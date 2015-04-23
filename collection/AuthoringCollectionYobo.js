
var yobo = require('yobo');

// Essential that we extend first, before we modify the prototype
var Collection = yobo.Collection.extend({

  model: undefined,

  // never shuffle authoring collection
  comparator: false,

  add: function(models, options) {
    if (yobo._.isArray(models)) {
      yobo._.each(models, this.validateAuthoringUnitAdd.bind(this));
    } else {
      this.validateAuthoringUnitAdd(models);
    }

    return yobo.Collection.prototype.add.apply(this, arguments);
  },

  validateAuthoringUnitAdd: function(model) {
    if (!this.model) {
      if (!model.hasOwnProperty('attributes')) {
        throw new Error("Only model instances can be added, not attribute objects");
      }
    }
  }

});

Collection.mixin(yobo.mixins.subset);

var orderedAdd = require('./OrderedAddMixin');
Collection.mixin(orderedAdd);

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
      console.assert(!!immerse, 'Need subset to suppoert immerse-only fn for composition with addAfter');
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
