"use strict";
const Path = require("path");
const { optionalRequire, parseEnv, AppMode } = require("./utils");
const userConfig = Object.assign({}, optionalRequire(Path.resolve("archetype/config")));

const defaultOptimizeCssOptions = {
  cssProcessorOptions: {
    zindex: false
  }
};

const defaultHtmlWebpackPluginOptions = {
  title: "funny-in-dev",
  template: "./template/template.html",
  filename: "index.html"
};

const optionsSpec = {};

const webpackConfigSpec = {
  devHostname: parseEnv("WEBPACK_DEV_HOST", "localhost"),
  devPort: parseEnv("WEBPACK_DEV_PORT", 3000, "number"),
  cdnProtocol: parseEnv("WEBPACK_DEV_CDN_PROTOCOL", null),
  cdnHostname: parseEnv("WEBPACK_DEV_CDN_HOST", null),
  cdnPort: parseEnv("WEBPACK_DEV_CDN_PORT", 0, "number"),
  https: parseEnv("WEBPACK_DEV_HTTPS", false, "boolean"),
  cssModuleSupport: parseEnv("CSS_MODULE_SUPPORT", true, "boolean"),
  enableBabelPolyfill: parseEnv("ENABLE_BABEL_POLYFILL", false, "boolean"),
  enableHotModuleReload: parseEnv("ENABLE_HOT_MODULE_RELOAD", true, "boolean"),
  enableNodeSourcePlugin: parseEnv("ENABLE_NODESOURCE_PLUGIN", false, "boolean"),
  woffFontInlineLimit: parseEnv("WODD_FONT_INLINE_LIMIT", 1000, "number"),
  enableShortenCSSNames: parseEnv("ENABLE_SHORTEN_CSS_NAMES", false, "boolean"),
  enableWarningsOverlay: parseEnv("WEBPACK_DEV_WARNINGS_OVERLAY", true, "boolean"),
  optimizeCSSOptions: parseEnv("OPTIMIZE_CSS_OPTIONS", defaultOptimizeCssOptions, "json"),
  htmlWebpackPluginOptions: parseEnv(
    "HTML_WEBPACK_PLUGIN_OPTIONS",
    defaultHtmlWebpackPluginOptions,
    "json"
  ),
  preserveSymlinks: parseEnv("WEBPACK_PRESERVE_SYMLINKS", false, "boolean"),
  minify: parseEnv("WEBPACK_MINIFY", true, "boolean")
};

const babelConfigSpec = {
  enableTypeScript: parseEnv("ENABLE_TYPESCRIPT", false, "boolean"),
  enableDynamicImport: parseEnv("ENABLE_DYNAMIC_IMPORT", true, "boolean"),
  enableFlow: { env: "ENABLE_BABEL_FLOW", default: true },
  // require the @flow directive in source to enable FlowJS type stripping
  flowRequireDirective: parseEnv("FLOW_REQUIRE_DIRECTIVE", false, "boolean"),
  proposalDecorators: parseEnv("BABEL_PROPOSAL_DECORATORS", false, "boolean"),
  legacyDecorators: parseEnv("BABEL_LEGACY_DECORATORS", true, "boolean"),
  transformClassProps: parseEnv("BABEL_CLASS_PROPS", false, "boolean"),
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
  babel: Object.assign(babelConfigSpec, userConfig.babel),
  options: Object.assign(optionsSpec, userConfig.options),
  AppMode,
  dir: Path.dirname(__dirname)
};

module.exports.babel.hasMultiTargets =
  Object.keys(module.exports.babel.envTargets)
    .sort()
    .join(",") !== "default,node";
