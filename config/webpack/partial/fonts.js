"use strict";

const urlLoader = require.resolve("url-loader");
const fileLoader = require.resolve("file-loader");
// const isomorphicLoader = require.resolve("isomorphic-loader"); // TODO: whether to use isomorphic-loader
const archetype = require("../../archetype");

module.exports = function() {
  return {
    module: {
      rules: [
        {
          _name: "font-woff",
          test: /\.(woff|woff2)(\?\S*)?$/i,
          use: [
            {
              loader: urlLoader,
              options: {
                limit: archetype.webpack.woffFontInlineLimit,
                mimetype: "application/font-woff"
              }
            }
            // isomorphicLoader
          ]
        },
        {
          _name: "font-file",
          test: /\.(eot|ttf)(\?\S*)?$/i,
          use: [
            fileLoader
            // isomorphicLoader
          ]
        }
      ]
    }
  };
};
