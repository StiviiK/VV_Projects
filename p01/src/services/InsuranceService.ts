import { IInsuranceModel, Insurance } from "../schemas/Insurance";
import { DocumentService } from "./DocumentService";

export const InsuranceService = new DocumentService<IInsuranceModel>(Insurance);
