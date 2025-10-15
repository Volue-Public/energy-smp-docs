"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inheritPrototype;
function inheritPrototype(child, parent) {
  var p = Object.create(parent.prototype);
  p.constructor = child;
  child.prototype = p;
  child.super_ = parent;
  return p;
}