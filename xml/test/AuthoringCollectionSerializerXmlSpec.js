
var expect = require('chai').expect;

describe("AuthoringCollectionSerializeXml", function() {

  var authormodel = require('../../');
  var AuthoringCollection = authormodel.AuthoringCollection;
  var AuthoringUnit = authormodel.AuthoringUnit;

  var AuthoringCollectionSerializerXml = require('../AuthoringCollectionSerializerXml');

  describe("#serialize", function() {

    var ac = new AuthoringCollection();
    ac.add(new AuthoringUnit({
      id: '1',
      type: 'p',
      content: 'Text with <emph>inline</emph> &gt;0.'
    }));
    ac.add(new AuthoringUnit({
      id: '2',
      type: 'graphic',
      fileref: 'x-svn://...'
    }));
    ac.add(new AuthoringUnit({
      id: '3',
      type: 'p',
      indent: 1,
      class: 'li',
      content: 'Bullet'
    }));

    var serializer = new AuthoringCollectionSerializerXml();

    it("Returns a string", function() {
      var s = serializer.serialize(ac);
      expect(s).to.exist;
      expect(s).to.be.a('string');
    });

    it("Produces a raw xml collection", function() {
      var s = serializer.serialize(ac);
      expect(s).to.match(/<unit[\s\S]+<unit.[\s\S]+<unit/);
    });

    it("Handles inline as xml, no escaping", function() {
      var s = serializer.serialize(ac);
      expect(s).not.to.contain('&lt;emph');
      expect(s).to.contain('<content>Text with <emph>inline</emph>');
    });

    it("Preserves existing entities", function() {
      var s = serializer.serialize(ac);
      expect(s).to.contain('<content>Text with <emph>inline</emph> &gt;0.</content>');
    });

  });

  describe("#parse", function() {

    xit("Must know about types, for example to produce id as string and indent as integer");

  });

});
