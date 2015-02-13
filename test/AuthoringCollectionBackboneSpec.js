'use strict';

var expect = require('chai').expect;

var AuthoringCollection = require('../collection/AuthoringCollectionBackbone');

describe("AuthoringCollectionBackbone", function() {

  describe("implements AuthoringCollection", function() {
    require('./IAuthoringCollectionSpec')(AuthoringCollection);
  });

  xit("Could test something specific about this particular impl", function() {

  });

});
