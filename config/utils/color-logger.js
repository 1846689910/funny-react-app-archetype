const args = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m"
};
const _log = (content, options) => console.log(`${options.join("")}${content}${args.Reset}`);

module.exports = (c, options = [args.FgGreen, args.Bright]) => _log(c, options);

Object.assign(module.exports, {
  args,
  danger: c => _log(c, [args.FgRed, args.Bright]),
  warn: c => _log(c, [args.FgYellow, args.Bright]),
  log: (c, options = [args.FgGreen, args.Bright]) => _log(c, options),
  info: c => _log(c, [args.FgBlue, args.Bright])
});

/**
 * usage:
 * const logger = require("color-logger");
 * logger("hello world");
 * const {args, danger, warn, log, info}  = logger;
 * 
 */
