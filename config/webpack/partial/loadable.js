const LoadablePlugin = require("@loadable/webpack-plugin");
const archetype = require("../../archetype");
module.exports = function() {
  return {
    plugins: archetype.babel.enableDynamicImport
      ? [new LoadablePlugin({ filename: "../server/loadable-stats.json" })]
      : []
  };
};
