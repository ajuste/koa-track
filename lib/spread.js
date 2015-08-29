const _         = require("underscore");
const requestId = require("./request-id")();

/**
 * @function Constructs exports for this module.
 * @param    {Object} [deps] Dependencies that can be mocked.
 */
module.exports = function(deps) {
  const mod = _.defaults(deps || {}, {


    /**
     * @function Returns a function that will spread tracking.
     * @param    {Object} [config.requestiId.write] True to spread request id
     * @param    {Object} [config.requestiId.artifactName] Name of hader for request id
     * @returns  {Object} The configuration defaults
     */
    spread : function(config) {
      config = mod.getSpreadDefaults(config);

      return function(ctx, opts) {
        if (config.requestId.write) {
          switch(opts.type) {
            case "http-request" :
              const headers = {};
              headers[config.requestId.artifactName] = ctx.trackingRequestId;
              _.defaults(opts.options, { headers : {}});
              _.defaults(opts.options.headers, headers);
              return opts.options;
            break;
            default :
              throw new Error("Unsupported spread type: " + opts.type);
          }
        }
      };
    },
    /**
     * @function Construct middleware
     * @param    {Boolean}   [opts.requestId.write] True to spread request-id on requests
     * @param    {Boolean}   [opts.requestId.read] True to read requestid from context
     * @param    {String}    [opts.requestId.writeArtifactName] Name where request-id should be sent
     * @param    {Array}     [opts.requestId.readArtifacts] Array of artifacts describing where to get request-id
     * @return   {Generator} Middleware function
     */
    middleware  : function(opts) {
      opts = mod.getMiddlewareDefaults(opts);

      return function* (next) {

        var artifact;
        // treat request id if configured to be red
        if (opts.requestId.read &&
           (artifact = mod.getFirstArtifactWithData(this, opts.requestId.artifacts))) {
          requestId.setTrackingId(this, artifact.value);
        }
        yield next;
      };
    },
    /**
     * @function Gets spread configuration defaults
     * @param    {Object} opts The options
     * @returns  {Object} The configuration defaults
     */
    getSpreadDefaults : function(opts) {
      opts = opts || {};
      _.defaults(opts, {requestId : {}});
      _.defaults(opts.requestId, {
        write: false,
        artifactName : requestId.defaultHeaderName
      });
      return opts;
    },
    /**
     * @function Gets middleware configuration defaults
     * @param    {Object} opts The options
     * @returns  {Object} The configuration defaults
     */
    getMiddlewareDefaults : function(opts) {
      opts = opts || {};
      _.defaults(opts, {requestId : {}});
      _.defaults(opts.requestId, {
        read: false,
        artifacts : [{type: "header", name: requestId.defaultHeaderName}]
      });
      return opts;
    },
    /**
     * @function Reads an artifact from context.
     * @param    {Object} ctx The context
     * @param    {Obejct} artifact The artifact to read
     * @throws   {Error}  When unsupported artifact type is passed
     * @returns  {*}      Value of the artifact
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
     * @function Gets first artifact with data in same order are passed.
     * @param    {Array}  artifacts Artifacts to analyze
     * @param    {Object} ctx The context
     * @returns  {Object} With artifact and value properties or undefined if none.
     */
    getFirstArtifactWithData : function(ctx, artifacts) {
      var data     = null;
      const artifact = _.find(artifacts, function(artifact) {
        return !!(data = mod.readArtifact(ctx, artifact));
      }, this);
      return artifact ? { artifact : artifact, value : data } : undefined;
    }
  });
  return mod;
};
