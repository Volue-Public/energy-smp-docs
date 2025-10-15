"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sanitizeInteger;
/**
 * Sanitize integer
 */

function sanitizeInteger(value, stdValue, options) {
  var num = parseInt(value, 10);
  options = options || {};
  if (isNaN(num) || options.min && num < options.min) {
    num = stdValue;
  }
  return num;
}