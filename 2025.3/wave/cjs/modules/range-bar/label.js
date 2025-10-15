"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Label;
function Label(options) {
  this.el = document.createElement('div');
  this.el.className = 'rangeBar-label';
  if (typeof options.label === 'function') {
    this.el.textContent = options.label.call(this, [options.min, options.max]);
  } else {
    this.el.textContent = options.label;
  }
}