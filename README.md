[![npm version][npm-image]][npm-url]
[![Build Status](https://travis-ci.org/ajuste/koa-track.svg?branch=master)](https://travis-ci.org/ajuste/koa-track)
[![codecov.io](http://codecov.io/github/ajuste/koa-track/coverage.svg?branch=master)](http://codecov.io/github/ajuste/koa-track?branch=master)


# koa-track

## Install

```sh

npm install koa-track

```

## What can we do for you?

Are you having a hard time keeping track of what happened with a erroring flow?

Then this module if perfect for you. Generate a unique id that identifies a request and spread it along with subsequent requests to different services you might be using.

This way you can identify a flow and see what went wrong.

### Usage

Use requestId middleware wherever you need to generate an id for an incoming request:

```js

var koa       = require("koa");
var koaTrack  = require("koa-track");
var koaApp    = koa();
var requestId = koaTrack.requestId.middleware;

koaApp.use(koaTrack.requestId.middleware());

```

If you need to spread your tracking information to other servers you can do it with spread utility:


```js

var http     = require("http");
var koaTrack = require("koa-track");
var spread   = koaTrack.spread.spread({ requestId: { write: true } });
var self     = this;

// set up your http request options as usual
var requestOptions = {
  hostname: "127.0.0.1",
  port: 3000,
  path: "/user",
  method: "GET"
};
// let spread function override options to embed current request id
requestOptions = spread(self, {options: requestOptions, type: "http-request" });

// execute request as usual
var req = http.request(requestOptions, function(res) {
  // on res callback
});

```


How do I achieve a koa application reuse tracking information from a request? 


```js

var koaTrack   = require("koa-track");
var middleware = koaTrack.spread.middleware({ requestId: { read: true } });

koaApp.use(middleware());

```


### Options

Overriding default options for requestId middleware.

```js

koaTrack.requestId.middleware({
  headerName : "x-rid"  // [String] - optional: Specify header name for request-id
})

```

## License

  MIT

[npm-image]: https://img.shields.io/npm/v/koa-track.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/koa-track
