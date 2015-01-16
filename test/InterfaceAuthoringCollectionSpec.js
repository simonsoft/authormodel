
var expect = require('chai').expect;

var interfaceTest = function(impl) {

  var AuthoringCollection = require(impl);
  var AuthoringUnit = AuthoringCollection.model;

  describe(impl + " static setup", function() {

    // I'm not so sure we'd want this, as we might have a lot of different units in a collection
    // (all of them implementing an AuthorUnit interface)
    xit("Should declare the type of model it accepts", function() {
      expect(AuthoringUnit).to.exist;
    });

  });

  describe(impl + " initialization without options", function() {

    it("Should initialize with a preconfigured model type", function() {
      var units = new AuthoringCollection();
      var added = units.add({type: 'text'});
      expect(added).to.exist;
      expect(added.attributes).to.exist;
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
