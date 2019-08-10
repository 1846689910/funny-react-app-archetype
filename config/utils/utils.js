const Fs = require("fs");
const Path = require("path");
const { merge } = require("lodash");

/**
 * @description: recursively get all paths within the given path
 * @param {*} path: the path needs to go through
 * @param {*} needPath: whether the result path needs to be the full path or just filename or folder name, default: `true` to get full path
 * @param {*} level: recursive search level, `0` means only the current level, default: `-2` means recursive search thoroughly
 * @param {*} pathType: what the result path type, `0 => FILE`, `1 => DIR` or `2 => BOTH`, default: `0` means only include file in the result
 * @returns {files: [*], dirs: [*]}
 */
function getAllPaths(path, needPath = true, pathType = 0, level = -2) {
  const paths = { files: [], dirs: [] };
  _getAllPathsHelper(path, paths, level, needPath, pathType);
  return paths;
}
function _getAllPathsHelper(path, paths, level, needPath, pathType) {
  if (level < 0 && level !== -2) {
    if (Fs.lstatSync(path).isFile() && (pathType === 0 || pathType === 2)) {
      paths.files.push(needPath ? path : Path.basename(path));
    }
    return;
  }
  const subs = Fs.readdirSync(path, { withFileTypes: true });
  const subdirs = subs.filter(x => x.isDirectory());
  const subfiles = subs.filter(x => x.isFile());
  if (pathType === 0 || pathType === 2)
    paths.files.push(...subfiles.map(x => (needPath ? Path.join(path, x.name) : x.name)));
  if (pathType === 1 || pathType === 2)
    paths.dirs.push(...subdirs.map(x => (needPath ? Path.join(path, x.name) : x.name)));
  for (const sub of subdirs) {
    _getAllPathsHelper(
      Path.join(path, sub.name),
      paths,
      level === -2 ? level : level - 1,
      needPath,
      pathType
    );
  }
}

function requirePartial(file) {
  const partial = require(file);
  return typeof partial === "function" ? partial() : partial;
}

/**
 *
 * @param {*} profiles object: {"_filename": { order: number }}
 */
function generateConfig(profiles) {
  const dir = Path.join(Path.dirname(__dirname), "webpack/partial");

  const partialFiles = Object.entries(profiles)
    .sort((e1, e2) => (e1[1].order === e2[1].order ? 0 : e1[1].order < e2[1].order ? -1 : 1))
    .map(x => Path.join(dir, `${x[0].substring(1)}.js`));

  const initConfig = { module: { rules: [] }, plugins: [] };

  const config = partialFiles.reduce((conf, file) => {
    const {module, plugins, ...rest} = requirePartial(file);
    if (module && module.rules) conf.module.rules.push(...module.rules);
    if (plugins) conf.plugins.push(... plugins);
    return merge(conf, rest);
  }, initConfig);

  return config;
}

module.exports = {
  getAllPaths,
  generateConfig
};
