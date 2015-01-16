
var expect = require('chai').expect;

var interfaceTest = function(impl) {

  var AuthoringUnit = require(impl);

  describe(impl + " AuthoringUnit", function() {

    it("Should initialize given a type attribute", function() {
      var unit1 = new AuthoringUnit({type: 'text'});
      expect(unit1).to.not.be.undefined;
    });

    it("Should keep non-transient properties under .attributes", function() {
      var unit1 = new AuthoringUnit({type: 'text'});
      expect(unit1.attributes).to.not.be.undefined;
      expect(unit1.attributes.type).to.not.be.undefined;
      expect(unit1.attributes.type).to.be.equal('text');
    });

  });

  describe(impl + " #set", function() {

    it("Should set the corresponding attribute value", function() {
      var unit1 = new AuthoringUnit({type: 'text'});
      unit1.set('somekey', 1234);
      expect(unit1.attributes.somekey).to.exist;
      expect(unit1.attributes.somekey).to.equal(1234);
    });

  });

  describe(impl + " #get", function() {

    it("Should get the corresponding attribute value", function() {
      var unit1 = new AuthoringUnit({type: 'some'});
      expect(unit1.get('type')).to.equal('some');
      expect(unit1.get('other')).to.be.undefined;
    });

  });

};

interfaceTest('../AuthoringUnitBackbone');
interfaceTest('../AuthoringUnit');
