'use strict';

var expect = require('chai').expect;
var mocks = require('simple-mock');

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
  var eventspy = this.eventspy = mocks.spy(function() {});
  this.on('all', eventspy);

  // try to follow the contract to avoid calls on undefined, and provide call logs for expectations
  var $el = this.$el = $('<p/>');
  this.model = options.model;
  this.render = mocks.spy(function() { return $el; });
};

var contentModel1 = {
  getView: mocks.spy(function(au, options) {
    return new UnitEditor1({model: au});
  })
};


module.exports = function interfaceSpec(required) {

  xit("TODO how are unit editors appended to DOM? In existing CollectionView?");

  describe("Handle unit add", function() {
    var opt = {
      collection: new AuthoringCollection(),
      contentModel: contentModel1
    };
    var renderEngine;
    var ue1;
    var ue2;

    it("Should not render anything if the collection is empty", function() {
      renderEngine = new required(opt);
      expect(opt.contentModel.getView.calls).to.have.length(0);
    });

    it("Should create unit editors for existing units", function() {
      opt.collection.add(new AuthoringUnit({id:'1', type: 'type1'}));
      expect(opt.contentModel.getView.calls).to.have.length(1);
      expect(opt.contentModel.getView.calls[0].args[0].attributes.id).to.equal('1');
      ue1 = unitEditors.pop();
      expect(ue1.model).to.equal(opt.collection.at(0));
    });

    it("Should already have a unit editor for the first model", function() {
      expect(ue1).to.exist;
      expect(ue1.eventspy.calls).to.be.empty;
    });

    it("Should produce a unit editor for the new unit", function() {
      ue1.render.reset();
      opt.contentModel.getView.reset();
      opt.collection.add(new AuthoringUnit({id:'2', type: 'type1'}));
      expect(opt.contentModel.getView.calls).to.have.length(1);
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
      expect(gotit).to.be.true;
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
