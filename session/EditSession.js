// Let this be a monster with dependencies to everywhere while we elaborate on editor UI logic
// And later possibly restrict access to dependencies like unit<-collection<-actions

var bev = require('bev');

var yobo = require('yobo');
var GenericCollection = yobo.Collection;
var AuthoringCollection = require('../collection/AuthoringCollectionDefault');

var EditSession = function() {

  var o = this;

  o.alerts = new GenericCollection();

  o.units = new AuthoringCollection();

  o.actions = new GenericCollection();

  o.assist = new GenericCollection();

  o.review = new GenericCollection();

  return o;

};

bev.mixin(EditSession.prototype);

module.exports = EditSession;
