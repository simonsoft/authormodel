'use strict';

// This now comprises of both the API of unit editors and the Action Specs for simplicity

var expect = require('chai').expect;

var $ = require('jquery');

var rangy = require('rangy');
rangy.init();

var authormodel = require('authormodel');
var ActionContext = authormodel.ActionContext;

module.exports = function interfaceSpec(required) {

  var AuthoringUnit = authormodel.AuthoringUnit;
  var UnitEditor = required.UnitEditor;

  // method not working properly with webpack tests, tests should be accurate,
  // issue seems to be with rangy impl
  describe('hasSelection()', function() {

    var $testcontent = $('#testcontent');
    console.assert($testcontent.length, 'No #testcontent element, can\'t do Rangy tests without it');

    it('returns false if there is no selection', function() {
      var au = new AuthoringUnit({type: 'text', content: '012345678901234567890-noselection'});
      var uniteditor = new UnitEditor({model: au});
      uniteditor.render();
      uniteditor.$el.appendTo($testcontent);

      // we might need this in some test runners
      //var range = rangy.createRange();
      //range.getSelection().removeAllRanges();*/
      console.log('Rangy no selection:', uniteditor.getSelection());
      expect(uniteditor.hasSelection()).to.be.false;
    });

    it('returns true if there is a selection', function() {
      var au = new AuthoringUnit({type: 'text', content: '012345678901234567890-selection'});
      var uniteditor = new UnitEditor({model: au});
      uniteditor.render();
      uniteditor.$el.appendTo($testcontent);

      var startIndex = 6;
      var endIndex = 9;

      var range = rangy.createRange();
      range.setStartAndEnd(uniteditor.el.firstChild, startIndex, endIndex);
      rangy.getSelection().setSingleRange(range);

      console.log('Rangy with selection:', uniteditor.getSelection());
      expect(uniteditor.hasSelection()).to.be.true;
    });

  });

  // method not working properly with webpack tests, tests should be accurate,
  // issue seems to be with rangy impl
  describe('getSelection()', function() {

    var $testcontent = $('#testcontent');
    console.assert($testcontent.length, 'No #testcontent element, can\'t do Rangy tests without it');

    it('returns a rangy object', function() {
      //Arrange
      var au = new AuthoringUnit({type: 'text', content: '012345678901234567890-getselection'});
      var uniteditor = new UnitEditor({model: au});
      uniteditor.render();
      uniteditor.$el.appendTo($testcontent);

      var startIndex = 6;
      var endIndex = 9;

      var range = rangy.createRange();
      range.setStartAndEnd(uniteditor.el.firstChild, startIndex, endIndex);
      var sel = rangy.getSelection();

      sel.setSingleRange(range);

      // use the uniteditor API
      expect(uniteditor.getSelection()).to.exist;
      expect(uniteditor.getSelection()).to.equal(rangy.getSelection());
    });

    it('Returns a rangy object even if there is no selection, so use hasSelection', function() {
      var au = new AuthoringUnit({type: 'text', content: '012345678901234567890-getselection'});
      var uniteditor = new UnitEditor({model: au});
      uniteditor.render();
      uniteditor.$el.appendTo($testcontent);
      expect(uniteditor.getSelection()).to.exist;
      expect(Object.keys(uniteditor.getSelection())).to.include('anchorNode');
    });

  });

  describe('Focus and other events from user', function() {

    // Maybe this is not for _all_ uniteditors, but at least for the typical text paragraphs
    describe('When the user presses enter', function() {
      var au = new AuthoringUnit({type: 'text'});
      var uniteditor;

      it('Captures the keypress event', function() {
        var triggered = false;
        // instantiate uniteditor
        uniteditor = new UnitEditor({model: au});
        expect(uniteditor.$el).to.exist;

        // fake keypress on uniteditor.$el
        var e = $.Event( 'keypress', {keyCode: 13 } );
        uniteditor.$el.trigger(e);

        // Dropping this expect because subsequent tests implicitly verify the same thing)
        //expect(uniteditor.enterTriggered).to.be.true;
      });

      it('Stops propagation', function() {
        var propagated = false;

        // create parent element
        var $parent = $('<div id="parent"/>');

        // listen to keypress on parent
        $parent.keypress(function( event ) {
          if ( event.keyCode == 13 ) {
            propagated = true;
          }
        });

        // create uniteditor
        uniteditor = new UnitEditor({model: au});

        // append uniteditor.$el to parent
        $parent.append(uniteditor.$el);

        // fake keypress enter on uniteditor.$el
        var e = $.Event( 'keypress', {keyCode: 13 } );
        uniteditor.$el.trigger(e);

        // assert no keypress on parent
        expect(propagated).to.be.false;

      });

      it('Triggers an \'authorintent\' event', function() {
        var authoractionTriggered = false;

        // create uniteditor
        uniteditor = new UnitEditor({model: au});

        // listen to authoraction on uniteditor (not uniteditor.$el)
        uniteditor.on('authorintent', function (){
          authoractionTriggered = true;
        });

        uniteditor.$el.on('authorintent', function (){
          throw 'Should trigger on the instance, not the element';
        });

        // fake keypress enter on uniteditor.$el
        var e = $.Event( 'keypress', {keyCode: 13 } );
        uniteditor.$el.trigger(e);

        // assert one authoraction event
        expect(authoractionTriggered).to.be.true;

      });

      it('Passes an ActionContext object with the event', function() {
        var authorintentEventContext;

        // create uniteditor
        uniteditor = new UnitEditor({model: au});

        // listen to authoraction on uniteditor (not uniteditor.$el)
        uniteditor.on('authorintent', function (context){
          authorintentEventContext = context;
        });

        // fake keypress enter on uniteditor.$el
        var e = $.Event( 'keypress', {keyCode: 13 } );
        uniteditor.$el.trigger(e);

        expect(authorintentEventContext).to.be.an.instanceof(ActionContext);

        // here or in additional it below do interesting get calls on context object and assert result

      });

      var result;

      it('Sets itself as uniteditor instance', function() {

        var authorintentEventContext;
        var au = new AuthoringUnit({type: 'text', content: '012345678901234567890'});

        var uniteditor = new UnitEditor({model: au});

        // listen to authoraction on uniteditor (not uniteditor.$el)
        uniteditor.on('authorintent', function (context){
          authorintentEventContext = context;
        });

        // Had unexpected selections here, might get selection from some other unit in the tests?
        var sel = rangy.getSelection();
        sel.removeAllRanges();
        expect(uniteditor.hasSelection()).to.be.false;

        // fake keypress enter on uniteditor.$el
        var e = $.Event( 'keypress', {keyCode: 13 } );
        uniteditor.$el.trigger(e);

        expect(authorintentEventContext.getUnitEditor()).to.equal(uniteditor);

        result = authorintentEventContext;
      });

      // Means we shouldn't depend on rangy objects for regular element access
      it('Avoids setSelection if there is no actual selection', function() {
        expect(result.getSelection()).to.be.undefined;
      });

    });

    describe('A typical text paragraph\'s ActionContext contribution', function() {

      var result; // expose for subsequent asserts

      var $testcontent = $('#testcontent');
      console.assert($testcontent.length, 'No #testcontent element, can\'t do Rangy tests without it');

      it('Sets a selection range object (Rangy\'s API is fine)', function() {
        //Arrange
        var rangy = require('rangy');
        var authorintentEventContext;
        var au = new AuthoringUnit({type: 'text', content: '012345678901234567890 <label>abcdefghijklmnop</label>'});

        // create uniteditor
        var uniteditor = new UnitEditor({model: au});
        uniteditor.render();
        console.assert(!!uniteditor.$el);
        console.assert(!!uniteditor.el);
        uniteditor.$el.appendTo($testcontent);

        // listen to authoraction on uniteditor (not uniteditor.$el)
        uniteditor.on('authorintent', function (context){
          authorintentEventContext = context;
        });

        // select text on uniteditor
        rangy.init();

        var startIndex = 6;
        var endIndex = 9;

        var range = rangy.createRange();
        range.setStartAndEnd(uniteditor.el.firstChild, startIndex, endIndex);
        var sel = rangy.getSelection();

        sel.setSingleRange(range);

        // Act
        // fake keypress enter on uniteditor.$el
        var e = $.Event( 'keypress', {keyCode: 13 } );
        uniteditor.$el.trigger(e);

        //Assert
        expect(authorintentEventContext).to.be.an.instanceof(ActionContext);

        var selection = authorintentEventContext.getSelection();
        expect(selection).to.exist;
        console.log('Rangy selection object', selection);
        expect(Object.keys(selection)).to.include('anchorNode');


        // reuse this step as setup for other asserts
        result = authorintentEventContext;
      });

      it('Sets the authoringunit', function() {
        expect(result.getUnitEditor()).to.exist;
      });

      it('Exposes the DOM element through the selection range object', function() {
        var sel = result.get('selection');
        var unitEditor = result.getUnitEditor();
        expect(sel.anchorNode).to.equal(unitEditor.el.firstChild);
      });

      xit('Sets the top level element because the selection might be in an inline', function() {

      });

      xit('Must have saved to the unit before emitting, so the model is up to date', function() {
        // TODO this is important but exact spec pending experiments with data binding in render engines
      });

    });

    describe('Tentative API for aggregating actions/ops through action context', function() {

      xit('Considers all these functions as custom, expose them through .ops.[mutationDescription]', function() {
        // body...
      });

      // We shoulnd't define those per-uniteditor operations here because with the above we let
      //  a hard coded or per-case configured enter menu to select and invoke these operations given the context

    });

  });

}
