
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

  describe("#deserialize", function() {

    var samplebase = './xml/test/';
    var serializer = new AuthoringCollectionSerializerXml();

    describe("sample1", function() {
      var fs = require('fs');
      var samplefile = samplebase + 'sample1-collection.xml';
      var xml = fs.readFileSync(samplefile, 'utf8');
      var c = serializer.deserialize(xml);

      expect(c.pluck('id')).to.deep.equal(['0006','a001','a002','0009','woot style: client id + generation at client']);

      expect(c.get('0006') === c.get('0006')).to.be.true();
      expect(c.get('0006').get('type')).to.equal('p');
      expect(c.get('0006').get('content')).to.equal('Text with <emph>inline</emph> <unit>provocation</unit> &gt;0.');

      expect(c.get('a001').get('type')).to.equal('figure-simple');
      expect(c.get('a001').get('href')).to.equal('x-svn://');

      expect(c.get('a002').get('deleted')).to.be.true();
      expect(c.get('a002').has('content')).to.be.true();

      expect(c.get('0009').get('class')).to.equal('itemlist');

      expect(c.at(4).get('previous')).to.equal('000c');

      expect(c.get('0006').has('previous')).to.be.false();
      expect(c.get('0006').has('class')).to.be.false();
      expect(c.get('0006').has('deleted')).to.be.false();
      expect(c.get('0006').has('href')).to.be.false();
    });

  });

});
