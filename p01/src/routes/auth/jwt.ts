import { Router } from "express";
import { UnauthorizedError } from "express-jwt";
import * as jwt from "jsonwebtoken";
import { App } from "../../App";
import { JWTObtainError } from "../../models/errors/JWTObtainError";
import { IApiResponse } from "../../models/IApiResponse";
import { IJWTPayload } from "../../models/IJWTPayload";
import { IRoute } from "../../models/IRoute";

export class JWTAuthRoute implements IRoute {
    public app: App;
    public baseRoute: string = "/jwt";
    public router: Router;

    public init(app: App): void {
        this.app = app;
        this.router = Router();
        this.mount();
    }

    public mount(): void {
        this.router.get("/", this.app.getJWTHandler(), (req, res, next) => {
            const payload: IJWTPayload = req.user;
            res.send(
                {
                    message: "successfully verified token",
                    method: req.method,
                    payload: { token_payload: payload },
                    status: true,
                } as IApiResponse,
            );
        });

        this.router.post("/", (req, res, next) => {
            if (!req.body.secret || req.body.secret !== "hsrosenheim") {
                next(new UnauthorizedError("invalid_token", { message: "obtain secret is wrong" }));
                return;
            }

            const payload: IJWTPayload = {};
            jwt.sign(payload, this.app.getJWTSignSecret(), { algorithm: "RS256", expiresIn: "1d" }, (err, token) => {
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
