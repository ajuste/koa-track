var sinon = require("sinon");

module.exports.defaultHeaderName = function() {
  const result = {
    defaultHeaderName : "mocked-name"
  };
  return function() {
    return result;
  };
};
module.exports.setTrackingId = function() {
  const result = {
    setTrackingId : sinon.stub()
  };
  return function() {
    return result;
  };
};
