var _         = require("underscore");
var requestId = require("./request-id")();

/**
 * @function Constructs exports for this module.
 * @param    {Object} [deps] Dependencies that can be mocked.
 */
module.exports = function(deps) {
  const mod = _.defaults(deps || {}, {

    spread : function() {

    },
    /**
     * @function
     */
    middleware  : function(opts) {
      opts = mod.getDefaults(opts);

      return function* (next) {
        this.trackingSpread = _.bind(mod.spread, this);

        var artifact;
        // treat request id if configured to be red
        if (opts.requestId.read &&
           (artifact = mod.getFirstArtifactWithData(opts.requestId.readArtifacts))) {
          requestId.setTrackingId(this, artifact.data);
        }
        yield next;
      };
    },
    /**
     * @function Gets configuration defaults
     * @param    {Object} opts The options
     * @returns  {Object} The configuration defaults
     */
    getDefaults : function(opts) {
      return _.defaults(opts || {}, {
        requestId : {
          write             : false,
          read              : false,
          writeArtifactName : requestId.defaultHeaderName,
          readArtifacts     : [{type: "header", name: requestId.defaultHeaderName}]
        }
      });
    },
    /**
     * @function
     */
    readArtifact : function(ctx, artifact) {
      switch(artifact.type) {
        case "header" :
          return ctx.request.header[artifact.name];
        default :
          throw new Error("Unsupported artifact type: " + artifact.type);
      }
    },
    /**
     * @function
     */
    getFirstArtifactWithData : function(artifacts) {
      var data     = null;
      var artifact = _.find(artifacts, function(artifact) {
        return !!(data = mod.readArtifact(this, artifact));
      }, this);
      return artifact ? { artifact : artifact, value : data } : undefined;
    }
  });
  return mod;
};
