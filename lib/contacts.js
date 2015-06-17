var mongoose = require('mongoose');

var enumeratedStates = ['AL AK AS AZ AR CA CO CT DE DC FM FL',
  'GA GU HI ID IL IN IA KS KY LA ME MH MD MA MI MN MS MO MT',
  'NE NV NH NJ NM NY NC ND MP OH OK OR PW PA PR RI SC SD TN TX',
  'UT VT VI VA WA WV WI WY'
].join(' ').split(' ');

var addressSchema = new mongoose.Schema({
  addressType: {
    type: String,
    required: true
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

var phoneSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required
  }

});

var contactSchema = new mongoose.Schema({


});



var mongoose = require('./mongoose-contacts.js');

var Schema = mongoose.Schema;
var contactSchema = new Schema({
  name: {
    first: {
      type: String,
      required: true
    },
    last: {
      type: String,
      required: true
    }
  }
});

var Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
