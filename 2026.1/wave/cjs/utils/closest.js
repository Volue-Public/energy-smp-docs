"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = closest;
var _matches = _interopRequireDefault(require("./matches"));
var _parents = _interopRequireDefault(require("./parents"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function closest(element, selector, shouldCheckSelf) {
  // eslint-disable-next-line eqeqeq
  if (!(element && element.nodeType == 1 && selector)) return;
  var parentElements = (shouldCheckSelf ? [element] : []).concat((0, _parents.default)(element));
  for (var i = 0, parent; parent = parentElements[i]; i++) {
    if ((0, _matches.default)(parent, selector)) return parent;
  }
}