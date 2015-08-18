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
