module.exports = function () {
  var o = this;

  var attributes = {};

  o.set = function(key, value) {
    attributes[key] = value;
  };

  o.get = function(key) {
    return attributes[key];
  };

};
