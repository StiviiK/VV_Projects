import { Router } from "express";
import { App } from "../App";
import { IRoute } from "../models/IRoute";

// router which listens on the index route (e.g. https://hsro.dev)
// currently unused
class IndexRoute implements IRoute {
    public app: App;
    public baseRoute: string = "/";
    public router: Router;

    public init(app: App): void {
        this.app = app;
        this.router = Router();
        this.mount();
    }

    // tslint:disable-next-line:no-empty
    public mount(): void { }
}

module.exports = new IndexRoute();
