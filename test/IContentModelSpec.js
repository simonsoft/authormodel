
var expect = require('chai').expect;

module.exports = function interfaceSpec(impl, required) {

  describe("IContentModel: " + impl, function() {

    it("Is something Editor needs to guide the user through structured authoring");

    it("Knows what unit types are allowed and intricacies of such rules");

    it("Is therefore a good candidate to suggest context sensitive Actions above the UnitEditor level");

    it("Impls export a constructor", function() {
      expect(required).to.be.a('function');
    });

  });

};
