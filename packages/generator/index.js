const xsh = require("shelljs");
const Fs = require("fs");
const Path = require("path");
const rootDir = Path.dirname(Path.dirname(__dirname));

xsh.rm("-rf", Path.join(rootDir, "tmp"));

