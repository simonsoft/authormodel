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

  o.getUnitEditor = function () {
    return attributes.unitEditor;
  };

  o.setUnitEditor = function (unitEditor) {
    attributes.unitEditor = unitEditor;
  };

  o.getUnit = function() {
    return attributes.unit;
  };

  o.setUnit = function(model) {
    attributes.unit = model;
    return this;
  };

  o.getSelection = function() {
    return attributes.selection;
  };

  o.setSelection = function(selection) {
    attributes.selection = selection;
    return this;
  };

};
