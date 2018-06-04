import { Router } from "express";
import { App } from "../App";
import { JwtConfig } from "../config/jwtconfig";
import { IApiCustomer, ICustomer, wrapCustomerModel } from "../models/database/ICustomer";
import { IApiResponse } from "../models/IApiResponse";
import { IRoute } from "../models/IRoute";
import { Address, IAddressModel } from "../schemas/Address";
import { Customer, ICustomerModel } from "../schemas/Customer";
import { IInsuranceModel, Insurance } from "../schemas/Insurance";

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
        this.router.get("/", this.jwt.getVerifier(), (req, res, next) => {
            Customer.find({}, (err: any, customers: ICustomerModel[]) => {
                if (err) {
                    next(err);
                    return;
                }

                const ids = [];
                customers.forEach((customer: ICustomerModel) => {
                    ids.push(customer._id);
                });

                res.send({
                    message: "fetched all customers",
                    method: req.method,
                    payload: ids,
                    status: true,
                } as IApiResponse);
            });
        });

        this.router.get("/:id", (req, res, next) => {
            Customer.findById(req.params.id, async (err: any, customer: ICustomerModel) => {
                if (err) {
                    next(err);
                    return;
                }

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
        });

        this.router.post("/create", (req, res, next) => {
            if (req.body.firstname !== null && req.body.lastname !== null && req.body.customer_number !== null) {
                const customer: ICustomerModel = new Customer({
                    customer_number: req.body.customer_number,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                } as ICustomerModel);

                customer.save((err, newCustomer) => {
                    res.send({
                        message: "ok",
                        method: req.method,
                        payload: newCustomer,
                        status: true,
                    } as IApiResponse);
                });
            }
        });
    }
}

module.exports = new CustomerRoute();
