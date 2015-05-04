'use strict';

// This now comprises of both the API of unit editors and the Action Specs for simplicity

var expect = require('chai').expect;

// Expect jquery to exist on downstream module
var $ = require('jquery');

// Expect rangy to exist on downstream module
var rangy = require('rangy');
rangy.init();

var ActionContext = require('../../actioncontext/ActionContext');
var AuthoringUnit = require('../../unit/AuthoringUnitDefault');

module.exports = function interfaceSpec(required) {

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

      expect(uniteditor.hasSelection()).to.be.true;
    });

    it('returns false if the selection is in some other unit editor', function() {
      //Arrange
      // unit 1
      var au = new AuthoringUnit({type: 'text', content: 'I WILL BE SELECTED'});
      var uniteditor = new UnitEditor({model: au});
      uniteditor.render();
      uniteditor.$el.appendTo($testcontent);

      // unit 2
      var au2 = new AuthoringUnit({type: 'text', content: 'I WONT BE SELECTED'});
      var uniteditor2 = new UnitEditor({model: au2});
      uniteditor2.render();
      uniteditor2.$el.appendTo($testcontent);

      var startIndex = 5;
      var endIndex = 7;

      // ACT
      // select on unit 1
      var range = rangy.createRange();
      range.setStartAndEnd(uniteditor.el.firstChild, startIndex, endIndex);
      var sel = rangy.getSelection();

      // ASSERT
      // assert on unit 2
      expect(uniteditor2.hasSelection()).to.be.false;
    });

  });

  // method not working properly with webpack tests, tests should be accurate,
  // issue seems to be with rangy impl
  describe('getSelection()', function() {

    var $testcontent = $('#testcontent');
    console.assert($testcontent.length, 'No #testcontent element, can\'t do Rangy tests without it');

    it('returns a rangy object', function() {
      //Arrange
      var au = new AuthoringUnit({type: 'text', content: '012345678901234567890 <label>getselection</label>'});
      var uniteditor = new UnitEditor({model: au});
      uniteditor.render();
      uniteditor.$el.appendTo($testcontent);

      /** changed range to include the label areas,
       * but doesn't really work based on range.setStartAndEnd in this element
       */
      var startIndex = 29;
      var endIndex = 31;

      var range = rangy.createRange();
      range.setStartAndEnd(uniteditor.el.firstChild, startIndex, endIndex);
      var sel = rangy.getSelection();

      sel.setSingleRange(range);

      // use the uniteditor API
      expect(uniteditor.getSelection()).to.exist;
      // What defines a Rangy object?
      var us = uniteditor.getSelection();
      var rs = rangy.getSelection();
      expect(us.rangeCount).to.equal(rs.rangeCount);
      expect(us.anchorOffset).to.equal(rs.anchorOffset);
      expect(us.focusOffset).to.equal(rs.focusOffset);
    });

    it('Returns undefined if there is no selection', function() {
      var au = new AuthoringUnit({type: 'text', content: '012345678901234567890-getselection'});
      var uniteditor = new UnitEditor({model: au});
      uniteditor.render();
      uniteditor.$el.appendTo($testcontent);
      expect(uniteditor.getSelection()).to.be.undefined;
    });

    it('Returns undefined if there is a selection but outside this unit', function() {
      //Arrange
      // unit 1
      var au = new AuthoringUnit({type: 'text', content: 'I WILL BE SELECTED'});
      var uniteditor = new UnitEditor({model: au});
      uniteditor.render();
      uniteditor.$el.appendTo($testcontent);

      // unit 2
      var au2 = new AuthoringUnit({type: 'text', content: 'I WONT BE SELECTED'});
      var uniteditor2 = new UnitEditor({model: au2});
      uniteditor2.render();
      uniteditor2.$el.appendTo($testcontent);

      var startIndex = 5;
      var endIndex = 7;

      // ACT
      // select on unit 1
      var range = rangy.createRange();
      range.setStartAndEnd(uniteditor.el.firstChild, startIndex, endIndex);
      var sel = rangy.getSelection();

      // ASSERT
      // assert on unit 2
      expect(uniteditor2.getSelection()).to.be.undefined;
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
