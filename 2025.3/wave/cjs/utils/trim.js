"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = trim;
/**
 * Trims string whitespace.
 */

var _hasTrim = typeof String.prototype.trim === 'function';
function trim(str) {
  if (_hasTrim) {
    return str.trim();
  }
  return str.replace(/^\s*|\s*$/g, '');
}