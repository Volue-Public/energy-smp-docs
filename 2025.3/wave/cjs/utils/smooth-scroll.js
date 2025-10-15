"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = smoothScroll;
var _raf = _interopRequireDefault(require("./raf"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Utility that enables smooth scrolling
 */

var document = window.document;
var documentEl = document.documentElement;
function smoothScroll(el, destination, duration, callback) {
  var startTop, startLeft, setElementScroll, destinationTop, destinationLeft;
  if (typeof el === 'undefined') {
    throw new Error('Wave.utils.smoothScroll() requires a DOM element or Window object');
  }
  if (el === window) {
    startTop = el.pageYOffset || documentEl.scrollTop || document.body.scrollTop || 0;
    startLeft = el.pageXOffset || documentEl.scrollLeft || document.body.scrollLeft || 0;
    setElementScroll = function (element, x, y) {
      el.scrollTo(x, y);
    };
  } else {
    startTop = el.scrollTop || 0;
    startLeft = el.scrollLeft || 0;
    setElementScroll = function (element, x, y) {
      el.scrollLeft = x;
      el.scrollTop = y;
    };
  }
  if (!!callback && typeof callback !== 'function') {
    throw new Error('Wave.utils.smoothScroll(): callback parameter must be a function');
  }
  callback = callback || function () {};
  if (typeof destination === 'number') {
    destinationTop = destination;
    destinationLeft = startLeft;
  } else {
    destinationTop = getFirstNum(destination.top, startTop);
    destinationLeft = getFirstNum(destination.left, startLeft);
  }
  timer(function (i) {
    setElementScroll(el, startLeft * (1 - i) + destinationLeft * i, startTop * (1 - i) + destinationTop * i);
  }, getFirstNum(duration, 300), callback);
}

// AnimationFrame manager
function timer(fn, duration, callback) {
  var start = new Date().getTime();
  var end = start + duration;
  var current = start;
  var lastPercent = 0;
  (0, _raf.default)(step);
  function step() {
    current = new Date().getTime();
    lastPercent = (current - start) / duration;
    fn(lastPercent = lastPercent < 1 ? lastPercent : 1);
    if (current > end) {
      // eslint-disable-next-line eqeqeq
      if (lastPercent != 1) {
        (0, _raf.default)(function () {
          fn(1);
        });
      } else {
        callback();
      }
    } else {
      (0, _raf.default)(step);
    }
  }
}
function getFirstNum() {
  var index = -1;
  var length = arguments.length;
  while (++index < length) {
    if (typeof arguments[index] === 'number') {
      return arguments[index];
    }
  }
}