"use strict";

const archetype = require("../../archetype");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function() {
  return {
    plugins: [new HtmlWebpackPlugin(archetype.webpack.htmlWebpackPluginOptions)]
  };
};
