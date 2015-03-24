
var yobo = require('yobo');

// Essential that we extend first, before we modify the prototype
var Collection = yobo.Collection.extend({

  // never shuffle authoring collection
  comparator: false,

  add: function(models, options) {
    // TODO when we get test coverage for array this is obviously going to fail
    // but then we should try to find a better way to restrict this
    if (!models.hasOwnProperty('attributes')) {
      throw "Only model instances can be added, not attribute objects";
    }
    return yobo.Collection.prototype.add.apply(this, arguments);
  }

});

Collection.mixin(yobo.mixins.subset);

var orderedAdd = require('./OrderedAddMixin');
Collection.mixin(orderedAdd);

// Needed because subset isn't a real collection
var subset = Collection.prototype.subset;
var subsetWhere = Collection.prototype.subsetWhere;
var patchSubsetOrderedAdd = function(prop) {
  var fn = Collection.prototype[prop];
  Collection.prototype[prop] = function() {
    var superset = this;
    var s = fn.apply(superset, arguments);
    s.addAfter = superset.addAfter.bind(this);
    return s;
  };
};
patchSubsetOrderedAdd('subset');
patchSubsetOrderedAdd('subsetWhere');

module.exports = Collection;
