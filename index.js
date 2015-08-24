var _    = require("underscore");
var uuid = require("node-uuid");
var requestId = require('./lib/request-id');

var UserIdCookie         = "uid";
var UserIdCookieDuration = "31536000000"; //1year

/**
 * @function Set cookie's value by name
 * @param    {Object} ctx The context
 * @param    {String} name The name of the cookie
 * @param    {String} value The value of the cookie
 * @param    {Number|Strign} duration The duration of the cookie in ms or as unit <br>1year</br>.
 */
var setCookieValue = function(ctx, name, value, duration) {
  ctx.cookies.set(name, value, { expires : new Date() + duration, maxAge : duration});
};
/**
 * @function Gets cookie's value by name
 * @param    {Object} ctx The response
 * @param    {String} name The name of the cookie
 * @returns  {String} The value of the cookie
 */
var getCookieValue = function(ctx, name) {
  return ctx.cookies.get(name);
};
/**
 * @function Gets configuration defaults
 * @param    {Object} opts The options
 * @returns  {Object} The configuration defaults
 */
var getReqConfigurationDefaults = function(opts) {
  return _.defaults(opts || {}, {
    request : {
      headerName: UserIdCookie
    },
    user : {
      cookieName: RequestIdHeader,
      cookieDuration : UserIdCookieDuration
    }
  });
};
module.exports = {
  requestId : requestId.middleware(),
  userId : function(opts) {
    opts = _.defaults(opts || {}, {
      cookieName: UserIdCookie,
      cookieDuration : UserIdCookieDuration
    });
    return function* (next) {
      this.trackingUserId = getCookieValue(this, opts.cookieName) || uuid.v4();
      yield* next;
      setCookieValue(this, opts.cookieName, this.trackingUserId, opts.cookieDuration);
    };
  },
  spread : function(ctx, opts) {

  }
};
