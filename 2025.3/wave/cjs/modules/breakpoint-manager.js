"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createBreakpointManager;
var _componentEvent = _interopRequireDefault(require("component-event"));
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _debounce = _interopRequireDefault(require("../utils/debounce"));
var _domReady = _interopRequireDefault(require("../utils/dom-ready"));
var _hasFeature = _interopRequireDefault(require("../utils/has-feature"));
var _inheritPrototype = _interopRequireDefault(require("../utils/inherit-prototype"));
var _trim = _interopRequireDefault(require("../utils/trim"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var document = window.document;
var head = document.head;
var debounceTime;
function createBreakpointManager(options) {
  return new BreakpointManager(options);
}
function BreakpointManager(options) {
  _emitterComponent.default.call(this);
  this.options = options || {};
  debounceTime = this.options.debounceTime || 100;
  this._isReady = false;
  this._isStarted = false;
  this._changeEventName = (0, _hasFeature.default)('orientationChange') ? 'orientationchange' : 'resize';
  (0, _domReady.default)(this._handleDomReady.bind(this));
}
(0, _inheritPrototype.default)(BreakpointManager, _emitterComponent.default);
BreakpointManager.prototype.currentBP = null;

/**
 * Start listening to window#resize
 */
BreakpointManager.prototype.start = function () {
  this._isStarted = true;
  this._boundChange = (0, _debounce.default)(this._change.bind(this), debounceTime);
  _componentEvent.default.bind(window, this._changeEventName, this._boundChange);
  return this;
};

/**
 * Stop listening to window#resize
 */
BreakpointManager.prototype.stop = function () {
  this._isStarted = false;
  if (this._boundChange) {
    _componentEvent.default.unbind(window, this._changeEventName, this._boundChange);
  }
  return this;
};

/**
 * Fetch all breakpoints
 */
BreakpointManager.prototype.getAll = function () {
  var BPs = [];
  var allBP = parseMQ(document.querySelector('title')).split(',');
  for (var i = 0; i < allBP.length; i++) {
    BPs.push((0, _trim.default)(allBP[i]));
  }
  return this._isReady ? BPs : null;
};

/**
 * Fetch the breakpoint in use
 */
BreakpointManager.prototype.getCurrent = function (callback) {
  var nowBP = parseMQ(head);
  return this._isReady ? typeof callback === 'undefined' ? nowBP : callback(nowBP) : null;
};

/**
 * Fire events whenever the breakpoint changes
 */
BreakpointManager.prototype._change = function () {
  var _this = this;
  this.getCurrent(function (bp) {
    if (bp !== _this.currentBP) {
      _this.emit(bp);
      _this.emit('change', bp);
      _this.currentBP = bp;
    }
  });
};
BreakpointManager.prototype._handleDomReady = function () {
  this._isReady = window.getComputedStyle(head, null).getPropertyValue('clear') !== 'none';
  this._isStarted && this._change();
};
function parseMQ(el) {
  var str = window.getComputedStyle(el, null).getPropertyValue('font-family');
  return str.replace(/"/g, '').replace(/'/g, '');
}