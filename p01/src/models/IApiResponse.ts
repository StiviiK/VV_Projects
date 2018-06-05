export interface IApiResponse {
    method: string;
    status: boolean;
    message: string;
    payload?: any;
    error?: any;
}
