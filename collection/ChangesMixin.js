
var filter = function isChanged(unit) {
  return !!unit._authormodelChanged;
};

var markChanged = function markChanged(unit) {
  unit._authormodelChanged = true;
};

var markUnchanged = function markUnchanged(unit) {
  delete unit._authormodelChanged;
};

module.exports = {

  initialize: function() {
    // These should be registered before any subset is created, which is a reasonable assumption for an initializer
    this.on('add', markChanged);
    this.on('change', markChanged);
  },

  changesSubset: function() {
    var changes = this.subset(filter);
    changes.listenTo(this, 'authormodelChangesReset', changes.refilter.bind(changes));
    return changes;
  },

  changesReset: function() {
    this.each(markUnchanged);
    this.trigger('authormodelChangesReset');
  }

};
