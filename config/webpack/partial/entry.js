"use strict";

const Fs = require("fs");
const _ = require("lodash");
const Path = require("path");
const archetype = require("../../archetype");
const logger = require("../../utils/color-logger");
const AppMode = archetype.AppMode;

function makeEntryPartial() {

  const partial = {
    context: Path.resolve(AppMode.src.client.dir)
  };

  function appEntry() {
    // look for src/client/app.js or src/client/app.jsx or src/client/app.tsx
    const entries = ["./app.js", "./app.jsx", "./app.tsx", "./js/app.js", "./js/app.jsx", "./js/app.tsx"];
    const entry = entries.find(f => Fs.existsSync(Path.join(partial.context, f))) || "./js/app.jsx";
    logger.info(`Default to single app entry point using ${entry} under context ${partial.context}`);

    return entry;
  }

  function shouldPolyfill() {
    if (archetype.webpack.enableBabelPolyfill) {
      if (archetype.babel.hasMultiTargets) {
        return archetype.babel.target === "default";
        // for all other targets, disable polyfill
      } else {
        return true;
      }
    }
    return false;
  }

  function makeEntry() {
    let entry = appEntry();
    const polyfill = shouldPolyfill();

    if (polyfill) {
      const coreJs = "core-js";
      const runtime = "regenerator-runtime/runtime";
      if (Array.isArray(entry)) {
        entry = { main: [coreJs, runtime, ...entry] };
      } else if (_.isObject(entry)) {
        entry = Object.entries(entry).reduce((prev, [k, v]) => {
          prev[k] = [coreJs, runtime].concat(v);
          return prev;
        }, {});
      } else {
        entry = { main: [coreJs, runtime, entry] };
      }
    }
    return entry;
  }
  
  partial.entry = makeEntry();

  return partial;
}

module.exports = makeEntryPartial();
