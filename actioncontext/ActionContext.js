module.exports = function () {

  var attributes = {};

  that.set = function(key, value) {
    attributes[key] = value;
  };

  that.get = function(key) {
    return attributes[key];
  }

};
