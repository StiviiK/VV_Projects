import { Router } from "express";
import * as passport from "passport";
import { App } from "../../App";
import { IApiResponse } from "../../models/IApiResponse";
import { IRoute } from "../../models/IRoute";

class GoogleAuthRoute implements IRoute {
    public app: App;
    public baseRoute: string = "/google";
    public router: Router;

    public init(app: App): void {
        this.app = app;
        this.router = Router();

        this.mount();
    }

    public mount(): void {
        this.router.get("/test", (req, res) => { res.send(true).end(); });
        this.router.get("/", passport.authenticate("google", {
            scope: ["https://www.googleapis.com/auth/userinfo.profile"],
        }));
        this.router.get("/callback", passport.authenticate("google", { failureRedirect: "/auth" }, () => {}));
    }
}

module.exports = new GoogleAuthRoute();
