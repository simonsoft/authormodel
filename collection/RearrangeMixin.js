
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
      return model.set('deleted', true);
    };

    var add = this.add.bind(this);

    var indexOf = (function(model) {
      var pos = this.indexOf(model);
      if (pos < 0) {
        throw Error('Move attempted on model not in collection, ' + model.cid);
      }
      return pos;
    }).bind(this);

    var refMove = function(model, toPosition) {
      var clone = model.clone();
      clone.unset('id');
      move.out();
      add(clone, {at: toPosition});
    };

    move.toAfter = function moveToAfter(otherModel) {
      refMove(model, indexOf(otherModel) + 1);
    };

    move.toBefore = function moveToBefore(otherModel) {
      refMove(model, indexOf(otherModel));
    };

    move.first = function moveFirst() {
      refMove(model, 0);
    };

    var size = this.size();
    var pos = indexOf(model);
    if (pos < size - 1) {
      var next = this.at(pos + 1);
      move.down = function() {
        move.toAfter(next);
      };
    }
    if (pos > 0) {
      var prev = this.at(pos - 1);
      move.up = function() {
        move.toBefore(prev);
      };
    }

    // Ensure chaining is used immediately, until the impl above is more robust to incoming changes
    setTimeout(function() {
      for (var f in move) {
        if (typeof move[f] === 'function') {
          move[f] = function gone() { throw new Error('move object must be used immediately'); };
        }
      }
    }, 1);

    return move;
  }

};
