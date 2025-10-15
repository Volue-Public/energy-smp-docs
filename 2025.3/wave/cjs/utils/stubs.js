"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = void 0;
var init = exports.init = function init() {
  // stub console (console object is not defined in IE9)
  if (!window.console) {
    window.console = {};
    var methods = ['info', 'log', 'warn', 'debug', 'error'];
    for (var i = methods.length - 1; i > -1; i--) {
      window.console[methods[i]] = function () {};
    }
  }
};