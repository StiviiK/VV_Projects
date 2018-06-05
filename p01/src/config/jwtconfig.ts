import * as jwt from "express-jwt";
import { sign as SignPayload, SignOptions } from "jsonwebtoken";

export class JwtConfig {
    private verifyOptions: jwt.Options = {
        credentialsRequired: true,
        getToken: (req) => {
            if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
                return req.headers.authorization.split(" ")[1];
            } else if (req.query && req.query.token) {
                return req.query.token;
            }
            return null;
        },
        requestProperty: "user.jwt",
        secret: null,
    };
    private signOptions: SignOptions = { algorithm: "RS256", expiresIn: "1d" };
    private signKey: string = null;

    public constructor(publicKey: string, privateKey: string) {
        this.verifyOptions.secret = publicKey;
        this.signKey = privateKey;
    }

    public authHandler(): jwt.RequestHandler {
        return jwt(this.verifyOptions);
    }

    public signPayload(payload: any, callback: (err: Error, token: string) => void) {
        SignPayload(payload, this.signKey, this.signOptions, callback);
    }
}
