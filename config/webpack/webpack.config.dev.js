"use strict";
/**
 * Webpack dev configuration
 */
const baseProfile = require("./profile.base");
const { generateConfig } = require("../utils");

function makeConfig() {
  const devProfile = {
    partials: {
      "_dev-mode": { order: 10000 },
      _dev: { order: 10100 }
    }
  };
  const profiles = { ...baseProfile.partials, ...devProfile.partials };
  return generateConfig(profiles);
}

module.exports = makeConfig();
