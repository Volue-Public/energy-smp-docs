"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = detect;
function detect(target, prefixes) {
  var prefixIdx;
  var prefix;
  var testName;
  var scope = this || window;
  prefixes = (prefixes || ['ms', 'o', 'moz', 'webkit']).concat('');
  prefixIdx = prefixes.length;
  while (prefixIdx--) {
    prefix = prefixes[prefixIdx];

    // capitalize first letter so that a test for
    // requestAnimationFrame would result in a search for
    // webkitRequestAnimationFrame
    testName = prefix + (prefix ? target.charAt(0).toUpperCase() + target.slice(1) : target);
    if (typeof scope[testName] === 'function') {
      return scope[testName];
    }
  }
}