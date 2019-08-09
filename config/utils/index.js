const utils = require("./utils");
const Fs = require("fs");
const Path = require("path");

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

const getExistingPath = p => Fs.existsSync(p) && p;

function getAppMode() {
  const root = Path.resolve();
  return {
    dir: root,
    src: {
      dir: getExistingPath(Path.join(root, "src")),
      client: {
        dir: getExistingPath(Path.join(root, "src/client"))
      },
      server: {
        dir: getExistingPath(Path.join(root, "src/server"))
      }
    },
    lib: {
      dir: getExistingPath(Path.join(root, "lib")),
      client: {
        dir: getExistingPath(Path.join(root, "lib/client"))
      },
      server: {
        dir: getExistingPath(Path.join(root, "lib/server"))
      }
    }
  };
}

function ejectBabelRcClient(writePath) {
  const babelRc = require("../babel/babelrc-client");
  const content = `module.exports = ${JSON.stringify(babelRc, null, 2)};`;
  Fs.writeFileSync(writePath, content);
}

function ejectBabelRcServer(writePath) {
  const babelRc = require("../babel/babelrc-server");
  const content = `module.exports = ${JSON.stringify(babelRc, null, 2)};`;
  Fs.writeFileSync(writePath, content);
}

module.exports = Object.assign(
  {
    optionalRequire,
    parseEnv,
    ejectBabelRcClient,
    ejectBabelRcServer,
    AppMode: getAppMode()
  },
  utils
);
