"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stringInterpolate;
/**
 * Simple string interpolation
 */

function stringInterpolate(str, obj) {
  var keys = str.match(/({.+?})/g);
  keys.forEach(function (v, i) {
    var key = keys[i].replace(/{(.+)}/, '$1');
    if (obj[key]) {
      str = str.replace(keys[i], obj[key]);
    }
  });
  return str;
}