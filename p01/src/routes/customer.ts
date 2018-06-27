import { Router } from "express";
import { App } from "../App";
import { wrapCustomerModel } from "../models/database/ICustomer";
import { InvalidRouteError } from "../models/errors/InvalidRouteError";
import { IApiResponse } from "../models/IApiResponse";
import { IRoute } from "../models/IRoute";
import { Customer, ICustomerModel } from "../schemas/Customer";
import { IInsuranceModel } from "../schemas/Insurance";
import { CustomerService } from "../services/CustomerService";
import { InsuranceService } from "../services/InsuranceService";
import { JWTService } from "../services/JWTService";

// router for CustomerAPI
class CustomerRoute implements IRoute {
    public app: App;
    public baseRoute: string = "/customer";
    public router: Router;
    public subRoutes?: IRoute[];

    private jwt: JWTService;

    public init(app: App): void {
        this.app = app;
        this.jwt = this.app.getJWTService();
        this.router = Router();
        this.mount();
    }

    public mount(): void {
        // Protect route with jwt authentication
        this.router.use(this.jwt.authHandler());

        // GET SECTION
        // Find by condition e.g. /?firstname=Stefan&lastname=Kürzeder or /find?customerId=5624, ...
        this.router.get("/", async (req, res, next) => {
            const condition = {
                ...(req.query.firstname !== undefined ? { firstname: req.query.firstname } : { }),
                ...(req.query.lastname !== undefined ? { lastname: req.query.lastname } : { }),
                ...(req.query.customerNumber !== undefined ? { customer_number: req.query.customerNumber } : { }),
                ...(req.query.addressRef !== undefined ? { address: req.query.addressRef } : { }),
                ...(req.query.birthday !== undefined ? { address: req.query.birthday } : { }),
            };

            const customer = await CustomerService.find(condition, next) as ICustomerModel[];
            res.send({
                message: "fetched all requested customers",
                method: req.method,
                payload: customer,
                status: true,
            } as IApiResponse);
        });

        // Get all infos about an customer
        this.router.get("/:id([a-fA-F\\d]{24})", async (req, res, next) => {
            const customer = await CustomerService.findById(req.params.id, next) as ICustomerModel;
            if (customer) {
                res.send({
                    message: "found customer",
                    method: req.method,
                    payload: await wrapCustomerModel(customer),
                } as IApiResponse);
            } else if (customer === null) {
                res.send({
                    message: "customer not found",
                    method: req.method,
                    status: false,
                } as IApiResponse);
            }
        });

        // Delete a customer
        this.router.delete("/:id([a-fA-F\\d]{24})", async (req, res, next) => {
            const customer = await CustomerService.remove(req.params.id, next) as ICustomerModel;
            if (customer) {
                res.send({
                    message: "successfully deleted costumer",
                    method: req.method,
                    status: true,
                } as IApiResponse);
            } else if (customer === null) {
                res.send({
                    message: "customer not found",
                    method: req.method,
                    status: false,
                } as IApiResponse);
            }
        });

        // POST SECTION
        // Creates a customer
        this.router.post("/", async (req, res, next) => {
            const fields = {
                ...(req.body.addressRef ? { address: req.body.addressRef } : { }),
                ...(req.body.birthday ? { birthday: req.body.birthday } : { }),
                ...(req.body.customerNumber ? { customer_number: req.body.customerNumber } : { }),
                ...(req.body.firstname ? { firstname: req.body.firstname } : { }),
                ...(req.body.lastname ? { lastname: req.body.lastname } : { }),
                ...(req.body.lastname ? { lastname: req.body.lastname } : { }),
            };

            const customer = await CustomerService.create(fields, next) as ICustomerModel;
            if (customer) {
                res.send({
                    message: "successfully created customer",
                    method: req.method,
                    payload: { customer },
                    status: true,
                } as IApiResponse);
            } else if (customer === null) {
                res.send({
                    message: "failed to create customer",
                    method: req.method,
                    status: false,
                } as IApiResponse);
            }
        });

        // PATCH SECTION
        // Updates a customer
        this.router.patch("/:id([a-fA-F\\d]{24})", async (req, res, next) => {
            const fields = {
                ...(req.body.addressRef ? { address: req.body.addressRef } : { }),
                ...(req.body.birthday ? { birthday: req.body.birthday } : { }),
                ...(req.body.customerNumber ? { customer_number: req.body.customerNumber } : { }),
                ...(req.body.firstname ? { firstname: req.body.firstname } : { }),
                ...(req.body.lastname ? { lastname: req.body.lastname } : { }),
            };

            const customer = await CustomerService.update(req.params.id, fields, next) as ICustomerModel;
            if (customer) {
                res.send({
                    message: "customer successfully updated",
                    method: req.method,
                    payload: await CustomerService.findById(customer._id),
                    status: true,
                } as IApiResponse);
            } else if (customer === null) {
                res.send({
                    message: "customer not found",
                    method: req.method,
                    status: false,
                } as IApiResponse);
            }
        });

        // INSURANCE SECTION
        // adds an insurance to an customer
        this.router.put("/:id([a-fA-F\\d]{24})/insurance/:insuranceId([a-fA-F\\d]{24})", async (req, res, next) => {
            const fields = { $push: { contracts: req.params.insuranceId } };

            const customer = await CustomerService.update(req.params.id, fields, next) as ICustomerModel;
            if (customer) {
                res.send({
                    message: "insurance successfully added",
                    method: req.method,
                    payload: await CustomerService.findById(customer._id),
                    status: true,
                } as IApiResponse);
            } else if (customer === null) {
                res.send({
                    message: "customer not found",
                    method: req.method,
                    status: false,
                } as IApiResponse);
            }
        });

        // removes an insurance from an customer
        this.router.delete("/:id([a-fA-F\\d]{24})/insurance/:insuranceId([a-fA-F\\d]{24})", async (req, res, next) => {
            const customer = await CustomerService.findById(req.params.id, next) as ICustomerModel;
            if (customer === null) {
                res.send({
                    message: "customer not found",
                    method: req.method,
                    status: false,
                } as IApiResponse);

                return;
            }

            const insurance = await InsuranceService.findById(req.params.insuranceId, next) as IInsuranceModel;
            if (insurance === null) {
                res.send({
                    message: "insurance not found",
                    method: req.method,
                    status: false,
                } as IApiResponse);

                return;
            }

            const result = await CustomerService.removeInsurance(customer, insurance, next) as ICustomerModel;
            if (result) {
                res.send({
                    message: "insurance successfully removed",
                    method: req.method,
                    payload: await CustomerService.findById(result._id),
                    status: true,
                } as IApiResponse);
            } else if (result === null) {
                res.send({
                    message: "failed to remove insurance",
                    method: req.method,
                    status: false,
                } as IApiResponse);
            }
        });
    }
}

module.exports = new CustomerRoute();
