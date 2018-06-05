import { Document, Model } from "mongoose";
import { Customer, ICustomerModel } from "../schemas/Customer";
import { IInsuranceModel, Insurance } from "../schemas/Insurance";

export class DocumentService<T extends Document> {
    public model: Model<T>;

    public constructor(model: Model<T>) {
        this.model = model;
    }

    public async find(condition): Promise<any[] | Error> {
        const ids = [];
        try {
            (await this.model.find(condition)).forEach((document) => { ids.push(document._id); });
        } catch (e) {
            return e;
        }

        return ids;
    }

    public async findById(id: any | string | number): Promise<T | Error> {
        try {
            return await this.model.findById(id);
        } catch (e) {
            return e;
        }
    }

    public async create(fields): Promise<T | Error> {
        try {
            return await this.model.create(fields);
        } catch (e) {
            return e;
        }
    }

    public async remove(id: any | string | number): Promise<T | Error> {
        try {
            return await this.model.findByIdAndRemove(id);
        } catch (e) {
            return e;
        }
    }

    public async update(id: any | string | number, fields): Promise<T | Error> {
        try {
            return await this.model.findByIdAndUpdate(id, fields);
        } catch (e) {
            return e;
        }
    }
}
