"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = state;
var _componentClasses = _interopRequireDefault(require("component-classes"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Conditional state classes
 */

function state(elem, className, active) {
  if (typeof active === 'undefined') {
    return (0, _componentClasses.default)(elem).has('is-' + className);
  }
  var service = active === 'toggle' ? 'toggle' : active ? 'add' : 'remove';
  (0, _componentClasses.default)(elem)[service]('is-' + className);
  return Boolean(active);
}