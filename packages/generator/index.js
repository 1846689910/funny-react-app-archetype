const xsh = require("shelljs");
const Fs = require("fs");
const Path = require("path");
const rootDir = Path.dirname(Path.dirname(__dirname));

// needs to have a ready-to-use project then migrate to tmp
// function generate(){

// }

// function demoAppStructure(){
//   return {
//     src: {
//       client: {
//         ".babelrc.js": ".babelrc.js"
//       },
//       server: {
//         ".babelrc.js": ".babelrc.js"
//       },
//     },
//     "package.json": "package.json",
//     ".gitignore": ".gitignore"
//   };
// }

// function initDir(){
//   xsh.rm("-rf", Path.join(rootDir, "tmp"));
//   xsh.mkdir("-p", Path.join(rootDir, "tmp/demo-app/client"), Path.join(rootDir, "tmp/demo-app/server"));
// }
