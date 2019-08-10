"use strict";

// const isomorphicLoader = require.resolve("isomorphic-loader"); // TODO: whether to use isomorphicLoader
const fileLoader = require.resolve("file-loader");

module.exports = function() {
  return {
    module: {
      rules: [
        {
          _name: "image",
          test: /\.(jpe?g|png|gif|svg)(\?\S*)?$/i,
          use: [
            {
              loader: fileLoader,
              options: {
                limit: 10000
              }
            },
            // isomorphicLoader
          ]
        }
      ]
    }
  };
};
