//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.PORT = 65092;

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
        it("should return info for the jwt token (/auth/jwt?token=" + token + ")", (done) => {
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

describe("Main api tests", () => {
    describe("test get all customers", () => {
        it("should return no customers", (done) => {
            chai.request(server)
                .get("/customer/find?token=" + token)
                .end((req, res) => {
                    res.should.have.status(200);
                    res.body.status.should.be.true;
                    done();
                });
        })
    });

    let customerId = null;
    let insuranceId = null;
    describe("test add customer and insurance", () => {
        it("should create an customer", (done) => {
            chai.request(server)
                .post("/customer/create?token=" + token)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    firstname: "Stefan",
                    lastname: "Kürzeder",
                    customerNumber: Math.floor(Math.random() * 10000) + 1,
                    addressRef: "5b17bafd42ee4b0007347e8b"
                })
                .end((req, res) => {
                    res.should.have.status(200);
                    res.body.status.should.be.true;

                    res.body.payload.should.have.property("customer");
                    res.body.payload.customer.should.have.property("_id");
                    customerId = res.body.payload.customer._id;

                    done();
                });
        })

        it("should create an insurance", (done) => {
            chai.request(server)
                .post("/insurance/create?token=" + token)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    annualRate: Math.floor(Math.random() * 10000) + 100,
                    contractNumber: Math.floor(Math.random() * 10000) + 1,
                    type: "KFZ"
                })
                .end((req, res) => {
                    res.should.have.status(200);
                    res.body.status.should.be.true;

                    res.body.payload.should.have.property("insurance");
                    res.body.payload.insurance.should.have.property("_id");
                    insuranceId = res.body.payload.insurance._id;

                    done();
                });
        })
    })

    describe("test add/remove insurance to/from the customer", () => {
        it("should add the insurance to the customer", (done) => {
            chai.request(server)
                .put("/customer/" + customerId + "/insurance/" + insuranceId + "?token=" + token)
                .end((req, res) => {
                    res.should.have.status(200);
                    res.body.status.should.be.true;

                    done();
                });
        });

        it("should remove the insurance from the customer", (done) => {
            chai.request(server)
                .del("/customer/" + customerId + "/insurance/" + insuranceId + "?token=" + token)
                .end((req, res) => {
                    res.should.have.status(200);
                    res.body.status.should.be.true;

                    done();
                });
        });
    })

    describe("test delete the customer and insurance", () => {
        it("should delete the newly added insurance", (done) => {
            chai.request(server)
                .del("/insurance/" + insuranceId + "?token=" + token)
                .end((req, res) => {
                    res.should.have.status(200);
                    res.body.status.should.be.true;

                    done();
                });
        })

        it("should delete the newly added customer", (done) => {
            chai.request(server)
                .del("/customer/" + customerId + "?token=" + token)
                .end((req, res) => {
                    res.should.have.status(200);
                    res.body.status.should.be.true;

                    done();
                });
        })
    });
})