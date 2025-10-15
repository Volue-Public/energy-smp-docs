"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _inheritPrototype = _interopRequireDefault(require("../utils/inherit-prototype"));
var _raf = _interopRequireDefault(require("../utils/raf"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var document = window.document;
var documentEl = document.documentElement;
var matchMedia = window.matchMedia || window.msMatchMedia;
var isResized = false;
var isScrolled = false;
var instance = null;
function _default() {
  return new ViewportMonitor();
}
function ViewportMonitor() {
  // Singleton
  if (!instance) {
    instance = this;
    this._init();
  }
  return instance;
}
(0, _inheritPrototype.default)(ViewportMonitor, _emitterComponent.default);
ViewportMonitor.prototype._init = function () {
  var self = this;
  window.addEventListener('resize', function () {
    isResized = true;
  }, false);
  window.addEventListener('scroll', function () {
    isScrolled = true;
  }, false);
  this._lastOffset = getScrollY();
  this.refresh();

  // call update() only once per frame to improve performance
  (function loop() {
    (0, _raf.default)(loop);
    update.call(self);
  })();
  return this;
};
ViewportMonitor.prototype._calcDimensions = function () {
  this.height = getHeight();
  this.width = getWidth();
  return this;
};
ViewportMonitor.prototype._calcScroll = function () {
  this.scrollY = getScrollY();
  this.scrollX = getScrollX();
  return this;
};
ViewportMonitor.prototype._calcScrollDirection = function () {
  var offset = this.scrollY;
  var diff = offset - this._lastOffset;
  var direction = Math.abs(diff) / diff;
  this._lastOffset = offset;

  // eslint-disable-next-line eqeqeq
  if (!isNaN(direction) && direction != this.scrollDirection) {
    this.scrollDirection = direction;
  }
  return this;
};
ViewportMonitor.prototype._calcOffset = function () {
  this.top = this.scrollY;
  this.right = this.scrollX + this.width;
  this.bottom = this.scrollY + this.height;
  this.left = this.scrollX;
  return this;
};
ViewportMonitor.prototype._calcOrientation = function () {
  var screenOrientation = window.screen.orientation || window.screen.mozOrientation || window.screen.msOrientation || undefined;
  var orientation;
  if (screenOrientation) {
    orientation = typeof screenOrientation === 'string' ? screenOrientation.split('-')[0] : screenOrientation.type.split('-')[0];
  } else if (matchMedia) {
    orientation = matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
  } else {
    orientation = this.height >= this.width ? 'portrait' : 'landscape';
  }
  this.orientation = orientation;
  return this;
};

/**
 * Determines if scroll position is at maximum for the document
 */
ViewportMonitor.prototype.isScrollMax = function () {
  return this.height + this.scrollY >= document.body.scrollHeight;
};

/**
 * Determines if scroll position is at minimum for the document
 */
ViewportMonitor.prototype.isScrollMin = function () {
  return this.scrollY <= 0;
};

/**
 * Determines if a given element is in the viewport
 * `verge` acts as a cushion around the viewport
 */
ViewportMonitor.prototype.isInViewport = function (el, verge) {
  if (typeof el === 'undefined') {
    throw new Error('Wave.ViewportMonitor.isInViewport() requires a DOM element');
  }
  var rect = calibrate(el.getBoundingClientRect(), verge);
  return rect.bottom >= 0 && rect.right >= 0 && rect.top <= this.height && rect.left <= this.width;
};

/**
 * Determines if a given element is in the same x-axis section as the viewport
 */
ViewportMonitor.prototype.isInY = function (el, verge) {
  if (typeof el === 'undefined') {
    throw new Error('Wave.ViewportMonitor.isInY() requires a DOM element');
  }
  var rect = calibrate(el.getBoundingClientRect(), verge);
  return rect.bottom >= 0 && rect.top <= this.height;
};

/**
 * Determines if a given element is in the same y-axis section as the viewport
 */
ViewportMonitor.prototype.isInX = function (el, verge) {
  if (typeof el === 'undefined') {
    throw new Error('Wave.ViewportMonitor.isInX() requires a DOM element');
  }
  var rect = calibrate(el.getBoundingClientRect(), verge);
  return rect.right >= 0 && rect.left <= this.width;
};

/**
 * Determines if a media query is active
 */
ViewportMonitor.prototype.mq = matchMedia ? function (query) {
  return !!matchMedia.call(window, query).matches;
} : function () {
  return false;
};

/**
 * Update the viewport dimensions, positions and orientation
 */
ViewportMonitor.prototype.refresh = function () {
  this._calcDimensions();
  this._calcScroll();
  this._calcScrollDirection();
  this._calcOffset();
  this._calcOrientation();
  return this;
};
function update() {
  if (!isResized && !isScrolled) {
    return;
  }
  var evt = isResized ? 'resize' : 'scroll';
  this.refresh();
  isResized = false;
  isScrolled = false;
  this.emit(evt);
}
function getHeight() {
  return Math.max(documentEl.clientHeight, window.innerHeight || 0);
}
function getWidth() {
  return Math.max(documentEl.clientWidth, window.innerWidth || 0);
}
function getScrollY() {
  var scrollY = window.pageYOffset;
  if (typeof scrollY === 'number') {
    return scrollY;
  }
  return documentEl.scrollTop;
}
function getScrollX() {
  var scrollX = window.pageXOffset;
  if (typeof scrollX === 'number') {
    return scrollX;
  }
  return documentEl.scrollLeft;
}
function calibrate(coords, verge) {
  var o = {};
  verge = typeof verge === 'number' ? verge || 0 : 0;
  o.width = (o.right = coords.right + verge) - (o.left = coords.left - verge);
  o.height = (o.bottom = coords.bottom + verge) - (o.top = coords.top - verge);
  return o;
}