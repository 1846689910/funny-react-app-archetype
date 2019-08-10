"use strict";

const baseProfile = require("./profile.base");
const { generateConfig } = require("../utils");

function makeConfig() {
  const productionProfile = {
    partials: {
      "_prod-mode": { order: 10000 },
      _uglify: { order: 10200 },
      "_sourcemaps-remote": { order: 10400 },
      _fail: { order: 10500 },
      "_simple-progress": { order: 10600 }
    }
  };
  const profiles = { ...baseProfile.partials, ...productionProfile.partials };
  return generateConfig(profiles);
}

module.exports = makeConfig();
