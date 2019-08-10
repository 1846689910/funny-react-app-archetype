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

function getAppMode() {
  const root = Path.resolve();
  return {
    dir: root,
    src: {
      dir: Path.join(root, "src"),
      client: {
        dir: Path.join(root, "src/client")
      },
      server: {
        dir: Path.join(root, "src/server")
      }
    },
    lib: {
      dir: Path.join(root, "lib"),
      client: {
        dir: Path.join(root, "lib/client")
      },
      server: {
        dir: Path.join(root, "lib/server")
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

function ejectWebpackConfig(writePath){
  const webpackConfig = require("../webpack/webpack.config");
  const config = Object.entries(webpackConfig).reduce((conf, [k, v]) => {
    if (k === "module") {
      v.rules = v.rules.map(x => {
        x.test = x.test.toString();
        return x;
      });
    } else if (k === "plugins") {
      v = v.map(x => {
        if (x.test) x.test = x.test.toString();
        if (x.options && x.options.test) x.options.test = x.options.test.toString();
        return x;
      });
    }
    conf[k] = v;
    return conf;
  }, {});
  const content = `module.exports = ${JSON.stringify(config, null, 2)};`;
  Fs.writeFileSync(writePath, content);
}

module.exports = Object.assign(
  {
    optionalRequire,
    parseEnv,
    ejectBabelRcClient,
    ejectBabelRcServer,
    ejectWebpackConfig,
    AppMode: getAppMode()
  },
  utils
);
