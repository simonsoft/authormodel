
var expect = require('chai').expect;

var ActionContext = require('../actioncontext/ActionContext');

describe('ActionContext', function() {

  it('Has get and set methods for unmodelled properties', function() {
    var context = new ActionContext();
    expect(context.set).to.be.a('function');
    expect(context.get).to.be.a('function');
  });

});
