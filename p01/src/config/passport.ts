import * as passport from "passport";
import { Strategy as GithubStrategy } from "passport-github";

export function loadConfig() {
  passport.use(
    new GithubStrategy(
      {
        callbackURL: "/auth/github/callback",
        clientID: "032f3ddf42c181b9548d",
        clientSecret: "d70f5f04baa3a4e271f0dd1fd6cd7b847bb80bb8",
      },
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
