"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createFileInput;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _componentEvents = _interopRequireDefault(require("component-events"));
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _inheritPrototype = _interopRequireDefault(require("../utils/inherit-prototype"));
var _stringInterpolate = _interopRequireDefault(require("../utils/string-interpolate"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var document = window.document;
function createFileInput(el, options) {
  return new FileInput(el, options);
}
function FileInput(el, options) {
  if (!el || el.nodeName !== 'INPUT') {
    throw new Error('Wave.FileInput() requires an <input> DOM element to initialize');
  }
  this.options = options || {};
  this._init(el);
}
(0, _inheritPrototype.default)(FileInput, _emitterComponent.default);
FileInput.prototype._init = function (el) {
  this.el = el;
  this.container = this.el.parentNode;
  this.labelNode = this.container.children[0];
  this.labelTxt = this.options.labelTxt || this.el.getAttribute('data-label') || '{number} files selected';
  this._renderFileInfo();
  this.events = (0, _componentEvents.default)(this.el, this);
  this.events.bind('change', '_handleChange');
  this.events.bind('focus', '_handleFocus');
  this.events.bind('blur', '_handleBlur');
  return this;
};
FileInput.prototype._handleFocus = function () {
  (0, _componentClasses.default)(this.container).add('fileInput--is-focused');
};
FileInput.prototype._handleBlur = function () {
  (0, _componentClasses.default)(this.container).remove('fileInput--is-focused');
};
FileInput.prototype._handleChange = function (e) {
  var files = [];
  var input = e.target;
  if (input.files) {
    files = input.files;
  } else {
    var file = this.value;
    if (file) {
      files[0] = {
        // Normalize strings and remove the path
        name: file.replace(/\\/g, '/').split('/').pop()
      };
    }
  }
  if (this.options.onChange && typeof this.options.onChange === 'function') {
    this.options.onChange.call(input, this, files);
  }
  this.emit('changed', files);
  this._updateLabel(files);
};
FileInput.prototype._updateLabel = function (files) {
  var len = files.length;
  if (len !== 0) {
    if (!(0, _componentClasses.default)(this.labelNode).has('fileInput-label--is-hidden')) {
      (0, _componentClasses.default)(this.labelNode).add('fileInput-label--is-hidden');
      (0, _componentClasses.default)(this.fileInfoNode).remove('fileInput-info--is-hidden');
    }
    if (len === 1) {
      this._updateFileInfo(files[0].name);
    } else {
      this._updateFileInfo((0, _stringInterpolate.default)(this.labelTxt, {
        number: len
      }));
    }
  } else {
    (0, _componentClasses.default)(this.fileInfoNode).add('fileInput-info--is-hidden');
    (0, _componentClasses.default)(this.labelNode).remove('fileInput-label--is-hidden');
  }
  return this;
};
FileInput.prototype._renderFileInfo = function () {
  this.fileInfoNode = document.createElement('span');
  this.fileInfoNode.className = 'fileInput-info fileInput-info--is-hidden';
  this.container.appendChild(this.fileInfoNode);
  return this;
};
FileInput.prototype._updateFileInfo = function (name) {
  this.fileInfoNode.innerHTML = name;
  return this;
};

/**
 * Enables file input
 */
FileInput.prototype.enable = function () {
  this.el.removeAttribute('disabled');
  (0, _componentClasses.default)(this.container).remove('fileInput--is-disabled');
  return this;
};

/**
 * Disables file input
 */
FileInput.prototype.disable = function () {
  this.el.setAttribute('disabled', 'disabled');
  (0, _componentClasses.default)(this.container).add('fileInput--is-disabled');
  return this;
};
FileInput.prototype.destroy = function () {
  this.events.unbind();
  this.container.removeChild(this.fileInfoNode);
  (0, _componentClasses.default)(this.labelNode).remove('fileInput-label--is-hidden');
};