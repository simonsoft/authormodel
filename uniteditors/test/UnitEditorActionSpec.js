'use strict';

// This now comprises of both the API of unit editors and the Action Specs for simplicity

var expect = require('chai').expect;
var $ = require('jquery');

var rangy = require('rangy');
rangy.init();

var ActionContext = require('../../authormodel/actioncontext/ActionContext');

module.exports = function interfaceSpec(required) {

  var AuthoringUnit = require('../../authormodel').AuthoringUnit;
  var UnitEditor = required.UnitEditor;

  // method not working properly with webpack tests, tests should be accurate,
  // issue seems to be with rangy impl
  describe('hasSelection()', function() {

    xit('returns false if there is no selection', function() {
      var au = new AuthoringUnit({type: 'text', content: '012345678901234567890'});
      var uniteditor = new UnitEditor({model: au});
      uniteditor.render();

      //do i need to force clear selections?
    /* rangy.init();
      var range = rangy.createRange();
      range.getSelection().removeAllRanges();*/

      expect(uniteditor.hasSelection()).to.be.false();
    });

    xit('returns true if there is a selection', function() {
      var au = new AuthoringUnit({type: 'text', content: '012345678901234567890'});
      var uniteditor = new UnitEditor({model: au});
      uniteditor.render();

      var startIndex = 6;
      var endIndex = 9;

      var range = rangy.createRange();
      range.setStartAndEnd(uniteditor.el.firstChild, startIndex, endIndex);
      rangy.getSelection().setSingleRange(range);

      expect(uniteditor.hasSelection()).to.be.true();
    });

  });

  // method not working properly with webpack tests, tests should be accurate,
  // issue seems to be with rangy impl
  xdescribe('getSelection()', function() {
    xit('returns a rangy object', function() {
      //Arrange
      var au = new AuthoringUnit({type: 'text', content: '012345678901234567890'});
      var uniteditor = new UnitEditor({model: au});
      uniteditor.render();

      var startIndex = 6;
      var endIndex = 9;

      var range = rangy.createRange();
      range.setStartAndEnd(uniteditor.el.firstChild, startIndex, endIndex);
      var sel = rangy.getSelection();

      sel.setSingleRange(range);

      // use the uniteditor API
      expect(uniteditor.getSelection()).to.exist();
      expect(uniteditor.getSelection()).to.equal(rangy.getSelection());
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

        // fake keypress on uniteditor.§el
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
        var authoractionEventContext;

        // create uniteditor
        uniteditor = new UnitEditor({model: au});

        // listen to authoraction on uniteditor (not uniteditor.$el)
        uniteditor.on('authorintent', function (context){
          authoractionEventContext = context;
        });

        // fake keypress enter on uniteditor.$el
        var e = $.Event( 'keypress', {keyCode: 13 } );
        uniteditor.$el.trigger(e);

        expect(authoractionEventContext).to.be.an.instanceof(ActionContext);

        // here or in additional it below do interesting get calls on context object and assert result

      });

      it('Sets itself as uniteditor instance', function() {

        var authoractionEventContext;
        var au = new AuthoringUnit({type: 'text', content: '012345678901234567890'});

        var uniteditor = new UnitEditor({model: au});

        // listen to authoraction on uniteditor (not uniteditor.$el)
        uniteditor.on('authorintent', function (context){
          authoractionEventContext = context;
        });

        // fake keypress enter on uniteditor.$el
        var e = $.Event( 'keypress', {keyCode: 13 } );
        uniteditor.$el.trigger(e);

        expect(authoractionEventContext.getUnitEditor()).to.equal(uniteditor);
      });

    });

    describe('A typical text paragraph\'s ActionContext contribution', function() {

      // TODO to implement these tests we might need to mock an ActionContext and assert on what uniteditor sets on it

      xit('Sets a selection range object (Rangy\'s API is fine)', function() {
        //Arrange
        var rangy = require('rangy');
        var authoractionEventContext;
        var au = new AuthoringUnit({type: 'text', content: '012345678901234567890'});
        var $el = uniteditor.$el;

        // create uniteditor
        uniteditor = new UnitEditor({model: au});

        // listen to authoraction on uniteditor (not uniteditor.$el)
        uniteditor.on('authorintent', function (context){
          authoractionEventContext = context;
        });

        rangy.init();

        var startIndex = 6;
        var endIndex = 9;

        var range = rangy.createRange();
        range.setStartAndEnd($el[0].firstChild, startIndex, endIndex);
        var sel = rangy.getSelection();

        sel.setSingleRange(range);

        // Act
        // fake keypress enter on uniteditor.$el
        var e = $.Event( 'keypress', {keyCode: 13 } );
        uniteditor.$el.trigger(e);

        //Assert
        expect(authoractionEventContext).to.be.an.instanceof(ActionContext);

        var selection = authoractionEventContext.get('selection');

        // create uniteditor
        // insert text into uniteditor
        // select text on uniteditor
        // trigger actioncontext on selection
        //
      });

      //Move to the getSelection()

      // method not working properly with webpack tests, tests should be accurate,
      // issue seems to be with rangy impl
      xit('Exposes the DOM element through the selection range object', function() {
        //Arrange
        var rangy = require('rangy');
        rangy.init();

        var $el = $('<p />');
        $el.addClass('testing');
        $el.text('012345678901234567890');
        $el.appendTo('body');

        var startIndex = 6;
        var endIndex = 9;

        var range = rangy.createRange();
        range.setStartAndEnd($el[0].firstChild, startIndex, endIndex);
        var sel = rangy.getSelection();

        // Act
        sel.setSingleRange(range);

        //Assert
        expect(sel.anchorNode).to.equal($el[0].firstChild);
      });

      xit('Sets the top level element because the selection might be in an inline', function() {

      });

      xit('Sets the authoringunit', function() {
        // We need some kind of method to find authoring units.. are we using ids?

      });

      xit('Must have saved to the unit before emitting, so the model is up to date', function() {

      });
    });

    xdescribe(' The external API for modification in the unit editor', function() {

      // we have already defined (somewhere) .save() .render() etc
      xit('should have a render function', function() {
        // body...
      });

      xit('should have a save function', function() {
        // body...
      });

      xit('Considers all these functions as custom, expose them through .ops.[mutationDescription]', function() {
        // body...
      });

      // We shoulnd't define those per-uniteditor operations here because with the above we let
      //  a hard coded or per-case configured enter menu to select and invoke these operations given the context

    });

  });

}
