
var expect = require('chai').expect;

describe('authormodel', function() {

  var authormodel = require('../');

  it("Should export AuthoringUnit", function() {
    expect(authormodel.AuthoringUnit).to.be.defined;
  });

});
