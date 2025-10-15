"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Bounds;
var _justClone = _interopRequireDefault(require("just-clone"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Checking if value is inside or outside of bounds
 */

function Bounds(obj) {
  if (obj) return mixin(obj);
}
function calculateReversed(self) {
  return self._min && self._max && self.before(self._max);
}
function mixin(obj) {
  for (var key in Bounds.prototype) {
    obj[key] = Bounds.prototype[key];
  }
  return obj;
}
Bounds.prototype.compare = function (fn) {
  this._compare = fn;
  return this;
};
Bounds.prototype.distance = function (fn) {
  this._distance = fn;
  return this;
};
Bounds.prototype.min = function (v) {
  if (!arguments.length) {
    return this._min;
  }
  this._min = v;
  delete this._reversed;
  return this;
};
Bounds.prototype.max = function (v) {
  if (!arguments.length) {
    return this._max;
  }
  this._max = v;
  delete this._reversed;
  return this;
};
Bounds.prototype.before = function (v) {
  return this._min && this._compare(v, this._min) < 0;
};
Bounds.prototype.after = function (v) {
  return this._max && this._compare(v, this._max) > 0;
};
Bounds.prototype.out = function (v) {
  return this.before(v) || this.after(v);
};
Bounds.prototype.in = function (v) {
  return !this.out(v);
};
Bounds.prototype.valid = function (v) {
  if (this.reversed()) {
    return !this.after(v) || !this.before(v);
  }
  return this.in(v);
};
Bounds.prototype.invalid = function (v) {
  return !this.valid(v);
};
Bounds.prototype.reversed = function () {
  if (this._reversed === undefined) {
    this._reversed = calculateReversed(this);
  }
  return this._reversed;
};
Bounds.prototype.restrict = function (v) {
  if (this.reversed()) {
    if (this.after(v) && this.before(v)) {
      // select closer bound
      return this._distance(this._max, v) < this._distance(v, this._min) ? (0, _justClone.default)(this._max) : (0, _justClone.default)(this._min);
    }
    return v;
  }
  if (this.before(v)) {
    return (0, _justClone.default)(this._min);
  }
  if (this.after(v)) {
    return (0, _justClone.default)(this._max);
  }
  return v;
};