import { Address, IAddressModel } from "../../schemas/Address";
import { ICustomerModel } from "../../schemas/Customer";
import { IInsuranceModel, Insurance } from "../../schemas/Insurance";
import { asyncForEach } from "../../util";

// layout for the CustomerSchema (MongoDB)
export interface ICustomer {
    address: string;
    contracts: string[];
    customer_number: number;
    firstname: string;
    lastname: string;
    birthday: number; // timestamp
}

// layout for customer api response (includes contracts and address, not only the refrenceId to them)
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

// loads address and contracts to respond as IApiCustomer
export async function wrapCustomerModel(customer: ICustomerModel): Promise<IApiCustomer> {
    const contracts: IInsuranceModel[] = [];
    await asyncForEach(customer.contracts, async (contractRef: string) => {
        const contract = await Insurance.findById(contractRef);
        if (contract !== null) {
            contracts.push(contract);
        }
    });

    return await {
        _id: customer._id,

        address: await Address.findById(customer.address),
        birthday: customer.birthday,
        contracts,
        customer_number: customer.customer_number,
        firstname: customer.firstname,
        lastname: customer.lastname,

        __v: customer.__v,
    } as IApiCustomer;
}
