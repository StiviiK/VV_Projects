import { Document, Model, model, Schema} from "mongoose";
import { IAddress } from "../models/database/IAddress";

// create the Address schema and model (MongoDB)

export interface IAddressModel extends IAddress, Document { }

export const AddressSchema: Schema = new Schema({
    city: String,
    postalCode: Number,
    street: String,
});

export const Address: Model<IAddressModel> = model("Address", AddressSchema);
