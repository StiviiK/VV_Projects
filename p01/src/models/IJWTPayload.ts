// defines the layout for required/existing fields in jwt tokens
export interface IJWTPayload {
    // ** do not set manually */
    readonly iat?: string;
    // ** do not set manually */
    readonly exp?: string;
}
