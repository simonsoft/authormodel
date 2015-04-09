// webpack alias so known files can be pre-loaded per folder

var known = {
  './xml/test/sample1-collection.xml': require('raw!./sample1-collection.xml')
};

module.exports = {

  readFileSync: function(path) {
    console.assert(known.hasOwnProperty(path), 'fs mock does not recognize ' + path);
    return known[path];
  }

};
