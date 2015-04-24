'use strict';

var expect = require('chai').expect;

module.exports = function interfaceSpec(required) {

  var ContentModel = required;

  it("Is something Editor needs to guide the user through structured authoring");

  it("Knows what unit types are allowed and intricacies of such rules");

  it("Is therefore a good candidate to suggest context sensitive Actions above the UnitEditor level");

  it("is a constructor", function() {
    expect(ContentModel).to.be.a('function');
  });

  describe("#getView", function() {

    it("#getView", function() {
      var cm = new ContentModel();
      expect(cm.getView).to.be.a('function');
    });

    xit("may be renamed to #getUnitEditor", function() {
    });

    it("Takes an authoring unit as first argument", function() {

    });

    it("Takes options as second argument", function() {

    });

    it("Supports an el option for existing element", function() {

    });

  });

};
