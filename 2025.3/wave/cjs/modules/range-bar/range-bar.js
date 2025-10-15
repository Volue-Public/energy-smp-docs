"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createRangeBar;
var _extend = _interopRequireDefault(require("extend"));
var _bar = _interopRequireDefault(require("./bar"));
var _find = _interopRequireDefault(require("../../utils/find"));
var _isInteger = _interopRequireDefault(require("../../utils/is-integer"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function createRangeBar(options) {
  return new RangeBar(options);
}
function RangeBar(options) {
  options = this._transformOptions(options);
  this._validateOptions(options);
  this._bar = new _bar.default(options);
  this.el = document.createElement('div');
  this.el.className = 'rangeBar';
  this.el.appendChild(this._bar.el);
}
RangeBar.prototype._transformOptions = function _transformOptions(options) {
  if (options.valueParse) {
    ['min', 'max', 'step', 'minSize'].forEach(function (key) {
      if (options[key] !== undefined) {
        options[key] = options.valueParse(options[key]);
      }
    });
  }
  return options;
};
RangeBar.prototype._validateOptions = function _validateOptions(options) {
  ['min', 'max', 'step'].forEach(function (key) {
    var value = options[key];
    if (value === undefined) {
      throw Error('Rangebar: ' + key + ' option is mandatory');
    }
    if (!(0, _isInteger.default)(value)) {
      throw Error('Rangebar: ' + key + ' option should be integer');
    }
  });
  if (options.max <= options.min) {
    throw Error('Rangebar: max should be greater than min');
  }
  if ((options.max - options.min) % options.step !== 0) {
    throw Error('Rangebar: there should be an integer number of steps between min and max');
  }
  if (options.minSize === undefined) {
    options.minSize = options.step;
  }
  if (options.minSize % options.step !== 0) {
    throw Error('Rangebar: there should be an integer number of steps in minSize');
  }
  ['maxRanges', 'bgMarks'].forEach(function (key) {
    var value = options[key];
    if (value !== undefined && !(0, _isInteger.default)(value)) {
      throw Error('Rangebar: ' + key + ' should be integer');
    }
  });
  if ([true, false, undefined].indexOf(options.readonly) === -1) {
    throw Error('Rangebar: readonly option should be true, false or undefined');
  }
  if (options.initialRanges !== undefined && !Array.isArray(options.initialRanges)) {
    throw Error('Rangebar: initialRanges option should be array');
  }
};
RangeBar.prototype._transformValue = function _transformValue(value) {
  if (this._bar.options.valueParse) {
    value = value.map(this._bar.options.valueParse);
  }
  return value;
};
RangeBar.prototype._validateValue = function _validateValue(value) {
  // eslint-disable-next-line eqeqeq
  if (!Array.isArray(value) || value.length != 2) {
    throw Error;
  }
};
RangeBar.prototype.add = function add(value, options) {
  options = (0, _extend.default)({}, options);
  value = this._transformValue(value);
  this._validateValue(value);
  if (options.id !== undefined && (0, _find.default)(this._bar.rangeList, function (range) {
    return range.id === options.id;
  })) {
    throw Error('Rangebar: range with this id already exists');
  }
  if (this._bar.getInsideRange(value[0]) || this._bar.getInsideRange(value[1])) {
    throw Error('Rangebar: intersection');
  }
  this._bar.rangeList.forEach(function (range) {
    if (value[0] <= range.left && range.right <= value[1]) {
      throw Error('Rangebar: intersection');
    }
  });
  return this._bar.add(value, options);
};
RangeBar.prototype.remove = function remove(rangeId) {
  if (!(0, _isInteger.default)(rangeId)) {
    throw new Error('Rangebar: wrong data');
  }
  return this._bar.remove(rangeId);
};
RangeBar.prototype.removeAll = function removeAll() {
  var _this = this;
  this._bar.rangeList.forEach(function (range) {
    _this._bar.remove(range.id);
  });
};
RangeBar.prototype.rangeValue = function rangeValue(rangeId, value) {
  if (!(0, _isInteger.default)(rangeId)) {
    throw Error('Ranngebar: rangeId should be integer');
  }
  var range = (0, _find.default)(this._bar.rangeList, function (range) {
    return range.id === rangeId;
  });
  if (!range) {
    return false;
  }
  if (value === undefined) {
    return range.getValue();
  } else {
    return range.setValue(value);
  }
};
RangeBar.prototype.rangeData = function rangeData(rangeId, data) {
  if (!(0, _isInteger.default)(rangeId)) {
    throw Error('Rangebar: rangeId should be integer');
  }
  var range = (0, _find.default)(this._bar.rangeList, function (range) {
    return range.id === rangeId;
  });
  if (!range) {
    return false;
  }
  return range.data(data);
};
RangeBar.prototype.render = function render() {
  this._bar.render();
};
RangeBar.prototype.val = function val() {
  return this._bar.getValue();
};
RangeBar.prototype.setVal = function setVal(ranges) {
  this._bar.setValue(ranges);
};
RangeBar.prototype.data = function data() {
  return this._bar.data();
};
RangeBar.prototype.on = function on(subject, cb) {
  this._bar.emitter.on(subject, cb);
};
RangeBar.prototype.off = function off(subject, cb) {
  this._bar.emitter.off(subject, cb);
};