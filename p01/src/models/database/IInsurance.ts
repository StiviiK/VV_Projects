export enum InsuranceType {
    RECHTSCHUTZ = "RECHTSCHUTZ",
    HAFTPFLICHT = "HAFTPFLICHT",
    KFZ         = "KFZ",
}

export interface IInsurance {
    annualRate: number;
    contractNumber: number;
    type: InsuranceType;
}
