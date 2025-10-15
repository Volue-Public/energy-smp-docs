"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createClock;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _componentEvents = _interopRequireDefault(require("component-events"));
var _dataset = _interopRequireDefault(require("dataset"));
var _domify = _interopRequireDefault(require("domify"));
var _elComponent = _interopRequireDefault(require("el-component"));
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _extend = _interopRequireDefault(require("extend"));
var _inGroupsOf = _interopRequireDefault(require("in-groups-of"));
var _rangeComponent = _interopRequireDefault(require("range-component"));
var _timeRange = _interopRequireDefault(require("./time-range"));
var _inheritPrototype = _interopRequireDefault(require("../../../utils/inherit-prototype"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Clock 1.2.1
 * (c) 2013 code42day
 * MIT License
 * @preserve
 */

var format = {
  table: function (caption, type, tbody) {
    return (0, _elComponent.default)('table', (0, _elComponent.default)('caption', caption) + (0, _elComponent.default)('tbody', tbody), {
      class: type
    });
  },
  cell: function (value, type) {
    var attribs = {
      href: '#'
    };
    attribs['data-' + type] = value;
    return (0, _elComponent.default)('td', (0, _elComponent.default)('a', '' + value, attribs));
  },
  query: function (kind, value) {
    return 'a[data-' + kind + '="' + value + '"]';
  }
};
var MINUTES_IN_HOUR = 60;
var VALID_MINUTE_STEPS = [5, 10, 15];
function createClock(options) {
  return new Clock(options);
}
function Clock(options) {
  _emitterComponent.default.call(this);
  verifyOptions(options);
  this.options = (0, _extend.default)(true, {}, this.constructor.defaults, options);
  this.selected = {};
  this.el = renderClock.call(this);
  this.events = (0, _componentEvents.default)(this.el, this);
  this.events.bind('click .clock-hour a', '_handleHourClick');
  this.events.bind('click .clock-minute a', '_handleMinuteClick');
  this.valid = (0, _timeRange.default)();
}
Clock.defaults = {
  i18n: {
    hours: 'Hour',
    minutes: 'Minute'
  }
};
(0, _inheritPrototype.default)(Clock, _emitterComponent.default);
Clock.prototype._handleHourClick = function (e) {
  this._handleClick('hour', e.target);
  e.preventDefault();
};
Clock.prototype._handleMinuteClick = function (e) {
  this._handleClick('minute', e.target);
  e.preventDefault();
};
Clock.prototype._handleClick = function (kind, a) {
  var value = (0, _dataset.default)(a, kind);
  if (!(0, _componentClasses.default)(a).has('is-invalid')) {
    this.selected[kind] = parseInt(value, 10);
    this.selectImpl(kind, this.selected[kind]);
    if (kind === 'hour') {
      this.selected = this.adjustMinutes(this.selected);
      this.markInvalid(this.selected.hour);
    }
    this.emit('change', this.selected, this.isComplete(kind));
  }
};
Clock.prototype.select = function (hm) {
  hm.minute = coerceMinutes(hm.minute, this.options.minuteStep);
  this.selectImpl('hour', hm.hour);
  this.selectImpl('minute', hm.minute);
  this.selected = hm;
  this.markInvalid(this.selected.hour);
  return this;
};
Clock.prototype._querySelector = function (kind, selector) {
  return this.el.querySelector('.clock-' + kind + ' ' + selector);
};
Clock.prototype._querySelectorAll = function (kind, selector) {
  return this.el.querySelectorAll('.clock-' + kind + ' ' + selector);
};
Clock.prototype.selectImpl = function (kind, value) {
  var selected = this._querySelector(kind, '.is-selected a');
  // deselect
  if (selected) {
    if (value === (0, _dataset.default)(selected, kind)) {
      // all is well
      return;
    }
    (0, _componentClasses.default)(selected.parentNode).remove('is-selected');
  }
  // select
  selected = this._querySelector(kind, format.query(kind, value));
  if (selected) {
    (0, _componentClasses.default)(selected.parentNode).add('is-selected');
  }
};

/**
 * Adjust minute value when hour changes as a result of select,
 * or the click on the calendar
 */
Clock.prototype.adjustMinutes = function (hm) {
  var adjusted;
  if (hm.minute !== undefined) {
    adjusted = this.valid.restrict(hm);
    // eslint-disable-next-line eqeqeq
    if (adjusted.minute != hm.minute) {
      this.selectImpl('minute', adjusted.minute);
    }
  }
  return adjusted || hm;
};
Clock.prototype.markInvalid = function (selectedHour, both) {
  var valid = this.valid;
  if (both) {
    markInvalid(this._querySelectorAll('hour', 'a'), 'hour', function (hour) {
      return valid.isValidHour(hour);
    });
  }
  markInvalid(this._querySelectorAll('minute', 'a'), 'minute', function (minute) {
    return valid.isValidMinute(selectedHour, minute);
  });
};
Clock.prototype.isComplete = function (kind) {
  this._complete = this._complete || {};
  if (kind) {
    this._complete[kind] = true;
  }
  if (this._complete.hour && this._complete.minute) {
    this._complete = {}; // reset complete
    return true;
  }
};
Clock.prototype.resetComplete = function () {
  this._complete = {};
  return this;
};
Clock.prototype.min = function (v) {
  if (!arguments.length) {
    return this.valid.min();
  }
  this.valid.min(v);
  this.markInvalid(this.selected.hour, true);
  return this;
};
Clock.prototype.max = function (v) {
  if (!arguments.length) {
    return this.valid.max();
  }
  this.valid.max(v);
  this.markInvalid(this.selected.hour, true);
  return this;
};
function renderTable(caption, type, rows) {
  var tbody = rows.map(function (row) {
    return '<tr>' + row.join('') + '</tr>';
  }).join('');
  return format.table(caption, type, tbody);
}
function renderHours() {
  var hours = (0, _rangeComponent.default)(0, 24).map(function (hour) {
    return format.cell(hour, 'hour');
  });
  return renderTable(this.options.i18n.hours, 'clock-hour', (0, _inGroupsOf.default)(hours, 6));
}
function renderMinutes() {
  var minuteStep = this.options.minuteStep || 1;
  var rangeB = MINUTES_IN_HOUR / minuteStep;
  var groupLength;
  if (minuteStep === 1) {
    groupLength = 6;
  } else if (minuteStep === 10) {
    groupLength = 3;
  } else {
    groupLength = 4;
  }
  var minutes = (0, _rangeComponent.default)(0, rangeB).map(function (minute) {
    return format.cell(minute * minuteStep, 'minute');
  });
  return renderTable(this.options.i18n.minutes, 'clock-minute', (0, _inGroupsOf.default)(minutes, groupLength));
}
function renderClock() {
  var html = ['<div class="clock">', '<div class="clock-col">' + renderHours.call(this) + '</div>', '<div class="clock-col">' + renderMinutes.call(this) + '</div>', '</div>'].join('');
  return (0, _domify.default)(html);
}
function verifyOptions(options) {
  options = options || {};
  if (options.minuteStep != null && (typeof options.minuteStep !== 'number' || VALID_MINUTE_STEPS.indexOf(options.minuteStep) === -1)) {
    throw new Error('TimePicker: `options.numberStep` must be one of the numbers: ' + VALID_MINUTE_STEPS.join(', '));
  }
}
function coerceMinutes(minutes, minuteStep) {
  if (!minutes) {
    return 0;
  }
  if (minuteStep === undefined) {
    return minutes;
  }
  minutes -= minutes % minuteStep;
  return minutes;
}
function markInvalid(nodes, kind, isValid) {
  function mark(node) {
    var cl = (0, _componentClasses.default)(node);
    var v = (0, _dataset.default)(node, kind);
    if (isValid(v)) {
      cl.remove('is-invalid');
    } else {
      cl.add('is-invalid');
    }
  }
  var i;
  for (i = 0; i < nodes.length; i++) {
    mark(nodes[i]);
  }
}