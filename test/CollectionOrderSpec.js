'use strict';

var expect = require('chai').expect;

var OrderedAddMixin = require('../collection/OrderedAddMixin');

var mocks = require('simple-mock');

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
      c.addAfter(m3, m1);
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

    it("Supports Backbone style options as third argument", function() {
      var collection = new Collection();
      var onAdd = mocks.spy();
      collection.on('add', onAdd);
      var m0 = collection.add(asModel({id: 't0'}));
      expect(onAdd.calls).to.have.length(1);
      var m1 = collection.addAfter(asModel({id: 't1'}), m0, {custom:'x'});
      expect(onAdd.calls).to.have.length(2);
      expect(onAdd.calls[1].args[2].custom).to.equal('x');
      var m2 = collection.addAfter(asModel({id: 't2'}), m0, {silent:true});
      expect(onAdd.calls).to.have.length(2);
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

    it("Supports Backbone style options as third argument", function() {
      var collection = new Collection();
      var onAdd = mocks.spy();
      collection.on('add', onAdd);
      var m0 = collection.addFirst(asModel({id: 't0'}), {custom:'y'});
      expect(onAdd.calls[0].args[2].custom).to.equal('y');
      var m0 = collection.addFirst(asModel({id: 't1'}), {silent:true});
      expect(onAdd.calls).to.have.length(1);
    });

  });

  describe("#move", function() {

    var Collection = require('../collection/AuthoringCollectionDefault');
    var Model = require('../unit/AuthoringUnitDefault');

    it("Takes a model and returns an object of possible rearrangements", function() {
      var c = new Collection();
      var model1 = c.add(new Model({type:'text'}));
      expect(c.move).to.be.a('function');
      var move = c.move(model1);
      expect(move).to.be.an('object');
    });

    it("Does no action unless a chained function is invoked", function() {
      var c = new Collection();
      c.add(new Model({type:'text'}));
      c.add(new Model({type:'text'}));
      var state1 = c.toJSON();
      c.move(c.at(1));
      expect(c.toJSON()).to.deep.equal(state1);
    });

    it("For example collection.move(model2).up()", function() {
      var c = new Collection();
      var model1 = c.add(new Model({type:'text'}));
      var model2 = c.add(new Model({type:'text'}));
      var move = c.move(model2);
      expect(move.up).to.be.a('function');
      move.up();
      expect(c.size()).to.equal(2);
      expect(c.at(0)).to.equal(model2);
      expect(c.at(1)).to.equal(model1);
      expect(c.down).to.be.undefined;
    });

    it("collection.move(model1) defines #down but not #up", function() {
      var c = new Collection();
      var model1 = c.add(new Model({type:'text'}));
      var model2 = c.add(new Model({type:'text'}));
      var move = c.move(model1);
      expect(move.up).to.be.undefined;
      move.down();
      expect(c.size()).to.equal(2);
      expect(c.at(0)).to.equal(model2);
      expect(c.at(1)).to.equal(model1);
      expect(c.down).to.be.undefined;
    });

    xit("Throws error if the model is not in the collection", function() {
      var c = new Collection();
      expect(function() {
        c.move(new Model({type: 'text'}));
      }).to.throw('');
    });

    xit("Can move #toAfter", function() {

    });

    xit("Can move #first", function() {

    });

    xit("Existing move object does not reflect changes, so don't keep it", function() {

    });

  });

  describe("#move keep", function() {

    it("For example collection.move(model2).keep.up()", function() {

    });

    it("Markes the original as `deleted`=true and adds a clone as move", function() {

    });

    xit("Sets a `movedTo` reference to the added unit", function() {

    });

  });

});
