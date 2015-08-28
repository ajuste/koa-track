var sinon = require("sinon");

module.exports.fixedV1 = function() {
  return {
    v4 : sinon.stub().returns("b4bdeac1-6a53-4380-bd41-a4c6535bf4e3")
  };
};
