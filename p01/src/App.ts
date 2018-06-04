import * as bodyparser from "body-parser";
import * as express from "express";
import * as jwt from "express-jwt";
import * as session from "express-session";
import { readFileSync } from "fs";
import { createServer as createHTTPServer, Server as HTTPServer } from "http";
import { createServer as createHTTPSServer, Server as HTTPSServer } from "https";
import * as mongoose from "mongoose";
import * as passport from "passport";
import { JwtConfig } from "./config/jwtconfig";
import { loadConfig as LoadPassportConfig } from "./config/passport";
import { create, drop } from "./DatabaseTest";
import { IApiResponse } from "./models/IApiResponse";
import { IRoute } from "./models/IRoute";

// drop();
// create();

export class App {
    public express: express.Express;
    private debug: boolean = false;
    private jwt: JwtConfig;

    private HTTPServer: HTTPServer;
    private HTTPSServer: HTTPSServer;

    private credentials = {
        cert: readFileSync("certificate/localhost.cert", "utf8"),
        key: readFileSync("certificate/localhost.key", "utf8"),
    };

    constructor(debug?: boolean) {
        this.debug = debug;
        this.jwt = new JwtConfig(this.credentials.cert, this.credentials.key);

        this.express = express();
        this.express.use(bodyparser.urlencoded({ extended: true }));
        this.express.use(bodyparser.json());
        this.express.use(session({ secret: "vv_project_01", resave: true, saveUninitialized: true }));
        this.express.use(passport.initialize());
        this.express.use(passport.session());

        mongoose.connect("mongodb://localhost:27017/test");

        LoadPassportConfig();
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

    public getJwtConfig(): JwtConfig {
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
            default:
                res.status(500);
                break;
        }

        const response: IApiResponse = {
            message: "an error occured, see payload",
            method: req.method,
            payload: { code: res.statusCode, name: err.name, message: err.message, data: err.data },
            status: false,
        };

        if (this.debug) {
            response.payload.stacktrace = err.stack;
        }

        res.send(response);
    }
}
