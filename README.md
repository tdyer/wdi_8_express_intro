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

Take 5-10 minutes and get this up on your own computer.  See that you get the same results. 

## What is a handler?

A handler is a function that responds to a request on a route.  

talk about function signatures for regular handlers, terminal handlers, error handlers

demonstrate fiddling with the response object:

```
app.get('/', function (req, res) {
  res.json({ hello: 'world' });
});
```

## Handlers can be chained

```
app.get('/', function (req, res) {
  res.locals.result = { name: 'Domino' };
  next();
});

app.get('/', function (req, res) {
  res.locals.result.species = 'cat';
  res.locals.result.age = 1;
  res.locals.result.color = 'tuxedo';
  res.json(app.locals.result);
});
```

Each handler must either call next() to pass control to the next handler or call one of the methods listed under "response methods" at http://expressjs.com/guide/routing.html

## Middleware module: parse a JSON request








