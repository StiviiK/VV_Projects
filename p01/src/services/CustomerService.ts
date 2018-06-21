import { NextFunction } from "express";
import { Customer, ICustomerModel } from "../schemas/Customer";
import { IInsuranceModel } from "../schemas/Insurance";
import { DocumentService } from "./DocumentService";

// extend our existing DocumentService to add additional functionality
class Service extends DocumentService<ICustomerModel> {
    public async removeInsurance(model: ICustomerModel, insurance: IInsuranceModel, errorHandler?: NextFunction)
        : Promise<ICustomerModel | Error> {
        try {
            const position = model.contracts.indexOf(insurance._id);
            if (position !== -1) {
                model.contracts.splice(position, 1);
                return await model.save();
            }

            return null;
        } catch (e) {
            return this.handleError(e, errorHandler);
        }
    }
}

// Create an instance of the DocumentService to handle changes for the Customer documents
export const CustomerService = new Service(Customer);
