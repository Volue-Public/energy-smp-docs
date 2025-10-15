"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadCss;
/**
 * Load CSS asynchronously
 */

function loadCss(href, options, callback) {
  if (typeof options === 'boolean') {
    options = {
      prepend: options
    };
  }
  options = options || {};
  var link = document.createElement('link');
  var head = document.getElementsByTagName('head')[0];
  var sheets = document.styleSheets;
  link.rel = 'stylesheet';
  link.href = href;
  link.media = 'only x';
  if (options.prepend) {
    head.insertBefore(link, head.childNodes[0]);
  } else {
    head.appendChild(link);
  }
  function toggleMedia() {
    var defined;
    for (var i = 0; i < sheets.length; i++) {
      if (sheets[i].href && ~sheets[i].href.indexOf(href)) {
        defined = true;
      }
    }
    if (defined) {
      link.media = 'all';
      callback && callback();
    } else {
      setTimeout(toggleMedia);
    }
  }
  toggleMedia();
  return link;
}