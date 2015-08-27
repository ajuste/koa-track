var _          = require("underscore");
var assert     = require("assert");

var mocks = {
  spread : require("./mocks/spread")
};

describe("spread's", function() {

  describe("getFirstArtifactWithData()", function() {

    after(function() {
      this.mod = null;
    });

    describe("called with data-less artifacts", function() {

      before(function() {
        this.artifacts = [{},{}];
        this.mock = mocks.spread.getFirstArtifactWithDataFail()();
        this.mod = require("../../lib/spread")(this.mock);
      });

      it("should return undefined", function() {
        assert.equal(this.mod.getFirstArtifactWithData(this.artifacts), undefined);
      });

      it("should have called readArtifact() twice", function() {
        assert.equal(this.mod.readArtifact.callCount, 2);
      });
    });

    describe("called with first data-less artifacts", function() {

      before(function() {
        this.artifacts = [0,1,2];
        this.ctx = {};
        this.mock = mocks.spread.getFirstArtifactWithDataSecondSuccess(this.ctx)();
        this.mod = require("../../lib/spread")(this.mock);
      });

      it("should return \'test-value\'", function() {
        var result = this.mod.getFirstArtifactWithData.call(this.ctx, this.artifacts);
        assert(result);
        assert.equal(result.artifact, this.artifacts[1]);
        assert.equal(result.value, "test-value");
      });

      it("should have called readArtifact() twice", function() {
        assert.equal(this.mod.readArtifact.callCount, 2);
      });

      it("should have called readArtifact() with correct args", function() {
        assert(this.mod.readArtifact.firstCall.calledWith(this.ctx, 0));
        assert(this.mod.readArtifact.secondCall.calledWith(this.ctx, 1));
        assert(this.mod.readArtifact.neverCalledWith(this.ctx, 2));
      });
    });
  });
});
