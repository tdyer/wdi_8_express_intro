var express = require('express');
var app = express();

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

var server = app.listen(3000, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
