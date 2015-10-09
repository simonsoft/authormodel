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

    it("Sets a 'previous' attribute", function() {
      expect(m3.has('previous')).to.be.true;
      expect(m3.get('previous')).to.be.a('string').and.equal('t1');
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

    it("Changes 'previous' attribute of the next unit", function() {
      expect('TODO').to.equal('implemented');
    });

    it("Avoids setting 'previous' attribute of the next unit if it had no 'previous' before", function() {
      expect('TODO').to.equal('implemented');
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

    it("Sets the 'previous' attribute to boolean false", function() {
      expect(m4.has('previous')).to.be.true;
      expect(m4.get('previous')).to.be.a('boolean').and.equal(false);
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

    it("Changes 'previous' attribute of the next unit", function() {
      expect('TODO').to.equal('implemented');
    });

    it("Avoids setting 'previous' attribute of the next unit if it had no 'previous' before", function() {
      expect('TODO').to.equal('implemented');
    });

  });

  describe("#delete", function() {

    it("Does not exist, use .move(model).out() instead", function() {
      var c = new Collection();
      expect(c.delete).to.be.undefined;
    });

  });

  describe("#remove (don't use!)", function() {

    it("Is in the backbone.js API but should normally be avoided in authormodel use", function() {
      expect(c.remove).to.exist.and.be.a('function');
    });

    it("Behaves as in backbone, but if you do want to kill a unit use model.destroy instead", function() {
      var Collection = require('../collection/AuthoringCollectionDefault');
      var Model = require('../unit/AuthoringUnitDefault');
      var c = new Collection();
      var model1 = c.add(new Model({type:'text'}));
      expect(c).to.have.length(1);
      c.remove(model1);
      expect(c).to.have.length(0);
    });

    it("Does not change 'previous' attribute of the next unit, so backend can detect misuse", function() {
      expect('TODO').to.equal('implemented');
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
      var model1 = c.add(new Model({id: 'u1', type:'text', content: 'p1'}));
      var model2 = c.add(new Model({id: 'u2', type:'text', content: 'p2'}));
      var move = c.move(model2);
      expect(move.up).to.be.a('function');
      move.up();
      expect(c.at(0).get('content')).to.equal('p2');
      expect(c.at(1).get('content')).to.equal('p1');
      expect(c.down).to.be.undefined;
      expect(model2.get('previous')).to.be.a('boolean').and.equal(false);
      expect(model1.has('previous')).to.be.false; // had no 'previous' before
    });

    it("Emits delete and add events, with extra option modelMove:true", function() {
      var c = new Collection();
      var model0 = c.add(new Model({id: 0, type:'t', content: '-'}));
      var model1 = c.add(new Model({id: 1, type:'t', content: 'x', previous: 0}));
      var model2 = c.add(new Model({id: 2, type:'t', content: 'y'}));
      var events = mocks.spy();
      c.on('add', events);
      c.on('change:deleted', events);
      c.move(model2).up({myoption: 'here'});
      expect(events.calls).to.have.length(2);
      expect(events.calls[0].args[0].get('deleted')).to.be.true;
      expect(events.calls[1].args[2]).to.deep.equal({merge:false, add:true, remove:false, at:1, index:1, modelMove:true, myoption:'here'});
      expect(model2.get('previous')).to.be.a('number').and.equal(0);
      expect(model1.get('previous')).to.equal(2);
    });

    it("Delete through collection.move(model1).out()", function() {
      var c = new Collection();
      var model1 = c.add(new Model({type:'text'}));
      c.move(model1).out();
      expect(model1.get('deleted')).to.equal(true);
    });

    it("Delete emits a change event instead of regular Backbone 'remove', extra option modelDelete:true", function() {
      var c = new Collection();
      var model1 = c.add(new Model({type:'text'}));
      var remove = mocks.spy();
      var change = mocks.spy();
      c.on('remove', remove);
      c.on('change:deleted', change);
      c.move(model1).out({customoption: 'yes'});
      expect(remove.calls).to.have.length(0);
      expect(change.calls).to.have.length(1);
      expect(change.lastCall.args[2]).to.exist.and.deep.equal({customoption: 'yes', modelDelete:true});
    });

    it("Keeps the original location with deleted status", function() {
      var c = new Collection();
      var model1 = c.add(new Model({id: 'u1', type:'text', content: 'p1'}));
      var model2 = c.add(new Model({id: 'u2', type:'text', content: 'p2'}));
      var move = c.move(model2);
      expect(move.up).to.be.a('function');
      move.up();
      expect(c.at(0).get('content')).to.equal('p2');
      expect(c.at(1).get('content')).to.equal('p1');
      expect(c.down).to.be.undefined;
      var deleted = c.at(2);
      expect(deleted.get('content')).to.equal('p2');
      expect(deleted.get('deleted')).to.be.true;
    });
    xit("OR collaborates with ChangesMixin to just keep track of deleted there");

    xit("AuthoringUnit defines an isDeleted check"); // hide an abstraction + distinguish from collection.remove

    it("collection.move(model1) defines #down but not #up", function() {
      var c = new Collection();
      var model1 = c.add(new Model({id:'1', type:'text', content: 'p1'}));
      var model2 = c.add(new Model({id:'2', type:'text', content: 'p2'}));
      var move = c.move(model1);
      expect(move.up).to.be.undefined;
      move.down();
      expect(c.size()).to.equal(3);
      expect(c.at(1).get('content')).to.equal('p2');
      expect(c.at(2).get('content')).to.equal('p1');
    });

    it("Throws error if the model is not in the collection", function() {
      var c = new Collection();
      expect(function() {
        c.move(new Model({type: 'text'}));
      }).to.throw('');
    });

    it("Can move #toAfter", function() {
      var c = new Collection();
      var model1 = c.add(new Model({id:'1', type:'text', content: 'p1'}));
      var model2 = c.add(new Model({id:'2', type:'text', content: 'p2'}));
      c.move(model1).toAfter(model2);
      expect(c.size()).to.equal(3);
      expect(c.at(2).get('content')).to.equal('p1');
      expect(model1.get('previous')).to.equal('2');
    });

    it("Can move #first", function() {
      var c = new Collection();
      var model1 = c.add(new Model({id:'1', type:'text', content: 'p1', previous: false}));
      var model2 = c.add(new Model({id:'2', type:'text', content: 'p2'}));
      c.move(model2).first();
      expect(c.size()).to.equal(3);
      expect(c.at(0).get('content')).to.equal('p2');
      expect(model2.get('previous')).to.be.a('boolean').and.equal(false);
      expect(model1.get('previous')).to.equal('2');
    });

    // This is useful for internal robustness as well so let's expose it
    it("Can move #toBefore", function() {
      var c = new Collection();
      var model1 = c.add(new Model({id:'1', type:'text', content: 'p1'}));
      var model2 = c.add(new Model({id:'2', type:'text', content: 'p2'}));
      c.move(model2).toBefore(model1);
      expect(c.size()).to.equal(3);
      expect(c.at(0).get('content')).to.equal('p2');
      expect(model2.get('previous')).to.be.a('boolean').and.equal(false);
    });

    // The stateful move object is a problem if the collection changes between creation and execution
    it("Existing move object does not reflect changes, so don't keep it", function(done) {
      var c = new Collection();
      var model1 = c.add(new Model({id:'1', type:'text'}));
      var model2 = c.add(new Model({id:'2', type:'text'}));
      var model3 = c.add(new Model({id:'3', type:'text'}));
      var move = c.move(model2);
      expect(move.up).to.exist;
      expect(move.down).to.exist;
      setTimeout(function() {
        expect(move.up).to.throw();
        expect(move.down).to.throw();
        done();
      },1);
    });

  });

  describe("#move keep", function() {

    xit("Sets a `movedTo` reference to the added unit", function() {

    });

  });

});
