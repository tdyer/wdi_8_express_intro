# Introduction to Express

## Objectives

* Set up and configure a project to use express 
* Configure routes and handlers in express
* Explain and use the express concepts of "handler chains" and "middleware"
* Use the 'body-parser' middleware to oarse POST and PUT requests
* Integrate express with mongoose to implement a REST service

## Before we begin: a review of project layout.

Because this is based on our standard Node project template, you have extra resources available to you if you follow the standard node package layout.  It is all documented in the file LAYOUT.md in this repository.

## Installing express

For our activities today, we'll need our usual development dependencies, plus Mongoose and Express.  

```
npm install
npm install mongoose --save
npm install express --save
npm install body-parser --save
```

## Basic Express configuration and "Hello World!"

This is a codealong (even though the bits of code are short).

First, we load our dependencies and start configuring our application: 
```
var express = require('express');
var app = express();
```

At the bottom of your main file you will start the server:
```
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
```

In the middle of the main file, you put routes and handlers for routes.  Right now we'll start with a simple one:
```
app.get('/', function (req, res) {
  res.send('Hello World!');
});
```

(This entire app is available as `examples/express-hello-world.js`, and you can run it by itself.) Take 5-10 minutes and get this up and running on your own computer.  Make sure you see the same thing in the browser.

One note: Node may log something in your Terminal that looks like this: 

```
Example app listening at http://:::3000
```

That is just the way of saying "localhost" in the newer dialects of the Internet Protocol.

## What is a handler?

A handler is a function that responds to a request on a route.  

In Express, a handler will usually take three arguments, but some take two or four.  

The three arguments to an ordinary Express handler are **req**, which is the HTTP request object that came from the user; **res**, which is the HTTP response object being prepared by Express; and **next**, which is a callback to the next handler in the chain, if there is one.

(You can read all about the HTTP Request and HTTP Response objects in the Node or Express documentation, but you'll probably find it easier going if you just dip in when you need something specific.)

Since we're going to be developing a REST service, it helps to know that we can output JSON as well:

```
app.get('/', function (req, res) {
  res.json({ hello: 'world' });
});
```

## Handlers can be chained

You may have noticed that even though we said handlers could have three arguments, the ones we have used so far only have two. This is because they are **terminal** handlers:  they contain a statement in them that indicates that our processing of the request is done and the server should send a response.  Terminal handlers do not have a next function for that reason.

Some of the statements that end processing are here:

|Response method|What it means|
|:--------------|:------------|
|`res.end()`| End the response process.|
|`res.json(jsonObject)`|  Send a JSON response.|
|`res.redirect()`|  Redirect a request.|
|`res.sendStatus()`|  Set the response status code and send its string representation as the response body.|

But if some handlers are terminal, that means others must be non-terminal. In fact, handlers can be chained, and that is some of what makes Express so powerful and flexible despite its bare-bones simplicity.

So we can have routes chained like this:

```javascript
app.get('/', function(req, res, next) {
  if (!res.locals.contacts) {
    res.locals.contacts = [];
  }

  // get contacts from iPhone/iCloud
  res.locals.contacts.push({
    name: 'Tom',
    phone: '617-555-1234'
  });
  next();
});

app.get('/', function(req, res, next) {
  if (!res.locals.contacts) {
    res.locals.contacts = [];
  }

  // get contacts from Google/Android
  res.locals.contacts.push({
    name: 'Charlton',
    phone: '617-555-1111'
  });
  next();
});

app.get('/', function(req, res, next) {
  if (!res.locals.contacts) {
    res.locals.contacts = [];
  }

  // get contacts from Hotmail
  res.locals.contacts.push({
    name: 'Antony',
    phone: '617-555-3311'
  });
  next();
});

app.get('/', function(req, res) {
  res.json(res.locals.contacts);
  res.status(200);
});
```

Look at the page in your browser and notice that the handlers were invoked in the order we defined them.

Also notice that we have three ordinary handlers (req, res, next as arguments and one terminal handler (only req and res as arguments, and one of our statements that end processing.

What do you think happens if we do not have a terminal handler? Try it in your browser and see.  Why do you think that happens?

This happens because the handler chain is simple enough that Express can see that it will never terminate.  If you do something more complex, the server willl simply never respond to that request.

Chained habdlers might seem silly: in the earlier example, very little prevented us from just writing this:

```javascript
app.get('/', function(req, res) {
  res.json([{
    name: 'Tom',
    phone: '617-555-1234'
  }, {
    name: 'Charlton',
    phone: '617-555-1111'
  }, {
    name: 'Antony',
    phone: '617-555-3311'
  }]);
  
  res.status(200);
});
```

And in fact, in real apps you probably won't write three handlers to do basically the same thing with different strings.

What you will most likely do, however, is write an authentication handler that needs to run for certain routes, and a content handler that needs to run for certain routes, and a security logging handler that needs to run for certain routes.  Being able to chain handlers means that you can make your code modular and run only the modules you need for any given request.

## Mini Lab

TO DO: write me

## Back to the Database

The first thing we do is consider what data we need to track in our contacts database.  Each contact will have a name, possibly a title (for business contacts), possibly a company, some number of addresses, some number of phone numbers, and some number of email addresses. We will also keep a record of communications.

Based on this, we can put together a Mongoose schema:



## Integrating with the DB (with bonus mongoose review!)

Walk through setting up mongoose for contacts

Create a schema

Create a model class from the schema

Create a 'seed.js' in lib/ to seed the db with some contacts

## Parse a JSON request

Demo: configure and use body-parser to turn body into JSON

## Answering REST calls

Demo: implement a REST service for POST /add that adds a list of numbers passed into it as JSON

Brief lab: students in groups implement a rest service for POST /average that averages a list of numbers passed into it as JSONe


## Make a REST service

Students should have all they need to do this.











