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
  var o = this;
  console.log('stub unit editor created', options);
  unitEditors.push(o);

  bev.mixin(o);

  // try to follow the contract to avoid calls on undefined, and provide call logs for expectations
  var $el = o.$el = $('<p/>');
  $el.insertAfter = mocks.spy();
  o.model = options.model;
  o.render = mocks.spy(function() { return o; });
};

var ContentModel1 = function() {
  this.getView = mocks.spy(function(au, options) {
    return new UnitEditor1({model: au});
  });
};


module.exports = function interfaceSpec(RenderEngine) {

  xit("TODO how are unit editors appended to DOM? In existing CollectionView?");

  describe("Handle unit add", function() {

    it("Should not render anything if the collection is empty", function() {
      var opt = {
        collection: new AuthoringCollection(),
        contentModel: new ContentModel1()
      };
      var renderEngine = new RenderEngine(opt);
      expect(opt.contentModel.getView.calls).to.have.length(0);
    });

    it("Should create unit editors for existing units", function() {
      var opt = {
        collection: new AuthoringCollection(),
        contentModel: new ContentModel1()
      };
      opt.collection.add(new AuthoringUnit({id:'1', type: 'type1'}));
      var renderEngine = new RenderEngine(opt);
      expect(opt.contentModel.getView.calls).to.have.length(1);
      expect(opt.contentModel.getView.calls[0].args[0].attributes.id).to.equal('1');
      expect(unitEditors).to.have.length(1);
      expect(unitEditors[0].model).to.equal(opt.collection.at(0));
    });

    it("Should call render on new unit editors", function() {
      expect(unitEditors[0].render.calls).to.have.length(1);
    });

    it("Should create unit editors for units added after init", function() {
      unitEditors.length = 0;
      var opt = {
        collection: new AuthoringCollection(),
        contentModel: new ContentModel1()
      };
      opt.collection.add(new AuthoringUnit({id:'1', type: 'type1'}));
      var renderEngine = new RenderEngine(opt);
      expect(unitEditors).to.have.length(1);
      opt.collection.add(new AuthoringUnit({id:'2', type: 'type1'}));
      expect(opt.contentModel.getView.calls).to.have.length(2);
      expect(unitEditors).to.have.length(2);
      expect(unitEditors[1].model).to.equal(opt.collection.at(1));
    });

    it("Should avoid to re-render existing when adding new", function() {
      expect(unitEditors[0].render.calls).to.have.length(1);
      expect(unitEditors[1].render.calls).to.have.length(1);
    });

    xit("Should order the inserted unit editor same as the units in the collection", function() {
      // See todo above, how are unit editors appended to DOM
    });

    it("Should listen to (and forward) events from the new unit editor", function() {
      var gotit1 = mocks.spy();
      unitEditors.length = 0;

      var opt = {
        collection: new AuthoringCollection(),
        contentModel: new ContentModel1()
      };

      var renderEngine = new RenderEngine(opt);
      renderEngine.on('custom-event', gotit1);

      opt.collection.add(new AuthoringUnit({id:'1', type: 'type1'}));
      expect(unitEditors).to.have.length(1);
      unitEditors[0].trigger('custom-event');
      expect(gotit1.called).to.be.true;
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
