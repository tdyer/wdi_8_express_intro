// add-restId

require('mongoose');

mongoose.on('connect', function(){
  // ensure that db.counters has an { _id: 'restId', seq: n } object, and create it if not
});

db.counters.insert({
  _id: "restId",
  seq: 0
});

var getNextSequence = function(name) {
  var ret = db.counters.findAndModify({
    query: {
      _id: name
    },
    update: {
      $inc: {
        seq: 1
      }
    },
    new: true
  });

  return ret.seq;
};

module.exports = function(schema) {

schema.pre('save', function() {
    this.update({
      $set: {
        restID: getNextSequence('restId')
      }
    })
  }
};
