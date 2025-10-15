"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Trigger;
var _extend = _interopRequireDefault(require("extend"));
var _data = _interopRequireDefault(require("../../utils/data"));
var _state = _interopRequireDefault(require("../../utils/state"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var DEFAULTS = {
  activeEvent: 'click',
  inactiveEvent: 'click'
};
function Trigger(el, options) {
  var trigger = (0, _data.default)(el, '_trigger');
  if (trigger instanceof Trigger) return trigger;
  this.options = (0, _extend.default)(true, {}, DEFAULTS, options);
  this.el = el;
  this.panel = options.panel.addTrigger(this);
  this.setState();
  if (el.tagName.toLowerCase() !== 'a' && el.tagName.toLowerCase() !== 'button') {
    el.setAttribute('tabindex', '0');
  }
  el.addEventListener(this.options.activeEvent, this, false);
  if (this.options.activeEvent !== this.options.inactiveEvent) {
    el.addEventListener(this.options.inactiveEvent, this, false);
  }
  (0, _data.default)(el, '_trigger', trigger);
}
Trigger.prototype.setState = function setState() {
  (0, _state.default)(this.el, this.panel.group.options.state, this.panel.state);
  return this;
};
Trigger.prototype.handleEvent = function handleEvent(e) {
  if (e.type === this.options.activeEvent && !this.panel.state) {
    if (e.type === 'click' && (e.metaKey || e.ctrlKey)) return;
    e.preventDefault();
    this.panel.setState(true);
  } else if (e.type === this.options.inactiveEvent && this.panel.state) {
    e.preventDefault();
    this.panel.setState(!this.panel.options.canTurnSelfOff);
  }
};
Trigger.prototype.detach = function detach() {
  this.panel.removeTrigger(this);
  this.el.removeEventListener(this.options.activeEvent, this);
  if (this.options.activeEvent !== this.options.inactiveEvent) {
    this.el.removeEventListener(this.options.inactiveEvent, this);
  }
  return this;
};
Trigger.prototype.destroy = function destroy() {
  this.detach();
  this.el.parentNode.removeChild(this.el);
  return this;
};