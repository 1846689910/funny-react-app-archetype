"use strict";

// const isomorphicLoader = require.resolve("isomorphic-loader"); // TODO: whether to use isomorphicLoader
const fileLoader = require.resolve("file-loader");

module.exports = function() {
  return {
    module: {
      rules: [
        {
          _name: "image",
          test: /\.(jpe?g|png|gif|svg|ico)(\?\S*)?$/i,
          use: [
            {
              loader: fileLoader,
              options: {
                limit: 10000,
                name(file) {
                  if (file.includes("favicon.ico")) return "[name].[ext]";
                  return "[hash].[ext]";
                }
              }
            }
            // isomorphicLoader
          ]
        }
      ]
    }
  };
};
