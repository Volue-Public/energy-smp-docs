"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Mark;
function Mark(options) {
  this.el = document.createElement('span');
  this.el.className = 'rangeBar-bgMark';
  this.el.style.left = this.getPercentageOffset(options.pos);
}
Mark.prototype.getPercentageOffset = function getPercentageOffset(pos) {
  return pos * 100 + '%';
};