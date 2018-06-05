import * as fs from "fs";
import { App } from "./App";
import { IRoute } from "./models/IRoute";

const port = process.env.PORT || 3000;

const app: App = new App();
const routes: IRoute[] = [
    // tslint:disable-next-line:no-var-requires
    require("./routes/index"),
    // tslint:disable-next-line:no-var-requires
    require("./routes/auth/auth"),
    // tslint:disable-next-line:no-var-requires
    require("./routes/customer"),
    // tslint:disable-next-line:no-var-requires
    require("./routes/insurance"),
    // tslint:disable-next-line:no-var-requires
    require("./routes/error"),
];
app.mountRoutes(routes);

app.listen(port, (err, allocatedPort) => {
    if (err)  {
        throw err;
    }

    // tslint:disable-next-line:no-console
    console.log(`server is listening on ${allocatedPort}`);
});
