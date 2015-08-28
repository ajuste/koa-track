var sinon = require("sinon");

module.exports.default = function() {
  const result = {
    getDefaults : sinon.stub().returns({
      headerName : "x-rid"
    }),
    setTrackingId : sinon.mock()
  };
  return function() {
    return result;
  };
};
