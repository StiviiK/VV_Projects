import * as passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";

export function loadConfig() {
  passport.use(
    new GoogleStrategy(
      {
        callbackURL: "/auth/google/callback",
        clientID: "172787220631-9m9nlug6luep1n8easap2ma7tkic440c.apps.googleusercontent.com",
        clientSecret: "bUyH29n_DjPpQoCRS3wJYXmo",
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, { googleId: profile.id });
      },
    ),
  );
}
