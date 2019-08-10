"use strict";

const archetype = require("../../archetype");

module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".json"].concat(archetype.babel.enableTypeScript && [".ts", ".tsx"]).filter(x => x)
  }
};
