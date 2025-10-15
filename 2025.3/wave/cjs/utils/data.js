"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = data;
var _kebabCase = _interopRequireDefault(require("./kebab-case"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Helper for storing arbitrary data associated with an element.
 * The data is stored directly on the DOM elements using a Symbol and
 * garbage collection is handled by the browser
 */

var DATA_KEY = window.Symbol && Symbol('data') || '__PUI__DATA_KEY';
function data(elem, key, value) {
  if (!elem || typeof key === 'undefined') {
    return;
  }
  var data = elem[DATA_KEY] = elem[DATA_KEY] || {};
  if (typeof value !== 'undefined') {
    return data[key] = value;
  }
  if (typeof data[key] === 'undefined') {
    return data[key] = elem.dataset ? elem.dataset[key] : elem.getAttribute('data-' + (0, _kebabCase.default)(key));
  }
  return data[key];
}