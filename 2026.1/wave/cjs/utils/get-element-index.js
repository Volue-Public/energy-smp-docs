"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getElementIndex;
/**
 * Get element index in a container
 */

function getElementIndex(element) {
  if (!element) {
    return -1;
  }
  var index = 0;
  while (element = element.previousElementSibling) {
    index++;
  }
  return index;
}