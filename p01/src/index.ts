import { App } from "./App";
import { IRoute } from "./models/IRoute";

// the "+" is required because environment variables are by default strings, so we convert it to an number
const port: number = +process.env.PORT || 3000;

// instantiate main api class
const app: App = new App();

// define all routes which the api uses
const routes: IRoute[] = [
    // tslint:disable-next-line:no-var-requires
    // require("./routes/index"), // currently unused

    // tslint:disable-next-line:no-var-requires
    require("./routes/auth/auth"),

    // tslint:disable-next-line:no-var-requires
    require("./routes/customer"),

    // tslint:disable-next-line:no-var-requires
    require("./routes/insurance"),

    // tslint:disable-next-line:no-var-requires
    require("./routes/error"), // always mount as last router
];
app.mountRoutes(routes);

// start listening
app.listen(port, (err, allocatedPort) => {
    if (err)  {
        throw err;
    }

    if (process.env.NODE_ENV !== "test") {
        // tslint:disable-next-line:no-console
        console.log(`server is listening on ${allocatedPort}`);
    }
});

module.exports = app.express;
