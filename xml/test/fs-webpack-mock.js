var known = {
  'sample-collection1.xml': require('!raw!sample-collection1.xml');
}


module.exports = {

  readFileSync: function(path) {
    console.assert(known.hasOwnProperty(path), 'fs mock does not recognize ' + path);
    return known[path];
  }

};
