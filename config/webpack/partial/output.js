"use strict";

const Path = require("path");
const archetype = require("../../archetype");

const inspectpack = process.env.INSPECTPACK_DEBUG === "true";

const getOutputFilename = () =>
  archetype.babel.hasMultiTargets ? `${archetype.babel.target}.[name].bundle.js` : "[name].bundle.[hash].js";

const getOutputPath = () => {
  if (process.env.WEBPACK_DEV === "true") {
    return "/"; // simulate the behavior of webpack-dev-server, which sets output path to /
  } else {
    return Path.resolve(archetype.babel.target !== "default" ? `dist-${archetype.babel.target}` : "dist", "js");
  }
};

module.exports = {
  output: {
    path: getOutputPath(),
    pathinfo: inspectpack, // Enable path information for inspectpack
    publicPath: "/js/",
    chunkFilename: archetype.babel.hasMultiTargets ? `${archetype.babel.target}.[hash].[name].js` : "[hash].[name].js",
    filename: getOutputFilename()
  }
};
