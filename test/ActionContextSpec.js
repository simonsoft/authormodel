
var expect = require('chai').expect;

var ActionContext = require('../actioncontext/ActionContext');

describe('ActionContext', function() {

  it('Has get and set methods for unmodelled properties', function() {
    var context = new ActionContext();
    expect(context.set).to.be.a('function');
    expect(context.get).to.be.a('function');
    context.set('arbitrary', 12345);
    expect(context.get('arbitrary')).to.equal(12345);
  });

  it('#setUnitEditor and #getUnitEditor', function() {
    var context = new ActionContext();
    expect(context.setUnitEditor).to.be.a('function');
    expect(context.getUnitEditor).to.be.a('function');
    var uniteditor = {};
    context.setUnitEditor(uniteditor);
    expect(context.getUnitEditor()).to.equal(uniteditor);
  });

  it("#setUnit and #getUnit", function() {
    var model = {attributes:{}};
    expect(new ActionContext().setUnit(model).getUnit()).to.equal(model);
  });

  it("#setSelection and #getSelection", function() {
    var selection = {}; // If we start validating this we might need a real rangy object here
    expect(new ActionContext().setSelection(selection).getSelection()).to.equal(selection);
  });

  xit('#addAction', function() {

  });

  xit('#filterActions takes a predicate function and removes the actions for which false is returned', function() {

  });

});
