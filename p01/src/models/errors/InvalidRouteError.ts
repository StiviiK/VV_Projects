export class InvalidRouteError implements Error {
    public name: string = "InvalidRouteError";
    public message: string = "requested route not found";
    public stack?: string;

    public constructor(url?: string) {
        if (url !== undefined) {
            this.message = "\"" + url + "\" not found";
        }
    }
}
