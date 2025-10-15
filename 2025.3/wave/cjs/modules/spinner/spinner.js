"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSpinner;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _domify = _interopRequireDefault(require("domify"));
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _extend = _interopRequireDefault(require("extend"));
var _template = _interopRequireDefault(require("./template"));
var _templateInline = _interopRequireDefault(require("./template-inline"));
var _inheritPrototype = _interopRequireDefault(require("../../utils/inherit-prototype"));
var _overlay = _interopRequireDefault(require("../overlay/overlay"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function createSpinner(el, options) {
  return new Spinner(el, options);
}
var defaults = {
  color: 'fg-accent--moderate',
  inline: false
};
function Spinner(el, options) {
  if (!el) {
    throw new Error('Wave.Spinner() requires a DOM element to initialize');
  }
  _emitterComponent.default.call(this);
  this.options = (0, _extend.default)(true, {}, defaults, options);
  this._appended = false;
  this._inline = this.options.inline;
  this.el = el;
}
(0, _inheritPrototype.default)(Spinner, _emitterComponent.default);
Spinner.prototype.overlay = function (options) {
  // Prevent appending the overlay if spinner is inline
  if (this._inline) {
    return this;
  }
  var overlayOptions = (0, _extend.default)(true, {}, {
    target: this.el
  }, options);
  var _this = this;
  var overlay = (0, _overlay.default)(overlayOptions);
  this.on('show', function () {
    overlay.show();
  });
  this.on('hide', function () {
    overlay.hide();
  });
  overlay.on('click', function () {
    _this.hide();
  });
  this._overlay = overlay;
  return this;
};
Spinner.prototype.show = function () {
  if (!this.el || this._appended) {
    return;
  }
  if (!this._inline) {
    this.spinner = (0, _domify.default)(_template.default);
    (0, _componentClasses.default)(this.spinner).add(this.options.color);
    if (this.options.position) {
      this.spinner.style.position = this.options.position;
    }
    if (this.options.offset) {
      if (this.options.offset === '50%') {
        (0, _componentClasses.default)(this.spinner).add('tC').add('lC');
      } else {
        this.spinner.style.top = this.options.offset;
      }
    }

    // Append to overlay if overlay is present
    if (this._overlay) {
      // this.options.color = 'white';
      this.el = this._overlay.getElement();
    }
  } else {
    this.spinner = (0, _domify.default)(_templateInline.default);
    (0, _componentClasses.default)(this.spinner).add(this.options.color);
  }
  if (!this.options.insertionType || this.options.insertionType !== 'prepend') {
    this.el.appendChild(this.spinner);
  } else {
    this.el.insertBefore(this.spinner, this.el.firstChild);
  }
  this._appended = true;
  this.emit('show');
  return this;
};
Spinner.prototype.hide = function () {
  if (this._appended) {
    this.spinner.parentNode.removeChild(this.spinner);
    this._appended = false;
  }
  this.emit('hide');
  return this;
};

/**
 * Returns a boolean specifying if the spinner is shown
 */
Spinner.prototype.isShown = function () {
  return this._appended;
};