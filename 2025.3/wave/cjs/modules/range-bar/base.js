"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Base;
var _isInDomTree = _interopRequireDefault(require("../../utils/is-in-dom-tree"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Base() {}
Base.prototype.unitToPercent = function unitToPercent(value) {
  return 100 * value;
};
Base.prototype.pixelToUnit = function pixelToUnit(value) {
  if (!(0, _isInDomTree.default)(this.el)) {
    throw new Error('element is not in dom!');
  }
  var rect = this.el.getBoundingClientRect();
  var width = rect.width;
  // eslint-disable-next-line eqeqeq
  if (width == 0) {
    throw new Error('element width is 0 or element is not attached to dom');
  }
  return value / width;
};
Base.prototype.unitToUser = function unitToUser(value) {
  return (this.options.max - this.options.min) * value + this.options.min;
};
Base.prototype.userToUnit = function userToUnit(value) {
  return (value - this.options.min) / (this.options.max - this.options.min);
};
Base.prototype.roundUserValue = function roundUserValue(value) {
  return this.options.min + Math.floor((value - this.options.min) / this.options.step) * this.options.step;
};
Base.prototype.getCursor = function getCursor(event) {
  // event is mousemove event
  // returns unitValue of place where the event has been made
  var rect = this.el.getBoundingClientRect();
  var x = event.clientX - rect.left;
  return this.unitToUser(this.pixelToUnit(x));
};