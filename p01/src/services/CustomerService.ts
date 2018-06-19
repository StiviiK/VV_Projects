import { NextFunction } from "express";
import { Customer, ICustomerModel } from "../schemas/Customer";
import { IInsuranceModel } from "../schemas/Insurance";
import { DocumentService } from "./DocumentService";

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

export const CustomerService = new Service(Customer);
