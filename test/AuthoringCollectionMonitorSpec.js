
var expect = require('chai').expect;

var Monitor = require('../collection/AuthoringCollectionMonitor');

var authormodel = require('../');

describe("AuthoringCollectionMonitor", function() {

  it("should log add", function() {
    var logged = [];
    var console = {
      log: function() {
        logged.push(arguments);
      }
    };
    var collection = new authormodel.AuthoringCollection();
    var monitor = new Monitor({collection: collection, logger: console});
    var unit1 = new authormodel.AuthoringUnit({type: 'test'});
    collection.add(unit1);
    expect(logged.length).to.be.equal(1);
  });

  xit("Should complain if console arg lacks a log method", function() {
    // pending throws expectations
  });

});
