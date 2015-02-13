
var ex = require('chai').expect;
var expect = require('expectations'); // for jasmine syntax

module.exports = function interfaceSpec(required) {

  var AuthoringUnit = required;

  describe("AuthoringUnit", function() {

    it("Should require an initial attributes object", function() {
      expect(function() {
        new AuthoringUnit();
      }).toThrow();
    });

    it("Should initialize given a type attribute", function() {
      var unit1 = new AuthoringUnit({type: 'text'});
      ex(unit1).to.exist;
    });

    it("Should keep non-transient properties under .attributes", function() {
      var unit1 = new AuthoringUnit({type: 'text'});
      ex(unit1.attributes).to.exist;
      ex(unit1.attributes.type).to.exist;
      ex(unit1.attributes.type).to.be.equal('text');
    });

    it("Should not accept a property named 'attributes' because that indicates it is already an object", function() {
      expect(function() {
        new AuthoringUnit({type: 'text', attributes: false});
      }).toThrow();
    });

  });

  describe("#set", function() {

    it("Should set the corresponding attribute value", function() {
      var unit1 = new AuthoringUnit({type: 'text'});
      unit1.set('somekey', 1234);
      ex(unit1.attributes.somekey).to.exist;
      ex(unit1.attributes.somekey).to.equal(1234);
    });

  });

  describe("#get", function() {

    it("Should get the corresponding attribute value", function() {
      var unit1 = new AuthoringUnit({type: 'some'});
      ex(unit1.get('type')).to.equal('some');
      ex(unit1.get('other')).to.be.undefined;
    });

  });

};
