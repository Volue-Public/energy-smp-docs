"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parents;
function parents(element) {
  var list = [];
  // eslint-disable-next-line eqeqeq
  while (element && element.parentNode && element.parentNode.nodeType == 1) {
    element = element.parentNode;
    list.push(element);
  }
  return list;
}