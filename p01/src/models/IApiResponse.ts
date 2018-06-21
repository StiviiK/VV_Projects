// defines the layout how the api always responds
export interface IApiResponse {
    method: string;
    status: boolean;
    message: string;
    payload?: any;
    error?: any;
}
