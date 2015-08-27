var _          = require("underscore");
var assert     = require("assert");
var proxyquire = require("proxyquire");

var mocks = {
  requestId : require("./mocks/request-id")
};

describe("spread's", function() {

  describe("getDefaults()", function() {

    before(function() {
      this.mod = proxyquire("../../lib/spread", { "./request-id" : mocks.requestId.defaultHeaderName() })();
    });

    after(function() {
      this.mod = null;
    });

    it("should return new object when passed null argument", function() {
      var def = this.mod.getDefaults(null);
      assert(def);
      assert(def.requestId);
      assert.equal(def.requestId.write, false);
      assert.equal(def.requestId.read, false);
      assert.equal(def.requestId.writeArtifactName, "mocked-name");
      assert(def.requestId.readArtifacts);
      assert(def.requestId.readArtifacts.length, 1);
      assert(def.requestId.readArtifacts[0].type, "header");
      assert(def.requestId.readArtifacts[0].name, "mocked-name");
    });

    it("should return new object when passed undefined argument", function() {
      var def = this.mod.getDefaults(undefined);
      assert(def);
      assert(def.requestId);
      assert.equal(def.requestId.write, false);
      assert.equal(def.requestId.read, false);
      assert.equal(def.requestId.writeArtifactName, "mocked-name");
      assert(def.requestId.readArtifacts);
      assert(def.requestId.readArtifacts.length, 1);
      assert(def.requestId.readArtifacts[0].type, "header");
      assert(def.requestId.readArtifacts[0].name, "mocked-name");
    });

    it("should set default properties when passed object without them", function() {
      var def = this.mod.getDefaults({test: 1});
      assert(def);
      assert(def.test, 1);
      assert(def.requestId);
      assert.equal(def.requestId.write, false);
      assert.equal(def.requestId.read, false);
      assert.equal(def.requestId.writeArtifactName, "mocked-name");
      assert(def.requestId.readArtifacts);
      assert(def.requestId.readArtifacts.length, 1);
      assert(def.requestId.readArtifacts[0].type, "header");
      assert(def.requestId.readArtifacts[0].name, "mocked-name");
    });

    it("should set not touch def properties when passed", function() {
      var def = this.mod.getDefaults({
        requestId : {
          write : true,
          read : true,
          writeArtifactName : "x-rid1",
          readArtifacts : [
            {type : "cookie", name : "rid" },
            {type : "header", name : "rid-header" }
          ]
        }
      });
      assert(def);
      assert(def.requestId);
      assert.equal(def.requestId.write, true);
      assert.equal(def.requestId.read, true);
      assert.equal(def.requestId.writeArtifactName, "x-rid1");
      assert(def.requestId.readArtifacts);
      assert(def.requestId.readArtifacts.length, 2);
      assert(def.requestId.readArtifacts[0].type, "cookie");
      assert(def.requestId.readArtifacts[0].name, "rid");
      assert(def.requestId.readArtifacts[1].type, "header");
      assert(def.requestId.readArtifacts[1].name, "rid-header");
    });
  });
});
