var sinon = require("sinon");

module.exports.defaultHeaderName = function() {
  return function() {
    return {
      defaultHeaderName : "mocked-name"
    };
  };
};
module.exports.setTrackingId = function() {
  var result = {
    setTrackingId : sinon.stub()
  };
  return function() {
    return result;
  };
};
