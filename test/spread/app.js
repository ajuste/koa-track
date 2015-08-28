const koa      = require("koa");
const koaRoute = require("koa-route");
const http     = require("http");

/**
 * @function Returns a database server for example
 */
module.exports.createDatabaseServer = function(spreadMiddleware, mockedLogger) {

  const server = koa();
  server.use(spreadMiddleware);

  server.use(koaRoute.get("/user", function* () {
    mockedLogger(["logging request-id from db server:", this.trackingRequestId].join(" "));
    this.body = { userId : 90, firstName : "ajuste" };
  }));

  return server;
};

/**
 * @function Returns a frontend server for example
 */
module.exports.createFrontendServer = function(spreadFunction, requestIdMiddleware, mockedLogger) {

  const server = koa();
  const self   = this;
  server.use(requestIdMiddleware);

  server.use(koaRoute.get("/renderUser", function* () {

    const server = koa();
    const self   = this;
    var requestOptions = {
      hostname: "127.0.0.1",
      port: 3000,
      path: "/user",
      method: "GET"
    };
    var   data   = null;

    mockedLogger(["logging request-id from front end server:", this.trackingRequestId].join(" "));

    yield new Promise(function(resolve, reject) {
      // ping db server and spread id.
      requestOptions = spreadFunction(self, {options: requestOptions, type: "http-request" });
      var req = http.request(requestOptions, function(res) {
        res.setEncoding("utf8");
        res.on("data", function (chunk) {
          data = chunk;
        });
        req.on("close", function () {
          self.body = data;
          resolve();
        });
      });
      req.end();
    });
  }));

  return server;
};
