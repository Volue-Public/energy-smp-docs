"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _detect = _interopRequireDefault(require("./detect"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * RequestAnimationFrame polyfill
 */

var requestAnimationFrame = (0, _detect.default)('requestAnimationFrame', ['webkit', 'moz']);
var lastTime = 0;
requestAnimationFrame = requestAnimationFrame || function (callback, element) {
  var currTime = new Date().getTime();
  var timeToCall = Math.max(0, 16 - (currTime - lastTime));
  var id = window.setTimeout(function () {
    // eslint-disable-next-line n/no-callback-literal
    callback(currTime + timeToCall);
  }, timeToCall);
  lastTime = currTime + timeToCall;
  return id;
};
var _default = exports.default = requestAnimationFrame;