var _          = require("underscore");
var assert     = require("assert");
var request    = require("supertest");
var proxyquire = require("proxyquire");
var stubs      = {
  nodeUuid : require("./stubs/node-uuid")
};

var afters = {
  common : function() {
    this.stub       = null;
    this.middleware = null;
    this.app        = null;
  }
};
var befores = {
  defParameters : function() {
    this.stub       = { nodeUuid : stubs.nodeUuid.fixedV1() };
    this.middleware = proxyquire("../../lib/request-id", { "node-uuid" : this.stub.nodeUuid })().middleware();
    this.app        = require("./app").createApp(this.middleware);
  },
  notDefaultParameters : function() {
    this.stub       = { nodeUuid : stubs.nodeUuid.fixedV1() };
    this.middleware = proxyquire("../../lib/request-id", { "node-uuid" : this.stub.nodeUuid })().middleware({
      headerName : "x-quest-id"
    });
    this.app        = require("./app").createApp(this.middleware);
  }
};
describe("requestId's", function() {

  describe("middleware()", function() {

    describe("with not default parameters", function() {

      describe("server responding 200", function() {

        before(befores.notDefaultParameters);
        after (afters.common);

        it("should respond with a request id header", function(done) {
          request(this.app.listen())
          .get("/200")
          .expect("x-quest-id", "b4bdeac1-6a53-4380-bd41-a4c6535bf4e3")
          .expect(200, "OK", done);
        });

        it("should have called v4 uuid once", function() {
          assert(this.stub.nodeUuid.v4.calledOnce);
        });
      });
    });

    describe("with default parameters", function() {

      describe("server responding 200", function() {

        before(befores.defParameters);
        after (afters.common);

        it("should respond with a request id header", function(done) {
          request(this.app.listen())
          .get("/200")
          .expect("x-rid", "b4bdeac1-6a53-4380-bd41-a4c6535bf4e3")
          .expect(200, "OK", done);
        });

        it("should have called v4 uuid once", function() {
          assert(this.stub.nodeUuid.v4.calledOnce);
        });
      });

      describe("server responding 200 with id already set", function() {

        before(befores.defParameters);
        after (afters.common);

        it("should respond with a request id header", function(done) {
          request(this.app.listen())
          .get("/alreadySet")
          .expect("x-rid", "alreadySet")
          .expect(200, "OK", done);
        });

        it("should have called v4 uuid once", function() {
          assert(!this.stub.nodeUuid.v4.calledOnce);
        });
      });

      describe("server responding 404", function() {

        before(befores.defParameters);
        after (afters.common);

        it("should respond with a request id header", function(done) {
          request(this.app.listen())
          .get("/404")
          .expect("x-rid", "b4bdeac1-6a53-4380-bd41-a4c6535bf4e3")
          .expect(404, "OK", done);
        });

        it("should have called v4 uuid once", function() {
          assert(this.stub.nodeUuid.v4.calledOnce);
        });
      });

      describe("erroring server", function() {

        before(befores.defParameters);
        after (afters.common);

        it("should respond without a request id header", function(done) {
          request(this.app.listen())
          .get("/error")
          .expect(function(res) {
            assert(_.isUndefined(res.headers["x-rid"]));
          })
          .expect(500, "Internal Server Error", done);
        });

        it("should have called v4 uuid once", function() {
          assert(this.stub.nodeUuid.v4.calledOnce);
        });
      });

    });
  });
});
