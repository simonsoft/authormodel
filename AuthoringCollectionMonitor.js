
// I wanted a plain backbone object with neither Model nor View characteristics

var _ = require('underscore');
var Backbone = require('backbone');

var AuthorCollectionMonitor = function(collection, console) {

  this.initialize.apply(this, arguments);

};

_.extend(AuthorCollectionMonitor.prototype, Backbone.Events, {

  initialize: function(collection, console) {
    this.console = console;
    this.listenTo(collection, 'add', this.onAdd.bind(this));
  },

  onAdd: function(ev) {
    this.console.log('add', ev);
  }

});


module.exports = AuthorCollectionMonitor;
