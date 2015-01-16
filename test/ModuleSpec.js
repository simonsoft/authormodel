
var expect = require('chai').expect;

describe('authormodel', function() {

  var authormodel = require('../');

  it("Should export AuthoringUnit", function() {
    // Gotcha! This wouldn't fail
    expect(authormodel.AuthoringUnit).to.be.defined;
    // With chai expect you must really code test-first, or be sure the assertion is defined
    expect(authormodel.AuthoringUnit).to.exist;
  });

  it("Should export AuthoringCollection", function() {
    expect(authormodel.AuthoringCollection).to.be.defined;
  });

});
