
var expect = require('chai').expect;

var mocks = require('simple-mock');

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
      type: 'figure-simple',
      href: 'x-svn://...'
    }));
    ac.add(new AuthoringUnit({
      id: '3',
      type: 'p',
      class: 'itemlist',
      content: 'Bullet'
    }));

    var serializer = new AuthoringCollectionSerializerXml();

    it("Returns a string", function() {
      var s = serializer.serialize(ac);
      expect(s).to.exist;
      expect(s).to.be.a('string');
    });

    it("Is XML UTF-8", function() {
      var s = serializer.serialize(ac);
      expect(s).to.match(/^<\?xml version="1.0" encoding="UTF-8"\?>/);
    });

    it("Declares namespace", function() {
      var s = serializer.serialize(ac);
      expect(s).to.contain('xmlns:sed="http://www.simonsoft.se/namespace/editor"');
    });

    it("Root element is namespaced", function() {
      var s = serializer.serialize(ac);
      expect(s).to.contain('<sed:authoring');
    });

    it("Produces a raw xml collection", function() {
      var s = serializer.serialize(ac);
      expect(s).to.match(/<sed:unit[\s\S]+<sed:unit.[\s\S]+<sed:unit/);
    });

    it("Handles inline as xml, no escaping", function() {
      var s = serializer.serialize(ac);
      expect(s).not.to.contain('&lt;emph');
      expect(s).to.contain('<sed:content>Text with <emph>inline</emph>');
    });

    it("Preserves existing entities", function() {
      var s = serializer.serialize(ac);
      expect(s).to.contain('<sed:content>Text with <emph>inline</emph> &gt;0.</sed:content>');
    });

  });

  describe("#deserialize", function() {

    var samplebase = './xml/test/';
    var serializer = new AuthoringCollectionSerializerXml();

    it("Parses sample1", function() {
      var fs = require('fs');
      var samplefile = samplebase + 'sample1-collection.xml';
      var xml = fs.readFileSync(samplefile, 'utf8');
      var c = serializer.deserialize(xml);

      expect(c.pluck('id')).to.deep.equal(['0006','a001','a002','0009','woot style: client id + generation at client']);

      expect(c.get('0006') === c.get('0006')).to.be.true;//();
      expect(c.get('0006').get('type')).to.equal('p');
      expect(c.get('0006').get('content')).to.equal('Text with <emph>inline</emph> <unit>provocation</unit> &gt;0.');

      expect(c.get('a001').get('type')).to.equal('figure-simple');
      expect(c.get('a001').get('href')).to.equal('x-svn://...');

      expect(c.get('a002').get('deleted')).to.be.true;//();
      expect(c.get('a002').has('content')).to.be.true;//();

      expect(c.get('0009').get('class')).to.equal('itemlist');

      expect(c.at(4).get('previous')).to.equal('000c');

      expect(c.get('0006').has('previous')).to.be.false;//();
      expect(c.get('0006').has('class')).to.be.false;//();
      expect(c.get('0006').has('deleted')).to.be.false;//();
      expect(c.get('0006').has('href')).to.be.false;//();
    });

    it("Can deserialize to existing collection", function() {

      var c = new AuthoringCollection();
      c.add(new AuthoringUnit({id:'A', type:'p'}));
      var xml = serializer.serialize(c);

      var c2 = new AuthoringCollection();
      var returned = serializer.deserialize(xml, c2);
      expect(returned).to.equal(c2);
      expect(c2.size()).to.equal(1);

    });

    it("Parses sample2", function() {
      var fs = require('fs');
      var samplefile = samplebase + 'sample2-servicebulletin.xml';
      var xml = fs.readFileSync(samplefile, 'utf8');
      var c = serializer.deserialize(xml);

      expect(c.at(0).get('id')).to.equal('4v7jy6f173f0001');
      expect(c.at(22).get('id')).to.equal('4v7jy6f173f000x');
    });

    xit("Ideally maintains subsets based on start and end meta units");

    xit("OR introduces section attributes that can be used with current subsetWhere feature", function() {
    });

    it("OR just leaves this to mvc for now", function() {
      var fs = require('fs');
      var samplefile = samplebase + 'sample2-servicebulletin.xml';
      var xml = fs.readFileSync(samplefile, 'utf8');
      var c = serializer.deserialize(xml);

      var title1 = c.at(0);
      expect(title1.get('id')).to.equal('4v7jy6f173f0001');
      expect(title1.get('type')).to.equal('title');
      expect(title1.get('content')).to.equal('Service Bulletin');

      var titleSection1 = c.get('4v7jy6f173f0005');
      expect(titleSection1.get('type')).to.equal('title');
      expect(titleSection1.get('content')).to.equal('Background');
    });

  });

  describe("#deserialize to existing collection", function() {

    var samplebase = './xml/test/';
    var serializer = new AuthoringCollectionSerializerXml();

    var collection = new AuthoringCollection();
    var added = [];
    var onAdd = mocks.spy(function(model) {
      added.push(model.toJSON()); // clone attributes so we can assert later
    });
    var onChange = mocks.spy();
    collection.on('add', onAdd);
    collection.on('change', onChange);

    it("Takes an optional second argument, the collection to deserialize to", function() {
      var fs = require('fs');
      var samplefile = samplebase + 'sample2-servicebulletin.xml';
      var xml = fs.readFileSync(samplefile, 'utf8');

      serializer.deserialize(xml, collection);
    });

    it("Produces add events", function() {
      expect(onAdd.calls).to.have.length(24);
    });

    it("Does so in order of xml appearance", function() {
      expect(added[0].id).to.equal('4v7jy6f173f0001');
      expect(added[1].id).to.equal('4v7jy6f173f0002');
      // meta units omitted
      expect(added[2].id).to.equal('4v7jy6f173f0005');
      expect(added[3].id).to.equal('4v7jy6f173f0006');
    });

    it("Does so when units are complete", function() {
      expect(added[0].type).to.equal('title');
      expect(added[0].content).to.equal('Service Bulletin');
    });

    it("Produces no change events during loading", function() {
      expect(onChange.calls).to.have.length(0);
    });

  });

  describe("Modification examples", function() {

    var samplebase = './xml/test/';
    var serializer = new AuthoringCollectionSerializerXml();

    it("Could be changes to existing units", function() {
      var fs = require('fs');
      var samplefile = samplebase + 'sample2-servicebulletin.xml';
      var xml = fs.readFileSync(samplefile, 'utf8');
      var c = serializer.deserialize(xml);

      c.get('4v7jy6f173f0009').set('content', 'Model 782.');
      c.get('4v7jy6f173f000k').set('content', 'Disconnect charger from mains supply.');

      var xml = serializer.serialize(c);
      //console.log('xml:', xml);
    });

    it("Could be additions after existing units", function() {
      var fs = require('fs');
      var samplefile = samplebase + 'sample2-servicebulletin.xml';
      var xml = fs.readFileSync(samplefile, 'utf8');
      var c = serializer.deserialize(xml);

      var unit = new AuthoringUnit({
        type: 'p',
        content: 'Model 783.'
      });
      unit.set('id', Date.now() + 'xyz' + '01'); // Currently missing id generator in authormodel

      c.addAfter(unit, c.get('4v7jy6f173f0009'));

      var xml = serializer.serialize(c);
      //console.log('xml:', xml);
    });

    it("Could be additions after additions", function() {
      var fs = require('fs');
      var samplefile = samplebase + 'sample2-servicebulletin.xml';
      var xml = fs.readFileSync(samplefile, 'utf8');
      var c = serializer.deserialize(xml);

      var unit1 = new AuthoringUnit({
        type: 'p',
        content: 'Model 783.'
      });
      unit1.set('id', Date.now() + 'xyz' + '01'); // Currently missing id generator in authormodel
      var unit2 = new AuthoringUnit({
        type: 'p',
        content: 'Model 786.'
      });
      unit2.set('id', Date.now() + 'xyz' + '02'); // Currently missing id generator in authormodel

      c.addAfter(unit1, c.get('4v7jy6f173f0009'));
      c.addAfter(unit2, unit1);

      var xml = serializer.serialize(c);
      //console.log('xml:', xml);
    });

    xit("Could be deletions, but units are kept marked as such", function() {

    });

    it("Could be combinations", function() {
      var fs = require('fs');
      var samplefile = samplebase + 'sample2-servicebulletin.xml';
      var xml = fs.readFileSync(samplefile, 'utf8');
      var c = serializer.deserialize(xml);

      expect(c.get('4v7jy6f173f0007').get('content')).to.match(/^The lithium-ion/);
      c.get('4v7jy6f173f0007').set('content', 'Overheated batteries have caused downtime.');

      expect(c.get('4v7jy6f173f000y').get('content')).to.match(/^Connect/);
      c.get('4v7jy6f173f000y').set('content', 'Ensure full charge before first use.');

      var unit1 = new AuthoringUnit({
        type: 'p',
        content: 'Model 783.'
      });
      unit1.set('id', Date.now() + 'xyz' + '01'); // Currently missing id generator in authormodel
      var unit2 = new AuthoringUnit({
        type: 'p',
        content: 'Model 786.'
      });
      unit2.set('id', Date.now() + 'xyz' + '02'); // Currently missing id generator in authormodel

      expect(c.get('4v7jy6f173f000a').get('content')).to.equal('Model 781.');
      c.addAfter(unit1, c.get('4v7jy6f173f000a'));
      c.addAfter(unit2, unit1);

      var xml = serializer.serialize(c);
      //console.log('xml:\n', xml);
    });

  });

});
