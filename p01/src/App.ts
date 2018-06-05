import * as bodyparser from "body-parser";
import { IDebugger } from "debug";
import * as express from "express";
import * as jwt from "express-jwt";
import * as RateLimit from "express-rate-limit";
import * as session from "express-session";
import { readFileSync } from "fs";
import { createServer as createHTTPServer, Server as HTTPServer } from "http";
import { createServer as createHTTPSServer, Server as HTTPSServer } from "https";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as passport from "passport";
import { Config } from "./config/config";
import { create, drop } from "./DatabaseTest";
import { RequestLimitError } from "./models/errors/RequestLimitError";
import { IApiResponse } from "./models/IApiResponse";
import { IRoute } from "./models/IRoute";
import { JWTService } from "./services/JWTService";
import { PassportService } from "./services/PassportService";

// drop();
// create();

export class App {
    public static LOGGER: IDebugger = require("debug")("app");

    public express: express.Express;
    private debug: boolean = false;
    private jwt: JWTService;
    private passport: PassportService;

    private HTTPServer: HTTPServer;
    private HTTPSServer: HTTPSServer;

    private credentials = {
        cert: readFileSync("certificate/localhost.cert", "utf8"),
        key: readFileSync("certificate/localhost.key", "utf8"),
    };

    constructor(debug?: boolean) {
        this.debug = debug;
        if (this.debug) {
            App.LOGGER.enabled = true;
        }

        this.jwt = new JWTService(this.credentials.cert, this.credentials.key);
        this.passport = new PassportService();

        this.express = express();
        this.express.use(morgan("combined"));
        this.express.use(bodyparser.urlencoded(Config.express.urlencoded));
        this.express.use(bodyparser.json());
        this.express.use(session(Config.express.session));
        this.express.use(passport.initialize());
        this.express.use(passport.session());
        this.express.use(new RateLimit(Config.express.request_limit));
        this.express.disable("x-powered-by");

        mongoose.connect("mongodb://localhost:27017/test")
            .catch((err) => {
                // tslint:disable-next-line:no-console
                console.error(err);
            });

        this.passport.init();
    }

    public mountRoutes(routes: IRoute[]): void {
        if (routes != null && routes.length > 0) {
            routes.forEach(
                (router: IRoute) => {
                    router.init(this);
                    this.express.use(router.baseRoute, router.router);
                },
            );
        }

        this.afterMount();
    }

    public listen(port: number | string, callback: (err, port) => void, optionalHttp?: boolean) {
        if (optionalHttp) {
            this.HTTPServer = createHTTPServer(this.express).listen(port, (err) => callback(err, port));
        }
        this.HTTPSServer = createHTTPSServer(this.credentials, this.express)
                            .listen(port as number + 443, (err) => callback(err, port as number + 443));
    }

    public getServer(http?: boolean): HTTPServer | HTTPSServer {
        if (http) {
            return this.HTTPServer;
        }

        return this.HTTPSServer;
    }

    public getJWTService(): JWTService {
        return this.jwt;
    }

    private afterMount() {
        this.express.use(((err, req, res, next) => this.handleError(err, req, res, next)));
    }

    private handleError(err, req, res, next) {
        switch (err.name) {
            case "UnauthorizedError":
                res.status(401);
                break;
            case "InvalidRouteError":
                res.status(404);
                break;
            case "TokenError":
                res.status(401);
                break;
            case "CastError":
                res.status(400);
                break;
            case "RequestLimitError":
                res.status(429);
                break;
            default:
                res.status(500);
                break;
        }

        const response: IApiResponse = {
            error: {
                code: res.statusCode,
                data: err.data,
                message: err.message,
                name: err.name,

                // javascript construct to add an element conditionally
                ...(this.debug === true ? { stacktrace: err.stack } : { }),
            },
            message: "an error occured, see error payload",
            method: req.method,
            status: false,
        };

        res.send(response);
    }
}
