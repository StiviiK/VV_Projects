export class JWTObtainError implements Error {
    public name: string = "JWTObtainError";
    public message: string = "unable to sign jwt token";
    public stack?: string;

    public constructor(err: Error) {
        this.message = this.message + "; " + err.message;
        this.stack = err.stack;
    }
}
