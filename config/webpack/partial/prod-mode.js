"use strict";
const archetype = require("../../archetype");

module.exports = function() {
  return {
    mode: archetype.webpack.minify ? "production" : "development"
  };
};
