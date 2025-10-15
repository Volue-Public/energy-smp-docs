"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = domReady;
/**
 * Execute callback when `DOMContentLoaded` fires for `document`,
 * or immediately if called afterwards
 */

function domReady(handler) {
  if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
    handler();
  } else {
    document.addEventListener('DOMContentLoaded', handler, false);
  }
}