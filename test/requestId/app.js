var koa        = require("koa");
var koaRoute   = require("koa-route");
var server     = null;

module.exports.createApp = function(middleware) {

  server     = koa();

  server.use(koaRoute.get("/alreadySet", function* (next) {
    this.trackingRequestId = "alreadySet";
    yield* next
    this.body = "OK";
  }));

  server.use(middleware);

  server.use(koaRoute.get("/200", function* () {
    this.body = "OK";
  }));

  server.use(koaRoute.get("/404", function* () {
    this.status = 404;
    this.body = "OK";
  }));

  server.use(koaRoute.get("/500", function* () {
    this.status = 500;
    this.body = "OK";
  }));

  server.use(koaRoute.get("/error", function* () {
    throw new Error("Internal Error");
  }));
  return server;
};
