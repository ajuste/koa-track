const _          = require("underscore");
const assert     = require("assert");
const co         = require("co");
const sinon      = require("sinon");
const mod        = require("../../lib/spread");
const proxyquire = require("proxyquire");
const mocks      = {
  spread    : require("./mocks/spread")
};

var afters = {
  common : function() {
    this.mocks            = null;
    this.spread           = null;
    this.func             = null;
    this.mod              = null;
    this.modCtr           = null;
  }
};
var befores = {
  common : function(defaults, opts) {
    return function() {
      this.defaults = defaults;
      this.mocks = { ctx : {trackingRequestId:"req-id-val"}};
      this.modCtr = require("../../lib/spread");
      this.mod = this.modCtr(mocks.spread.getSpreadDefaults(defaults)()),
      this.spread = mod(this.mod).spread;
      this.opts = opts;
    };
  }
};
describe("spread's", function() {

  describe("spread()", function() {

    describe("for requestId", function() {

      describe("with write flag on and artifactName not default", function() {

        before(befores.common(
          {
            requestId:{
              write:true, artifactName:"test"
            }
          },
          {
            type:"http-request",
            options : {
              headers: {
                other:"val"
              }
            }
          }));
        after (afters.common);

        it("should have called getSpreadDefaults once", function() {
          this.func = this.spread(this.opts);
          assert(this.mod.getSpreadDefaults.calledOnce);
        });

        it("should have called getSpreadDefaults with correct arguments", function() {
          assert(this.mod.getSpreadDefaults.calledWith(this.opts));
        });

        it("should have set requestId with correct header name", function() {
          this.func(this.mocks.ctx, this.opts);
          debugger;
          assert.equal(this.opts.options.headers.test, "req-id-val");
        });

        it("should have left untouched other heaaders", function() {
          assert.equal(this.opts.options.headers.other, "val");
        });
      });

      describe("with write flag on and invalid type", function() {

        before(befores.common(
          {
            requestId:{
              write:true, artifactName:"test"
            }
          },
          {
            type:"http-cookie"
          }));
        after (afters.common);

        it("should have called getSpreadDefaults once", function() {
          this.func = this.spread(this.opts);
          assert(this.mod.getSpreadDefaults.calledOnce);
        });

        it("should have called getSpreadDefaults with correct arguments", function() {
          assert(this.mod.getSpreadDefaults.calledWith(this.opts));
        });

        it("should have thrown an error", function() {
          var fn = _.bind(function() { this.func(this.mocks.ctx, this.opts); }, this);
          assert.throws(fn, Error, "Unsupported spread type: http-cookie");
        });
      });
    });
  });
});
