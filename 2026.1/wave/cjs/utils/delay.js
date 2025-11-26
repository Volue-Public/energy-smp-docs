"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = delay;
/**
 * Delay a function call
 */
function delay(time) {
  time = time || 10;
  return function (fn) {
    var args = arguments;
    setTimeout(function () {
      fn.apply(this, args);
    }, time);
  };
}