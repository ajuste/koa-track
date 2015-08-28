const _          = require("underscore");
const assert     = require("assert");
const request    = require("supertest");
const proxyquire = require("proxyquire");
const app        = require("./app");
const sinon      = require("sinon");

const mocks      = {
  nodeUuid : require("./mocks/node-uuid")
};

describe("spread integration testing", function() {

  before(function() {
    this.mock = { nodeUuid : mocks.nodeUuid.fixedV1() };
    this.spreadMiddlewareDb  = require("../../lib/spread")().middleware({
      requestId: {
        read: true,
        artifacts:[{
          type:"header", name: "x-quest-id"
        }]
      }
    });
    this.spreadFe  = require("../../lib/spread")().spread({
      requestId: {
        write: true,
        artifactName:"x-quest-id"
      }
    });
    this.requestIdMiddleware = proxyquire("../../lib/request-id", { "node-uuid" : this.mock.nodeUuid })().middleware({headerName:"x-quest-id"});
    this.mockedLogger = sinon.stub();
    this.databaseApp  = app.createDatabaseServer(this.spreadMiddlewareDb, this.mockedLogger);
    this.frontendApp  = app.createFrontendServer(this.spreadFe, this.requestIdMiddleware, this.mockedLogger);
    this.databaseApp.listen(3000);
  });

  it("should respond with a request id header", function(done) {
    request(this.frontendApp.listen())
    .get("/renderUser")
    .expect("x-quest-id", "b4bdeac1-6a53-4380-bd41-a4c6535bf4e3")
    .expect(200, "{\"userId\":90,\"firstName\":\"ajuste\"}", done);
  });

  it("should have called v4 uuid once", function() {
    assert(this.mock.nodeUuid.v4.calledOnce);
  });

  it("should have called logger two times", function() {
    assert.equal(this.mockedLogger.callCount, 2);
  });

  it("should have called logger on front end", function() {
    assert(this.mockedLogger.firstCall.calledWith("logging request-id from front end server: b4bdeac1-6a53-4380-bd41-a4c6535bf4e3"));
  });

  it("should have called logger on db end", function() {
    assert(this.mockedLogger.secondCall.calledWith("logging request-id from db server: b4bdeac1-6a53-4380-bd41-a4c6535bf4e3"));
  });
});
