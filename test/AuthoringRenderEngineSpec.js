'use strict';

var expect = require('chai').expect;
var simple = require('simple-mock');
// reset a single functino spy in simple-mock, the brutal one-liner way, works for this spec's cases
var reset = function(simpleSpy) {
  simpleSpy.calls.length = simpleSpy.callCount = simpleSpy.called = simpleSpy.lastCall = 0;
};

// Deps
var bev = require('bev');
var authormodel = require('../');
var AuthoringUnit = authormodel.AuthoringUnit;
var AuthoringCollection = authormodel.AuthoringCollection;

// Mocks, but if they get too complex we might want to use ContentModelFromTypeMap and UnitEditorFallback
var unitEditors = [];
var UnitEditor1 = function(options) {
  console.log('stub unit editor created', options);
  unitEditors.push(this);

  bev.mixin(this);
  var eventspy = this.eventspy = simple.spy(function() {});
  this.on('all', eventspy);

  // try to follow the contract to avoid calls on undefined, and provide call logs for expectations
  var $el = this.$el = $('<p/>');
  this.model = options.model;
  this.render = simple.spy(function() { return $el; });
};

var ContentModel1 = function() {
  var calls = this.calls = [];
  this.getView = function(au, options) {
    this.calls.push(arguments);
    return new UnitEditor1({model: au});
  }
};


module.exports = function interfaceSpec(required) {

  xit("TODO how are unit editors appended to DOM? In existing CollectionView?");

  describe("Handle unit add", function() {
    var opt = {
      collection: new AuthoringCollection(),
      contentModel: new ContentModel1()
    };
    var renderEngine;
    var ue1;
    var ue2;

    it("Should not render anything if the collection is empty", function() {
      renderEngine = new required(opt);
      expect(opt.contentModel.calls).to.have.length(0);
    });

    it("Should create unit editors for existing units", function() {
      opt.collection.add(new AuthoringUnit({id:'1', type: 'type1'}));
      expect(opt.contentModel.calls).to.have.length(1);
      ue1 = unitEditors.pop();
      expect(ue1.model).to.equal(opt.collection.at(0));
    });

    it("Should already have a unit editor for the first model", function() {
      expect(ue1).to.exist;
      expect(ue1.eventspy.calls).to.be.empty;
    });

    it("Should produce a unit editor for the new unit", function() {
      reset(ue1.render);
      opt.contentModel.calls.splice(0, opt.contentModel.calls.length);
      opt.collection.add(new AuthoringUnit({id:'2', type: 'type1'}));
      expect(opt.contentModel.calls).to.have.length(1);
      ue2 = unitEditors.pop();
      expect(ue2.model).to.equal(opt.collection.at(1));
    });

    it("Should have added editor with no re-render on existing", function() {
      expect(ue1.render.calls).to.have.length(0);
    });

    xit("Should order the inserted unit editor same as the units in the collection", function() {
      // See todo above
    });

    it("Should listen to (and forward) events from the new unit editor", function() {
      var gotit = false;
      renderEngine.once('custom-event', function() {
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
