"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tokenize;
/**
 * Break apart words
 */

function tokenize(string) {
  return string.split(/\s+/);
}