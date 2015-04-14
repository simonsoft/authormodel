// webpack alias so known files can be pre-loaded per folder

var known = {
  './xml/test/sample1-collection.xml': require('raw!./sample1-collection.xml'),
  './xml/test/sample2-servicebulletin.xml': require('raw!./sample2-servicebulletin.xml')
};

module.exports = {

  readFileSync: function(path) {
    console.assert(known.hasOwnProperty(path), 'fs mock does not recognize ' + path);
    return known[path];
  }

};
