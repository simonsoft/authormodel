
var expect = require('chai').expect;

describe("FlagCommon", function() {

  var FlagCommon = require('../src/FlagCommon');

  /* deprecated OO tests
  describe("constructor", function() {

    it("Can be initialized as a plain object", function() {
      var flagCommon = new FlagCommon(); // unuseful, triggers dependency assert errors
    });

  });

  describe("mixin", function() {

    it("Can be initialized without `new` given an object", function() {
      var obj = {};
      FlagCommon(obj);
      expect(obj.render).to.be.a('function');
    });

    it("Can be initialized with `new` given an object", function() {
      var obj = {};
      new FlagCommon(obj);
      expect(obj.render).to.be.a('function');
    });

  });

  describe("namespaced mixin", function() {

    it("Avoids overriding behavior", function() {
      var obj = {render: function() {}};
      expect(function() {
        FlagCommon(obj);
      }).to.throw();
      expect(function() {
        new FlagCommon(obj);
      }).to.throw();
    });

    it("Is therefore more like delegation", function() {
      var obj = {mixins: {}};
      new FlagCommon(obj);
      expect(obj.mixins.FlagCommon).to.exist();
      expect(obj.mixins.FlagCommon.render).to.be.a('function');
    });

    it("Can however listen to and emit events on behalf of the object itself", function() {

    });

  });
  */

  describe("#render", function() {

    it("Avoids overriding", function() {
      var obj = {render: function() {}};
      expect(function() {
        new FlagCommon(obj)
      }).to.throw();
    });

    it("Adds the 'preview' class if there is such a flag", function() {
      var classes = [];
      var obj = {
        model: {attributes: {preview: true}},
        mixins: {},
        $el: {
          addClass: function(name) { // ES6 syntax would definitely be nicer here
            classes.push(name);
          }
        },
        render: function() {
          obj.mixins.FlagCommon.render();
        }
      };
      FlagCommon(obj);
      expect(classes).to.have.length(0);
      obj.render();
      expect(classes).to.have.length(1);
    });

    it("Adds the 'removed' class if there is such a flag", function() {
      var classes = [];
      var obj = {
        model: {attributes: {removed: true}},
        mixins: {},
        $el: {
          addClass: function(name) { // ES6 syntax would definitely be nicer here
            classes.push(name);
          }
        },
        render: function() {
          obj.mixins.FlagCommon.render();
        }
      };
      FlagCommon(obj);
      expect(classes).to.have.length(0);
      obj.render();
      expect(classes).to.have.length(1);
    });

    xit("Unsets the contenteditable if there is such an attribute", function() {
    });

  });

  describe("Reaction to model change", function() {

    // Or do we already render on all changes? How about changes triggered by a save()?
    it("Calls render on preview attribute change", function() {

    });

  });

});
