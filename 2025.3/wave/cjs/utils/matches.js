"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = matches;
var proto = window.Element.prototype;
var nativeMatches = proto.matches || proto.matchesSelector || proto.webkitMatchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector;
function matches(element, test) {
  // eslint-disable-next-line eqeqeq
  if (element && element.nodeType == 1 && test) {
    // eslint-disable-next-line eqeqeq
    if (typeof test === 'string' || test.nodeType == 1) {
      // eslint-disable-next-line eqeqeq
      return element == test || matchesSelector(element, test);
    } else if ('length' in test) {
      for (var i = 0, item; item = test[i]; i++) {
        // eslint-disable-next-line eqeqeq
        if (element == item || matchesSelector(element, item)) return true;
      }
    }
  }
  return false;
}
function matchesSelector(element, selector) {
  if (typeof selector !== 'string') return false;
  if (nativeMatches) return nativeMatches.call(element, selector);
  var nodes = element.parentNode.querySelectorAll(selector);
  for (var i = 0, node; node = nodes[i]; i++) {
    // eslint-disable-next-line eqeqeq
    if (node == element) return true;
  }
  return false;
}