var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/contacts');

var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var app = express();

var Contact = require('./lib/contacts.js');

var util = require('util');

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

app.post('/contacts', jsonParser);
app.post('/contacts', function(req, res) {
  Contact.create(req.body, function(error, contact) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(201);
    }
  });
});

app.put('/contacts/:id', jsonParser);
app.put('/contacts/:id', function(req, res) {
  Contact.findByIdAndUpdate(req.params.id, req.body, function(error, contact) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(200);
    }
  });
});

app.patch('/contacts/:id', jsonParser);
app.patch('/contacts/:id', function(req, res) {
  Contact.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, function(error, contact) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(200);
    }
  });
});

app.delete('/contacts/:id', function(req, res) {
  Contact.remove({
    _id: req.params.id
  }, function(error) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

var server = app.listen(3000, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
