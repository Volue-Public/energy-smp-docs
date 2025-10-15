"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = clickOutside;
var _componentEvent = _interopRequireDefault(require("component-event"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function clickOutside(elements, fn) {
  var self = {
    on,
    off,
    isClicked
  };
  var clickedEl;
  var handlers;
  function stop(e) {
    clickedEl = this;
    e.stopPropagation();
  }
  function pass() {
    clickedEl = undefined;
    fn();
  }
  function isClicked(el) {
    return el === clickedEl;
  }
  function on() {
    handlers = Array.prototype.map.call(elements, function (el) {
      return _componentEvent.default.bind(el, 'mousedown', stop.bind(el));
    });
    _componentEvent.default.bind(document.documentElement, 'mousedown', pass);
    return self;
  }
  function off() {
    _componentEvent.default.unbind(document.documentElement, 'mousedown', pass);
    Array.prototype.forEach.call(elements, function (el, i) {
      _componentEvent.default.unbind(el, 'mousedown', handlers[i]);
    });
    return self;
  }
  return self;
}