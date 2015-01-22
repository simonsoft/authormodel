
// I wanted a plain backbone object with neither Model nor View characteristics

var _ = require('underscore');
var Backbone = require('backbone');

var AuthorCollectionMonitor = function(options) {

  this.initialize.apply(this, arguments);

};

_.extend(AuthorCollectionMonitor.prototype, Backbone.Events, {

  initialize: function(options) {
    console.assert(!!options.collection);
    console.assert(!!options.logger);
    this.logger = options.logger;
    this.listenTo(options.collection, 'add', this.onAdd.bind(this));
  },

  onAdd: function(ev) {
    this.logger.log('add:', ev);
  }

});


module.exports = AuthorCollectionMonitor;
