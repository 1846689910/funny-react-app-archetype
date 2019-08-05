const utils = require("./utils");

function optionalRequire(path) {
  let pkg;
  try {
    pkg = require(path);
  } catch (e) {}
  return pkg;
}

function parseEnv(env, defaultValue, envType = "string") {
  let val = process.env[env];
  if (val) {
    if (envType === "boolean") {
      val = val === "true";
    } else if (envType === "number") {
      val = parseFloat(val);
    } else if (envType === "array" || envType === "json") {
      val = JSON.parse(val);
    }
  }
  return val || defaultValue;
}

module.exports = Object.assign(
  {
    optionalRequire,
    parseEnv
  },
  utils
);
