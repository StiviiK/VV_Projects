import { NextFunction, Request, Response } from "express";
import { wrapCustomerModel } from "../models/database/ICustomer";
import { IApiResponse } from "../models/IApiResponse";
import { IApiService } from "../models/IApiService";
import { Customer, ICustomerModel } from "../schemas/Customer";

class CustomerService implements IApiService {
    public async find(req: Request, res: Response, next: NextFunction) {
        const condition = {
            ...(req.query.firstname !== undefined ? { firstname: req.query.firstname } : { }),
            ...(req.query.lastname !== undefined ? { lastname: req.query.lastname } : { }),
            ...(req.query.customerNumber !== undefined ? { customer_number: req.query.customerNumber } : { }),
            ...(req.query.addressRef !== undefined ? { address: req.query.addressRef } : { }),
            ...(req.query.birthday !== undefined ? { address: req.query.birthday } : { }),
        };

        const customers = await Customer.find(condition);
        const ids = [];

        customers.forEach((customer) => {
            ids.push(customer._id);
        });

        res.send({
            message: "fetched all requested customers",
            method: req.method,
            payload: ids,
            status: true,
        } as IApiResponse);
    }

    public async findById(req: Request, res: Response, next: NextFunction) {
        const customer = await Customer.findById(req.params.id);
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
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        const fields = {
            ...(req.body.addressRef ? { address: req.body.addressRef } : { }),
            ...(req.body.birthday ? { birthday: req.body.birthday } : { }),
            ...(req.body.customerNumber ? { customer_number: req.body.customerNumber } : { }),
            ...(req.body.firstname ? { firstname: req.body.firstname } : { }),
            ...(req.body.lastname ? { lastname: req.body.lastname } : { }),
            ...(req.body.lastname ? { lastname: req.body.lastname } : { }),
        };

        const customer = await Customer.create(fields);
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
    }

    public async remove(req: Request, res: Response, next: NextFunction) {
        const customer = await Customer.findByIdAndRemove(req.params.id);
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
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        const fields = {
            ...(req.body.addressRef ? { address: req.body.addressRef } : { }),
            ...(req.body.birthday ? { birthday: req.body.birthday } : { }),
            ...(req.body.customerNumber ? { customer_number: req.body.customerNumber } : { }),
            ...(req.body.firstname ? { firstname: req.body.firstname } : { }),
            ...(req.body.lastname ? { lastname: req.body.lastname } : { }),
            ...(req.body.lastname ? { lastname: req.body.lastname } : { }),
        };

        const customer: ICustomerModel = await Customer.findByIdAndUpdate(req.params.id, fields);
        if (customer) {
            res.send({
                message: "customer successfully updated",
                method: req.method,
                payload: await Customer.findById(customer.id),
                status: true,
            } as IApiResponse);
        } else {
            res.send({
                message: "failed to update customer",
                method: req.method,
                status: false,
            } as IApiResponse);
        }
    }
}

export const Service = new CustomerService();
