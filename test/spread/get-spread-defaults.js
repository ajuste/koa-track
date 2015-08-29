const _          = require("underscore");
const assert     = require("assert");
const proxyquire = require("proxyquire");
const mocks      = {
  requestId : require("./mocks/request-id")
};

describe("spread's", function() {

  describe("getSpreadDefaults()", function() {

    before(function() {
      this.mod = proxyquire("../../lib/spread", { "./request-id" : mocks.requestId.defaultHeaderName() })();
    });

    after(function() {
      this.mod = null;
    });

    it("should return new object when passed null argument", function() {
      var def = this.mod.getSpreadDefaults(null);
      debugger;
      assert(def);
      assert(def.requestId);
      assert.equal(def.requestId.write, false);
      assert(def.requestId.artifactName, "mocked-name");
    });

    it("should return new object when passed undefined argument", function() {
      var def = this.mod.getSpreadDefaults(undefined);
      assert(def);
      assert(def.requestId);
      assert.equal(def.requestId.write, false);
      assert(def.requestId.artifactName, "mocked-name");
    });

    it("should set default properties when passed object without them", function() {
      var def = this.mod.getSpreadDefaults({test: 1});
      assert(def);
      assert(def.test, 1);
      assert(def.requestId);
      assert(def.requestId.artifactName, "mocked-name");
    });

    it("should set not touch def properties when passed", function() {
      var def = this.mod.getSpreadDefaults({
        requestId : {
          write : true,
          artifactName : "rid-header"
        }
      });
      assert(def);
      assert(def.requestId);
      assert.equal(def.requestId.write, true);
      assert(def.requestId.artifactName, "rid-header");
    });
  });
});
