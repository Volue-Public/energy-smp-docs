"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = timeRange;
var _bounds = _interopRequireDefault(require("../../../utils/bounds"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function timeRange() {
  var self;

  /**
   * For standard range:
   * Hour is valid if any of the hour:minute combination is in bounds
   * it is invalid, if its 59th minute is before or if the 0th minute is after
   */
  function isValidHour(hour) {
    var min, max;
    min = self.min() ? self.min().hour : 0;
    max = self.max() ? self.max().hour : 23;
    if (self.reversed()) {
      return hour <= max || min <= hour;
    }
    return min <= hour && hour <= max;
  }
  function isValidMinute(hour, minute) {
    var v = {
      hour,
      minute
    };
    if (hour === undefined) {
      return true;
    }
    if (self.reversed()) {
      return !self.after(v) || !self.before(v);
    }
    return self.in(v);
  }

  // mixin bounds
  self = (0, _bounds.default)({
    isValidHour,
    isValidMinute
  });
  self.compare(function (a, b) {
    if (a.hour < b.hour) {
      return -1;
    }
    if (a.hour > b.hour) {
      return 1;
    }
    if (a.minute < b.minute) {
      return -1;
    }
    if (a.minute > b.minute) {
      return 1;
    }
    return 0;
  });
  self.distance(function (a, b) {
    return 60 * Math.abs(a.hour - b.hour) + Math.abs(a.minute - b.minute);
  });
  return self;
}