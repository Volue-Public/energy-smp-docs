"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deepKeys;
/**
 * Creates an array composed of the own enumerable
 * property names(including nested) of an object
 */

function deepKeys(object, prefix) {
  if (typeof prefix === 'undefined') {
    prefix = [];
  }
  var keys = [];
  for (var k in object) {
    if (!Object.hasOwnProperty.call(object, k)) {
      continue;
    }
    if (typeof object[k] !== 'object') {
      keys.push(prefix.concat([k]));
    }
    if (typeof object[k] === 'object' && object[k] !== null) {
      keys = keys.concat(deepKeys(object[k], prefix.concat([k])));
    }
  }
  return keys;
}