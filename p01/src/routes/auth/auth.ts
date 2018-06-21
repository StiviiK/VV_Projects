import { Router } from "express";
import { App } from "../../App";
import { IRoute } from "../../models/IRoute";

// router for handling authentication sub-routes (github, jwt)
class AuthRoute implements IRoute {
    public app: App;
    public baseRoute: string = "/auth";
    public subRoutes: IRoute[] = [
        require("./github"),
        require("./jwt"),
    ];
    public router: Router;

    public init(app: App): void {
        this.app = app;
        this.router = Router();
        this.mount();
        this.loadSubRoutes();
    }

    // tslint:disable-next-line:no-empty
    public mount(): void { }

    public loadSubRoutes(): void {
        if (this.subRoutes != null && this.subRoutes.length > 0) {
            this.subRoutes.forEach(
                (router: IRoute) => {
                    router.init(this.app);

                    this.router.use(router.baseRoute, router.router);
                },
            );
        }
    }
}

module.exports = new AuthRoute();
