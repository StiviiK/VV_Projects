import { Router } from "express";
import { App } from "../App";
import { JwtConfig } from "../config/jwtconfig";
import { wrapCustomerModel } from "../models/database/ICustomer";
import { InvalidRouteError } from "../models/errors/InvalidRouteError";
import { IApiResponse } from "../models/IApiResponse";
import { IRoute } from "../models/IRoute";
import { CustomerService } from "../services/CustomerService";

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
        this.router.use(this.jwt.authHandler());

        // GET SECTION
        // Get all customer ids
        // this.router.get("/", (req, res, next) => next(new InvalidRouteError("/customer")));

        // Find by condition e.g. /find?firstname=Stefan&lastname=Kürzeder or /find?customerId=5624, ...
        this.router.get("/find", async (req, res, next) => {
            const condition = {
                ...(req.query.firstname !== undefined ? { firstname: req.query.firstname } : { }),
                ...(req.query.lastname !== undefined ? { lastname: req.query.lastname } : { }),
                ...(req.query.customerNumber !== undefined ? { customer_number: req.query.customerNumber } : { }),
                ...(req.query.addressRef !== undefined ? { address: req.query.addressRef } : { }),
                ...(req.query.birthday !== undefined ? { address: req.query.birthday } : { }),
            };

            res.send({
                message: "fetched all requested customers",
                method: req.method,
                payload: await CustomerService.find(condition),
                status: true,
            } as IApiResponse);
        });

        // Get all infos about an customer
        this.router.get("/:id", async (req, res, next) => {
            const customer = await CustomerService.findById(req.params.id);
            if (customer) {
                res.send({
                    message: "found customer",
                    method: req.method,
                    payload: await wrapCustomerModel(customer),
                } as IApiResponse);
            } else {
                res.send({
                    message: "customer not found",
                    method: req.method,
                    status: false,
                } as IApiResponse);
            }
        });

        // Delete a customer
        this.router.delete("/:id", async (req, res, next) => {
            const customer = await CustomerService.remove(req.params.id);
            if (customer) {
                res.send({
                    message: "successfully deleted costumer",
                    method: req.method,
                    status: true,
                } as IApiResponse);
            } else {
                res.send({
                    message: "customer not found",
                    method: req.method,
                    status: false,
                } as IApiResponse);
            }
        });

        // POST SECTION
        // Creates a customer
        this.router.post("/create", async (req, res, next) => {
            const fields = {
                ...(req.body.addressRef ? { address: req.body.addressRef } : { }),
                ...(req.body.birthday ? { birthday: req.body.birthday } : { }),
                ...(req.body.customerNumber ? { customer_number: req.body.customerNumber } : { }),
                ...(req.body.firstname ? { firstname: req.body.firstname } : { }),
                ...(req.body.lastname ? { lastname: req.body.lastname } : { }),
                ...(req.body.lastname ? { lastname: req.body.lastname } : { }),
            };

            const customer = await CustomerService.create(fields);
            if (customer) {
                res.send({
                    message: "successfully created customer",
                    method: req.method,
                    payload: { customer },
                    status: true,
                } as IApiResponse);
            } else {
                res.send({
                    message: "failed to create customer",
                    method: req.method,
                    status: false,
                } as IApiResponse);
            }
        });

        // PATCH SECTION
        // Updates a customer
        this.router.patch("/:id", async (req, res, next) => {
            const fields = {
                ...(req.body.addressRef ? { address: req.body.addressRef } : { }),
                ...(req.body.birthday ? { birthday: req.body.birthday } : { }),
                ...(req.body.customerNumber ? { customer_number: req.body.customerNumber } : { }),
                ...(req.body.firstname ? { firstname: req.body.firstname } : { }),
                ...(req.body.lastname ? { lastname: req.body.lastname } : { }),
                ...(req.body.lastname ? { lastname: req.body.lastname } : { }),
            };

            const customer = await CustomerService.update(req.params.id, fields);
            if (customer) {
                res.send({
                    message: "customer successfully updated",
                    method: req.method,
                    payload: await CustomerService.findById(customer._id),
                    status: true,
                } as IApiResponse);
            } else {
                res.send({
                    message: "failed to update customer",
                    method: req.method,
                    status: false,
                } as IApiResponse);
            }
        });
    }
}

module.exports = new CustomerRoute();
