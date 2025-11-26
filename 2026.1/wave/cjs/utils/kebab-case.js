"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = kebabCase;
var _trim = _interopRequireDefault(require("./trim"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var WORD_SEPARATORS = /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]+/;
var CAPITAL_PLUS_LOWER = /[A-ZÀ-Ý\u00C0-\u00D6\u00D9-\u00DD][a-zà-ÿ]/g;
var CAPITALS = /[A-ZÀ-Ý\u00C0-\u00D6\u00D9-\u00DD]+/g;
function kebabCase(str) {
  str = str.replace(CAPITAL_PLUS_LOWER, function (match) {
    return ' ' + (match[0].toLowerCase() || match[0]) + match[1];
  });
  str = str.replace(CAPITALS, function (match) {
    return ' ' + match.toLowerCase();
  });
  return (0, _trim.default)(str).split(WORD_SEPARATORS).join('-').replace(/^-/, '').replace(/-\s*$/, '');
}