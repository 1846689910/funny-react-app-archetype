"use strict";

const archetype = require("../../archetype");
const logger = require("../../utils/color-logger");

module.exports = function(options) {
  const config = options && options.currentConfig || {};

  if (
    process.env.NODE_ENV === "production" &&
    config.target === undefined &&
    archetype.webpack.enableNodeSourcePlugin !== true
  ) {
    logger.info("Disabling NodeSourcePlugin for production");
    return { node: false };
  } else {
    logger.info(`Not disabling NodeSourcePlugin.  NODE_ENV: '${process.env.NODE_ENV}'`);
    return {};
  }
};
