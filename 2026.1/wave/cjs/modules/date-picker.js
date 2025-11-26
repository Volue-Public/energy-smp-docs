"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createDatePicker;
var _componentEvents = _interopRequireDefault(require("component-events"));
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _extend = _interopRequireDefault(require("extend"));
var _keyname = _interopRequireDefault(require("keyname"));
var _calendar = _interopRequireDefault(require("./calendar"));
var _mobileInput = _interopRequireDefault(require("./mobile-input"));
var _popover = _interopRequireDefault(require("./popover"));
var _clickOutside = _interopRequireDefault(require("../utils/click-outside"));
var _inheritPrototype = _interopRequireDefault(require("../utils/inherit-prototype"));
var _setImmediate = _interopRequireDefault(require("../utils/set-immediate"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var ISO_8601_FORMAT = 'YYYY-MM-DD';
function createDatePicker(el, options) {
  return new DatePicker(el, options);
}
function DatePicker(el, options) {
  if (!el || el.nodeName !== 'INPUT') {
    throw new Error('Wave.DatePicker() requires an <input> DOM element to initialize');
  }
  this.el = el;
  this.options = (0, _extend.default)(true, {}, this.constructor.defaults, options);
  if (this.options.useNativePickerOnTouchCapableDevices && (0, _mobileInput.default)(this.el, {
    type: 'date'
  }).isConverted()) {
    this._native = true;
    this.events = (0, _componentEvents.default)(this.el, this);
    this.events.bind('change', '_handleChange');

    // native date input always uses ISO-8601 date format
    this._initDateFormat(ISO_8601_FORMAT);
    return this;
  }
  this.cal = (0, _calendar.default)(this.options).showMonthSelect().showYearSelect();
  this.cal.addClass('calendar--datepicker');
  this.cal.on('change', function (date) {
    var value = this.value(date);
    value && this.el.focus();
  }.bind(this));
  this.events = (0, _componentEvents.default)(this.el, this);
  this.events.bind('change', '_handleChange');
  this.events.bind('focus', '_handleFocus');
  this.events.bind('blur', '_handleBlur');
  this.events.bind('click', '_handleClick');
  this.events.bind('keydown', '_handleKeydown');
  this._initDateFormat(this.options.format);
  return this;
}
DatePicker.defaults = {
  format: ISO_8601_FORMAT,
  useNativePickerOnTouchCapableDevices: true,
  triggerChangeOnEmpty: false
};
(0, _inheritPrototype.default)(DatePicker, _emitterComponent.default);
DatePicker.prototype._native = false;
DatePicker.prototype._position = 'bottom';

/**
 * Return boolean whether the native picker is enabled
 */
DatePicker.prototype.isNative = function () {
  return this._native;
};
DatePicker.prototype._initDateFormat = function (format) {
  var reDivider = /[^a-zA-Z0-9]/;
  format = format.toUpperCase();
  this._dayPos = format.indexOf('DD');
  this._monthPos = format.indexOf('MM');
  this._yearPos = format.indexOf('YYYY');
  this._divider = format.match(reDivider)[0];
};
DatePicker.prototype._processDate = function (date) {
  var dateArray = [];
  var finalString = '';
  var divider = this._divider;
  dateArray = [{
    value: ('0' + date.getDate()).slice(-2),
    position: this._dayPos
  }, {
    value: ('0' + (1 + date.getMonth())).slice(-2),
    position: this._monthPos
  }, {
    value: date.getFullYear(),
    position: this._yearPos
  }];
  dateArray.sort(function (a, b) {
    if (a.position < b.position) {
      return -1;
    }
    if (a.position > b.position) {
      return 1;
    }
    return 0;
  });
  dateArray.forEach(function (entry) {
    finalString += entry.value + divider;
  });

  // Slice away the last divider
  return finalString.slice(0, -1);
};
DatePicker.prototype._parseInput = function () {
  var val = this.el.value;
  var t = /^[0-9]*$/;
  var day = val.substring(this._dayPos, this._dayPos + 2);
  var month = val.substring(this._monthPos, this._monthPos + 2);
  var year = val.substring(this._yearPos, this._yearPos + 4);
  if (t.test(year) && t.test(month) && t.test(day)) {
    year = parseInt(year, 10);
    month = parseInt(month, 10) - 1;
    day = parseInt(day, 10);
    var dat = new Date(year, month, day);
    if (dat.getDate() == day &&
    // eslint-disable-line eqeqeq
    dat.getMonth() == month &&
    // eslint-disable-line eqeqeq
    dat.getFullYear() == year // eslint-disable-line eqeqeq
    ) {
      return dat;
    }
  }
  return null;
};

/**
 * Get/set value
 */
DatePicker.prototype.value = function (date) {
  var self = this;
  var calDate;
  if (typeof date === 'undefined') {
    return this._parseInput();
  } else if (date === null) {
    calDate = new Date();
  } else {
    date = calDate = date instanceof Date ? date : new Date(date);
    if (date.toString() === 'Invalid Date') {
      return false;
    }
  }
  if (!this._native) {
    this.cal.select(calDate);
    (0, _setImmediate.default)(function () {
      self.hide();
    });
  }
  this.el.value = date === null ? '' : this._processDate(date);
  this.emit('change', date);
  return true;
};
DatePicker.prototype.position = function (pos) {
  this._position = pos;
  return this;
};
DatePicker.prototype.min = function (date) {
  if (this._native) {
    return this;
  }
  date = date instanceof Date ? date : new Date(date);
  if (date.toString() === 'Invalid Date') {
    return this;
  }
  this.cal.min(date);
  return this;
};
DatePicker.prototype.max = function (date) {
  if (this._native) {
    return this;
  }
  date = date instanceof Date ? date : new Date(date);
  if (date.toString() === 'Invalid Date') {
    return this;
  }
  this.cal.max(date);
  return this;
};

/**
 * Show DatePicker
 */
DatePicker.prototype.show = function () {
  if (this._native) {
    return;
  }
  var self = this;
  var ev = document.createEvent('Event');
  ev.initEvent('click', true, true);
  document.dispatchEvent(ev);
  if (this._isVisible) {
    return;
  }
  this._isVisible = true;
  if (!self.popover) {
    this.popover = (0, _popover.default)({
      content: this.cal.el,
      node: this.options.popoverNode,
      popoverClass: this.options.popoverClass
    }).on('show', function () {
      self.clickOutside.on();
      self.emit('show');
    }).on('hide', function () {
      self.emit('hide');
    });
    this.clickOutside = (0, _clickOutside.default)([this.el, this.popover.el], this.hide.bind(this));
    if (this._position) {
      this.popover.position(this._position);
    }
  }
  this.popover.show(this.el);
};

/**
 * Hide DatePicker
 */
DatePicker.prototype.hide = function () {
  if (!this._isVisible || this._native) {
    return;
  }
  this._isVisible = false;
  this.clickOutside.off();
  this.popover.hide();
};

/**
 * Handle input clicks
 */
DatePicker.prototype._handleClick = function (e) {
  if (this.el.disabled) {
    return;
  }
  this.show();
};
DatePicker.prototype._handleKeydown = function (e) {
  switch ((0, _keyname.default)(e.which)) {
    case 'enter':
      e.preventDefault();
      this._handleChange(e);
      break;
    case 'esc':
      this.hide();
      break;
  }
};

/**
 * Handle focus/blur
 */
DatePicker.prototype._handleFocus = function (e) {
  this.show();
};
DatePicker.prototype._handleBlur = function (e) {
  if (!this.clickOutside.isClicked(this.popover.el)) {
    this.hide();
  }
};

/**
 * Handle date changes
 */
DatePicker.prototype._handleChange = function (e) {
  var date = this._parseInput();
  if (date) {
    this._setValue(date);
  } else if (this.options.triggerChangeOnEmpty && this.el.value === '') {
    this._setValue(null);
  }
};
DatePicker.prototype._setValue = function (val) {
  if (this._native) {
    this.emit('change', val);
  } else {
    this.value(val) && this.el.focus();
  }
};