import { Router } from "express";
import { UnauthorizedError } from "express-jwt";
import * as jwt from "jsonwebtoken";
import { App } from "../../App";
import { JWTObtainError } from "../../models/errors/JWTObtainError";
import { IApiResponse } from "../../models/IApiResponse";
import { IJWTPayload } from "../../models/IJWTPayload";
import { IRoute } from "../../models/IRoute";
import { JWTService } from "../../services/JWTService";

export class JWTAuthRoute implements IRoute {
    public app: App;
    public baseRoute: string = "/jwt";
    public router: Router;

    private jwt: JWTService;

    public init(app: App): void {
        this.app = app;
        this.jwt = this.app.getJWTService();
        this.router = Router();
        this.mount();
    }

    public mount(): void {
        this.router.get("/", this.jwt.authHandler(), (req, res, next) => {
            const payload: IJWTPayload = req.user.jwt;
            res.send(
                {
                    message: "successfully verified token",
                    method: req.method,
                    payload: { token_payload: payload },
                    status: true,
                } as IApiResponse,
            );
        });

        this.router.get("/obtain", (req, res, next) => {
            if (!req.user || !req.user.authenticated) {
                res.redirect("/auth/github");
                return;
            }

            const payload: IJWTPayload = {};
            this.jwt.signPayload(payload, (err, token) => {
                if (err) {
                    next(new JWTObtainError(err)); // Wrap Error to JWTObtainError
                    return;
                }

                res.send(
                    {
                        message: "successfully obtained jwt token",
                        method: req.method,
                        payload: { token },
                        status: true,
                    } as IApiResponse,
                );
            });
        });
    }
}

module.exports = new JWTAuthRoute();
