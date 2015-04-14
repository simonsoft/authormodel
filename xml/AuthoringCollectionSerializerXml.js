
// Maybe this code should move to a downstream module so we can require('authormodel') here and don't duplicate impl selection
var AuthoringUnit = require('../unit/AuthoringUnitBackbone');
var AuthoringCollection = require('../collection/AuthoringCollectionYobo');

var AuthoringCollectionSerializerXml = module.exports = function AuthoringCollectionSerializerXml() {

};

var _ = require('../unit/BackboneExport')._;
var builder = require('xmlbuilder');

var parser = require('./parserlib');

AuthoringCollectionSerializerXml.prototype.serialize = function(authoringCollection) {

  var assert = function(test, model, message) {
    if (!test) {
      throw (message || "invalid") + ": " + model.cid + " " + JSON.stringify(model.attributes);
    }
  };

  var xml = builder.create('sed:authoring',
    {version: '1.0', encoding: 'UTF-8'});

  xml.att('xmlns:sed', 'http://www.simonsoft.se/namespace/editor');

  var unit = function(model) {
    assert(model.has('id'), model, "Serialization requires model id");
    assert(model.has('type'), model, "Serialization requires model type");
    var u = xml.ele('sed:unit', {
      'sed:id': model.get('id'),
      'sed:type': model.get('type')
    });
    for (var a in model.attributes) {
      var v = model.get(a);
      if (a === 'id' || a === 'type') {
        // already added
      } else if (a === 'content') {
        var content = u.ele('sed:content');
        content.raw(v);
      } else {
        u.att('sed:' + a, v);
      }
    }
  };

  authoringCollection.each(unit);

  return xml.end({ pretty: true, indent: '\t', newline: '\n' });
};

AuthoringCollectionSerializerXml.prototype.deserialize = function(xmlString, toCollection) {

  var c = toCollection || new AuthoringCollection();

  var ns = {
    sed: 'http://www.simonsoft.se/namespace/editor'
  };

  var attrParserDefault = function(str) { return str; };
  var attrParser = {
    deleted: function(str) { return Boolean(str); },
    preview: function(str) { return Boolean(str); }
  };

  var x = parser.parse(xmlString)
  var xc = parser.get(x, '/sed:authoring', ns);

  var contentpending = [];

  parser.each(xc, 'sed:unit', function(unit) {
    var json = {};
    parser.each(unit, '@*', function(attr) {
      var nameNoNS = attr.localName;
      var value = (attrParser[nameNoNS] || attrParserDefault)(attr.value);
      json[nameNoNS] = value;
    });
    var u = new AuthoringUnit(json);
    if (parser.query(unit, 'sed:content', ns).length === 1) {
      contentpending.push(u);
    };
    c.add(u);
  }, ns);

  var contentPattern = /<sed:content>([\s\S]*?)<\/sed:content>/gi

  var i = 0;
  var debug = xmlString.replace(contentPattern, function(match, text, x){
    var unit = contentpending[i++];
    if (!unit) {
      throw new Error('Missing unit for content: ' + text);
    }
    if (!unit.set) {
      throw new Error('Unexpected unit: ' + unit);
    }
    unit.set('content', text);
    return '<!-- extracted ' + i + ' ' + x + ' ' + text.length + '-->';
  });

  if (i !== contentpending.length) {
    console.log(debug);
    throw new Error('Content extraction failed. Found ' + i + ' of ' + contentpending.length);
  }

  return c;
};
