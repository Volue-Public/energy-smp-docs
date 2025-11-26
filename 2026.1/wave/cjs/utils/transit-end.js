"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transitEnd;
var _componentEvent = _interopRequireDefault(require("component-event"));
var _isStyleSupported = _interopRequireDefault(require("./is-style-supported"));
var _whichTransitionEvent = _interopRequireDefault(require("./which-transition-event"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Transitionend event helper
 */

var TRANSITION_END_EVENT = (0, _whichTransitionEvent.default)();
function transitEnd(elem, callback) {
  if ((0, _isStyleSupported.default)('transition-property')) {
    _componentEvent.default.bind(elem, TRANSITION_END_EVENT, function transitHandle() {
      _componentEvent.default.unbind(elem, TRANSITION_END_EVENT, transitHandle);
      callback(elem);
    });
  } else {
    callback(elem);
  }
}