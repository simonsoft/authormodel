
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

    var at = this.at.bind(this);
    var add = this.add.bind(this);
    var opid = this.opid ? this.opid.bind(this) : function() {};
    var del = function(delmodel, options) {
      return delmodel.set('deleted', true, options);
    };

    move.out = function moveDelete(options) {
      return del(model, _.extend({modelDelete:true}, options));
    };

    var indexOf = (function(model) {
      var pos = this.indexOf(model);
      if (pos < 0) {
        throw Error('Move attempted on model not in collection, ' + model.cid);
      }
      return pos;
    }).bind(this);

    var refMove = function(refmodel, toPosition, options, previous) {
      var clone = refmodel.clone();
      clone.unset('id');
      opid(clone);
      if (typeof previous !== 'undefined') {
        clone.set('previous', previous);
      }
      del(refmodel, _.extend({modelMove:true}, options));
      add(clone, _.extend({at:toPosition, modelMove:true}, options));
    };

    move.toAfter = function moveToAfter(otherModel, options) {
      refMove(model, indexOf(otherModel) + 1, options, otherModel.get('id'));
    };

    move.toBefore = function moveToBefore(otherModel, options) {
      var to = indexOf(otherModel);
      refMove(model, to, options, !to ? false : at(to - 1).get('id'));
    };

    move.first = function moveFirst(options) {
      refMove(model, 0, undefined, false);
    };

    var size = this.size();
    var pos = indexOf(model);
    if (pos < size - 1) {
      var next = this.at(pos + 1);
      move.down = function(options) {
        move.toAfter(next, options);
      };
    }
    if (pos > 0) {
      var prev = this.at(pos - 1);
      move.up = function(options) {
        move.toBefore(prev, options);
      };
    }

    // Ensure chaining is used immediately, until the impl above is more robust to incoming changes
    var gone = function gone() { throw new Error('move object must be used immediately'); };
    setTimeout(function() {
      for (var f in move) {
        if (typeof move[f] === 'function') {
          move[f] = gone;
        }
      }
    }, 1);

    return move;
  }

};
