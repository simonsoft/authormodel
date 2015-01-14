
var AuthoringUnit = function(attributes, options) {

  this.attributes = attributes;

};

// NPM and plain javascript tag compatibility
if (typeof module != 'undefined') {
  module.exports = AuthoringUnit;
} else {
  window.AuthoringUnit = AuthoringUnit;
}
