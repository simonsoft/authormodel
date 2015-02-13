'use strict';

var expect = require('chai').expect;

module.exports = function interfaceSpec(required) {

  describe("Is a Command pattern handle passed through ActionContext to UI that might trigger actions", function() {

    it("Is a constructor", function() {
      expect(required).to.be.a('function');
      expect(required.constructor).to.exist();
      expect(required.constructor.name).to.match(/^[A-Z].+/);
    });

  });

  describe("#identify", function() {

    it("Returns a descriptor object", function() {

    });

    it(".key is a dot notation style identifier for the operation label", function() {

    });

    it(".attributes, if defined, has variables used to render label", function() {

    });

  });

  describe("#execute", function() {

    it("1st arg is the actionContext", function() {

    });

    it("2nd arg is the authoringCollection", function() {

    });

  });

  describe("#preview", function() {

    it("1st arg is the actionContext", function() {

    });

    it("2nd arg is the authoringCollection", function() {

    });

    it("Actually modifies the authoringCollection", function() {

    });

    xit("But sets isPreview on added models", function() {

    });

    xit("Do we have a transaction+rollback concept, or do w (ehhh, what did I think here?)");

    it("Returns a *preview* object", function() {

    });

    it("The *preview* object has an #execute method", function() {

    });

    it("The *preview* object's #cancel method, if defined, _must_ be invoked if the action is aborted", function() {

    });

  });

};
