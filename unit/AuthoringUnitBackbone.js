
var yobo = require('./BackboneExport');

var AuthoringUnit = yobo.Model.extend({

  initialize: function(attributes, options) {
    if (typeof attributes != 'object') {
      throw new Error("AuthoringUnit must be instantiated with initial attributes");
    }

    if (attributes.hasOwnProperty('attributes')) {
      throw new Error("AuthoringUnit disallows use of an 'attributes' attribute");
    }
  }

});

module.exports = AuthoringUnit;
