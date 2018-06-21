import { Document, Model, model, Schema} from "mongoose";
import { ICustomer } from "../models/database/ICustomer";

// create the Customer schema and model (MongoDB)

export interface ICustomerModel extends ICustomer, Document { }

export const CustomerSchema: Schema = new Schema({
    address: { type: Schema.Types.ObjectId, ref: "Address" },
    birthday: Number,
    contracts: [{ type: Schema.Types.ObjectId, ref: "Insurance" }],
    customer_number: String,
    firstname: String,
    lastname: String,
});

export const Customer: Model<ICustomerModel> = model<ICustomerModel>("Customer", CustomerSchema);
