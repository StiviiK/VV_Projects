import { Router } from "express";
import { App } from "../App";
import { JwtConfig } from "../config/jwtconfig";
import { InvalidRouteError } from "../models/errors/InvalidRouteError";
import { IApiResponse } from "../models/IApiResponse";
import { IRoute } from "../models/IRoute";
import { Service as CustomerService } from "../services/CustomerService";

class CustomerRoute implements IRoute {
    public app: App;
    public baseRoute: string = "/customer";
    public router: Router;
    public subRoutes?: IRoute[];

    private jwt: JwtConfig;

    public init(app: App): void {
        this.app = app;
        this.jwt = this.app.getJwtConfig();
        this.router = Router();
        this.mount();
    }

    public mount(): void {
        // Protect route with jwt authentication
        this.router.use(this.jwt.getVerifier());

        // GET SECTION
        // Get all customer ids
        // this.router.get("/", (req, res, next) => next(new InvalidRouteError("/customer")));

        // Find by condition e.g. /find?firstname=Stefan&lastname=Kürzeder or /find?customerId=5624
        this.router.get("/find", CustomerService.find);

        // Get all infos about an customer
        this.router.get("/:id", CustomerService.findById);

        // Delete a customer
        this.router.delete("/:id", CustomerService.remove);

        // POST SECTION
        // Creates a customer
        this.router.post("/create", CustomerService.create);

        // PATCH SECTION
        // Updates a customer
        this.router.patch("/:id", CustomerService.update);
    }
}

module.exports = new CustomerRoute();
