[![npm version][npm-image]][npm-url]
[![Build Status](https://travis-ci.org/ajuste/koa-track.svg?branch=master)](https://travis-ci.org/ajuste/koa-track)
[![codecov.io](http://codecov.io/github/ajuste/koa-track/coverage.svg?branch=master)](http://codecov.io/github/ajuste/koa-track?branch=master)


# koa-track

## Install

```sh

npm install koa-track

```

Keep track of users and requests to your koa application.

## Track requests

Now you can identify each request with an Id. The requests gets a UUID which is available through ctx.trackingRequestId. Your id is returned to the client in a header caller 'x-rid'; which can be used for troubleshooting issues.

### Usage

```js

var koa      = require("koa");
var koaTrack = require("koa-track");
var koaApp   = koa();

koaApp.use(koaTrack.requestId());

```

### Options

```js

koaTrack.requestId({
  headerName : "x-rid"  // [String] - optional: Specify header name for request-id
})

```

## Track users

<b>TODO</b>



## License

  MIT

[npm-image]: https://img.shields.io/npm/v/koa-track.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/koa-track
