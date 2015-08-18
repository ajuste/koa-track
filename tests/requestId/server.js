var koa        = require("koa");
var koaRoute   = require("koa-route");
var mod        = require("../../index");
var server     = koa();

server.use(mod.requestId());

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

module.exports = server;
