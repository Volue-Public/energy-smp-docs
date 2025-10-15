"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var CustomEvent;
if (typeof window !== 'undefined' && typeof window.CustomEvent !== 'function') {
  CustomEvent = function (event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  };
  CustomEvent.prototype = window.Event.prototype;
} else {
  CustomEvent = window.CustomEvent;
}
var _default = exports.default = CustomEvent;