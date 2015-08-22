var _          = require("underscore");
var assert     = require("assert");

describe("getDefaults()", function() {
  before(function() {
    this.mod = require("../../lib/request-id");
  });

  after(function() {
    this.mod = null;
  });

  it("should return new object when passed null argument", function() {
    var def = this.mod.getDefaults(null);
    assert(def);
    assert.equal(def.headerName, "x-rid");
  })

  it("should return new object when passed undefined argument", function() {
    var def = this.mod.getDefaults(undefined);
    assert(def);
    assert.equal(def.headerName, "x-rid");
  })

  it("should set default properties when passed object without them", function() {
    var def = this.mod.getDefaults({prop:1});
    assert(def);
    assert.equal(def.headerName, "x-rid");
    assert.equal(def.prop, 1);
  })

  it("should set not touch def properties when passed", function() {
    var def = this.mod.getDefaults({prop:1, headerName: "x-request-id"});
    assert(def);
    assert.equal(def.headerName, "x-request-id");
    assert.equal(def.prop, 1);
  })
});
