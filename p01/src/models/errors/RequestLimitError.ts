export class RequestLimitError implements Error {
    public name: string = "RequestLimitError";
    public message: string = "request limit exceeded";
    public stack?: string;

    // tslint:disable-next-line:variable-name
    private _err: Error = new Error(); // instantiate Javascript Error so we can catch the stacktrace

    public constructor(retryAfter?: number) {
        this.stack = this._err.stack;
        this.message = this.message + "; retry after " + retryAfter as string + "ms";
    }
}
