"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createPopover;
var _tip = _interopRequireDefault(require("./tip/tip"));
var _inheritPrototype = _interopRequireDefault(require("../utils/inherit-prototype"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function createPopover(options) {
  return new Popover(options);
}
function Popover(options) {
  options = options || {};
  _tip.default.call(this, '<div class="popover-content"></div>', {
    node: options.node,
    hideArrow: options.hideArrow
  });
  var className = 'popover';
  if (options.popoverClass) {
    className += ' ' + options.popoverClass;
  }
  this.el.className += ' ' + className;
  this.classname = className;
  this.content(options.content);
}
(0, _inheritPrototype.default)(Popover, _tip.default);
Popover.prototype.content = function (content) {
  var contentEl = this.el.querySelector('.popover-content');
  if (typeof content === 'string') {
    contentEl.innerHTML = content;
  } else {
    contentEl.appendChild(content);
  }
  return this;
};