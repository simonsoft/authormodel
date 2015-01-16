
var expect = require('chai').expect;

var interfaceTest = function(impl) {

  var AuthoringCollection = require(impl);
  var AuthoringUnit = AuthoringCollection.model;

  describe(impl + " initialization without options", function() {

    // TODO is this really a good idea? Would probably be better if add only accepts proper authoring units
    it("Should initialize with a preconfigured model type", function() {
      var units = new AuthoringCollection();
      var added = units.add({type: 'text'});
      expect(added).to.exist;
      expect(added.attributes).to.exist;
      expect(added.attributes.attributes).to.be.undefined;
      expect(added.attributes.type).to.be.equal('text');
    });

    it("Should declare the model constructor", function() {
      var units = new AuthoringCollection();
      expect(units.model).to.exist;
      expect(units.model).to.be.a('function');
    });

  });

  describe(impl + " essential change events", function() {

    it("Should emit 'add'", function() {
      var events = [];
      var units = new AuthoringCollection();
      units.on('add', function() {
        events.push(arguments);
      });
      units.add({type: 'text'});
      expect(events.length).to.be.equal(1);
    });

    it("Should emit 'change'", function() {
      var events = [];
      var units = new AuthoringCollection();
      units.on('add', function() {
        events.push(arguments);
      });
      var unit1 = units.add({type: 'text'});
      unit1.set('content', 'new input');
      expect(events.length).to.be.equal(1);
    });

  });

};

interfaceTest('../AuthoringCollectionBackbone');
