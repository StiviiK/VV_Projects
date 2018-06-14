//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../dist/index');
let should = chai.should();
chai.use(chaiHttp);

const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjgxMTcyOTZ9.K3xqqJjII80U5KS6Fqx7ki3HFXTfN5OPIY6OGtau-bar6BKRBdoqlw1Jeo9NokMY-PDtc6ORVugOp7R146fi4CeMWtJMofZ3K-NWS85_TegnzJ4PjMDONKst20JIJ_nYteryh1B8gmYNtWEXL75mhYYfEpAGlZD69iY2XIPN9C6YZlp8rp80IuPRxKWTUVEEgY6s4ypO-AR34gRIilM6-iGUgn8VBs6bDTzdptIZgfTOJy9RxqC1lhINUXyZmeIneZJtET8-oo2oZwJExCzWTulfE9B-455pQzCoNKUl0Rmsn-JzNh3Jw2uCGxxWrCuh-0wfQRRcn4VbCcjfEm4TWw";

// Test blocks
describe("JWT tests", () => {
    describe("test unauthorized request", () => {
        it("should return an unauthorized error (/auth/jwt)", (done) => {
            chai.request(server)
                .get("/auth/jwt")
                .end((req, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");

                    done();
                });
        });
    });

    describe("test authorized request", () => {
        it("should return info for the jwt token (/auth/jwt?token=...)", (done) => {
            chai.request(server)
                .get("/auth/jwt?token=" + token)
                .end((req, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("payload")
                    res.body.payload.should.have.property("token_payload");
                    res.body.payload.token_payload.should.have.property("iat");
                    
                    done();
                });
        });
    });
});
