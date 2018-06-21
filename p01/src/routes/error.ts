import { Router } from "express";
import { App } from "../App";
import { InvalidRouteError } from "../models/errors/InvalidRouteError";
import { IRoute } from "../models/IRoute";

// router to catch invalid routes
// special router, gets loaded last and is listening on all routes
// responds with an InvalidRouteError
class ErrorRoute implements IRoute {
    public app: App;
    public baseRoute: string = "*";
    public router: Router;

    public init(app: App): void {
        this.app = app;
        this.router = Router();
        this.mount();
    }

    public mount(): void {
        this.router.use((req, res, next) => {
            next(new InvalidRouteError(req.originalUrl));
        });
    }
}

module.exports = new ErrorRoute();
