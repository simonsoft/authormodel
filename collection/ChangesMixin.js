
var filter = function isChanged(unit) {
  return !!unit._changed;
};

var markChanged = function markChanged(unit) {
  unit._changed = true;
};

var markUnchanged = function markUnchanged(unit) {
  delete unit._changed;
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
