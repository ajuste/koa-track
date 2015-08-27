var _          = require("underscore");
var assert     = require("assert");
var co         = require("co");
var sinon      = require("sinon");
var mod        = require("../../lib/spread");
var proxyquire = require("proxyquire");

var mocks  = {
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
      this.middlewareArgs = { requestId : { read : true, readArtifacts : [{}] }};
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

        it("should have called getDefaults once", function() {
          this.func = this.middleware(this.middlewareArgs);
          assert(this.mod.getDefaults.calledOnce);
        });

        it("should have called getDefaults with correct arguments", function() {
          assert(this.mod.getDefaults.calledWith(this.middlewareArgs));
        });

        it("should have called getFirstArtifactWithData once", function() {
          co(this.func.call(this.mocks.ctx, function* () { }));
          assert(this.mod.getFirstArtifactWithData.calledOnce);
        });

        it("should have called getFirstArtifactWithData with correct arguments", function() {
          assert(this.mod.getFirstArtifactWithData.calledWith(this.middlewareArgs.requestId.readArtifacts));
        });

        it("should have not called setRequestId", function() {
          assert(this.mocks["./request-id"]().setTrackingId.notCalled);
        });

        it("should have set trackingSpread", function() {
          assert(_.isFunction(this.mocks.ctx.trackingSpread));
        });
      });

      describe("and artifacts", function() {

        before(befores.common({data:"data"}));
        after (afters.common);

        it("should have called getDefaults once", function() {
          this.func = this.middleware(this.middlewareArgs);
          assert(this.mod.getDefaults.calledOnce);
        });

        it("should have called getDefaults with correct arguments", function() {
          assert(this.mod.getDefaults.calledWith(this.middlewareArgs));
        });

        it("should have called getFirstArtifactWithData once", function() {
          co(this.func.call(this.mocks.ctx, function* () { }));
          assert(this.mod.getFirstArtifactWithData.calledOnce);
        });

        it("should have called getFirstArtifactWithData with correct arguments", function() {
          assert(this.mod.getFirstArtifactWithData.calledWith(this.middlewareArgs.requestId.readArtifacts));
        });

        it("should have called setRequestId once", function() {
          assert(this.mocks["./request-id"]().setTrackingId.calledOnce);
        });

        it("should have called setRequestId with correct arguments", function() {
          assert(this.mocks["./request-id"]().setTrackingId.calledWith(this.mocks.ctx, this.returnedArtifact.data));
        });

        it("should have set trackingSpread", function() {
          assert(_.isFunction(this.mocks.ctx.trackingSpread));
        });
      });
    });
  });
});
