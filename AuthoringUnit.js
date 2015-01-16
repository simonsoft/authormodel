
var AuthoringUnit = function(attributes, options) {

  if (typeof attributes != 'object') {
    throw "AuthoringUnit must be instantiated with initial attributes";
  }

  if (attributes.hasOwnProperty('attributes')) {
    throw "AuthoringUnit disallows use of an 'attributes' attribute";
  }

  var that = this;

  that.attributes = attributes;

  that.set = function(key, value) {
    that.attributes[key] = value;
  };

  that.get = function(key) {
    return that.attributes[key];
  }

};

// NPM and plain javascript tag compatibility
if (typeof module != 'undefined') {
  module.exports = AuthoringUnit;
} else {
  window.AuthoringUnit = AuthoringUnit;
}
