const Path = require("path");
const merge = require("lodash/merge");
const ActionWatcher = require("./ActionWatcher");

function requirePartial(file) {
  const partial = require(file);
  return typeof partial === "function" ? partial() : partial;
}

function filterProps(rule) {
  delete rule._name;
  return rule;
}

/**
 *
 * @param {*} profiles object: {"_filename": { order: number }}
 */
function generateConfig(profiles) {
  const dir = Path.join(Path.dirname(__dirname), "webpack/partial");

  const partialFiles = Object.entries(profiles)
    .sort((e1, e2) =>
      e1[1].order === e2[1].order ? 0 : e1[1].order < e2[1].order ? -1 : 1
    )
    .map(x => Path.join(dir, `${x[0].substring(1)}.js`));

  const initConfig = { module: { rules: [] }, plugins: [] };

  const config = partialFiles.reduce((conf, file) => {
    const { module, plugins, ...rest } = requirePartial(file);
    if (module && module.rules)
      conf.module.rules.push(...module.rules.map(x => filterProps(x)));
    if (plugins) conf.plugins.push(...plugins);
    return merge(conf, rest);
  }, initConfig);

  return config;
}

module.exports = {
  generateConfig,
  ActionWatcher
};
