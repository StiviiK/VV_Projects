import { Router } from "express";
import * as jwt from "jsonwebtoken";
import { App } from "../App";
import { IApiResponse } from "../models/IApiResponse";
import { IRoute } from "../models/IRoute";

class IndexRoute implements IRoute {
    public app: App;
    public baseRoute: string = "/";
    public router: Router;

    public init(app: App): void {
        this.app = app;
        this.router = Router();
        this.mount();
    }

    public mount(): void {
        this.router.get("/", (req, res) => {
            const response: IApiResponse = {
                message: "success",
                method: req.method,
                status: true,
            };
            res.send(response);
        });

        this.router.get("/users", (req, res, next) => {
            this.app.getServer().getConnections((err, count) => {
                if (err) {
                    next(err);
                    return;
                }

                const response: IApiResponse = {
                    message: "success",
                    method: req.method,
                    payload: { count },
                    status: true,
                };
                res.send(response);
            });
        });
    }
}

module.exports = new IndexRoute();
