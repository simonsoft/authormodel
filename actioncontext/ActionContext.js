module.exports = function(o) {
  // work as both constructor and mixin
  o || (o = this);
  // use private state unless mixin to object that declares public state
  var attributes = o.attributes || {};

  o.set = function(key, value) {
    attributes[key] = value;
  };

  o.get = function(key) {
    return attributes[key];
  };

};
