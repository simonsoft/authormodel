'use strict';

var expect = require('chai').expect;

var AuthoringUnit = require('../../unit/AuthoringUnitDefault');

module.exports = function interfaceSpec(required) {

  var UnitEditor = required.UnitEditor;

  describe('Module', function() {

    it("Exports a UnitEditor constructor", function() {
      expect(UnitEditor).to.exist;
      expect(UnitEditor).to.be.a('function');
    });

  });

  describe('Events', function() {

    it("Should be event capable", function() {
      var au = new AuthoringUnit({type: 'text'});
      var ue = new UnitEditor({model: au});
      var events = [];
      ue.on('custom1', function() {
        events.push(arguments);
      });
      // TODO outside trigger isn't really a use case, and probably a distraction
      ue.trigger('custom1', [7]);
      expect(events).to.have.length(1);
    });

  });

  describe("#render", function() {
    // TODO transfer generic parts of textparagraph spec to here
  });

  describe("#save", function() {
    // TODO transfer generic parts of textparagraph spec to here
  });

  describe("#focus", function() {

    it("Is called to ensure focus on the unit, while effects may vary depending on what the unit editor does", function() {
      var au = new AuthoringUnit({type:'text', content:''});
      var ue = new UnitEditor({model: au});
      expect(ue.focus).is.a('function');
      ue.focus();
    });

  });

}
