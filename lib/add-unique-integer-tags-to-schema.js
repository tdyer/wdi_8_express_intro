var mongoose = require('mongoose');

var Counter = mongoose.model('Counter', {
  _id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    required: true
  }
});

var ensureCounter = function(tag, callback) {
  Counter.findOne({
    _id: tag
  }, function(error, counter) {
    if (error) {
      callback(error);
    } else if (!counter) {
      Counter.create({
        _id: tag,
        seq: 0
      }, function(error, counter) {
        callback(null, counter.seq);
      });
    } else {
      callback(null, counter.seq);
    }
  });
};

var getNextInSequence = function(tag, callback) {
  Counter.findOneAndUpdate({
      _id: tag
    }, {
      $inc: {
        seq: 1
      }
    }, {
      new: true
    },
    function(err, counter) {
      callback(err, counter && counter.seq);
    }
  );
};

var addUniqueIntegerTagToSchema = function(tag, schema) {
  schema.pre('save', function(next) {
    var datum = this;
    if (datum[tag] === undefined) {
      getNextInSequence(tag, function(error, idValue) {
        if (error) {
          next(new Error(error));
        } else {
          datum[tag] = idValue;
          next();
        }
      });
    }
  });
};

module.exports = addUniqueIntegerTagToSchema;
module.exports.getNextInSequence = getNextInSequence;
module.exports.ensureCounter = ensureCounter;
