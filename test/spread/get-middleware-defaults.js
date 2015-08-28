const _          = require("underscore");
const assert     = require("assert");
const proxyquire = require("proxyquire");
const mocks      = {
  requestId : require("./mocks/request-id")
};

describe("spread's", function() {

  describe("getMiddlewareDefaults()", function() {

    before(function() {
      this.mod = proxyquire("../../lib/spread", { "./request-id" : mocks.requestId.defaultHeaderName() })();
    });

    after(function() {
      this.mod = null;
    });

    it("should return new object when passed null argument", function() {
      var def = this.mod.getMiddlewareDefaults(null);
      assert(def);
      assert(def.requestId);
      assert.equal(def.requestId.read, false);
      assert(def.requestId.artifacts);
      assert(def.requestId.artifacts.length, 1);
      assert(def.requestId.artifacts[0].type, "header");
      assert(def.requestId.artifacts[0].name, "mocked-name");
    });

    it("should return new object when passed undefined argument", function() {
      var def = this.mod.getMiddlewareDefaults(undefined);
      assert(def);
      assert(def.requestId);
      assert.equal(def.requestId.read, false);
      assert(def.requestId.artifacts);
      assert(def.requestId.artifacts.length, 1);
      assert(def.requestId.artifacts[0].type, "header");
      assert(def.requestId.artifacts[0].name, "mocked-name");
    });

    it("should set default properties when passed object without them", function() {
      var def = this.mod.getMiddlewareDefaults({test: 1});
      assert(def);
      assert(def.test, 1);
      assert(def.requestId);
      assert.equal(def.requestId.read, false);
      assert(def.requestId.artifacts);
      assert(def.requestId.artifacts.length, 1);
      assert(def.requestId.artifacts[0].type, "header");
      assert(def.requestId.artifacts[0].name, "mocked-name");
    });

    it("should set not touch def properties when passed", function() {
      var def = this.mod.getMiddlewareDefaults({
        requestId : {
          read : true,
          artifacts : [
            {type : "cookie", name : "rid" },
            {type : "header", name : "rid-header" }
          ]
        }
      });
      assert(def);
      assert(def.requestId);
      assert.equal(def.requestId.read, true);
      assert(def.requestId.artifacts);
      assert(def.requestId.artifacts.length, 2);
      assert(def.requestId.artifacts[0].type, "cookie");
      assert(def.requestId.artifacts[0].name, "rid");
      assert(def.requestId.artifacts[1].type, "header");
      assert(def.requestId.artifacts[1].name, "rid-header");
    });
  });
});
