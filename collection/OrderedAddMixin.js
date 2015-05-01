
module.exports = {

  addAfter: function addAfter(newModel, referenceModel) {
    var ix = this.indexOf(referenceModel);
    if (ix < 0) {
      throw 'Reference model not found in collection';
    }
    if (this.contains(newModel)) {
      throw 'Already a collection member';
    }
    var added = this.add(newModel, {at:ix+1});
    added.set('previous', referenceModel.id);
    return added;
  },

  addFirst: function addFirst(newModel) {
    if (this.contains(newModel)) {
      throw 'Already a collection member';
    }
    var added = this.add(newModel, {at:0});
    return added;
  }

};
