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
npm install async --save
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
app.get('/contacts', function(req, res, next) {
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

app.get('/contacts', function(req, res, next) {
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

app.get('/contacts', function(req, res, next) {
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

app.get('/contacts', function(req, res) {
  res.json(res.locals.contacts);
  res.status(200);
});
```

Look at the page in your browser and notice that the handlers were invoked in the order we defined them.

`res.locals` is a property of the response object that is explicitly for handler functions to store information in.  It persists through the life of the request/response, and is shared across middleware and handlers. 

Also notice that we have three ordinary handlers (req, res, next as arguments and one terminal handler (only req and res as arguments, and one of our statements that end processing.

What do you think happens if we do not have a terminal handler? Try it in your browser and see.  Why do you think that happens?

This happens because the handler chain is simple enough that Express can see that it will never terminate.  If you do something more complex, the server willl simply never respond to that request.

Chained habdlers might seem silly: in the earlier example, very little prevented us from just writing this:

```javascript
app.get('/contacts', function(req, res) {
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

Create a set of handlers for the `GET` method and the `/articles` resource.

Each article should have a two-to-three word title, a publication date, a one-sentence body (this is just an example), and what mood you were in when you wrote it.

Create four chained handlers that add to some attribute of the `res.locals` property ("articles" might be a good choice for property name), and a fifth handler to terminate the chain.



## Back to the Database

The first thing we do is consider what data we need to track in our contacts database.  Each contact will have a name, possibly a title (for business contacts), possibly a company, some number of addresses, some number of phone numbers, and some number of email addresses. We will also keep a record of communications.

Based on this, we can put together a Mongoose schema.

This is one of the model objects for our application, so it belongs under the ./lib directory.  Since it is for contacts, we call it contacts.js.

Because we need to access the Mongoose object, we have to start the file with a `require` statement:

```javascript
var mongoose = require('mongoose');
```

(Because there is only one Mongoose object throughout our application and because we plan to connect it to our MongoDB database in our `app.js` file, we do not need to do so here.)

Now, because we want to validate the contents of the lists of addresses, phone numbers, and email addresses, we create separate schemas for those.

```javascript
var enumeratedContactTypes = ['home', 'work', 'personal', 'other'];

var emailAddressSchema = new mongoose.Schema({
  emaillAddressType: {
    type: String,
    required: true,
    enum: {
      values: enumeratedContactTypes
    }
  },
  emailAddress: {
    type: String,
    required: true,
    match: /\S+@\S+\.\S+/
  }
});
```

Notice that we have defined a set of email address types.  These are things like "home" and "work."  We plan to reuse them with phone numbers and addresses as well.

Also notice that we use a regular expression to validate the email address.  This is a very rough solution: it looks for at least one character before the @ sign, at least one character before the dot, and at least one character after the dot.  This won't catch all invalid addresses, but it will prevent some of the obvious ones.

Now, the phone numbers:

```javascript
var phoneNumberSchema = new mongoose.Schema({
  phoneNumberType: {
    type: String,
    required: true,
    enum: {
      values: enumeratedContactTypes
    }

  },
  phoneNumber: {
    type: String,
    required: true,
    match: /(\d?\D*\d{3}\D*\d{3}\D*\d{4})/
  }
});
```

Finally, and most complicated, the addresses:

```javascript
var enumeratedStates = ['AL AK AS AZ AR CA CO CT DE DC FM FL',
  'GA GU HI ID IL IN IA KS KY LA ME MH MD MA MI MN MS MO MT',
  'NE NV NH NJ NM NY NC ND MP OH OK OR PW PA PR RI SC SD TN TX',
  'UT VT VI VA WA WV WI WY'
].join(' ').split(' ');

var addressSchema = new mongoose.Schema({
  addressType: {
    type: String,
    required: true,
    enum: {
      values: enumeratedContactTypes
    }
  },
  street: {
    type: String,
    required: true
  },
  secondStreet: String,
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true,
    enum: {
      values: enumeratedStates
    }
  },
  zipCode: {
    type: String,
    required: true,
    match: /^\d{5}(-\d{4})$/
  },
  country: String
});

var contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  title: String,
  company: String,
  addresses: [addressSchema],
  phoneNumbers: [phoneNumberSchema],
  emailAddresses: [emailAddressSchema]
});
```

The only new thing here is that the keys `addresses`, `phoneNumbers`, and `emailAddresses` are now lists of objects that validate according to the address, phone number, and email address schemas respectively.

Read through the entire schema so far and make sure you understand what all of the validations require.  (It's okay if you are fuzzy on the regular expressions.) Later on you will need to write one of these for yourself.

Now we're going to add something we expect to be convenient.  The database stores first and last names separately.  A good deal of the time, we're going to use them together as a full name.  So we create a `virtual attribute` called fullName.  We must define how to translate from first and last names to full name and back:

```javascript
contactSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName;
});

contactSchema.virtual('fullName').set(function(name) {
  var names = name.split(' ');
  this.firstName = names[0];
  this.lastName = names[1];
});
```

The next-to-last thing we need to do is to turn our schema into a model:

```javascript
var Contact = mongoose.model('Contact', contactSchema);
```

Then, so that other parts of the application can use the Contact model, we export it.

```javascript
module.exports = Contact;
```

## Seed data for the database

Schemas, and even model object factories, are sort of abstract.  Let's put some people in our database.

Support scripts for your app should go in a `./scripts` directory, and there is one in this repository.  We will be creating the file `seed-contacts-database.js` there.

## Dear Blog: I hate Schemas!!!!

Create a schema for articles in a blog.  They should have a title, an optional subtitle, a permanent URL link, a publication date, a body, and a description of your mood when you wrote it. You're planning a set of nifty icons, so constrain your moods to no more than 7.

Add two virtual attributes. One should produce an HTML anchor tag linking to that blog article based on the permanent link and the article title.  This will be read-only: you need to write the get function but not the set function.  The other should be a word count of the body of the article: also read-only. 

Your blog will also attract comments.  Each blog article will have a list of 0 or more comments.  Each comment will have the username of the user who posted it, an optional URL for the commenter's blog, the date the user posted it, the body of the comment, and a Boolean flag indicating whether you approved of its publication.  (Sadly, your blog will attract a lot of spammers too.)

## RESTful Contacts

We're going to turn our `app.js` into a full-fledged REST server for contacts. Wipe out all the routes.  (If you think you'll feel nostalgic for them, you can save a copy of the file elsewhere.)

When you're done, your `app.js` file should have this at the beginning:

```javascript
var express = require('express');
var app = express();
```

and this at the end:

```javascript
var server = app.listen(3000, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
```

### Our first service:  GET /contacts

We start with a route and the shell of a handler:

```javascript
app.get('/contacts', function(req, res, next){

});


```


## Parse a JSON request

Demo: configure and use body-parser to turn body into JSON

## Answering REST calls

Demo: implement a REST service for POST /add that adds a list of numbers passed into it as JSON

Brief lab: students in groups implement a rest service for POST /average that averages a list of numbers passed into it as JSONe


## Make a REST service

Students should have all they need to do this.



TODO: link in mongoose howto and mongo reference cards








