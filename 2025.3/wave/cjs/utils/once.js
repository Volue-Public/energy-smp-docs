"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = once;
/**
 * Ensure the function is only executed once
 */

function once(func, context) {
  var result;
  return function () {
    if (func) {
      result = func.apply(context || this, arguments);
      func = null;
    }
    return result;
  };
}