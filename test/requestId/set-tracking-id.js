var assert     = require("assert");
var proxyquire = require("proxyquire");
var stubs      = {
  nodeUuid : require("./stubs/node-uuid")
};

var afters = {
  common : function() {
    this.ctx  = null;
    this.stub = null;
    this.mod  = null;
  }
};
var befores = {
  common : function() {
    this.ctx  = {};
    this.stub = { nodeUuid : stubs.nodeUuid.fixedV1() };
    this.mod  = proxyquire("../../lib/request-id", { "node-uuid" : this.stub.nodeUuid })();
  }
};
describe("requestId's", function() {

  describe("setTrackingId()", function() {

    describe("without previous id and not specifying", function() {

      before(befores.common);
      after(afters.common);

      it("should set request id", function() {
        this.mod.setTrackingId(this.ctx);
        assert.equal(this.ctx.trackingRequestId, "b4bdeac1-6a53-4380-bd41-a4c6535bf4e3");
      });

      it("should have called v4 uuid once", function() {
        assert(this.stub.nodeUuid.v4.calledOnce);
      });
    });

    describe("without previous id and specifying", function() {

      before(befores.common);
      after(afters.common);

      it("should set request id", function() {
        this.mod.setTrackingId(this.ctx, "specified");
        assert.equal(this.ctx.trackingRequestId, "specified");
      });

      it("should have not called v4 uuid once", function() {
        assert(!this.stub.nodeUuid.v4.calledOnce);
      });
    });

    describe("with previous id", function() {

      before(befores.common);
      after(afters.common);

      it("should keep request id and not generate a random", function() {
        this.ctx.trackingRequestId = "previous"
        this.mod.setTrackingId(this.ctx);
        assert.equal(this.ctx.trackingRequestId, "previous");
      });

      it("should have not called v4 uuid once", function() {
        assert(!this.stub.nodeUuid.v4.calledOnce);
      });
    });

    describe("with previous id and specifying", function() {

      before(befores.common);
      after(afters.common);

      it("should keep request id and not generate a random", function() {
        this.ctx.trackingRequestId = "previous"
        this.mod.setTrackingId(this.ctx, "specified");
        assert.equal(this.ctx.trackingRequestId, "previous");
      });

      it("should have not called v4 uuid once", function() {
        assert(!this.stub.nodeUuid.v4.calledOnce);
      });
    });
  });
});
