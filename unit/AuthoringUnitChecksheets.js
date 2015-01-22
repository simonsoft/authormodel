
// This impl doesn work in unit tests because it is bundled with code that require jQuery etc

var CheckDetails = require('../authoreditor/com.yolean.checksheets/CheckDetails');

var AuthoringUnit = CheckDetails.Model;

// NPM and plain javascript tag compatibility
if (typeof module != 'undefined') {
  module.exports = AuthoringUnit;
} else {
  window.AuthoringUnit = AuthoringUnit;
}
