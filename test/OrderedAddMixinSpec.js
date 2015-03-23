'use strict';

var expect = require('chai').expect;

var OrderedAddMixin = require('../collection/OrderedAddMixin');

describe("Collection order", function() {

  var yobo = require('yobo');

  var Collection = yobo.Collection.extend({}).mixin(OrderedAddMixin);

  var c = new Collection();

  var asModel = function(attributes) {
    return new yobo.Model(attributes);
    // not working with backbone _isModel: return {attributes: attributes};
  };

  var m1 = asModel({id: 't1'});
  var m2 = asModel({id: 't2'});
  c.add(m1);
  c.add(m2);

  describe("#at", function() {

    it("Returns a model given a position, 0-based", function() {
      expect(c.at(0)).to.equal(m1);
      expect(c.at(1)).to.equal(m2);
    });

  });

  describe("#addAfter", function() {

    var m3 = asModel({id: 't3'});

    it("First argument is the new model, second argument is the reference model", function() {
      c.addAfter(m3, m2);
    });

    it("Inserts the new model below the reference model in the collection", function() {
      expect(c.at(0)).to.equal(m1);
      expect(c.at(1)).to.equal(m3);
      expect(c.at(2)).to.equal(m2);
    });

    it("Can't be used to re-arrange items already in the collection", function() {
      expect(function() {
        c.addAfter(m2, m3);
      }).to.throw('Already a collection member');
    });

  });

  describe("#addFirst", function() {

    var c2 = new Collection();
    var m4 = asModel({id: 't4'});

    it("Can add to an empty collection", function() {
      c2.addFirst(m4);
      expect(c2.at(0)).to.equal(m4);
    });

    it("Adds before any existing models", function() {
      var m5 = asModel({id: '4'});
      c2.addFirst(m5);
      expect(c2.at(0)).to.equal(m5);
      expect(c2.at(1)).to.equal(m4);
    });

    it("Also doesn't accept already present models", function() {
      expect(function() {
        c2.addFirst(m4);
      }).to.throw('Already a collection member');
    });

  });

});
