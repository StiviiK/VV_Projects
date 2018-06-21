import { InsuranceType } from "./models/database/IInsurance";
import { Address, IAddressModel } from "./schemas/Address";
import { Customer, ICustomerModel } from "./schemas/Customer";
import { IInsuranceModel, Insurance } from "./schemas/Insurance";

// test function to fill db with mock data, unused!

export function create() {
    const contract1: IInsuranceModel = new Insurance({
        annualRate: 1000,
        contractNumber: 525625,
        type: InsuranceType.KFZ,
    } as IInsuranceModel);
    contract1.save();

    const contract2: IInsuranceModel = new Insurance({
        annualRate: 50,
        contractNumber: 434545,
        type: InsuranceType.HAFTPFLICHT,
    } as IInsuranceModel);
    contract2.save();

    const contract3: IInsuranceModel = new Insurance({
        annualRate: 1000,
        contractNumber: 123456,
        type: InsuranceType.RECHTSCHUTZ,
    } as IInsuranceModel);
    contract3.save();

    const address: IAddressModel = new Address({
        city: "Steinhöring",
        postalCode: 85643,
        street: "von-Waldeck-Straße 42",
    } as IAddressModel);
    address.save();

    const customer: ICustomerModel = new Customer({
        address: address._id,
        birthday: 0,
        contracts: [ contract1._id, contract2._id, contract3._id ],
        customer_number: 5624,
        firstname: "Stefan",
        lastname: "Kürzeder",
    } as ICustomerModel);
    customer.save();
}

export async function drop() {
    await Insurance.remove({});
    await Address.remove({});
    await Customer.remove({});
}
