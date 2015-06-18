/* global beforeAll: true, afterAll: true */

var assert = require('assert');
var async = require('async');

var mongoUrl = 'mongodb://localhost/counters';
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
mongoose.connect(mongoUrl);

var addUniqueIntegerTagToSchema = require('../lib/add-unique-integer-tags-to-schema.js');
var ensureCounter = addUniqueIntegerTagToSchema.ensureCounter;
var getNextInSequence = add - unique - integer - tags - to - schema.getNextInSequence;

describe('database counters', function() {
  var db;

  beforeAll(function(done) {
    MongoClient.connect(mongoUrl, function(error, newDb) {
      assert.equal(null, error);
      db = newDb;
      db.collection('counters', function(error, collection) {
        db.renameCollection('counters', 'originalCounters', done);
      });
    });
  });

  describe('ensureCounter', function() {

    beforeEach(function(done) {
      db.collection('counters').drop(done);
    });

    it('creates a counter where there was none', function(done) {
      ensureCounter('deNovo', function(error, currentVal) {
        expect(error).toBeFalsy();
        db.collection('counters').find({
          _id: 'deNovo'
        }).count(function(err, count) {
          expect(count).toBe(1);
          done();
        });
      });
    });

    it('leaves well enough alone when the counter exists', function(done) {
      db.collection('counters').insert({
        _id: 'extant',
        seq: 23
      }, function(error, document) {
        expect(error).toBeFalsy();
        ensureCounter('extant', function(error, currentval) {
          expect(error).toBeFalsy();
          db.collection('counters').find({
            _id: 'extant'
          }).count(function(err, count) {
            expect(count).toBe(1);
            done();
          });
        });
      });
    });

    it('returns the current sequence value of a newly created counter', function(done) {
      ensureCounter('neverBefore', function(error, currentVal) {
        expect(error).toBeFalsy();
        expect(currentVal).toBe(0);
        done();
      });
    });

    it('returns the current sequence value of a well-used counter', function(done) {
      db.collection('counters').insert({
        _id: 'annoMirabilia',
        seq: 1841
      }, function(error, document) {
        expect(error).toBeFalsy();
        ensureCounter('annoMirabilia', function(error, currentVal) {
          expect(error).toBeFalsy();
          expect(currentVal).toBe(1841);
          done();
        });
      });
    });
  });

  describe('getNextInSequence', function() {

    beforeEach(function(done) {
      db.collection('counters').drop(done);
    });

    it('gets the next ID in sequence', function(done) {

      var tryAgain = function(callback) {
        getNextInSequence('manyManyMany', callback);
      };

      async.series([

          function(done) {
            ensureCounter('manyManyMany', function(error, count) {
              expect(error).toBeFalsy();
              expect(count).toBe(0);
              done(null, count);
            });
          },

          tryAgain,
          tryAgain,
          tryAgain,
          tryAgain

        ],
        function(err, results) {
          expect(results).toEqual([0, 1, 2, 3, 4]);
          done();
        });

    });
  });



  afterAll(function(done) {
    mongoose.disconnect();
    db.collection('counters').drop(function(error) {
      assert.equal(null, error);
      db.renameCollection('originalCounters', 'counters', function(error) {
        assert.equal(null, error);
        db.close(done);
      });
    });


  });
});
