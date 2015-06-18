var mongoose = require('mongoose');

// List of the kinds of phone or email one can have.
var enumeratedContactTypes = ['home', 'work', 'personal', 'other'];

// Email schema 
/*
  { emailAddressType: 'home', 
    emailAddress: 'tdyer1@gmail.com'
  }
*/
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
    // Regular Expression
    match: /\S+@\S+\.\S+/
  }
});

/*
{ 
  phoneNumberType: 'work',
  phoneNumber: '617 334-8976'
}
*/
var phoneNumberSchema = new mongoose.Schema({
  phoneNumberType: {
    type: String,
    required: true,
    enum {
      value: enumeratedContactTypes
    }
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /(\d?\D*\d{3}\D*\d{3}\D*\d{4})/
  }
})

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

/*
{firstName: 'Tom',
lastName: 'Dyer',
title: 'Chief Shit.cat',
company "Shit.cat",
addresses: [
  {
    addressType: 'home',
    street: "3 Shitcat st",
    city: "Beantown",
    state: "MA",
    zipCode: 01863
  },
  {
    addressType: 'work',
    street: '51 Melcher St',
    city: 'Boston'
    state: 'MA',
    zipCode: 012345
  }
],
phoneNumbers: [
...
],
emailAddresses: [
...
]
}
*/
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

// Create a virtual attribute for the Contact
// fullName. GETTER method/function
// tomContact.fullName(); // returns the full name
contactSchema.virtual('fullName').get(function(){
  return this.firstName + ' ' + this.lastName;
})

// SETTER method/function
// tomContact.fullName = "Tom Dyer"
contactSchema.virtual('fullName').set(function(name){
  // Given "Tom Dyer"
  var names = name.split(' ');
  // names = ["Tom", "Dyer"]

  this.firstName = names[0]; // "Tom"
  this.lastName = names[1]; // "Dyer"
});

// tomContact.randomName();
contactSchema.virtual('randomName').get(function(){
  return "blah" + generateLoremIpsum();
})

// Create a Contact Model
var Contact = mongoose.model('Contact', contactSchema);

// Make Contact Constructor Function available 
// outside of this file.
model.exports = Contact;










