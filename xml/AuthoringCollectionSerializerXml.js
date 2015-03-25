
var authormodel = require('../');

var AuthoringCollectionSerializerXml = module.exports = function AuthoringCollectionSerializerXml() {

};

var _ = require('underscore');
var builder = require('xmlbuilder');

var parser = require('./parserlib');

AuthoringCollectionSerializerXml.prototype.serialize = function(authoringCollection) {

  var assert = function(test, model, message) {
    if (!test) {
      throw (message || "invalid") + ": " + model.cid + " " + JSON.stringify(model.attributes);
    }
  };

  var attr = function(unitXml, key, value) {
    if (key == 'id' || key == 'type') {
      return;
    }
    var a = unitXml.ele(key);
    if (key == 'content') {
      a.raw(value);
    } else {
      a.text(value);
    }
  };

  var xml = builder.create('authoring');

  var unit = function(model) {
    assert(model.has('id'), model, "Serialization requires model id");
    assert(model.has('type'), model, "Serialization requires model type");
    var u = xml.ele('unit', {
      'id': model.get('id'),
      'type': model.get('type')
    });
    for (var a in model.attributes) {
      attr(u, a, model.get(a));
    }
  };

  authoringCollection.each(unit);

  return xml.end({ pretty: true, indent: '\t', newline: '\n' });
};

AuthoringCollectionSerializerXml.prototype.deserialize = function(xmlString) {

  var c = new authormodel.AuthoringCollection();

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
    var u = new authormodel.AuthoringUnit(json);
    if (parser.query(unit, 'sed:content', ns).length === 1) {
      contentpending.push(u);
    };
    c.add(u);
  }, ns);

  console.log('content pending', _.pluck(contentpending, 'id'));

  var contentPattern = /<sed:content>(.*)<\/sed:content>/gi

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
    throw 'Content extraction failed. Found ' + i + ' of ' + contentpending.length;
  }

  return c;
};
