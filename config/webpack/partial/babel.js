const Path = require("path");
const babelLoader = require.resolve("babel-loader");
const archetype = require("../../archetype");
const { AppMode } = require("../../utils");
module.exports = function(options) {
  const clientVendor = Path.join(AppMode.src.client.dir, "vendor/");
  const babelExclude = x => {
    if (x.includes("node_modules")) return true;
    if (x.includes(clientVendor)) return true;
    return false;
  };

  const test = archetype.babel.enableTypeScript ? /\.[tj]sx?$/ : /\.jsx?$/;

  const babelLoaderConfig = {
    _name: "babel",
    test,
    exclude: babelExclude,
    use: {
      loader: babelLoader,
      options: Object.assign(
        { cacheDirectory: Path.resolve(".etmp/babel-loader") },
        options && options.babel
      )
    }
  };

  return {
    module: {
      rules: [
        Object.assign(
          {},
          babelLoaderConfig,
          archetype.babel.hasMultiTargets ? archetype.babel.extendLoader : {}
        )
      ]
    }
  };
};
