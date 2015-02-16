'use strict';

describe("AuthoringRenderEngine", function() {

  var AuthoringRenderEngine = require('../collection/AuthoringRenderEngine');

  describe("implements AuthoringRenderEngine (obviously, but there are other impls)", function() {
    require('./AuthoringRenderEngineSpec')(AuthoringRenderEngine);
  });

});
