'use strict';

var expect = require('chai').expect;

var Collection = require('../collection/AuthoringCollectionDefault.js');
var Unit = require('../unit/AuthoringUnitDefault.js');

describe("#changesSubset", function() {

  it("Returns a collection", function() {
    var c = new Collection();
    var changed = c.changesSubset();
    expect(changed.size()).to.equal(0);
  });

  it("Contains any #add'ed unit", function() {
    var c = new Collection();
    var changed = c.changesSubset();
    c.add(new Unit({type: 'test1'}));
    expect(changed.size()).to.equal(1);
    expect(changed.at(0).get('type')).to.equal('test1');
  });

  it("Contains any unit that got a #set done on it", function() {
    var c = new Collection();
    var changed = c.changesSubset();
    c.add(new Unit({type: 'test1'}));
    c.add(new Unit({type: 'test2'}));
    c.changesReset();
    expect(changed.size()).to.equal(0);

  });

  it("Doesn't matter when the subset was created, changes are tracked since creation/reset anyway", function() {

  });

  it("#unit set is a change", function() {

  });

  it("#changes.reset is supposed to run after save", function() {

  });

  xit("#changes.exist could be a useful function");

});
