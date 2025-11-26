"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Group;
var _extend = _interopRequireDefault(require("extend"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var DEFAULTS = {
  state: 'active',
  afterStateChange: undefined
};
function Group(options) {
  this.options = (0, _extend.default)(true, {}, DEFAULTS, options);
  this.panels = [];
  this.activePanel = undefined;
}
Group.prototype.addPanel = function addPanel(panel) {
  if (!this.panels.some(function (p) {
    return p === panel;
  })) {
    this.panels.push(panel);
  }
  return this;
};
Group.prototype.setActivePanel = function setActivePanel(activePanel) {
  if (activePanel === this.activePanel) {
    return this;
  }
  this.activePanel = activePanel;
  this.panels.forEach(function (p) {
    if (p === activePanel) {
      return;
    }
    p.setState(false, true);
  });
  this.afterStateChange();
  return this;
};
Group.prototype.removeActivePanel = function removeActivePanel() {
  this.activePanel = false;
  this.panels.forEach(function (p) {
    p.setState(false, true);
  });
  this.afterStateChange();
  return this;
};
Group.prototype.afterStateChange = function afterStateChange() {
  var hasActivePanel = Boolean(this.activePanel);
  if (this.options.parent && this.options.parent.activePanel) {
    this.options.parent.activePanel.setIsVisible(!hasActivePanel);
  }
  if (typeof this.options.afterStateChange === 'function') {
    this.options.afterStateChange(this, hasActivePanel, this.activePanel);
  }
};