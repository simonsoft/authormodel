
// Required because Backbone can't out of the box handle models coming from a different require (i.e. source file) than self
// while such difference happens easily in an npm install where each lib has its own dependencies

var backbone = require('collection-subset/node_modules/backbone');

// Only a subset of backbone because we don't want Views and other UI stuff to be loaded this way
module.exports = {
  Model: backbone.Model,
  Collection: backbone.Collection
}
