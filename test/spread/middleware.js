var assert  = require("assert");
var sinon   = require("sinon");
var mod     = require("../../lib/request-id");
var co      = require("co");

var afters = {
  common : function() {
    this.stub           = null;
    this.middleware     = null;
    this.middlewareArgs = null;
    this.func           = null;
  }
};
var befores = {
  common : function() {
    this.stub       = {
      mod      : {
        getDefaults : sinon.stub().returns({
          headerName : "x-rid"
        }),
        setTrackingId : sinon.stub()
      },
      ctx : {
        set : sinon.stub(),
        trackingRequestId : "tracking"
      }
    };
    this.middlewareArgs = {};
    this.middleware     = mod(this.stub.mod).middleware;
  }
};
describe("spread's", function() {

  describe("middleware()", function() {

    before(befores.common);
    after (afters.common);

    it("should have called getDefaults once", function() {
      this.func = this.middleware(this.middlewareArgs);
      assert(this.stub.mod.getDefaults.calledOnce);
      assert(this.stub.mod.getDefaults.calledWith(this.middlewareArgs));
    });

    it("should have called setTrackingId once", function() {

      co(this.func.call(this.stub.ctx, function* () { }));
      assert(this.stub.mod.setTrackingId.calledOnce);
    });

    it("should have called set on ctx once with requestId", function() {
      assert(this.stub.ctx.set.calledOnce);
      assert(this.stub.ctx.set.calledWith("x-rid", "tracking"));
    });
  });
});
