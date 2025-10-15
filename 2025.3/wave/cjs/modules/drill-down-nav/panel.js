"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Panel;
var _extend = _interopRequireDefault(require("extend"));
var _state = _interopRequireDefault(require("../../utils/state"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var DEFAULTS = {
  canTurnSelfOff: true
};
function Panel(el, options) {
  this.options = (0, _extend.default)(true, {}, DEFAULTS, options);
  this.el = el;
  this.triggers = [];
  this.state = false;
  this.group = options.group.addPanel(this);
}
Panel.prototype.addTrigger = function addTrigger(trigger) {
  if (!this.triggers.some(function (t) {
    return t === trigger;
  })) {
    trigger.index = this.triggers.length;
    this.triggers.push(trigger);
  }
  return this;
};
Panel.prototype.removeTrigger = function removeTrigger(trigger) {
  this.triggers.splice(trigger.index, 1);
  return this;
};
Panel.prototype.setIsVisible = function setIsVisible(isVisible) {
  (0, _state.default)(this.el, 'visible', isVisible);
};
Panel.prototype.setState = function setState(active, calledByGroup) {
  active = active === 'toggle' ? !this.state : active;
  if (active !== this.state) {
    (0, _state.default)(this.el, this.group.options.state, this.state = active);
    this.setIsVisible(active);
    if (active) {
      this.group.setActivePanel(this);
    } else if (!calledByGroup) {
      this.group.removeActivePanel();
    }
  }
  this.triggers.forEach(function (t) {
    return t.setState();
  });
  return this;
};