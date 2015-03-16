
var Backbone = require('../unit/BackboneExport');

module.exports = Backbone.Collection.extend({

  // never shuffle authoring collection
  comparator: false,

  add: function(models, options) {
    // TODO when we get test coverage for array this is obviously going to fail
    // but then we should try to find a better way to restrict this
    if (!models.hasOwnProperty('attributes')) {
      throw "Only model instances can be added, not attribute objects";
    }
    return Backbone.Collection.prototype.add.apply(this, arguments);
  }

});
