import { Address, IAddressModel } from "../../schemas/Address";
import { ICustomerModel } from "../../schemas/Customer";
import { IInsuranceModel, Insurance } from "../../schemas/Insurance";
import { IAddress } from "./IAddress";
import { IInsurance } from "./IInsurance";

export interface ICustomer {
    address: string;
    contracts: string[];
    customer_number: number;
    firstname: string;
    lastname: string;
    birthday: number; // timestamp
}

export interface IApiCustomer {
    _id?: string;

    address: IAddressModel;
    contracts: IInsuranceModel[];
    customer_number: number;
    firstname: string;
    lastname: string;
    birthday: number;

    __v?: number;
}

export async function wrapCustomerModel(customer: ICustomerModel): Promise<IApiCustomer> {
    const contracts: IInsuranceModel[] = [];
    customer.contracts.forEach(async (contractRef: string) => {
        contracts.push(await Insurance.findById(contractRef));
    });
    const address: IAddressModel = await Address.findById(customer.address);

    return await {
        _id: customer._id,

        address,
        birthday: customer.birthday,
        contracts,
        customer_number: customer.customer_number,
        firstname: customer.firstname,
        lastname: customer.lastname,

        __v: customer.__v,
    };
}
