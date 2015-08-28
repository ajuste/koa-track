var assert  = require("assert");
var sinon   = require("sinon");
var mod     = require("../../lib/request-id");
var co      = require("co");

var afters = {
  common : function() {
    this.mock           = null;
    this.middleware     = null;
    this.middlewareArgs = null;
    this.func           = null;
  }
};
var befores = {
  common : function() {
    this.mock       = {
      mod : require("./mocks/request-id").default()(),
      ctx : { set : sinon.stub(), trackingRequestId : "tracking" }
    };
    this.middlewareArgs = {};
    this.middleware     = mod(this.mock.mod).middleware;
  }
};
describe("requestId's", function() {

  describe("middleware()", function() {

    before(befores.common);
    after (afters.common);

    it("should have called getDefaults once", function() {
      this.func = this.middleware(this.middlewareArgs);
      assert(this.mock.mod.getDefaults.calledOnce);
      assert(this.mock.mod.getDefaults.calledWith(this.middlewareArgs));
    });

    it("should have called setTrackingId once", function() {

      co(this.func.call(this.mock.ctx, function* () { }));
      assert(this.mock.mod.setTrackingId.calledOnce);
    });

    it("should have called set on ctx once with requestId", function() {
      assert(this.mock.ctx.set.calledOnce);
      assert(this.mock.ctx.set.calledWith("x-rid", "tracking"));
    });
  });
});
