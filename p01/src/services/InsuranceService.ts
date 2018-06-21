import { IInsuranceModel, Insurance } from "../schemas/Insurance";
import { DocumentService } from "./DocumentService";

// Create an instance of the DocumentService to handle changes for the Insurance documents
export const InsuranceService = new DocumentService<IInsuranceModel>(Insurance);
