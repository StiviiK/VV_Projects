import { IDebugger } from "debug";
import { Router } from "express";
import { App } from "../App";

// defines layout how every router class should be build
export interface IRoute {
    // optional object for an logger
    LOGGER?: IDebugger;

    // refrence to the main api app
    app: App;

    // define base route (e.g. /api, /customer)
    baseRoute: string;

    // expressjs router object
    router: Router;

    // additional sub-router
    subRoutes?: IRoute[];

    init(app: App): void;

    // Loads main routes
    mount(): void;

    // Loads additional sub-routes forwared to an additional router (e.g. /api/test => is forwared to a new router)
    loadSubRoutes?(): void;
}
