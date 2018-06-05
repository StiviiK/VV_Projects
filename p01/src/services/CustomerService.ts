import { Customer, ICustomerModel } from "../schemas/Customer";
import { DocumentService } from "./DocumentService";

export const CustomerService = new DocumentService<ICustomerModel>(Customer);
