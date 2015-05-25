
var expect = require('chai').expect;

var EditSession = require('../session/EditSession');

describe("EditSession", function() {

  describe(".units", function() {

    it("Starts as an empty AuthoringCollection", function() {
      var s = new EditSession();
      expect(s.units).to.exist;
      expect(s.units.size()).to.equal(0);
      expect(s.units.addAfter).to.be.a('function');
    });

  });

  describe(".actions", function() {

    it("Provides an #execute fuction", function() {
      
    });

  });

});
