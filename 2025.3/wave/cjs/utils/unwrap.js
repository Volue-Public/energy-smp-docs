"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = unwrap;
/**
 * Unwraps a DOM element.
 */

function unwrap(wrapper) {
  // place childNodes in document fragment
  var docFrag = document.createDocumentFragment();
  while (wrapper.firstChild) {
    var child = wrapper.removeChild(wrapper.firstChild);
    docFrag.appendChild(child);
  }

  // replace wrapper with document fragment
  wrapper.parentNode.replaceChild(docFrag, wrapper);
}