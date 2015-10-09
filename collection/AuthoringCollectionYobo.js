
var yobo = require('yobo');

var CollectionModelUndefined = function() {
  throw new Error('The collection has no model option so added items must be models, not attribute objects');
};

// Essential that we extend first, before we modify the prototype
var Collection = yobo.Collection.extend({

  model: CollectionModelUndefined,

  // never shuffle authoring collection
  comparator: false

});

Collection.mixin(yobo.mixins.subset);

var orderedAdd = require('./OrderedAddMixin');
Collection.mixin(orderedAdd);

var changeTracking = require('./ChangesMixin');
Collection.mixin(changeTracking);

var rearrangeMixin = require('./RearrangeMixin');
Collection.mixin(rearrangeMixin);

// Needed because subset isn't a real collection
var subset = Collection.prototype.subset;
var subsetWhere = Collection.prototype.subsetWhere;
var patchSubsetOrderedAdd = function(subsetFnProp) {
  var subsetFn = Collection.prototype[subsetFnProp];
  // We could probably do this a lot smarter by using a proxy as context to subset add, but the force wasn't strong with me now
  Collection.prototype[subsetFnProp] = function() {
    var superset = this;
    var subset = subsetFn.apply(superset, arguments);
    subset.immerse = subset.immerse || function(model) { // yobo should define this
      var immerse = this._subset_immerse;
      console.assert(!!immerse, 'Need subset to support immerse-only fn for composition with addAfter');
      immerse(model);
    };
    subset.addAfter = function() {
      this.immerse(arguments[0]);
      return superset.addAfter.apply(superset, arguments);
    };
    subset.addFirst = function() {
      this.immerse(arguments[0]);
      return superset.addFirst.apply(superset, arguments);
    };
    return subset;
  };
};
patchSubsetOrderedAdd('subset');
patchSubsetOrderedAdd('subsetWhere');

module.exports = Collection;
