'use strict';
/**
 * Unit editor mixin that does common operations in response to flag changes.
 *
 * Trigger additional render in flag changes where it does rendering.
 * Add classes to $el depending on state.
 *
 * The mixin doesn't override anything so use a mixin engine or call, from yourmethod, mixins.FlagCommon.
 *
 * An even lighter mixin would be `var FlagCommon = new FlagCommon(this)` which is delegation but granting access to the parent
 */
module.exports = function FlagCommon(o) {
  typeof o == 'undefined' && (o = this);
  var mixin = o.mixins && (o.mixins.FlagCommon = {}) || o;

  if (mixin.render !== undefined) {
    throw 'Avoiding override of render method. Define .mixins={} for delegation.';
  }

  console.assert(!!o.model);
  console.assert(!!o.$el);

  mixin.render = function() {
    if (o.model.attributes.preview) {
      o.$el.addClass('preview');
    }
    if (o.model.attributes.removed) {
      o.$el.addClass('removed');
    }
  }
};
