"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createProgressBar;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _componentEvent = _interopRequireDefault(require("component-event"));
var _domify = _interopRequireDefault(require("domify"));
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _extend = _interopRequireDefault(require("extend"));
var _template = _interopRequireDefault(require("./template"));
var _debounce = _interopRequireDefault(require("../../utils/debounce"));
var _inheritPrototype = _interopRequireDefault(require("../../utils/inherit-prototype"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function createProgressBar(el, options) {
  return new ProgressBar(el, options);
}
var defaults = {
  color: 'info--strong',
  htmlCaption: false,
  captionPadding: 20
};
function ProgressBar(el, options) {
  if (!el) {
    throw new Error('Wave.ProgressBar() requires a DOM element to initialize');
  }
  _emitterComponent.default.call(this);
  this.options = (0, _extend.default)(true, {}, defaults, options);
  this.el = el;
  this._progress = 0;
  this._color = this.options.color;
  this._status = null;
  this._render();
}
(0, _inheritPrototype.default)(ProgressBar, _emitterComponent.default);
ProgressBar.prototype._hasCaption = false;
ProgressBar.prototype._render = function () {
  this.progressBar = (0, _domify.default)(_template.default);
  if (this.options.progressBarClass) {
    this.progressBar.className += ' ' + this.options.progressBarClass;
  }
  this.barCaption = this.progressBar.querySelector('.js-barCaption');
  if (this.options.captionClass) {
    this.barCaption.className += ' ' + this.options.captionClass;
  }
  if (this.options.caption) {
    this._setCaption(this.options.caption);
  }
  this.indicatorBar = this.progressBar.querySelector('.js-indicatorBar');
  (0, _componentClasses.default)(this.indicatorBar).add('fill-' + this._color);
  this.el.appendChild(this.progressBar);
  this._boundHandleResize = (0, _debounce.default)(this._handleResize.bind(this), 100);
  _componentEvent.default.bind(window, 'resize', this._boundHandleResize);
};

/**
 * Set new progress value
 */
ProgressBar.prototype.setProgress = function (progress) {
  if (progress !== undefined && typeof progress === 'number' && progress <= 100 && progress >= 0) {
    // Force the layout to be computed
    // eslint-disable-next-line no-unused-expressions
    this.progressBar.offsetHeight;
    this.indicatorBar.style.width = progress + '%';
    this._progress = progress;
    this._positionCaption();
    this.emit('progress', progress);
  } else {
    throw Error('Progressbar: progress must be a number between 0 and 100');
  }
  return this;
};

/**
 * Set background fill for indicator bar
 */
ProgressBar.prototype.setFill = function (color) {
  if (color !== undefined && typeof color === 'string') {
    (0, _componentClasses.default)(this.indicatorBar).remove('fill-' + this._color).add('fill-' + color);
    this._color = color;
  } else {
    throw Error('Progressbar: background color must be a string');
  }
  return this;
};

/**
 * Set progress bar's caption
 */
ProgressBar.prototype.setCaption = function (caption) {
  this._setCaption(caption);
  return this;
};
ProgressBar.prototype._setCaption = function (caption) {
  if (this.options.htmlCaption) {
    this.barCaption.innerHTML = caption;
  } else {
    this.barCaption.textContent = caption;
  }
  this._hasCaption = true;
};
ProgressBar.prototype._positionCaption = function () {
  var progressBarWidth = this.progressBar.clientWidth;
  var barCaptionWidth = this.barCaption.clientWidth;
  var left = 0;
  var padding = this.options.captionPadding;
  var offset = this._progress / 100 * progressBarWidth;
  if (barCaptionWidth + padding < offset) {
    left = offset - barCaptionWidth - padding / 2;
  } else {
    left = offset + padding / 2;
  }
  this.barCaption.style.left = left + 'px';
};
ProgressBar.prototype._handleResize = function () {
  this._hasCaption && this._positionCaption();
};

/**
 * Get current progress
 */
ProgressBar.prototype.getProgress = function () {
  return this._progress;
};

/**
 * Get or set the progress bar's status
 */
ProgressBar.prototype.status = function (status) {
  if (status === undefined) {
    return this._status;
  }
  var progressBarClasses = (0, _componentClasses.default)(this.progressBar);
  if (this._status != null) {
    progressBarClasses.remove('progressBar--' + this._status);
  }
  if (status != null) {
    progressBarClasses.add('progressBar--' + status);
  }
  this._status = status;
  this.emit('status', status);
  return this;
};

/**
 * Hides progress bar
 */
ProgressBar.prototype.hide = function () {
  (0, _componentClasses.default)(this.progressBar).add('progressBar--is-hidden');
  return this;
};

/**
 * Shows progress bar
 */
ProgressBar.prototype.show = function () {
  (0, _componentClasses.default)(this.progressBar).remove('progressBar--is-hidden');
  return this;
};