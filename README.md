# Introduction to Express

## Objectives

* Set up and configure a project to use express 
* Configure routes and handlers in express
* Explain and use express concepts of "handler chains" and "middleware"
* Use the 'body-parser' middleware to oarse POST and PUT requests
* Integrate express with mongoose to implement a REST service

## Installing express

```
npm install
npm install mongoose --save
npm install express --save
```

## basic express configuration and hello world

at the top of your main file - load dependencies and initialize

```
var express = require('express');
var app = express();
```

at the bottom of your main file - start the server

```
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
```

in the middle of your main file - routes and handlers

```
app.get('/', function (req, res) {
  res.send('Hello World!');
});
```

(This entire app is at examples/express-hello-world.js)


