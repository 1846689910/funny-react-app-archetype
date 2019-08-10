"use strict";

const profile = {
  partials: {
    _babel: { order: 100 },
    _entry: { order: 200 },
    _output: { order: 300 },
    _resolve: { order: 400 },
    "_extract-style": { order: 2100 },
    _fonts: { order: 2200 },
    _images: { order: 2300 },
    _stats: { order: 2400 },
    _loadable: { order: 2700 },
    _node: { order: 30000 }
  }
};

module.exports = profile;
