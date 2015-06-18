'use strict'

var mongoose = require('mongoose');

var enumeratedContactTypes = ['home', 'work', 'personal', 'other'];

var emailAddressSchema = new mongoose.Schema({
  emailAddressType: {
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
    match: /^\d{5}(-\d{4})?$/
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

contactSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName;
});

contactSchema.virtual('fullName').set(function(name) {
  var names = name.split(' ');
  this.firstName = names[0];
  this.lastName = names[1];
});

var Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;


