
var expect = require('chai').expect;

module.exports = function interfaceSpec(impl, required) {

  describe("IContentModel: " + impl, function() {

    it("is a constructor", function() {
      expect(required).to.be.a('function');
    });

  });

};
