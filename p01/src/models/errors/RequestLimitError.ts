export class RequestLimitError implements Error {
    public name: string = "RequestLimitError";
    public message: string = "request limit exceeded";
    public stack?: string;

    public constructor(retryAfter?: number) {
        this.message = this.message + "; retry after " + retryAfter as string + " ms"; 
    }
}
