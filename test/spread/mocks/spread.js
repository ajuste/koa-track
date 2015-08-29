var sinon = require("sinon");

module.exports.getFirstArtifactWithDataSecondSuccess = function(ctx) {
  const result = {
    readArtifact : (function() {
      var stub = sinon.stub();

      stub.withArgs(ctx, 0).returns(undefined);
      stub.withArgs(ctx, 1).returns("test-value");

      return stub;
    })()
  };
  return function() {
    return result;
  };
};
module.exports.getFirstArtifactWithDataFail = function() {
  const result = {
    readArtifact : sinon.stub().returns(undefined)
  };
  return function() {
    return result;
  };
};
module.exports.getSameOptionsAndArtifacts = function(opts, art) {
  const result = {
    getMiddlewareDefaults    : sinon.stub().returns(opts),
    getFirstArtifactWithData : sinon.stub().returns(art)
  };
  return function() {
    return result;
  };
};
module.exports.getSpreadDefaults = function(opts) {
  const result = {
    getSpreadDefaults : sinon.stub().returns(opts)
  };
  return function() {
    return result;
  };
};
