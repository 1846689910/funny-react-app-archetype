"use strict";
const Path = require("path");
const { optionalRequire, parseEnv } = require("./utils");
const userConfig = Object.assign({}, optionalRequire(Path.resolve("archetype/config")));

const defaultOptimizeCssOptions = {
  cssProcessorOptions: {
    zindex: false
  }
};

const webpackConfigSpec = {
  devHostname: parseEnv("WEBPACK_DEV_HOST", "localhost"),
  devPort: parseEnv("WEBPACK_DEV_PORT", 2992, "number"),
  https: parseEnv("WEBPACK_DEV_HTTPS", false, "boolean"),
  cssModuleSupport: parseEnv("CSS_MODULE_SUPPORT", true, "boolean"),
  enableBabelPolyfill: parseEnv("ENABLE_BABEL_POLYFILL", false, "boolean"),
  enableHotModuleReload: parseEnv("ENABLE_HOT_MODULE_RELOAD", true, "boolean"),
  woffFontInlineLimit: parseEnv("WODD_FONT_INLINE_LIMIT", 1000, "number"),
  enableShortenCSSNames: parseEnv("ENABLE_SHORTEN_CSS_NAMES", false, "boolean"),
  optimizeCSSOptions: parseEnv("OPTIMIZE_CSS_OPTIONS", defaultOptimizeCssOptions, "json"),
  minify: parseEnv("WEBPACK_MINIFY", true, "boolean")
};

const babelConfigSpec = {
  enableTypeScript: parseEnv("ENABLE_TYPESCRIPT", false, "boolean"),
  enableDynamicImport: parseEnv("ENABLE_DYNAMIC_IMPORT", true, "boolean"),
  enableFlow: { env: "ENABLE_BABEL_FLOW", default: true },
  // require the @flow directive in source to enable FlowJS type stripping
  flowRequireDirective: parseEnv("FLOW_REQUIRE_DIRECTIVE", false, "boolean"),
  transformClassProps: { env: "BABEL_CLASS_PROPS", default: false },
  looseClassProps: parseEnv("BABEL_CLASS_PROPS_LOOSE", true, "boolean"),
  envTargets: parseEnv(
    "BABEL_ENV_TARGETS",
    {
      default: {
        ie: 8
      },
      node: process.versions.node.split(".")[0]
    },
    "json"
  ),
  target: parseEnv("ENV_TARGET", "default")
};

module.exports = {
  webpack: Object.assign(webpackConfigSpec, userConfig.webpack),
  babel: Object.assign(babelConfigSpec, userConfig.babel)
};

module.exports.babel.hasMultiTargets =
  Object.keys(module.exports.babel.envTargets)
    .sort()
    .join(",") !== "default,node";
