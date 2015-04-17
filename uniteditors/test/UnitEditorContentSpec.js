'use strict';

var expect = require('chai').expect;
var mocks = require('simple-mock');

var AuthoringUnit = require('authormodel').AuthoringUnit;

// tests for unit editors like a paragraph with 'content' attribute

module.exports = function interfaceSpec(required) {

  describe("#isEmpty", function() {

    it("Returns true if there is no user generated content");

    it("Is a function", function() {
      var au = new AuthoringUnit({type:'text', content:''});
      var ue = new required.UnitEditor({model: au});
      expect(ue.isEmpty).to.be.a('function');
    });

    it("Returns true if there is no content attribute", function() {
      var au = new AuthoringUnit({type:'text'});
      var ue = new required.UnitEditor({model: au});
      expect(ue.isEmpty()).to.be.true;
    });

    it("Returns true if content is an empty string", function() {
      var au = new AuthoringUnit({type:'text', content:''});
      var ue = new required.UnitEditor({model: au});
      ue.render();
      expect(ue.isEmpty()).to.be.true;
    });

    it("Returns false if content is an empty string", function() {
      var au = new AuthoringUnit({type:'text', content:'x'});
      var ue = new required.UnitEditor({model: au});
      ue.render();
      expect(ue.isEmpty()).to.be.false;
    });

    it("Is a method on the uniteditor so if not in sync with model it will return its own state", function() {
      var au = new AuthoringUnit({type:'text', content:''});
      var ue = new required.UnitEditor({model: au});
      ue.render();
      au.attributes.content = 'xyz'; // won't emit a change event
      expect(ue.isEmpty()).to.be.true;
    });

  });

  describe("#save", function() {

    var ue;
    var changed = mocks.spy();
    var changedContent = mocks.spy();

    it("Updates content", function() {
      var au = new AuthoringUnit({type:'text', content:''});
      au.on('change', changed);
      au.on('change:content', changedContent);
      ue = new required.UnitEditor({model: au});
      ue.$el.text('Some text');
      expect(changed.called).to.be.false;
      expect(changedContent.called).to.be.false;
      ue.save();
    });

    it("...in a way that triggers a change event on the model", function() {
      expect(changed.called).to.be.true;
      expect(changedContent.called).to.be.true;
    });

    it("Only triggers change events if actually changed", function() {
      ue.save();
      expect(changed.calls).to.have.length(1);
      expect(changedContent.calls).to.have.length(1);
    });

  });

};
