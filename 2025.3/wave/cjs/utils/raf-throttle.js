"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rafThrottle;
var _raf = _interopRequireDefault(require("./raf"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Throttle a function by requestAnimationFrame
 */

function rafThrottle(fn) {
  var busy = false;
  return function () {
    if (busy) {
      return;
    }
    busy = true;
    fn.apply(this, arguments);
    (0, _raf.default)(function () {
      busy = false;
    });
  };
}