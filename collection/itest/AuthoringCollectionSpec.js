'use strict';

var expect = require('chai').expect;

var mocks = require('simple-mock');

module.exports = function interfaceSpec(required) {

  var AuthoringCollection = required;
  var AuthoringUnit = require('../../unit/AuthoringUnitBackbone');

  describe("initialization without options", function() {

    // TODO is this really a good idea? Would probably be better if add only accepts proper authoring units
    xit("Should initialize with a preconfigured model type", function() {
      var units = new AuthoringCollection();
      var added = units.add({type: 'text'});
      expect(added).to.exist;
      expect(added.attributes).to.exist;
      expect(added.attributes.attributes).to.be.undefined;
      expect(added.attributes.type).to.equal('text');
    });

    xit("Should declare the model constructor", function() {
      var units = new AuthoringCollection();
      expect(units.model).to.exist;
      expect(units.model).to.be.a('function');
    });

  });

  describe("instantiation with initial models", function() {

    // This is because we don't want to specify the type of model (at least not yet)
    // And we don't want the collection to create default a no-behavior model like Backbone does
    it("Should only allow actual models, not standalone attribute objects", function() {
      expect(function() {
        var units = new AuthoringCollection({type:'text'});
      }).to.throw();
      expect(function() {
        var units = new AuthoringCollection([{type:'text'}]);
      }).to.throw();
      var units = new AuthoringCollection([new AuthoringUnit({type:'text'})]);
      expect(units.size()).to.equal(1);
    });

    it("Should do Backbone style auto-instantiation if there is a Model property", function() {
      var Collection = AuthoringCollection.extend({
        model: AuthoringUnit
      });
      var units = new Collection({type:'text'});
      expect(units.size()).to.equal(1);
      expect(units.at(0).cid).to.exist;
      expect(units.at(0).get('type')).to.equal('text');
    });

  });

  describe("add", function() {

    it("Should only allow actual models, not standalone attribute objects", function() {
      var units = new AuthoringCollection();
      expect(function() {
        units.add({type:'text'});
      }).to.throw('The collection has no model option so added items must be models, not attribute objects');
      expect(function() {
        units.add([{type:'text'}]);
      }).to.throw();
      units.add([new AuthoringUnit({type:'text'})]);
      expect(units.size()).to.equal(1);
    });

    it("Returns added units", function() {
      var units = new AuthoringCollection();
      var u = new AuthoringUnit({type: 'text'});
      expect(units.add(u)).to.equal(u);
    });

    it("Throws Error if the ID already exists (which prevents Unit clones to be added foolishly)", function() {
      var units = new AuthoringCollection();
      var ux = units.add(new AuthoringUnit({type: 'noid'}));
      units.add(ux.clone());
      expect(units.size()).to.equal(2);
      var u = units.add(new AuthoringUnit({id: '1a', type:'text'}));
      var uc = u.clone();
      expect(function() {
        units.add(uc);
      }).to.throw('Unit "1a" is already a collection member');
      uc.set('id', undefined);
      units.add(uc);
      expect(units.size()).to.equal(4);
    });

  });

  describe("addAfter", function() {

    it("Should be doable on subset", function() {
      var units = new AuthoringCollection();
      expect(units.addAfter).to.be.a('function');
      var group = units.subset(function() {});
      expect(group.addAfter).to.be.a('function');
      var group2 = units.subsetWhere({});
      expect(group2.addAfter).to.be.a('function');
    });

    it("Should insert after", function() {
      var units = new AuthoringCollection();
      var u0 = units.add(new AuthoringUnit({id: '0a', type: 'title'}));
      var u1 = units.add(new AuthoringUnit({id: '0b', type: 'p'}));
      var u1 = units.add(new AuthoringUnit({id: '09', type: 'p'}));
      var u2 = units.add(new AuthoringUnit({id: '05', type: 'p'}));
      var group = units.subsetWhere({type:'p'});
      expect(group.pluck('id')).to.deep.equal(['0b','09','05']);
      var u3 = group.addAfter(new AuthoringUnit({id: '10', type:'p'}), u1);
      expect(group.pluck('id')).to.deep.equal(['0b','09','10','05']);
    });

    it("Should set reference to previous", function() {
      var units = new AuthoringCollection();
      var u1 = units.add(new AuthoringUnit({id: '01', type: 'p'}));
      var u2 = units.addAfter(new AuthoringUnit({id: '02', type: 'p'}), u1);
      expect(u2.get('previous')).to.equal('01'); // TODO attribute value with CMS spec
    });

    it("Should execute immerse function", function() {
      var units = new AuthoringCollection();
      var u1 = units.add(new AuthoringUnit({id: '0b', type: 'p'}));
      var group = units.subsetWhere(function() {return true;}, function(u) { u.set('section','x'); });
      var u2 = group.addAfter(new AuthoringUnit({id: '0c', type:'p'}), u1);
      expect(u2.get('section')).to.equal('x');
    });

  });

  describe("addFirst", function() {

    xit("Roughly the same specs as addAfter, but maybe we'll deprecate addFirst and require use of meta units");

  });

  describe("essential change events", function() {

    it("Should emit 'add'", function() {
      var events = [];
      var units = new AuthoringCollection();
      units.on('add', function() {
        events.push(arguments);
      });
      units.add(new AuthoringUnit({type: 'text'}));
      expect(events.length).to.equal(1);
    });

    it("Should emit 'change'", function() {
      var events = [];
      var units = new AuthoringCollection();
      units.on('add', function() {
        events.push(arguments);
      });
      var unit1 = units.add(new AuthoringUnit({type: 'text'}));
      unit1.set('content', 'new input');
      expect(events.length).to.equal(1);
    });

  });

  describe("unit move", function() {

    it("Should mark the original as deleted and create a clone unit", function() {

    });

    it("Should reference from the new to the copy source", function() {

    });

    xit("Should reference from the deleted to the copy target (maybe, but there could be many)", function() {

    });

    xit("Should reference with timestamps?", function() {

    });

  });

};
