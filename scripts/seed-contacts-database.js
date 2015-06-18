var async = require('async');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/contacts');

var Contact = require('../lib/contacts.js');

async.series([

    // first: clean everything out of the contacts collection

    function(done) {
      Contact.remove({}, done);
    },

    // create a person who is a cat
    // note that because addresses, phone numbers, and
    // emails are all lists of 0 or more, this validates

    function(done) {
      Contact.create({
        firstName: 'Socks',
        lastName: 'Clinton',
        title: 'First Cat'
      }, done);
    },

    // create a president

    function(done) {
      Contact.create({
        firstName: 'John',
        lastName: 'Adams',
        title: 'President',
        addresses: [{
          addressType: 'work',
          street: '1600 Pennsylvania Avenue',
          city: 'Washington',
          state: 'DC',
          zipCode: '20500',
          country: 'United States of America'
        }, {
          addressType: 'home',
          street: '150 Adams Street',
          city: 'Dorchester Center',
          state: 'MA',
          zipCode: '02124'
        }]
      }, done);
    }
  ],

  function(error) {
    if (error) {
      console.error(error);
    }
    mongoose.disconnect();
  }
);
