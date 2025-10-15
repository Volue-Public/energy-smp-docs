"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createMenu;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _componentEvent = _interopRequireDefault(require("component-event"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var document = window.document;
function createMenu(el, options) {
  return new Menu(el, options);
}
createMenu.autoInit = true;
function Menu(el, options) {
  if (!el) {
    throw new Error('Wave.Menu() requires a DOM element to initialize');
  }
  this.el = el;
  this.trigger = options.trigger;
  this._handleClickOutside = this._handleClickOutside.bind(this);
  this._handleTriggerClick = this._handleTriggerClick.bind(this);
  if (this.trigger) {
    _componentEvent.default.bind(this.trigger, 'click', this._handleTriggerClick);
  }
}
Menu.prototype.open = function () {
  var self = this;
  (0, _componentClasses.default)(this.el).add('is-active');
  setTimeout(function () {
    _componentEvent.default.bind(document.documentElement, 'click', self._handleClickOutside);
  }, 0);
  return this;
};
Menu.prototype.close = function () {
  _componentEvent.default.unbind(document.documentElement, 'click', this._handleClickOutside);
  (0, _componentClasses.default)(this.el).remove('is-active');
  return this;
};
Menu.prototype.toggle = function () {
  if (this.isOpen()) {
    this.close();
  } else {
    this.open();
  }
  return this;
};
Menu.prototype.isOpen = function () {
  return (0, _componentClasses.default)(this.el).has('is-active');
};
Menu.prototype.destroy = function () {
  (0, _componentClasses.default)(this.el).remove('is-active');
  _componentEvent.default.unbind(document.documentElement, 'click', this._handleClickOutside);
  _componentEvent.default.unbind(this.trigger, 'click', this._handleTriggerClick);
};
Menu.prototype._handleClickOutside = function (e) {
  if (!this.el.contains(e.target) && this.isOpen()) {
    this.close();
  }
};
Menu.prototype._handleTriggerClick = function (e) {
  if (e.target === this.trigger) {
    this.toggle();
  }
};