"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createOverlay;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _componentEvent = _interopRequireDefault(require("component-event"));
var _domify = _interopRequireDefault(require("domify"));
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _template = _interopRequireDefault(require("./template"));
var _inheritPrototype = _interopRequireDefault(require("../../utils/inherit-prototype"));
var _transitEnd = _interopRequireDefault(require("../../utils/transit-end"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var document = window.document;
var body = document.body;
function createOverlay(options) {
  return new Overlay(options);
}
function Overlay(options) {
  _emitterComponent.default.call(this);
  this.options = options || {};
  this._hidden = true;
  this._closable = this.options.closable;
  this.target = this.options.target || body;
  this.el = (0, _domify.default)(_template.default);
  this._handleClick = this._handleClick.bind(this);
  _componentEvent.default.bind(this.el, 'click', this._handleClick);
  if (body === this.target) {
    (0, _componentClasses.default)(this.el).add('overlay--fixed');
  }
  if (this.options.overlayClass) {
    this.el.className += ' ' + this.options.overlayClass;
  }
  if (this.options.zIndex) {
    this.el.style.zIndex = this.options.zIndex;
  }
}
(0, _inheritPrototype.default)(Overlay, _emitterComponent.default);
Overlay.prototype.show = function () {
  var _this = this;
  if (this._hidden === false || this._animating) {
    return;
  }
  this._hidden = false;
  this._animating = true;
  this.emit('showing');
  this.target.appendChild(this.el);

  // Force the layout to be computed
  // eslint-disable-next-line no-unused-expressions
  this.el.offsetHeight;
  (0, _componentClasses.default)(this.el).remove('overlay--is-hidden').add('overlay--is-shown');
  (0, _transitEnd.default)(this.el, function () {
    _this._animating = false;
    _this.emit('show');
  });
  return this;
};
Overlay.prototype.hide = function () {
  var _this = this;
  if (this._hidden) {
    return;
  }
  this._hidden = true;
  this._animating = true;
  this.emit('hiding');

  // Force the layout to be computed
  // eslint-disable-next-line no-unused-expressions
  this.el.offsetHeight;
  (0, _componentClasses.default)(this.el).remove('overlay--is-shown').add('overlay--is-hidden');
  (0, _transitEnd.default)(this.el, function () {
    _this._animating = false;
    _this.emit('hide');
    _this.el.parentNode.removeChild(_this.el);
  });
  return this;
};

/**
 * Sets a new target for overlay
 */
Overlay.prototype.setTarget = function (target) {
  this.target = target;
  this.emit('settarget');
  return this;
};

/**
 * When the overlay is clicked, emit an event so that the view that is using this overlay can choose
 * to close it
 */
Overlay.prototype._handleClick = function (e) {
  if (this._closable) {
    this.emit('click', e);
  }
};
Overlay.prototype.getElement = function () {
  return this.el;
};
Overlay.prototype.destroy = function () {
  _componentEvent.default.unbind(this.el, 'click', this._handleClick);
  this._handleClick = undefined;
  this.el = null;
  this.target = null;
};