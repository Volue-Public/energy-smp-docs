"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DayRange;
var _bounds = _interopRequireDefault(require("../../../utils/bounds"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function date(d) {
  return Object.prototype.toString.call(d) === '[object Date]' ? d : new Date(d[0], d[1], d[2]);
}
function DayRange(min, max) {
  return this.min(min).max(max);
}
(0, _bounds.default)(DayRange.prototype);
DayRange.prototype._compare = function (a, b) {
  return date(a).getTime() - date(b).getTime();
};
DayRange.prototype._distance = function (a, b) {
  return Math.abs(this.compare(a, b));
};