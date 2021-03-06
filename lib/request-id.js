const _    = require("underscore");
const uuid = require("node-uuid");

const RequestIdHeader = "x-rid";

/**
 * @function Constructs exports for this module.
 * @param    {Object} [deps] Dependencies that can be mocked.
 */
module.exports = function(deps) {

  const mod = _.defaults(deps || {}, {
    /**
     * @function Middleware for request id.
     * @param    {Object} [opts] The options
     * @param    {String} [opts.headerName] Header name for request id.
     */
    middleware : function(opts) {
      opts = mod.getDefaults(opts);
      return function* (next) {
        mod.setTrackingId(this);
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
    /**
     * @function Sets request id to context if not already.
     * @param    {Object} ctx The context
     * @param    {String} [id] Id to set. If not specified a UUID will be generated.
     */
    setTrackingId : function(ctx, id) {
      ctx.trackingRequestId = ctx.trackingRequestId || id || uuid.v4();
    },
    defaultHeaderName : RequestIdHeader
  });
  return mod;
};
