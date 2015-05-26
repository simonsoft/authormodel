
var _ = require('yobo')._;

var defaultKeepOptions = {
  transform: function(model) {
    throw new Error('.keep not implemented, needs access to the Model class, or do a deep clone with id reset');
  }
};

module.exports = {

  // With object mixin syntax we can't validate that OrderedAddMixin has been added, but we do depend on it

  // Backbone doesn't guard against ID conflicts, and it's easy to cause one with unit.clone()
  add: function(model) {
    if (model.id) {
      var idmatch = this.get(model.id);
      if (idmatch && idmatch !== model) {
        throw new Error('Unit "' + model.id + '" is already a collection member');
      }
    }
  },

  move: function(model) {
    console.assert(!!this.addAfter, 'Ordered collection must define addAfter function');
    console.assert(!!this.addFirst, 'Ordered collection must define addFirst function');
    var move = {};

    move.out = function moveDelete() {
      model.set('deleted', true);
    };

    var size = this.size();
    var pos = this.indexOf(model);
    if (pos < 0) {
      throw Error('Move attempted on model not in collection, ' + model.cid);
    }
    if (pos < size - 1) {
      move.down = function() {

      };
    }

    var keep = {};
    for (var op in move) {
      keep[op] = function moveKeep() {
        move[op].call(this, defaultKeepOptions);
      };
    }
    move.keep = keep;

    return move;
  }

};
