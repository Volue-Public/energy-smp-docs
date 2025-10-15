"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isStyleSupported;
/**
 * Detect support for CSS styles and assignable values
 */

var el = window.document.createElement('div');
var prefixes = ['Webkit', 'Moz', 'O', 'ms'];
var camelRe = /-([a-z]|[0-9])/gi;
var cache = {};
var key;
var length;
var support;
var camel;
var capitalized;
var prefixed;
function isStyleSupported(style, value) {
  value = arguments.length === 2 ? value : 'inherit';
  key = style + ':' + value;
  if (key in cache) {
    return cache[key];
  }
  support = supports(style, value);
  if (!support) {
    camel = toCamelCase(style);
    capitalized = camel.charAt(0).toUpperCase() + camel.slice(1);
    el.style.cssText = style + ':' + value;
    support = camel in el.style && el.style[camel] !== '';
    length = prefixes.length;
    while (!support && length--) {
      prefixed = '-' + prefixes[length].toLowerCase() + '-' + style;
      support = supports(prefixed, value);
      if (!support) {
        camel = prefixes[length] + capitalized;
        el.style.cssText = prefixed + ':' + value;
        support = camel in el.style && el.style[camel] !== '';
      }
    }
  }
  return cache[key] = support;
}

/**
 * Convert css notation (hypenated) to DOM notation (camel cased)
 */
function toCamelCase(style) {
  return style.replace(camelRe, function (all, letter) {
    return (letter + '').toUpperCase();
  });
}

/**
 * Encapsulate the different native APIs in a function
 */
function supports(style, value) {
  // Check for the standard native method first
  if ('CSS' in window && 'supports' in window.CSS) {
    return window.CSS.supports(style, value);
  }
  // Check for Opera's native method
  if ('supportsCSS' in window) {
    return window.supportsCSS(style, value);
  }
  return false;
}