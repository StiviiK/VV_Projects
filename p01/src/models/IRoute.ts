import { IDebugger } from "debug";
import { Router } from "express";
import { App } from "../App";

export interface IRoute {
    LOGGER?: IDebugger;

    app: App;
    baseRoute: string;
    router: Router;
    subRoutes?: IRoute[];

    init(app: App): void;
    mount(): void;
    loadSubRoutes?(): void;
}
