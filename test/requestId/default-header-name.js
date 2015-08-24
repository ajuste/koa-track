var assert     = require("assert");

describe("requestId's", function() {
  describe("defaultHeaderName", function() {
    it("should have correct name", function() {
      assert.equal(require("../../lib/request-id")().defaultHeaderName, "x-rid");
    });
  });
});
