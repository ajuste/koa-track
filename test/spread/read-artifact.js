const _          = require("underscore");
const assert     = require("assert");
const proxyquire = require("proxyquire");
const mocks      = {
  spread : require("./mocks/spread")
};

describe("spread's", function() {

  describe("readArtifact()", function() {

    before(function() {
      this.mod = require("../../lib/spread")();
    });

    after(function() {
      this.mod = null;
    });

    describe("header artifact", function() {

      before(function() {
        this.ctx = {
          request : {
            header : {
              "test-header" : "test-value"
            }
          }
        };
      });

      after(function() {
        this.ctx = null;
      });

      it("should read headers of header artifact", function() {
        var artifactValue = this.mod.readArtifact(this.ctx, { name : "test-header", type: "header" });
        assert.equal(artifactValue, "test-value");
      });

      it("should return undefined on header not present", function() {
        var artifactValue = this.mod.readArtifact(this.ctx, { name : "test-header1", type: "header" });
        assert.equal(artifactValue, undefined);
      });
    });

    describe("unknown artifact", function() {

      before(function() {
        this.ctx = {};
      });

      after(function() {
        this.ctx = null;
      });

      it("should throw an exception", function() {
        var fn = this.mod.readArtifact.bind(this.mod, this.ctx, { name : "test-header", type: "invalid-artifact" });
        assert.throws(fn, Error, "Unsupported artifact type: invalid-artifact");
      });
    });
  });
});
