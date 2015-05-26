Authormodel is an abstraction between your average WYSI-whatever editor and your storage. It supports Structured Documentation.

### Interface specs

This module exports specs that define the contracts for declared interfaces.

To be used like
```javascript
describe("MyUnitEditor", function() {

  describe("implements UnitEditor", function() {
    require('authormodel/uniteditors/itest/UnitEditorSpec.js')(exports);
  });

  describe("implements UnitEditor, is .content compatible", function() {
    require('authormodel/uniteditors/itest/UnitEditorContentSpec.js')(exports);
  });

  describe("implements UnitEditor, actions spec", function() {
    require('authormodel/uniteditors/itest/UnitEditorActionSpec.js')(exports);
  });
```
