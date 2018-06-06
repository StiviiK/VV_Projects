import { OptionsUrlencoded } from "body-parser";
import * as RateLimit from "express-rate-limit";
import { SessionOptions } from "express-session";
import { readFileSync } from "fs";
import { SecureContextOptions } from "tls";
import { RequestLimitError } from "../models/errors/RequestLimitError";

export const Config = {
    credentials: {
        cert: readFileSync("certificate/localhost.cert", "utf8"),
        key: readFileSync("certificate/localhost.key", "utf8"),
    } as SecureContextOptions,
    express: {
        request_limit: {
            delayAfter: 0,
            max: 60,
            windowMs: 60000,

            handler: (req, res, next) => {
                res.setHeader("Retry-After", Math.ceil(Config.express.request_limit.windowMs / 1000));
                next(new RequestLimitError(Config.express.request_limit.windowMs));
            },
        } as RateLimit.Options,

        session: {
            resave: true,
            saveUninitialized: true,
            secret: "vv_project_01",
        } as SessionOptions,

        urlencoded: {
            extended: true,
        } as OptionsUrlencoded,
    },
    oauth: {
        github: {
            callbackURL: "/auth/github/callback",
            clientID: process.env.PRODUCTION
                ? "29f95c54f386b925a557" : "032f3ddf42c181b9548d",
            clientSecret: process.env.PRODUCTION
                ? "8abf2d66d85ec4cec6a9897cc8d82dcf0ad31d2f" : "d70f5f04baa3a4e271f0dd1fd6cd7b847bb80bb8",
        },
    },
};
