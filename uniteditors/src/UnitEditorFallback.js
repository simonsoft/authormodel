/**
 * Renderer-of-last-resort if content model finds no matching unit editor, for example after 'disband'.
 *
 * Normally a plain readonly render of text would be preferred over this impl.
 *
 * No events emitted; neither author* nor disband can happen.
 *
 * In a production scenario this could be an error condition,
 * clearly visible to user instead of just logging that an editor could not be found.
 */
module.exports = function UnitEditorFallback(options) {

  this.$el = options.$el;
  this.model = options.model;

  this.isEmpty = function() {
    return false;
  };

  this.focus = function() {
  };

  this.render = function() {
    var text = JSON.stringify(this.model);
    if (this.$el) {
      this.$el.text(text);
    } else {
      console.log('Fallback render', text);
    }
  };

};

require('bev').mixin(module.exports.prototype);
