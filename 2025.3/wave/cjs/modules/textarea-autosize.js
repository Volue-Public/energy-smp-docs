"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _componentEvent = _interopRequireDefault(require("component-event"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _default(el) {
  return new TextareaAutosize(el);
}
function TextareaAutosize(el) {
  if (!el) {
    throw new Error('Wave.TextareaAutosize() requires a DOM element to initialize');
  }
  this._init(el);
}
TextareaAutosize.prototype._init = function (el) {
  this.el = el;
  var height = this.el.offsetHeight;
  var style = window.getComputedStyle(this.el);
  var diff;
  if (style.boxSizing === 'content-box') {
    diff = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
  } else {
    diff = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
  }
  if (isNaN(diff) || this.el.scrollHeight + diff < height) {
    diff = 0;
  }
  this._diff = diff;
  if (containsText(this.el.value)) {
    this.el.style.height = this.el.scrollHeight + 'px';
  }

  // Bind events
  this._boundInputHandler = this._handleInput.bind(this);
  _componentEvent.default.bind(this.el, 'input', this._boundInputHandler);
};

/**
 * Handle `input` event
 */
TextareaAutosize.prototype._handleInput = function (e) {
  e.target.style.height = '0px';
  e.target.style.height = e.target.scrollHeight + this._diff + 'px';
};
TextareaAutosize.prototype.triggerInput = function () {
  var event = document.createEvent('HTMLEvents');
  event.initEvent('input', true, false);
  this.el.dispatchEvent(event);
  return this;
};

/**
 * Unbind events
 */
TextareaAutosize.prototype.destroy = function () {
  _componentEvent.default.unbind(this.el, 'input', this._boundInputHandler);
  this._boundInputHandler = undefined;
  return this;
};
function containsText(val) {
  return val.replace(/\s/g, '').length > 0;
}