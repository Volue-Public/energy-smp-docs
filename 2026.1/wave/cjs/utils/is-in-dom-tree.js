"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isInDOMTree;
/**
 * Check to see whether a node has been added to the DOM
 */

function isInDOMTree(node) {
  return !!findUltimateAncestor(node).body;
}
function findUltimateAncestor(node) {
  var ancestor = node;
  while (ancestor.parentNode) {
    ancestor = ancestor.parentNode;
  }
  return ancestor;
}