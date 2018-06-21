import * as passport from "passport";
import { Strategy as GithubStrategy } from "passport-github";
import { Config } from "../config/config";

// configuration for OAuth authentication (usign github oauth)
export class PassportService {
    public init() {
            passport.use(
                new GithubStrategy(
                    Config.oauth.github,
                    (accessToken, refreshToken, profile, done) => {
                    done(null, { id: profile.id });
                    },
                ),
            );

            passport.serializeUser((user, done) => {
                done(null, true);
            });

            passport.deserializeUser((authenticated, done) => {
                if (authenticated) {
                    done(null, { authenticated });
                }
            });
        }
    }
