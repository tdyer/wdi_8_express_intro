var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/contacts');

// Load express
var express = require('express');
// Create an express app.
var app = express();

var Contact = require('./lib/contacts.js');

app.get('/contacts', function(req, res) {
  Contact.find({}, function(error, contactList) {
    res.json(contactList);
  });
});

app.get('/contacts/:id', function(req, res) {
  Contact.find({
    _id: req.params.id
  }, function(error, contact) {
    res.json(contact);
  });
});

// Create a server
var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening http://%s:%s', host, port);

});
