
module.exports = {

  addAfter: function addAfter(newModel, referenceModel) {
    var ix = this.indexOf(referenceModel);
    if (referenceModel < 0) {
      throw 'Reference model not found in collection';
    }
    if (this.contains(newModel)) {
      throw 'Already a collection member';
    }
    this.add(newModel, {at:ix});
  },

  addFirst: function addFirst(newModel) {
    if (this.contains(newModel)) {
      throw 'Already a collection member';
    }
    this.add(newModel, {at:0});
  }

};
