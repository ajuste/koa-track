var sinon = require("sinon");

module.exports.getFirstArtifactWithDataSecondSuccess = function(ctx) {
  return function() {
    return {
      readArtifact : (function() {
        var stub = sinon.stub();

        stub.withArgs(ctx, 0).returns(undefined);
        stub.withArgs(ctx, 1).returns("test-value");

        return stub;
      })()
    };
  };
};
module.exports.getFirstArtifactWithDataFail = function() {
  return function() {
    return {
      readArtifact : sinon.stub().returns(undefined)
    };
  };
};
module.exports.getSameOptionsAndArtifacts = function(opts, art) {
  return function() {
    return {
      getDefaults              : sinon.stub().returns(opts),
      getFirstArtifactWithData : sinon.stub().returns(art)
    };
  };
};
