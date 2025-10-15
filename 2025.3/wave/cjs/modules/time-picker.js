"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _componentEvents = _interopRequireDefault(require("component-events"));
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _extend = _interopRequireDefault(require("extend"));
var _keyname = _interopRequireDefault(require("keyname"));
var _clock = _interopRequireDefault(require("./clock"));
var _mobileInput = _interopRequireDefault(require("./mobile-input"));
var _popover = _interopRequireDefault(require("./popover"));
var _clickOutside = _interopRequireDefault(require("../utils/click-outside"));
var _inheritPrototype = _interopRequireDefault(require("../utils/inherit-prototype"));
var _setImmediate = _interopRequireDefault(require("../utils/set-immediate"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _default(el, options) {
  return new TimePicker(el, options);
}
function TimePicker(el, options) {
  if (!el || el.nodeName !== 'INPUT') {
    throw new Error('Wave.TimePicker() requires an <input> DOM element to initialize');
  }
  this.el = el;
  this.options = (0, _extend.default)(true, {}, this.constructor.defaults, options);
  if (this.options.useNativePickerOnTouchCapableDevices && (0, _mobileInput.default)(this.el, {
    type: 'time'
  }).isConverted()) {
    this._native = true;
    this.events = (0, _componentEvents.default)(this.el, this);
    this.events.bind('change', '_handleChange');
    return;
  }
  this.clock = (0, _clock.default)(this.options);
  this.clock.on('change', function (time, complete) {
    var value = this.value(time, complete);
    value && this.el.focus();
  }.bind(this));
  this.events = (0, _componentEvents.default)(this.el, this);
  this.events.bind('change', '_handleChange');
  this.events.bind('focus', '_handleFocus');
  this.events.bind('blur', '_handleBlur');
  this.events.bind('click', '_handleClick');
  this.events.bind('keydown', '_handleKeydown');
  return this;
}
TimePicker.defaults = {
  useNativePickerOnTouchCapableDevices: true
};
(0, _inheritPrototype.default)(TimePicker, _emitterComponent.default);
TimePicker.prototype._native = false;
TimePicker.prototype._position = 'bottom';

/**
 * Return boolean whether the native picker is enabled
 */
TimePicker.prototype.isNative = function () {
  return this._native;
};
TimePicker.prototype._parseTime = function parseTime(time) {
  var hour = parseInt(time.hour, 10);
  var minute = parseInt(time.minute, 10);
  return {
    hour: !isNaN(hour) && hour.toString().length < 3 ? hour : 0,
    minute: !isNaN(minute) && minute.toString().length < 3 ? minute : 0
  };
};

/**
 * Get/set value
 */
TimePicker.prototype.value = function (time, complete) {
  var self = this;
  if (!time) {
    if (!this.el.value.match(/\d{2}:\d{2}/)) {
      return null;
    }
    var parts = this.el.value.split(':');
    return {
      hour: parts[0],
      minute: parts[1]
    };
  }
  time = this._parseTime(time);
  if (!this._native) {
    this.clock.select({
      hour: time.hour,
      minute: time.minute
    });
    if (complete) {
      (0, _setImmediate.default)(function () {
        self.hide();
      });
    }
  }
  this.el.value = ('0' + time.hour).slice(-2) + ':' + ('0' + time.minute).slice(-2);
  this.emit('change', time, complete);
  return true;
};
TimePicker.prototype.position = function (pos) {
  this._position = pos;
  return this;
};
TimePicker.prototype.min = function (v) {
  if (this._native) {
    return this;
  }
  this.clock.min(v);
  return this;
};
TimePicker.prototype.max = function (v) {
  if (this._native) {
    return this;
  }
  this.clock.max(v);
  return this;
};

/**
 * Show TimePicker
 */
TimePicker.prototype.show = function () {
  if (this._native) {
    return;
  }
  var self = this;
  var date = new Date();
  var ev = document.createEvent('Event');
  ev.initEvent('click', true, true);
  document.dispatchEvent(ev);
  if (this._isVisible) {
    return;
  }
  this._isVisible = true;

  // eslint-disable-next-line eqeqeq
  if (this.el.value == '') {
    this.clock.select({
      hour: date.getHours(),
      minute: date.getMinutes()
    });
  }
  if (!self.popover) {
    this.popover = (0, _popover.default)({
      content: this.clock.el,
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
  this.clock.resetComplete();
  this.popover.show(this.el);
};

/**
 * Hide TimePicker
 */
TimePicker.prototype.hide = function () {
  if (!this._isVisible || this._native) {
    return;
  }
  this._isVisible = false;
  this.clickOutside.off();
  this.popover.hide();
  return this;
};

/**
 * Handle input clicks
 */
TimePicker.prototype._handleClick = function (e) {
  if (this.el.disabled) {
    return;
  }
  this.show();
};
TimePicker.prototype._handleKeydown = function (e) {
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
TimePicker.prototype._handleFocus = function (e) {
  this.show();
};
TimePicker.prototype._handleBlur = function (e) {
  if (!this.clickOutside.isClicked(this.popover.el)) {
    this.hide();
  }
};

/**
 * Handle time changes
 */
TimePicker.prototype._handleChange = function (e) {
  var parts = this.el.value.split(':');
  var time;
  if (parts.length < 2) {
    return this.value(null);
  }
  time = {
    hour: parts[0],
    minute: parts[1]
  };
  if (this._native) {
    time = this._parseTime(time);
    this.emit('change', time, true);
  } else {
    this.value(time, true) && this.el.focus();
  }
};