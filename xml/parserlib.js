
// Originally written for Checksheets

// Parser should be client side compatible and xml.js is

var XML = require('xmldom-xpath-wrapper');

XML.get = XML.get || function(context, xpath, ns) {
  var all = XML.query(context, xpath, ns);
  console.assert(all.length === 1, 'Expected a single result but got', all.length, 'from', xpath, 'in', context.nodeName);
  return all[0];
};

XML.dataOrDefault = XML.dataOrDefault || function(context, xpath, dflt, ns) {
  var all = XML.query(context, xpath);
  console.assert(all.length < 2, 'Expected zero or one result but got', all.length, 'from', xpath, 'in', context.nodeName);
  if (all.length === 0) {
    return dflt;
  }
  var x = all[0];
  return x.value || x.data || dflt;
};

XML.data = XML.data || function(context, xpath, ns) {
  var all = XML.query(context, xpath, ns);
  if (all.length === 0) {
    // This sets the validation idea aside (used to delegate to .get) but it turns out that empty elements don't match text()
    // So how would we distinguish between nonexistent and empty?
    // TODO ideally return empty string on empty elements but fail with the assert below if the element doesn't exist at all
    if (/text\(\)$/.test(xpath)) {
      return '';
    }
  }
  console.assert(all.length === 1, 'Expected a single result but got', all.length, 'from', xpath, 'in', context.nodeName);
  var x = all[0];
  return x.value || x.data ||
    console.assert(false, 'No value or data in result from', xpath, 'in', context.nodeName);
};

XML.each = XML.each || function(context, xpath, iterator, ns) {
  var all = XML.query(context, xpath, ns);
  for (var i = 0; i < all.length; i++) {
    iterator(all[i]);
  }
  return all.length;
};

module.exports = XML;
