const _          = require("underscore");
const assert     = require("assert");
const co         = require("co");
const sinon      = require("sinon");
const mod        = require("../../lib/spread");
const proxyquire = require("proxyquire");
const mocks      = {
  spread    : require("./mocks/spread"),
  requestId : require("./mocks/request-id")
};

var afters = {
  common : function() {
    this.mocks            = null;
    this.middleware       = null;
    this.middlewareArgs   = null;
    this.func             = null;
    this.mod              = null;
    this.modCtr           = null;
    this.returnedArtifact = null;
    this.getFirstArtifactWithDataArgs = null;
  }
};
var befores = {
  common : function(returnedArtifact) {
    return function() {
      this.middlewareArgs = { requestId : { read : true, artifacts : [{}] }};
      this.getFirstArtifactWithDataArgs = {};
      this.returnedArtifact = returnedArtifact;
      this.mocks = {
        "./request-id" : mocks.requestId.setTrackingId(),
        ctx : {
          set : sinon.stub(),
          trackingRequestId : "tracking"
        }
      };
      this.modCtr = proxyquire("../../lib/spread", this.mocks);
      this.mod = this.modCtr(mocks.spread.getSameOptionsAndArtifacts(this.middlewareArgs, returnedArtifact)()),
      this.middleware = mod(this.mod).middleware;
    };
  }
};
describe("spread's", function() {

  describe("middleware()", function() {

    describe("with read flag", function() {

      describe("and no artifacts", function() {

        before(befores.common());
        after (afters.common);

        it("should have called getMiddlewareDefaults once", function() {
          this.func = this.middleware(this.middlewareArgs);
          assert(this.mod.getMiddlewareDefaults.calledOnce);
        });

        it("should have called getMiddlewareDefaults with correct arguments", function() {
          assert(this.mod.getMiddlewareDefaults.calledWith(this.middlewareArgs));
        });

        it("should have called getFirstArtifactWithData once", function() {
          co(this.func.call(this.mocks.ctx, function* () { }));
          assert(this.mod.getFirstArtifactWithData.calledOnce);
        });

        it("should have called getFirstArtifactWithData with correct arguments", function() {
          assert(this.mod.getFirstArtifactWithData.calledWith(this.mocks.ctx, this.middlewareArgs.requestId.artifacts));
        });

        it("should have not called setRequestId", function() {
          assert(this.mocks["./request-id"]().setTrackingId.notCalled);
        });
      });

      describe("and artifacts", function() {

        before(befores.common({data:"data"}));
        after (afters.common);

        it("should have called getMiddlewareDefaults once", function() {
          this.func = this.middleware(this.middlewareArgs);
          assert(this.mod.getMiddlewareDefaults.calledOnce);
        });

        it("should have called getMiddlewareDefaults with correct arguments", function() {
          assert(this.mod.getMiddlewareDefaults.calledWith(this.middlewareArgs));
        });

        it("should have called getFirstArtifactWithData once", function() {
          co(this.func.call(this.mocks.ctx, function* () { }));
          assert(this.mod.getFirstArtifactWithData.calledOnce);
        });

        it("should have called getFirstArtifactWithData with correct arguments", function() {
          assert(this.mod.getFirstArtifactWithData.calledWith(this.mocks.ctx, this.middlewareArgs.requestId.artifacts));
        });

        it("should have called setRequestId once", function() {
          assert(this.mocks["./request-id"]().setTrackingId.calledOnce);
        });

        it("should have called setRequestId with correct arguments", function() {
          assert(this.mocks["./request-id"]().setTrackingId.calledWith(this.mocks.ctx, this.returnedArtifact.value));
        });
      });
    });
  });
});
