
// select impl
var AuthoringUnit = require('./unit/AuthoringUnitBackbone');
var AuthoringCollection = require('./collection/AuthoringCollectionSubset');

var AuthoringMonitor = require('./collection/AuthoringMonitor');
// deprecated name, looks like a collection impl
var AuthoringCollectionMonitor = AuthoringMonitor;

var ActionContext = require('./actioncontext/ActionContext');

module.exports = {
  AuthoringUnit: AuthoringUnit,
  AuthoringCollection: AuthoringCollection,
  AuthoringCollectionMonitor: AuthoringCollectionMonitor,
  ActionContext: ActionContext
};
