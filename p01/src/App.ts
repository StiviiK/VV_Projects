import * as bodyparser from "body-parser";
import { IDebugger } from "debug";
import * as express from "express";
import * as RateLimit from "express-rate-limit";
import * as session from "express-session";
import { createServer as createHTTPServer, Server as HTTPServer } from "http";
import { createServer as createHTTPSServer, Server as HTTPSServer } from "https";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as passport from "passport";
import { Config } from "./config/config";
import { IApiResponse } from "./models/IApiResponse";
import { IRoute } from "./models/IRoute";
import { JWTService } from "./services/JWTService";
import { PassportService } from "./services/PassportService";

// main restapi class
export class App {
    public static LOGGER: IDebugger = require("debug")("app");

    public express: express.Express;
    private debug: boolean = false;
    private jwt: JWTService;
    private passport: PassportService;

    private HTTPServer: HTTPServer;
    private HTTPSServer: HTTPSServer;

    private credentials = Config.credentials;

    constructor(debug?: boolean) {
        this.debug = debug;
        if (this.debug) {
            App.LOGGER.enabled = true;
        }

        // sign the jwt's with private and public key from the certificate (better use own pair in production)
        this.jwt = new JWTService(this.credentials.cert as string, this.credentials.key as string);
        this.passport = new PassportService();

        // add some (required) middleware
        this.express = express();
        if (process.env.NODE_ENV !== "test") {
            this.express.use(morgan("combined")); // loggger
        }
        this.express.use(bodyparser.urlencoded(Config.express.urlencoded));
        this.express.use(bodyparser.json());
        this.express.use(session(Config.express.session));
        this.express.use(passport.initialize());
        this.express.use(passport.session());
        this.express.use(new RateLimit(Config.express.request_limit)); // add Ratelimiter (1 req/1 s)
        this.express.disable("x-powered-by"); // disable the header, could tell attackers useful vunerability infos

        mongoose.connect(process.env.MONGO_DB_URL || "mongodb://localhost:27017/test")
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

    // create the HTTPs server with an optional HTTP server
    public listen(port: number, callback: (err, port) => void, optionalHttp?: boolean) {
        if (optionalHttp) {
            this.HTTPServer = createHTTPServer(this.express).listen(port, (err) => callback(err, port));
        }
        this.HTTPSServer = createHTTPSServer(this.credentials, this.express)
                            .listen(port + 443, (err) => callback(err, port + 443));
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

    // "catch" all request after no middleware handled it, or forwarded the request with an error
    // "Error Catcher"
    private afterMount() {
        this.express.use(((err, req, res, next) => this.handleError(err, req, res, next)));
    }

    private handleError(err, req, res, next) {
        // change error codes for specific errors, fallback to status 500
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

        // send the error object
        res.send({
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
        } as IApiResponse);
    }
}
