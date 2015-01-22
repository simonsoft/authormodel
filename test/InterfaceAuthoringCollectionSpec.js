
var expect = require('chai').expect;

var interfaceTest = function(impl) {

  var AuthoringCollection = require(impl);
  var AuthoringUnit = require('../unit/AuthoringUnitBackbone');

  describe(impl + " initialization without options", function() {

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

  describe(impl + "instantiation with initial models", function() {

    // This is because we don't want to specify the type of model (at least not yet)
    // And we don't want the collection to create default a no-behavior model like Backbone does
    it("Should only allow actual models, not standalone attribute objects", function() {
      expect(function() {
        var units = new AuthoringCollection({type:'text'});
      }).to.throw();
      expect(function() {
        var units = new AuthoringCollection([{type:'text'}]);
      }).to.throw();
    });

  });

  describe(impl + " add", function() {

    it("Should only allow actual models, not standalone attribute objects", function() {
      var units = new AuthoringCollection();
      expect(function() {
        units.add({type:'text'});
      }).to.throw();
      expect(function() {
        units.add([{type:'text'}]);
      }).to.throw();
    });

    it("Returns added units", function() {
      var units = new AuthoringCollection();
      var u = new AuthoringUnit({type: 'text'});
      expect(units.add(u)).to.equal(u);
    });

  });

  describe(impl + " essential change events", function() {

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

};

interfaceTest('../collection/AuthoringCollectionBackbone');
