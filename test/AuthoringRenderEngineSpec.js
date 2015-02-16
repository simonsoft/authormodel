'use strict';

var expect = require('chai').expect;

module.exports = function interfaceSpec(required) {

  describe("Constructor", function() {

    it("is a constructor", function() {
      expect(required).to.be.a('function');
      expect(required.name).to.equal('AuthoringRenderEngine');
      // instances
      //expect(required.constructor).to.exist();
      //expect(required.constructor.name).to.equal('AuthoringRenderEngine');
    });

  });

};
