var _    = require("underscore");
var uuid = require("node-uuid");

var RequestIdHeader = "x-rid";
/**
 * @function Gets configuration defaults
 * @param    {Object} opts The options
 * @returns  {Object} The configuration defaults
 */
var getDefaults = function(opts) {
  return _.defaults(opts || {}, {
    headerName: RequestIdHeader
  });
};
/**
 * @function Middleware for request id.
 * @param    {Object} [opts] The options
 * @param    {String} [opts.headerName] Header name for request id.
 */
var middleware = function(opts) {
  opts = getDefaults(opts);
  return function* (next) {
    this.trackingRequestId = this.trackingRequestId || uuid.v4();
    yield* next;
    this.set(opts.headerName, this.trackingRequestId);
  };
};
module.exports = {
  middleware  : middleware,
  getDefaults : getDefaults
};
