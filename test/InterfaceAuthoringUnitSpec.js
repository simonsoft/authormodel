
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
    });

  });

};

interfaceTest('../AuthoringUnitBackbone');
interfaceTest('../AuthoringUnit');
