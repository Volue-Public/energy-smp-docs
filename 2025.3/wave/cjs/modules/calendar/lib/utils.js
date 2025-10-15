"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clamp = clamp;
/**
 * Clamp `month`
 */
function clamp(month) {
  if (month > 11) {
    return 0;
  }
  if (month < 0) {
    return 11;
  }
  return month;
}