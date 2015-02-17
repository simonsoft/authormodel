'use strict';

describe("AuthoringRenderEngine", function() {

  var AuthoringRenderEngine = require('../collection/AuthoringRenderEngine');

  xdescribe("implements AuthoringRenderEngine (obviously, but there are other impls)", function() {
    require('./AuthoringRenderEngineSpec')(AuthoringRenderEngine);
  });

});
