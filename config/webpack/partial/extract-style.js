"use strict";

const archetype = require("../../archetype");
const Path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const atImport = require("postcss-import");
const postcssPresetEnv = require("postcss-preset-env");

const autoprefixer = require("autoprefixer");
const cssLoader = require.resolve("css-loader");
const sassLoader = require.resolve("sass-loader");
const stylusLoader = require.resolve("stylus-relative-loader");
const postcssLoader = require.resolve("postcss-loader");
const lessLoader = require.resolve("less-loader");
const isDevelopment = process.env.NODE_ENV !== "production";

/*
 * cssModuleSupport: false
 *
 * - *.css => normal CSS
 * - *.styl => stylus compiled to normal CSS
 * - *.scss => SASS compiled to normal CSS
 *
 * cssModuleSupport: true
 *
 * - *.css => CSS-Modules + CSS-Next
 * - *.styl => stylus compiled to normal CSS => CSS-Modules + CSS-Next
 * - *.scss => SASS compiled to normal CSS => CSS-Modules + CSS-Next
 *
 * cssModuleSupport: undefined (default)
 *
 * - *only* *.css => cssModuleSupport sets to true
 * - *no* *.css (but *.styl or *.scss) => cssModuleSupport sets to false
 */

const cssModuleSupport = archetype.webpack.cssModuleSupport;

const rules = [];

/*
 * css Loader
 */
const cssQuery = {
  loader: cssLoader,
  options: {
    minimize: true
  }
};

/*
 * css-modules Loader
 */
const getCSSModuleOptions = () => {
  const enableShortenCSSNames = archetype.webpack.enableShortenCSSNames;
  const enableShortHash = process.env.NODE_ENV === "production" && enableShortenCSSNames;
  const localIdentName = `${enableShortHash ? "" : "[name]__[local]___"}[hash:base64:5]`;

  return {
    context: Path.resolve("src"),
    modules: true,
    localIdentName
  };
};

const cssModuleQuery = {
  loader: cssLoader,
  options: getCSSModuleOptions()
};

/*
 * postcss Loader
 *
 * Note:
 * - webpack requires an identifier (ident) in options
 * when {Function}/require is used (Complex Options).
 */
const postcssQuery = {
  loader: postcssLoader,
  options: {
    ident: "postcss",
    plugins: loader => [autoprefixer(), atImport({ root: loader.resourcePath }), postcssPresetEnv()]
  }
};

const cssRules = {
  _name: `extract-css${cssModuleSupport ? "-modules" : ""}`,
  test: /\.css$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: { hmr: isDevelopment, reload: isDevelopment, publicPath: "" }
    },
    ...(cssModuleSupport ? [cssModuleQuery, postcssQuery] : [cssQuery, postcssQuery])
  ]
};

/*
 * sass Loader
 */

const sassQuery = {
  loader: sassLoader
};

const sassRules = {
  _name: `extract${cssModuleSupport ? "-css" : ""}-scss`,
  test: /\.(scss|sass)$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: { hmr: isDevelopment, reload: isDevelopment, publicPath: "" }
    },
    ...(cssModuleSupport
      ? [cssModuleQuery, postcssQuery, sassQuery]
      : [cssQuery, postcssQuery, sassQuery])
  ]
};

/*
 * stylus Loader
 */
const stylusQuery = {
  loader: stylusLoader
};

const stylusRules = {
  _name: `extract${cssModuleSupport ? "-css" : ""}-stylus`,
  test: /\.styl$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: { hmr: isDevelopment, reload: isDevelopment, publicPath: "" }
    },
    ...(cssModuleSupport
      ? [cssModuleQuery, postcssQuery, stylusQuery]
      : [cssQuery, postcssQuery, stylusQuery])
  ]
};

/**
 * less Loader
 */
const lessQuery = {
  loader: lessLoader
};

const lessRules = {
  _name: `extract${cssModuleSupport ? "-css" : ""}-less`,
  test: /\.less$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: { hmr: isDevelopment, reload: isDevelopment, publicPath: "" }
    },
    ...(cssModuleSupport
      ? [cssModuleQuery, postcssQuery, lessQuery]
      : [cssQuery, postcssQuery, lessQuery])
  ]
};

module.exports = function() {

  rules.push(...[cssRules, sassRules, stylusRules, lessRules]);

  return {
    module: { rules },
    plugins: [
      new MiniCssExtractPlugin({
        filename: archetype.babel.hasMultiTargets ? "[name].style.css" : "[name].style.[hash].css"
      }),
      process.env.NODE_ENV === "production" &&
        new OptimizeCssAssetsPlugin(archetype.webpack.optimizeCssOptions),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        options: {
          context: Path.resolve("src")
        }
      })
    ].filter(x => !!x)
  };
};
