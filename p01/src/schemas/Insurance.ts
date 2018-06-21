import { Document, Model, model, Schema} from "mongoose";
import { IInsurance } from "../models/database/IInsurance";

// create the Insurance schema and model (MongoDB)

export interface IInsuranceModel extends IInsurance, Document { }

export const InsuranceSchema: Schema = new Schema({
    annualRate: Number,
    contractNumber: Number,
    type: String,
});

export const Insurance: Model<IInsuranceModel> = model("Insurance", InsuranceSchema);
