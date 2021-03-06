"use strict"; // eslint-disable-line

const Url = require("url");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const archetype = require("../../archetype");

const HTTP_PORT = 80;

const devProtocol = archetype.webpack.https ? "https://" : "http://";

module.exports = function() {
  const devServerConfig = {
    historyApiFallback: {
      rewrites: [ // TODO: could setup api rewrites here. 
        { from: /^\/.*$/, to: "/js/index.html" } // after `publicPath` set to /js/, the index page, needs to be retrieved under /
      ]
    },
    hot: archetype.webpack.enableHotModuleReload,
    overlay: {
      errors: true,
      warnings: archetype.webpack.enableWarningsOverlay
    },
    https: Boolean(archetype.webpack.https),
    port: archetype.webpack.devPort
  };

  if (process.env.WEBPACK_DEV_HOST || process.env.WEBPACK_HOST) {
    devServerConfig.public = `${archetype.webpack.devHostname}:${archetype.webpack.devPort}`;
    devServerConfig.headers = {
      "Access-Control-Allow-Origin": `${devProtocol}${archetype.webpack.devHostname}:${
        archetype.webpack.devPort
      }`
    };
  } else {
    devServerConfig.disableHostCheck = true;
    devServerConfig.headers = {
      "Access-Control-Allow-Origin": "*"
    };
  }

  //
  // The publicPath here is for mapping assets that are collected
  // during webpack compile through the isomorphic-loader plugin.
  // Elsewhere in electrode-react-webapp, it detects webpack dev
  // mode and construct the CSS/JS bundle URLs separately.
  //
  /* eslint-disable no-else-return */
  const makePublicPath = () => {
    // is any of the webpack.cdn* options defined
    const { cdnProtocol, cdnHostname, cdnPort } = archetype.webpack;
    if (cdnProtocol !== null || cdnHostname !== null || cdnPort !== 0) {
      return Url.format({
        protocol: cdnProtocol || "http",
        hostname: cdnHostname || "localhost",
        port: cdnPort !== HTTP_PORT ? cdnPort : "",
        pathname: "/js/"
      });
    } else {
      const { https, devHostname, devPort } = archetype.webpack;
      // original dev assets URLs
      return Url.format({
        protocol: https ? "https" : "http",
        hostname: devHostname,
        port: devPort,
        pathname: "/js/"
      });
    }
  };

  const publicPath = makePublicPath();
  devServerConfig.publicPath = publicPath;

  const config = {
    devServer: devServerConfig,
    output: {
      publicPath,
      filename: "[name].bundle.dev.js"
    },
    devtool: "inline-source-map",
    plugins: [new MiniCssExtractPlugin({ filename: "[name].style.css" })],
    optimization: {
      noEmitOnErrors: true
    }
  };

  return config;
};
