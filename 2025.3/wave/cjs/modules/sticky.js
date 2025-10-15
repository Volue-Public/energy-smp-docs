"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _extend = _interopRequireDefault(require("extend"));
var _detect = _interopRequireDefault(require("../utils/detect"));
var _setImmediate = _interopRequireDefault(require("../utils/set-immediate"));
var _tokenize = _interopRequireDefault(require("../utils/tokenize"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var requestAnimationFrame = (0, _detect.default)('requestAnimationFrame', ['webkit', 'moz']);
var document = window.document;
var zIndexOffset = 0;
var defaults = {
  zIndexBase: 0,
  zIndexManagement: true,
  stickyClass: 'sticky',
  placeholderClass: 'stickyPlaceholder',
  top: 0,
  onStuck: null,
  onUnstuck: null
};
function _default(nodes, options) {
  return new StickyWrapper(nodes, options);
}
function StickyWrapper(nodes, options) {
  if (nodes.length === undefined) {
    nodes = [nodes];
  }
  var i = 0;
  var len = nodes.length;
  for (i; i < len; i += 1) {
    this.collection.push(new Sticky(nodes[i], options));
  }
  return this;
}
StickyWrapper.prototype.collection = [];
StickyWrapper.prototype._waitingForUpdate = false;
StickyWrapper.prototype.destroy = function (node) {
  var i = 0;
  var len = this.collection.length;
  var instance;
  for (i; i < len; ++i) {
    instance = this.collection[i];
    if (instance.el === node) {
      instance.destroy();
      this.collection.splice(i, 1);
      return true;
    }
  }
  return false;
};
StickyWrapper.prototype.update = function () {
  if (!this._waitingForUpdate) {
    this._waitingForUpdate = true;

    // avoid too many repaints
    if (requestAnimationFrame) {
      requestAnimationFrame(this._update.bind(this));
    } else {
      setTimeout(this._update.bind(this), 15);
    }
  }
};
StickyWrapper.prototype._update = function () {
  this._waitingForUpdate = false;
  this.collection.forEach(checkPosition);
};
function Sticky(el, options) {
  if (!el) {
    throw new Error('Wave.Sticky() requires a DOM element to initialize');
  }
  this.el = el;
  this.options = (0, _extend.default)(true, {}, defaults, options);
  this._originalZindex = this.el.style.zIndex;
  this._originalTop = this.el.style.top;
  return this;
}
Sticky.prototype.destroy = function () {
  var self = this;
  if (this.options.stickyClass) {
    (0, _tokenize.default)(this.options.stickyClass).forEach(function (token) {
      (0, _componentClasses.default)(self.el).remove(token);
    });
  }
  if (this._placeholder) {
    this.el.parentNode.removeChild(this._placeholder);
    this._placeholder = null;
  }
};
Sticky.prototype._isFixed = false;
function checkPosition(sticky) {
  var offsetTop = sticky.el.getBoundingClientRect().top;
  if (!sticky._isFixed && offsetTop <= sticky.options.top) {
    if (!sticky._placeholder) {
      sticky._placeholder = document.createElement('div');
      if (sticky.el.id) {
        sticky._placeholder.id = sticky.options.placeholderClass + '-' + sticky.el.id;
      }
      sticky._placeholder.className = sticky.options.placeholderClass;
      sticky._placeholder.style.height = sticky.el.offsetHeight + 'px';
      sticky._placeholder.style.position = 'relative';
      sticky.el.nextElementSibling ? sticky.el.parentNode.insertBefore(sticky._placeholder, sticky.el.nextElementSibling) : sticky.el.parentNode.appendChild(sticky._placeholder);
    } else {
      sticky._placeholder.style.display = 'block';
    }
    sticky.el.style.top = sticky.options.top + 'px';
    if (sticky.options.stickyClass) {
      (0, _tokenize.default)(sticky.options.stickyClass).forEach(function (token) {
        (0, _componentClasses.default)(sticky.el).add(token);
      });
    }
    if (sticky.options.zIndexManagement) {
      sticky.el.style.zIndex = sticky.options.zIndexBase + zIndexOffset++;
    }
    sticky._isFixed = true;
    if (sticky.options.onStuck) {
      (0, _setImmediate.default)(function () {
        sticky.options.onStuck.call(sticky, sticky.el);
      });
    }
  } else if (sticky._isFixed) {
    var originalTop = sticky.el.parentElement ? sticky.el.parentElement.getBoundingClientRect().top : 0;
    if (sticky.el.previousElementSibling) {
      originalTop = sticky.el.previousElementSibling.getBoundingClientRect().top + sticky.el.previousElementSibling.getBoundingClientRect().height;
    }
    if (originalTop > sticky.options.top) {
      sticky.el.style.top = sticky._originalTop;
      if (sticky.options.stickyClass) {
        (0, _tokenize.default)(sticky.options.stickyClass).forEach(function (token) {
          (0, _componentClasses.default)(sticky.el).remove(token);
        });
      }
      if (sticky.options.zIndexManagement) {
        sticky.el.style.zIndex = sticky._originalZindex;
      }
      sticky._isFixed = false;
      if (sticky._placeholder) {
        sticky._placeholder.style.display = 'none';
      }
      if (sticky.options.onUnstuck) {
        (0, _setImmediate.default)(function () {
          sticky.options.onUnstuck.call(sticky, sticky.el);
        });
      }
    }
  }
}