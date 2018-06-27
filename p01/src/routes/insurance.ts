import { Router } from "express";
import { App } from "../App";
import { IApiResponse } from "../models/IApiResponse";
import { IRoute } from "../models/IRoute";
import { IInsuranceModel } from "../schemas/Insurance";
import { InsuranceService } from "../services/InsuranceService";
import { JWTService } from "../services/JWTService";

// router for CustomerAPI
class InsuranceRoute implements IRoute {
    public app: App;
    public baseRoute: string = "/insurance";
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
                ...(req.query.annualRate !== undefined ? { annualRate: req.query.annualRate } : { }),
                ...(req.query.contractNumber !== undefined ? { contractNumber: req.query.contractNumber } : { }),
                ...(req.query.type !== undefined ? { type: req.query.type } : { }),
            };

            const insurance = await InsuranceService.find(condition, next) as IInsuranceModel[];
            res.send({
                message: "fetched all requested insurances",
                method: req.method,
                payload: insurance,
                status: true,
            } as IApiResponse);
        });

        // Get all infos about an insurance
        this.router.get("/:id([a-fA-F\\d]{24})", async (req, res, next) => {
            const insurance = await InsuranceService.findById(req.params.id, next) as IInsuranceModel;
            if (insurance) {
                res.send({
                    message: "found insurance",
                    method: req.method,
                    payload: insurance,
                } as IApiResponse);
            } else if (insurance === null) {
                res.send({
                    message: "insurance not found",
                    method: req.method,
                    status: false,
                } as IApiResponse);
            }
        });

        // Delete a customer
        this.router.delete("/:id([a-fA-F\\d]{24})", async (req, res, next) => {
            const insurance = await InsuranceService.remove(req.params.id, next) as IInsuranceModel;
            if (insurance) {
                res.send({
                    message: "successfully deleted insurance",
                    method: req.method,
                    status: true,
                } as IApiResponse);
            } else if (insurance === null) {
                res.send({
                    message: "insurance not found",
                    method: req.method,
                    status: false,
                } as IApiResponse);
            }
        });

        // POST SECTION
        // Creates a customer
        this.router.post("/", async (req, res, next) => {
            const fields = {
                ...(req.body.annualRate !== undefined ? { annualRate: req.body.annualRate } : { }),
                ...(req.body.contractNumber !== undefined ? { contractNumber: req.body.contractNumber } : { }),
                ...(req.body.type !== undefined ? { type: req.body.type } : { }),
            };

            const insurance = await InsuranceService.create(fields, next) as IInsuranceModel;
            if (insurance) {
                res.send({
                    message: "successfully created insurance",
                    method: req.method,
                    payload: { insurance },
                    status: true,
                } as IApiResponse);
            } else if (insurance === null) {
                res.send({
                    message: "failed to create insurance",
                    method: req.method,
                    status: false,
                } as IApiResponse);
            }
        });

        // PATCH SECTION
        // Updates a insurance
        this.router.patch("/:id([a-fA-F\\d]{24})", async (req, res, next) => {
            const fields = {
                ...(req.body.annualRate !== undefined ? { annualRate: req.body.annualRate } : { }),
                ...(req.body.contractNumber !== undefined ? { contractNumber: req.body.contractNumber } : { }),
                ...(req.body.type !== undefined ? { type: req.body.type } : { }),
            };

            const insurance = await InsuranceService.update(req.params.id, fields, next) as IInsuranceModel;
            if (insurance) {
                res.send({
                    message: "insurance",
                    method: req.method,
                    payload: await InsuranceService.findById(insurance._id),
                    status: true,
                } as IApiResponse);
            } else if (insurance === null) {
                res.send({
                    message: "insurance not found",
                    method: req.method,
                    status: false,
                } as IApiResponse);
            }
        });
    }
}

module.exports = new InsuranceRoute();
