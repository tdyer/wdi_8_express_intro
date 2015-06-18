var express = require('express');

// Create an instance of a Express application
var app = express();

var tomHandler = function(req, res, next){
  // Save an Array, contacts, on the response.locals
  //property
  if (!res.locals.contacts){
    res.locals.contacts = [];
  }

  // Add an object that represent's tom's contact 
  // info to the list of contacts.
  res.locals.contacts.push({
    name: 'Tom',
    phone: '617-555-1234'
  });

  // Invoke the next function. This will invoke
  // the function below in the handler chain.
  next();
};

var bozoHandler = function(req, res, next){
  res.locals.contacts.push({
    name: 'Bozo',
    phone: '617-555-6666'
  });
  next();
};

var lonnieHandler = function(req, res,next){
  res.locals.contacts.push({
    name: 'Lonnie',
    phone: '617-555-3333'
  });
  next();
}

app.get('/contacts', [tomHandler, bozoHandler, lonnieHandler], 
  function(req, res, next){
  res.locals.contacts.push({
    name: "Shit.cat",
    phone: '666-666-6666'
  })
  next();
});

// Another way to do the below.
// app.get('/contacts', f1, f2, f3)

// This is the pattern we originally used. 
// app.get('/contacts', f1)
// app.get('/contacts', f2)
// app.get('/contacts', f3)

app.get('/contacts', function(req, res, next){
  if (!res.locals.contacts){
    res.locals.contacts = [];
  }
  res.locals.contacts.push({
    name: 'Charlton',
    phone: '617-555-1111'
  });

  next();
})
app.get('/contacts', function(req, res, next){
  if (!res.locals.contacts){
    res.locals.contacts = [];
  }
  res.locals.contacts.push({
    name: 'Antony',
    phone: '617-555-3311'
  });

  next();
})

// Create the terminal handler for the GET /contacts
// route.
app.get('/contacts', function(req, res){
  // the method 'json' is a terminate statement
  // when it's invoked it will signal the END 
  // of the handler chain. 
  res.json(res.locals.contacts);
  res.status(200);
});

var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
