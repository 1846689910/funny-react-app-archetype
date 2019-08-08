"use strict";

const archetype = require("../archetype");
const {
  enableTypeScript,
  flowRequireDirective,
  enableFlow,
  transformClassProps,
  looseClassProps,
  enableDynamicImport
} = archetype.babel;

const basePlugins = [
  ...(enableDynamicImport
    ? ["@babel/plugin-syntax-dynamic-import", "@loadable/babel-plugin"]
    : [false]),
  //
  // allow class properties. loose option compile to assignment expression instead
  // of Object.defineProperty.
  // Note: This must go before @babel/plugin-transform-classes
  //
  (enableTypeScript || transformClassProps) && [
    "@babel/plugin-proposal-class-properties",
    { loose: looseClassProps }
  ],
  [
    "babel-plugin-i18n-id-hashing",
    {
      varsContainingMessages: ["defaultMessages", "translations"]
    }
  ],
  [
    "babel-plugin-react-intl",
    {
      messagesDir: "./tmp/messages/",
      enforceDescriptions: true
    }
  ],
  "babel-plugin-lodash",
  "@babel/plugin-transform-runtime",
  enableFlow && [
    "@babel/plugin-transform-flow-strip-types",
    { requireDirective: flowRequireDirective }
  ]
];

const { BABEL_ENV, NODE_ENV } = process.env;

const enableCssModule = process.env.ENABLE_CSS_MODULE === "true";
const isProduction = (BABEL_ENV || NODE_ENV) === "production";
const isTest = (BABEL_ENV || NODE_ENV) === "test";

const plugins = basePlugins.concat(
  // test env
  isTest && ["babel-plugin-dynamic-import-node"],
  // production env
  isProduction && [
    "@babel/plugin-transform-react-constant-elements",
    [
      "babel-plugin-transform-react-remove-prop-types",
      {
        removeImport: true
      }
    ]
  ],
  // css module support
  enableCssModule && [
    [
      "babel-plugin-react-css-modules",
      {
        context: "./src",
        generateScopedName: `${isProduction ? "" : "[name]__[local]___"}[hash:base64:5]`,
        filetypes: {
          ".scss": {
            syntax: "postcss-scss",
            plugins: ["postcss-nested"]
          },
          ".styl": {
            syntax: "sugarss"
          },
          ".less": {
            syntax: "postcss-less"
          }
        }
      }
    ]
  ]
);

const targets = archetype.babel.envTargets[archetype.babel.target];
const coreJsVersion = require("core-js/package.json").version.split(".")[0];
const useBuiltIns = archetype.babel.hasMultiTargets
  ? { useBuiltIns: "entry", corejs: coreJsVersion }
  : {};

const presets = [
  //
  // webpack 4 can handle ES modules now so turn off babel module transformation
  // in production mode to allow tree shaking.
  // But keep transforming modules to commonjs when not in production mode so tests
  // can continue to stub ES modules.
  //
  [
    "@babel/preset-env",
    {
      modules: isProduction || enableDynamicImport ? "auto" : "commonjs",
      loose: true,
      targets,
      ...useBuiltIns
    }
  ],
  enableTypeScript && "@babel/preset-typescript",
  "@babel/preset-react"
];

module.exports = {
  presets: presets.filter(x => x),
  plugins: plugins.filter(x => x)
};
