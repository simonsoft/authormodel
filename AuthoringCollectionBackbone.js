
var Backbone = require('backbone');
var AuthoringUnit = require('./AuthoringUnitBackbone');

module.exports = Backbone.Collection.extend({
  model: AuthoringUnit
});
