export const Config = {
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
