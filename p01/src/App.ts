import * as bodyparser from "body-parser";
import * as express from "express";
import * as jwt from "express-jwt";
import { readFileSync } from "fs";
import { createServer as createHTTPServer, Server as HTTPServer } from "http";
import { createServer as createHTTPSServer, Server as HTTPSServer } from "https";
import { IApiResponse } from "./models/IApiResponse";
import { IRoute } from "./models/IRoute";

export class App {
    public express: express.Express;
    private debug: boolean = false;

    private HTTPServer: HTTPServer;
    private HTTPSServer: HTTPSServer;

    private credentials = {
        cert: readFileSync("certificate/localhost.cert", "utf8"),
        key: readFileSync("certificate/localhost.key", "utf8"),
    };
    private JWTConfig: jwt.Options = {
        credentialsRequired: true,
        getToken: (req) => {
            if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
                    return req.headers.authorization.split(" ")[1];
            } else if (req.query && req.query.token) {
                return req.query.token;
            }
            return null;
        },
        secret: this.credentials.cert,
    };

    constructor(debug?: boolean) {
        this.debug = debug;

        this.express = express();
        this.express.use(bodyparser.urlencoded({ extended: true }));
        this.express.use(bodyparser.json());
        // this.express.use(this.getJWTHandler());
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

    public getJWTHandler(): jwt.RequestHandler {
        return jwt(this.JWTConfig);
    }

    public getJWTSignSecret() {
        return this.credentials.key;
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
