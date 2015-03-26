
// select impl
var AuthoringUnit = require('./unit/AuthoringUnitBackbone');
var AuthoringCollection = require('./collection/AuthoringCollectionYobo');

var AuthoringMonitor = require('./collection/AuthoringMonitor');
// deprecated name, looks like a collection impl
var AuthoringCollectionMonitor = AuthoringMonitor;

var ActionContext = require('./actioncontext/ActionContext');

var yobo = require('./unit/BackboneExport');

module.exports = {
  AuthoringUnit: AuthoringUnit,
  AuthoringCollection: AuthoringCollection,
  AuthoringCollectionMonitor: AuthoringCollectionMonitor,
  ActionContext: ActionContext,

  serializers: {
    sedXml: require('./xml/AuthoringCollectionSerializerXml')
  },

  // Reuse the same libs downstream, mainly to avoid duplication in Webpack bundles
  // Also important to avoid Backbone's wrapping of models, but quite irrelevant because AuthoringUnit is already subclassing the expected Model
  Backbone: yobo.Backbone,
  _: yobo._
};
