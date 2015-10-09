
var _ = require('yobo')._;

module.exports = {

  addAfter: function addAfter(newModel, referenceModel, options) {
    var ix = this.indexOf(referenceModel);
    if (ix < 0) {
      throw 'Reference model not found in collection';
    }
    if (this.contains(newModel)) {
      throw 'Already a collection member';
    }
    var options = _.extend({}, options, {at:ix+1})
    var added = this.add(newModel, options);
    added.set('previous', referenceModel.id);
    return added;
  },

  addFirst: function addFirst(newModel, options) {
    if (this.contains(newModel)) {
      throw 'Already a collection member';
    }
    var options = _.extend({}, options, {at:0})
    var added = this.add(newModel, options);
    added.set('previous', false);
    return added;
  }

};
