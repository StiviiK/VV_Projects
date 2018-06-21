import { NextFunction } from "express";
import { Document, Model } from "mongoose";
import { Customer, ICustomerModel } from "../schemas/Customer";
import { IInsuranceModel, Insurance } from "../schemas/Insurance";

// Base class for handling document changes in the db
export class DocumentService<T extends Document> {
    public model: Model<T>;

    public constructor(model: Model<T>) {
        this.model = model;
    }

    public async find(condition, errorHandler?: NextFunction): Promise<any[] | Error> {
        const ids = [];
        try { // use await befor each model action to properly catch errors
            (await this.model.find(condition)).forEach((document) => { ids.push(document._id); });
        } catch (e) {
            return this.handleError(e, errorHandler);
        }

        return ids;
    }

    public async findById(id: any | string | number, errorHandler?: NextFunction): Promise<T | Error> {
        try {
            return await this.model.findById(id);
        } catch (e) {
            return this.handleError(e, errorHandler);
        }
    }

    public async create(fields, errorHandler?: NextFunction): Promise<T | Error> {
        try {
            return await this.model.create(fields);
        } catch (e) {
            return this.handleError(e, errorHandler);
        }
    }

    public async remove(id: any | string | number, errorHandler?: NextFunction): Promise<T | Error> {
        try {
            return await this.model.findByIdAndRemove(id);
        } catch (e) {
            return this.handleError(e, errorHandler);
        }
    }

    public async update(id: any | string | number, fields, errorHandler?: NextFunction): Promise<T | Error> {
        try {
            return await this.model.findByIdAndUpdate(id, fields);
        } catch (e) {
            return this.handleError(e, errorHandler);
        }
    }

    protected handleError(err, errorHandler?: NextFunction) {
        if (errorHandler !== undefined) {
            errorHandler(err);
            return -1;  // return any value != null to prevent further responses to the request
                        // because we can't stop code execution here, we have to return something
        } else {
            return err;
        }
    }
}
