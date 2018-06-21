export enum InsuranceType {
    RECHTSCHUTZ = "RECHTSCHUTZ",
    HAFTPFLICHT = "HAFTPFLICHT",
    KFZ         = "KFZ",
}

// layout for the InsuranceSchema (MongoDB)
export interface IInsurance {
    annualRate: number;
    contractNumber: number;
    type: InsuranceType;
}
