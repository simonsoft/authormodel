'use strict';

var expect = require('chai').expect;

var AuthoringUnit = require('../unit/AuthoringUnitBackbone');

describe("AuthoringUnitBackbone", function() {

  describe("implements AuthoringUnit", function() {
    require('./IAuthoringUnitSpec')(AuthoringUnit);
  });

  xit("Could test something specific about this particular impl", function() {

  });

});
