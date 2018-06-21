import { Router } from "express";
import * as passport from "passport";
import { App } from "../../App";
import { IApiResponse } from "../../models/IApiResponse";
import { IRoute } from "../../models/IRoute";

// sub-router for handling oauth authentication with github
class GoogleAuthRoute implements IRoute {
    public app: App;
    public baseRoute: string = "/github";
    public router: Router;

    public init(app: App): void {
        this.app = app;
        this.router = Router();

        this.mount();
    }

    public mount(): void {
        this.router.get("/", passport.authenticate("github"));
        this.router.get("/callback", passport.authenticate("github"),
            (req, res) => {
                res.redirect("/auth/jwt/obtain");
            },
        );
        this.router.get("/logout", (req, res, next) => {
            req.session.destroy((err) => {
                if (err) {
                    next(err);
                    return;
                }

                res.send(
                    {
                        message: "successfully revoked oauth access",
                        method: req.method,
                        status: true,
                    } as IApiResponse,
                );
            });
        });
    }
}

module.exports = new GoogleAuthRoute();
