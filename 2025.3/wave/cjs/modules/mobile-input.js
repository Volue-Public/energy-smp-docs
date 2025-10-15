"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createMobileInput;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _closest = _interopRequireDefault(require("../utils/closest"));
var _hasFeature = _interopRequireDefault(require("../utils/has-feature"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var hasTouch = (0, _hasFeature.default)('touch');
function createMobileInput(el, options) {
  return new MobileInput(el, options);
}
function MobileInput(el, options) {
  if (!el || el.nodeName !== 'INPUT') {
    throw new Error('Wave.MobileInput() requires an <input> DOM element to initialize');
  }
  options = options || {};
  this.options = options;
  if (!hasTouch) {
    return;
  }
  if (typeof options.type === 'string' && (0, _hasFeature.default)('inputs.' + options.type)) {
    this._init(el, options.type);
  }
}
MobileInput.prototype._title = null;
MobileInput.prototype._pattern = null;
MobileInput.prototype._hasFieldHint = false;
MobileInput.prototype._converted = false;
MobileInput.prototype._init = function (el, type) {
  this.el = el;
  if (this.el.hasAttribute('title')) {
    this._title = this.el.getAttribute('title');
    this.el.removeAttribute('title');
  }

  // The pattern attribute works with the url, tel and email input types
  if (!/^(url|tel|email)$/.test(type) && this.el.hasAttribute('pattern')) {
    this._pattern = this.el.getAttribute('pattern');
    this.el.removeAttribute('pattern');
  }
  this._lastType = this.el.type;
  this.el.type = type;
  var fieldLabel = (0, _closest.default)(this.el, 'label');
  var fieldHint = fieldLabel && fieldLabel.querySelector('.fieldHint');
  if (/^(date|time)$/.test(type) && fieldHint != null) {
    this._hasFieldHint = true;
    this._fieldHint = fieldHint;
    (0, _componentClasses.default)(fieldHint).add('is-hidden');
  }
  this._converted = true;

  // Store the MobileInput instance
  this.el.MobileInput = this;
  return this;
};

/**
 * Return boolean whether the input is converted
 */
MobileInput.prototype.isConverted = function () {
  return this._converted;
};

/**
 * Removes instance of module
 */
MobileInput.prototype.destroy = function () {
  if (!hasTouch) {
    return;
  }
  if (this._title) {
    this.el.setAttribute('title', this._title);
  }
  if (this._pattern) {
    this.el.setAttribute('pattern', this._pattern);
  }
  if (this._hasFieldHint) {
    (0, _componentClasses.default)(this._fieldHint).remove('is-hidden');
  }
  this.el.type = this._lastType;
  this._converted = false;

  // Remove the MobileInput instance
  this.el.MobileInput = undefined;
};