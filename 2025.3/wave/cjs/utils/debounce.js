"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = debounce;
/**
 * Helper for limiting the rate at which the function can fire
 */

function debounce(fn, wait, isImmediate) {
  var timeout, result;
  return function () {
    var args = arguments;
    var context = this;
    function delayed() {
      if (!isImmediate) {
        result = fn.apply(context, args);
      }
      timeout = null;
    }
    if (timeout) {
      clearTimeout(timeout);
    } else if (isImmediate) {
      result = fn.apply(context, args);
    }
    timeout = setTimeout(delayed, wait);
    return result;
  };
}