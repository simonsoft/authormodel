
var Backbone = require('./BackboneExport');

var AuthoringUnit = Backbone.Model.extend({

  initialize: function(attributes, options) {
    if (typeof attributes != 'object') {
      throw "AuthoringUnit must be instantiated with initial attributes";
    }

    if (attributes.hasOwnProperty('attributes')) {
      throw "AuthoringUnit disallows use of an 'attributes' attribute";
    }
  }

});

module.exports = AuthoringUnit;
