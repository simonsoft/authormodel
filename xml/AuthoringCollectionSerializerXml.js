
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

  var x = parser.parse(xmlString)
  var xc = parser.get(x, '/authoring');

  parser.each(xc, 'unit', function(xrule) {
    var u = new authormodel.AuthoringUnit();
    c.add(u);
  });

  return c;
};
