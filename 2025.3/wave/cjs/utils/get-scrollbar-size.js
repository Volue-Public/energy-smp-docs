"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getScrollbarSize;
/**
 * Scrollbar size detection
 */

function getScrollbarSize() {
  var div = document.createElement('div');
  var styles = {
    width: '50px',
    height: '50px',
    overflow: 'scroll',
    position: 'absolute',
    top: '-999px'
  };
  for (var prop in styles) {
    if (Object.prototype.hasOwnProperty.call(styles, prop)) {
      div.style[prop] = styles[prop];
    }
  }
  document.body.appendChild(div);
  var scrollbarSize = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);
  return scrollbarSize;
}