'use strict';

var expect = require('chai').expect;

// Deps
var bev = require('bev');
var AuthoringUnit = require('../').AuthoringUnit;

// Mocks
var Editor1 = bev.mixin(function() {

});

var ContentModel = function MockContentModel() {
  this.getView = function(au) {
    return new Editor1(au);
  }
};


module.exports = function interfaceSpec(required) {

  describe("Handle unit add", function() {

  });

  describe("Handle unit remove (actual remove, not just flagged)", function() {

  });

  describe("Handle unit change", function() {

    xit("EITHER expects unit editor to render automatically", function() {
    });
    xit("OR calls render on unit editor", function() {
    });

  });

  describe("handle unit editor 'changed'", function() {

    it("Who calls save?");

  });

  describe("Events from unit editors", function() {

    xit("Re-emits any unrecognized", function() {

    });

    xit("Re-emits authorintent", function() {

    });

    xit("Re-emits authorpause", function() {

    });

    xit("Given the 'disband' event it requests a new unit editor from content model", function() {

    });

  });

};
