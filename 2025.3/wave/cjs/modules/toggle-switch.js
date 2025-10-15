"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createToggleSwitch;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _componentEvent = _interopRequireDefault(require("component-event"));
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _inheritPrototype = _interopRequireDefault(require("../utils/inherit-prototype"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var CHECKBOX_ROLE = 'checkbox';
var SWITCH_BUTTON_CLASS = 'toggleSwitch-button';
var SWITCH_CHECKED_CLASS = 'toggleSwitch--is-checked';
var SWITCH_ENABLED_CLASS = 'toggleSwitch--is-enabled';
var SWITCH_DISABLED_CLASS = 'toggleSwitch--is-disabled';
function createToggleSwitch(el, options) {
  return new ToggleSwitch(el, options);
}
function ToggleSwitch(el, options) {
  if (!el) {
    throw new Error('Wave.ToggleSwitch() requires a DOM element to initialize');
  }
  _emitterComponent.default.call(this);
  options = options || {};
  this.el = el;
  this._toggleButton = this.el.querySelector('.' + SWITCH_BUTTON_CLASS);
  this._value = Boolean(options.value);
  this._isDisabled = Boolean(options.isDisabled);
  if (!this._toggleButton.hasAttribute('role')) {
    this._toggleButton.setAttribute('role', CHECKBOX_ROLE);
  }
  this._setCheckedState();
  this._setDisabledState();
  this._handleToggleButtonClick = this._handleToggleButtonClick.bind(this);
  _componentEvent.default.bind(this._toggleButton, 'click', this._handleToggleButtonClick);
  return this;
}
(0, _inheritPrototype.default)(ToggleSwitch, _emitterComponent.default);
ToggleSwitch.prototype._handleToggleButtonClick = function (e) {
  e.preventDefault();
  if (this._isDisabled) {
    return;
  }
  this._toggle();
};
ToggleSwitch.prototype._setCheckedState = function () {
  (0, _componentClasses.default)(this.el)[this._value ? 'add' : 'remove'](SWITCH_CHECKED_CLASS);
  this._toggleButton.setAttribute('aria-checked', this._value);
};
ToggleSwitch.prototype._setDisabledState = function () {
  var addClass = this._isDisabled ? SWITCH_DISABLED_CLASS : SWITCH_ENABLED_CLASS;
  var removeClass = this._isDisabled ? SWITCH_ENABLED_CLASS : SWITCH_DISABLED_CLASS;
  (0, _componentClasses.default)(this.el).add(addClass).remove(removeClass);
  if (this._isDisabled) {
    this._toggleButton.setAttribute('disabled', 'disabled');
  } else {
    this._toggleButton.removeAttribute('disabled');
  }
};
ToggleSwitch.prototype._toggle = function (checked) {
  this._value = checked === undefined ? !this._value : checked;
  this._setCheckedState();
  this.emit('change', this._value);
};
ToggleSwitch.prototype.getValue = function () {
  return this._value;
};
ToggleSwitch.prototype.activate = function () {
  this._toggle(true);
  return this;
};
ToggleSwitch.prototype.deactivate = function () {
  this._toggle(false);
  return this;
};
ToggleSwitch.prototype.toggle = function () {
  this._toggle();
  return this;
};
ToggleSwitch.prototype.enable = function () {
  this._isDisabled = false;
  this._setDisabledState();
  return this;
};
ToggleSwitch.prototype.disable = function () {
  this._isDisabled = true;
  this._setDisabledState();
  return this;
};
ToggleSwitch.prototype.destroy = function () {
  _componentEvent.default.unbind(this._toggleButton, 'click', this._handleToggleButtonClick);
};