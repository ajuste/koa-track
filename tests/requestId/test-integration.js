var assert     = require("assert");
var request    = require("supertest");
var proxyquire = require("proxyquire");
var stubs      = {
  "node-uuid" : require("./stubs/node-uuid")
};

describe("koa-track", function() {

  before(function(){
    proxyquire("../../index", { "node-uuid" : stubs["node-uuid"] });
    this.app = require("./server");
  });

  after(function() {
    this.app = null;
  });

  it("should respond with a request id header on 200", function(done) {
    request(this.app.listen())
    .get("/200")
    .expect("x-rid", "b4bdeac1-6a53-4380-bd41-a4c6535bf4e3")
    .expect(200, "OK", done);
  });

  it("should respond with a request id header on 404", function(done) {
    request(this.app.listen())
    .get("/404")
    .expect("x-rid", "b4bdeac1-6a53-4380-bd41-a4c6535bf4e3")
    .expect(404, "OK", done);
  });
});
