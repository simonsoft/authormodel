
var yobo = require('yobo');

var Collection = yobo.Collection.extend({

  // never shuffle authoring collection
  comparator: false,

  add: function(models, options) {
    // TODO when we get test coverage for array this is obviously going to fail
    // but then we should try to find a better way to restrict this
    if (!models.hasOwnProperty('attributes')) {
      throw "Only model instances can be added, not attribute objects";
    }
    return Collection.prototype.add.apply(this, arguments);
  }

});

Collection.mixin(yobo.mixins.subset);

Collection.mixin(require('./OrderedAddMixin'));

module.exports = Collection;
