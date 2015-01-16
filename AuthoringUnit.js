
var AuthoringUnit = function(attributes, options) {

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
