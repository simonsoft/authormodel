'use strict';

describe("UnitEditorFallback", function() {

  var AuthoringUnit = require('authormodel').AuthoringUnit;
  var UnitEditor = require('../src/UnitEditorFallback');

  // These tests were geared towards text editors, but as they mature we migt be able to comply
  describe("implements UnitEditor", function() {
    require('./UnitEditorSpec')({UnitEditor: UnitEditor});
  });

  describe("#render", function() {

    it("shows the unit's contents in some way", function() {
      var unit = new AuthoringUnit({type: 'p'});

    });

  });


});
