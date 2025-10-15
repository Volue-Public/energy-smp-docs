"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isInteger;
/**
 * Check to see whether the value is a number
 */

function isInteger(value) {
  return !isNaN(parseFloat(value)) && isFinite(value) && Math.floor(value) == value // eslint-disable-line eqeqeq
  ;
}