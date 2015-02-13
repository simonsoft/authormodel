'use strict';

var expect = require('chai').expect;

module.exports = function interfaceSpec(required) {

  var ContentModel = required;

  it("Is something Editor needs to guide the user through structured authoring");

  it("Knows what unit types are allowed and intricacies of such rules");

  it("Is therefore a good candidate to suggest context sensitive Actions above the UnitEditor level");

  it("is a constructor", function() {
    expect(ContentModel).to.be.a('function');
    expect(ContentModel.constructor.name).to.equal('ContentModel');
  });

  describe("#getView", function() {

    it("#getView", function() {
      var cm = new ContentModel();
      expect(cm.getView).to.be.a('function');
    });

    xit("may be renamed to #getUnitEditor", function() {
    });

  });

};
