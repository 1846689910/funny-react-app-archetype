"use strict";

module.exports = function() {
  /**
   * to overwrite:
   * const { splitChunks } = require("funny-react-app-archetype/config/webpack/partial/split-chunks.js")().optimization;
   * const config = require("funny-react-app-archetype/config/webpack/webpack.config");
   * config.optimization.splitChunks = Object.assign({}, splitChunks, {...});
   * 
   */
  return {
    optimization: {
      splitChunks: {
        name: process.env.NODE_ENV !== "production", //  set splitChunks.name to false for production builds so that it doesn't change names unnecessarily
        chunks: "all", // split code in app and node_modules into bundle and vendor.bundle.js
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          // keep splitting the node_module chunks
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `npm.${packageName.replace("@", "")}`;
            }
          },
          // includes all code shared between entry points
          commons: {
            name: "commons",
            chunks: "initial",
            minChunks: 2
          }
        }
      }
    }
  };
};
