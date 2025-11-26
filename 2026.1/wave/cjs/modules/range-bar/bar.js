"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Bar;
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _extend = _interopRequireDefault(require("extend"));
var _base = _interopRequireDefault(require("./base"));
var _label = _interopRequireDefault(require("./label"));
var _mark = _interopRequireDefault(require("./mark"));
var _range = _interopRequireDefault(require("./range"));
var _find = _interopRequireDefault(require("../../utils/find"));
var _inheritPrototype = _interopRequireDefault(require("../../utils/inherit-prototype"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function identity(value) {
  return value;
}
var DEFAULTS = {
  readonly: false,
  maxRanges: Infinity,
  valueParse: identity,
  valueFormat: identity
};
function Bar(options) {
  _base.default.call(this);
  this.options = (0, _extend.default)(true, {}, DEFAULTS, options);
  this.el = document.createElement('div');
  var elClassName = 'rangeBar-bar';
  if (this.options.barClass != null) {
    elClassName += ' ' + this.options.barClass;
  }
  this.el.className = elClassName;
  this.el.ondragstart = function () {
    return false;
  };
  this.rangeIdCount = 0;
  this.rangeList = [];
  if (this.options.bgMarks != null) {
    for (var i = 0; i < this.options.bgMarks; ++i) {
      this.addMark(i / this.options.bgMarks);
    }
  }
  if (this.options.initialRanges != null) {
    this.setValue(options.initialRanges, /* emitEvents */false);
  }
  if (this.options.label != null) {
    var label = new _label.default({
      label: this.options.label,
      min: this.options.min,
      max: this.options.max
    });
    this.el.appendChild(label.el);
  }
  this.emitter = new _emitterComponent.default();
}
(0, _inheritPrototype.default)(Bar, _base.default);
Bar.prototype.getRangeId = function getRangeId() {
  // Just return some unique number
  this.rangeIdCount += 1;
  return this.rangeIdCount;
};
Bar.prototype.proxyRangeEvent = function proxyRangeEvent(eventName, range) {
  var _this = this;
  range.emitter.on(eventName, function () {
    _this.emitter.emit(eventName, {
      data: _this.data(),
      range: range.data()
    });
  });
};
Bar.prototype.add = function add(value, options) {
  var _this = this;
  if (this.rangeList.length >= this.options.maxRanges) {
    return false;
  }
  options = (0, _extend.default)({}, {
    id: this.getRangeId(),
    value,
    readonly: this.options.readonly,
    emitEvents: true
  }, options, {
    bar: this
  });
  var range = new _range.default(options);
  this.el.appendChild(range.el);
  this.rangeList.push(range);
  var rangeId = range.id;
  ['remove', 'changing', 'change', 'click'].forEach(function (eventName) {
    _this.proxyRangeEvent(eventName, range);
  });
  range.emitter.on('remove', function () {
    _this.remove(rangeId);
  });
  if (options.emitEvents) {
    ['change', 'add'].forEach(function (eventName) {
      _this.emitter.emit(eventName, {
        data: _this.data(),
        range: range.data()
      });
    });
  }
  return range;
};
Bar.prototype.remove = function remove(rangeId) {
  var range = (0, _find.default)(this.rangeList, function (range) {
    return range.id === rangeId;
  });
  if (range) {
    range.removeEvents();
    this.el.removeChild(range.el);
    this.rangeList = this.rangeList.filter(function (range) {
      return range.id !== rangeId;
    });
    return true;
  } else {
    return false;
  }
};
Bar.prototype.getInsideRange = function getInsideRange(cursor) {
  for (var i = 0; i < this.rangeList.length; i++) {
    var range = this.rangeList[i];
    if (range.left < cursor && cursor < range.right) {
      return range;
    }
  }
  return false;
};
Bar.prototype.getValue = function getValue() {
  return this.rangeList.map(function (range) {
    return range.getValue();
  });
};
Bar.prototype.setValue = function setValue(ranges, emitEvents) {
  if (ranges == null || !Array.isArray(ranges)) {
    return;
  }
  emitEvents = emitEvents !== false;
  var _this = this;
  if (this.rangeList.length > ranges.length) {
    for (var i = ranges.length - 1, l = this.rangeList.length - 1; i < l; --l) {
      this.remove(l);
    }
    this.rangeList.length = ranges.length;
  }
  ranges.forEach(function (range, i) {
    var rangeValue;
    var rangeColor;
    if (range === Object(range) && !Array.isArray(range)) {
      rangeValue = range.value;
      rangeColor = range.color;
    } else {
      rangeValue = range;
    }
    rangeValue = rangeValue.map(_this.options.valueParse);
    if (_this.rangeList[i] != null) {
      _this.rangeList[i].setValue(rangeValue);
    } else {
      _this.add(rangeValue, {
        emitEvents,
        color: rangeColor
      });
    }
  });
};
Bar.prototype.data = function data() {
  return this.rangeList.map(function (range) {
    return range.data();
  });
};
Bar.prototype.addMark = function addMark(pos) {
  var mark = new _mark.default({
    pos
  });
  this.el.appendChild(mark.el);
};
Bar.prototype.render = function render() {
  this.rangeList.forEach(function (range) {
    range.render();
  });
};