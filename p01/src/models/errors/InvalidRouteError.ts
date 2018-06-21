export class InvalidRouteError implements Error {
    public name: string = "InvalidRouteError";
    public message: string = "requested route not found";
    public stack?: string;

    // tslint:disable-next-line:variable-name
    private _err: Error = new Error(); // instantiate Javascript Error so we can catch the stacktrace

    public constructor(url?: string) {
        this.stack = this._err.stack;
        if (url !== undefined) {
            this.message = "\"" + url + "\" not found";
        }
    }
}
