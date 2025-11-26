"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = whichTransitionEvent;
var transitions = {
  transition: 'transitionend',
  OTransition: 'oTransitionEnd',
  MozTransition: 'transitionend',
  WebkitTransition: 'webkitTransitionEnd'
};
var memo;
function whichTransitionEvent() {
  if (memo === undefined) {
    var el = document.createElement('fakeelement');
    for (var t in transitions) {
      if (el.style[t] !== undefined) {
        memo = transitions[t];
        return memo;
      }
    }
  }
  return memo;
}