"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * Shim for setImmediate()
 */

var _setImmediate;
if (typeof setImmediate === 'function') {
  _setImmediate = setImmediate;
} else {
  _setImmediate = function setImmediate(fn) {
    setTimeout(fn, 0);
  };
}
var _default = exports.default = _setImmediate;