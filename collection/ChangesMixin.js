
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
    this.on('add', markChanged);
    this.on('change', markChanged);
  },

  changesSubset: function() {
    return this.subset(filter);
  },

  changesReset: function() {
    this.each(markUnchanged);
  }

};
