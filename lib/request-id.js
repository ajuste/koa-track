var _    = require("underscore");
var uuid = require("node-uuid");

var RequestIdHeader = "x-rid";

/**
 * @function Constructs exports for this module.
 * @param    {Object} [deps] Dependencies that can be mocked.
 */
module.exports = function(deps) {

  deps = _.defaults(deps || {}, {
    /**
     * @function Middleware for request id.
     * @param    {Object} [opts] The options
     * @param    {String} [opts.headerName] Header name for request id.
     */
    middleware : function(opts) {
      opts = deps.getDefaults(opts);
      return function* (next) {
        deps.setTrackingId(this);
        yield next;
        this.set(opts.headerName, this.trackingRequestId);
      };
    },
    /**
     * @function Gets configuration defaults
     * @param    {Object} opts The options
     * @returns  {Object} The configuration defaults
     */
    getDefaults : function(opts) {
      return _.defaults(opts || {}, {
        headerName: RequestIdHeader
      });
    },
    setTrackingId : function(ctx, id) {
      ctx.trackingRequestId = ctx.trackingRequestId || id || uuid.v4();
    },
    defaultHeaderName : RequestIdHeader
  });
  return deps;
};
