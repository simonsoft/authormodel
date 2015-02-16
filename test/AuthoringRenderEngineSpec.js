'use strict';

var expect = require('chai').expect;

// Deps
var bev = require('bev');
var authormodel = require('../');
var AuthoringUnit = authormodel.AuthoringUnit;
var AuthoringCollection = authormodel.AuthoringCollection;

// Mocks
var unitEditors = [];
var UnitEditor1 = function() {
  unitEditors.push(this);
  bev.mixin(this);
  var eventlog = this.eventlog = [];
  this.listenTo('all', function() {
    eventlog.push(arguments);
  });
};

var ContentModel1 = function() {
  var calls = this.calls = [];
  this.getView = function(au) {
    this.calls.push(arguments);
    return new UnitEditor1(au);
  }
};


module.exports = function interfaceSpec(required) {

  describe("Handle initial units", function() {
    var opt = {
      collection: new AuthoringCollection(),
      contentModel: new ContentModel1()
    };

    it("Should not render anything if the collection is empty", function() {
      var renderEngine = new required(opt);
      expect(opt.contentModel.calls).to.have.length(0);
    });

    it("Should create unit editors for existing units", function() {
      opt.collection.add(new AuthoringUnit({type: 'type1'}));
      expect(opt.contentModel.calls).to.have.length(1);
      var ue = unitEditors1.pop();
      expect(ue.model).to.equal(opt.collection.at(0));
    });

    xit("Should call render", function() {
      // TODO rules are under consideration for who triggers render
    });

  });

  xdescribe("TODO how are unit editors appended to DOM? In existing CollectionView?");

  describe("Handle unit add", function() {
    var opt = {
      collection: new AuthoringCollection(),
      contentModel: new ContentModel1()
    };
    opt.collection.add(new AuthoringUnit({type: 'type1'}));
    var renderEngine = new required(opt);
    var ue1 = unitEditors.pop();
    ue1.eventlog.splice(0, ue1.eventlog.length-1);
    var ue2;

    it("Should already have a unit editor for the first model", function() {
      expect(ue1).to.exist();
      expect(ue1.eventlog).to.be.empty();
    });

    it("Should produce a unit editor for the new unit", function() {
      collection.add(new AuthoringUnit({type: 'type1'}));
      expect(opt.contentModel.calls).to.have.length(1);
      ue2 = unitEditors.pop();
      expect(ue2.model).to.equal(opt.collection.at(1));
    });

    it("Should stay away from the existing editor, not call re-render", function() {
      expect(ue1.eventlog).to.have.length(1);
    });

    it("Should insert the unit editor in relation to previous unit editor", function() {
      // See todo above
    });

    it("Should listen to (and forward) events from the new unit editor", function() {
      var gotit = false;
      opt.renderEngine.once(function() {
        gotit = true;
      });
      ue2.trigger('custom-event');
      expect(gotit).to.be.true();
    });

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

  describe("Renders only as needed", function() {

  });

  describe("Avoids render on unit (editor) being edited", function() {

  });

};
