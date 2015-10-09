
var expect = require('chai').expect;

module.exports = function interfaceSpec(required) {

  var AuthoringUnit = required;

  describe("AuthoringUnit", function() {

    it("Should require an initial attributes object", function() {
      expect(function() {
        new AuthoringUnit();
      }).to.throw();
    });

    it("Should initialize given a type attribute", function() {
      var unit1 = new AuthoringUnit({type: 'text'});
      expect(unit1).to.exist;
    });

    it("Should keep non-transient properties under .attributes", function() {
      var unit1 = new AuthoringUnit({type: 'text'});
      expect(unit1.attributes).to.exist;
      expect(unit1.attributes.type).to.exist;
      expect(unit1.attributes.type).to.be.equal('text');
    });

    it("Should not accept a property named 'attributes' because that indicates it is already an object", function() {
      expect(function() {
        new AuthoringUnit({type: 'text', attributes: false});
      }).to.throw();
    });

  });

  describe("#set", function() {

    it("Should set the corresponding attribute value", function() {
      var unit1 = new AuthoringUnit({type: 'text'});
      unit1.set('somekey', 1234);
      expect(unit1.attributes.somekey).to.exist;
      expect(unit1.attributes.somekey).to.equal(1234);
    });

  });

  describe("#get", function() {

    it("Should get the corresponding attribute value", function() {
      var unit1 = new AuthoringUnit({type: 'some'});
      expect(unit1.get('type')).to.equal('some');
      expect(unit1.get('other')).to.be.undefined;
    });

  });

  describe("#clone", function() {

    it("Returns a unit with the same attributes", function() {
      var unit1 = new AuthoringUnit({id: 1, type: 'some', blah: 'bläh'});
      var unit2 = unit1.clone();
      expect(unit2.get('type')).to.equal('some');
      expect(unit2.get('blah')).to.equal('bläh');
    });

    it("Keeps ID on the clone because you might get surprised otherwise", function() {
      var unit1 = new AuthoringUnit({id: 1, type: 'some', blah: 'bläh'});
      var unit2 = unit1.clone();
      expect(unit2.get('id')).to.equal(1);
      expect(unit2.id).to.equal(1);
    });

  });

};
