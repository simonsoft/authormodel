'use strict';

var expect = require('chai').expect;

var AuthoringUnit = require('../unit/AuthoringUnit');

xdescribe("AuthoringUnit plain object", function() {

  describe("implements AuthoringUnit", function() {
    require('../unit/itest/AuthoringUnitSpec')(AuthoringUnit);
  });

  xit("Could test something specific about this particular impl", function() {

  });

});
