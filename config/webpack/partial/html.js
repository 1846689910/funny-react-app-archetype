"use strict";

const archetype = require("../../archetype");
/**
 *  reference: https://github.com/jantimon/html-webpack-plugin
 *  根据template.html生成所需的index.html, 并且引用合适的bundle.js
 * */
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function() {
  return {
    plugins: [new HtmlWebpackPlugin(archetype.webpack.htmlWebpackPluginOptions)]
  };
};
