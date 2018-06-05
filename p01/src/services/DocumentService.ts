import { Document, Model } from "mongoose";
import { Customer, ICustomerModel } from "../schemas/Customer";
import { IInsuranceModel, Insurance } from "../schemas/Insurance";

export class DocumentService<T extends Document> {
    public model: Model<T>;

    public constructor(model: Model<T>) {
        this.model = model;
    }

    public async find(condition): Promise<any[]> {
        const ids = [];
        (await this.model.find(condition)).forEach((document) => { ids.push(document._id); });

        return ids;
    }

    public async findById(id: any | string | number): Promise<T> {
        return this.model.findById(id);
    }

    public async create(fields): Promise<T> {
        return this.model.create(fields);
    }

    public async remove(id: any | string | number): Promise<T> {
        return this.model.findByIdAndRemove(id);
    }

    public async update(id: any | string | number, fields): Promise<T> {
        return this.model.findByIdAndUpdate(id, fields);
    }
}
