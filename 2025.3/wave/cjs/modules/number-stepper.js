"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createNumberStepper;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _componentDelegate = _interopRequireDefault(require("component-delegate"));
var _componentEvent = _interopRequireDefault(require("component-event"));
var _extend = _interopRequireDefault(require("extend"));
var _hasFeature = _interopRequireDefault(require("../utils/has-feature"));
var _sanitizeInteger = _interopRequireDefault(require("../utils/sanitize-integer"));
var _unwrap = _interopRequireDefault(require("../utils/unwrap"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var hasTouch = (0, _hasFeature.default)('touch');
var document = window.document;
function createNumberStepper(el, options) {
  return new NumberStepper(el, options);
}
var defaults = {
  labels: {
    up: '&#9650;',
    down: '&#9660;'
  },
  delay: 150
};
function NumberStepper(el, options) {
  if (!el || el.nodeName !== 'INPUT') {
    throw new Error('Wave.NumberInput() requires an <input> DOM element to initialize');
  }
  this.options = (0, _extend.default)(true, {}, defaults, options);
  this._init(el);
}
NumberStepper.prototype._init = function (el) {
  this.el = el;
  var arrowsTemplate = ['<div class="numberStepper-arrows">', '<div class="numberStepper-arrow numberStepper-arrow--up"><span class="txtAssistive">' + this.options.labels.up + '</span></div>', '<div class="numberStepper-arrow numberStepper-arrow--down"><span class="txtAssistive">' + this.options.labels.down + '</span></div>', '</div>'].join('\n');
  (0, _componentClasses.default)(this.el).add('numberStepper-input');
  var containerNode = document.createElement('div');
  containerNode.className = 'numberStepper' + (this.options.stepperClass ? ' ' + this.options.stepperClass : '');

  // Modify DOM
  this.el.parentNode.insertBefore(containerNode, this.el);
  containerNode.appendChild(this.el);
  this.container = containerNode;
  var min = parseFloat(this.el.getAttribute('min'));
  var max = parseFloat(this.el.getAttribute('max'));
  var stepInterval = parseFloat(this.el.getAttribute('step')) || 1;
  this._min = typeof min !== 'undefined' && !isNaN(min) ? min : false;
  this._max = typeof max !== 'undefined' && !isNaN(max) ? max : false;
  this._stepInterval = typeof stepInterval !== 'undefined' && !isNaN(stepInterval) ? stepInterval : 1;
  this._timer = null;
  this._digits = digits(this._stepInterval);
  if (this.el.disabled) {
    (0, _componentClasses.default)(this.container).add('numberStepper--is-disabled');
  }

  // Bind `this` on event callbacks
  this._handleMouseUp = this._handleMouseUp.bind(this);
  this._handleMouseDown = this._handleMouseDown.bind(this);
  this._handleKeyup = this._handleKeyup.bind(this);

  // Bind events
  this._keyupHandler = _componentDelegate.default.bind(this.container, '.numberStepper-input', 'keypress', this._handleKeyup);
  if (!hasTouch) {
    this.el.insertAdjacentHTML('afterend', arrowsTemplate);
    this._mouseDownHandler = _componentDelegate.default.bind(this.container, '.numberStepper-arrow', 'mousedown', this._handleMouseDown);
  }

  // Store the numberStepper instance
  this.el.numberStepper = this;
  return this;
};

/**
 * Handle `keypress` event
 */
NumberStepper.prototype._handleKeyup = function (e) {
  if (e.keyCode === 38 || e.keyCode === 40) {
    e.preventDefault();
    this._step(e.keyCode === 38 ? this._stepInterval : -this._stepInterval);
  }
};

/**
 * Handle `mousedown` event
 */
NumberStepper.prototype._handleMouseDown = function (e) {
  var _this = this;

  // Reset the states
  this._handleMouseUp(e);
  if (!this.el.disabled && !(0, _componentClasses.default)(this.container).has('numberStepper--is-disabled')) {
    var change = (0, _componentClasses.default)(e.target).has('numberStepper-arrow--up') ? this._stepInterval : -this._stepInterval;
    this._timer = startTimer(this._timer, (0, _sanitizeInteger.default)(this.options.delay, defaults.delay, {
      min: 0
    }), function () {
      _this._step(change, false);
    });
    this._step(change);
    _componentEvent.default.bind(document.body, 'mouseup', this._handleMouseUp);
  }
};

/**
 * Handle `mouseup` event
 */
NumberStepper.prototype._handleMouseUp = function (e) {
  e.preventDefault();
  e.stopPropagation();
  clearTimer(this._timer);
  _componentEvent.default.unbind(document.body, 'mouseup', this._handleMouseUp);
};
NumberStepper.prototype._step = function (change) {
  var originalValue = parseFloat(this.el.value);
  var value = change;
  var event;
  if (typeof originalValue === 'undefined' || isNaN(originalValue)) {
    if (this._min !== false) {
      value = this._min;
    } else {
      value = 0;
    }
  } else if (this._min !== false && originalValue < this._min) {
    value = this._min;
  } else {
    value += originalValue;
  }
  var exp = Math.pow(10, this._digits);
  var diff = Math.round((value - this._min) * exp) % Math.round(this._stepInterval * exp);
  if (diff !== 0) {
    value -= diff / exp;
  }
  if (this._min !== false && value < this._min) {
    value = this._min;
  }
  if (this._max !== false && value > this._max) {
    value -= this._stepInterval;
  }
  if (value !== originalValue) {
    value = roundNum(value, this._digits);
    event = document.createEvent('HTMLEvents');
    event.initEvent('change', true, false);
    this.el.value = value;
    this.el.dispatchEvent(event);
  }
};

/**
 * Enables number stepper
 */
NumberStepper.prototype.enable = function () {
  this.el.disabled = false;
  (0, _componentClasses.default)(this.container).remove('numberStepper--is-disabled');
  return this;
};

/**
 * Disables number stepper
 */
NumberStepper.prototype.disable = function () {
  this.el.disabled = true;
  (0, _componentClasses.default)(this.container).add('numberStepper--is-disabled');
  return this;
};

/**
 * Removes instance of module
 */
NumberStepper.prototype.destroy = function () {
  // Unbind events
  _componentDelegate.default.unbind(this.container, 'keypress', this._keyupHandler);
  _componentDelegate.default.unbind(this.container, 'mousedown', this._mouseDownHandler);
  _componentEvent.default.unbind(document.body, 'mouseup', this._handleMouseUp);
  if (!hasTouch) {
    var arrowsContainer = this.container.querySelector('.numberStepper-arrows');
    arrowsContainer.parentNode.removeChild(arrowsContainer);
  }
  (0, _componentClasses.default)(this.el).remove('numberStepper-input');
  (0, _unwrap.default)(this.container);

  // Remove the numberStepper instance
  this.el.numberStepper = undefined;
};

/**
 * Return significant digit count
 */
function digits(value) {
  var test = String(value);
  if (test.indexOf('.') > -1) {
    return test.length - test.indexOf('.') - 1;
  } else {
    return 0;
  }
}

/**
 * Rounds a number to a sepcific significant digit count
 */
function roundNum(value, digits) {
  var exp = Math.pow(10, digits);
  return Math.round(value * exp) / exp;
}

/**
 * Starts timer
 */
function startTimer(timer, time, callback) {
  clearTimer(timer);
  return setInterval(callback, time);
}

/**
 * Clears timer
 */
function clearTimer(timer) {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}