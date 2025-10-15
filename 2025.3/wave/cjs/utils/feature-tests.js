"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * Input feature detection
 */
function isInputTypeSupported(typeName) {
  var input = document.createElement('input');
  var smile = ':)';
  input.setAttribute('type', typeName);
  var bool = input.type !== 'text';
  if (bool) {
    input.value = smile;
    input.style.cssText = 'position:absolute;visibility:hidden;';
    if (/^(search|tel)$/.test(typeName)) {
      // pass this through as true
    } else if (/^(url|email)$/.test(typeName)) {
      bool = input.checkValidity && input.checkValidity() === false;
    } else {
      // eslint-disable-next-line eqeqeq
      bool = input.value != smile;
    }
  }
  return bool;
}
var _default = exports.default = {
  bind: !!function () {}.bind,
  addEventListener: !!window.addEventListener,
  querySelector: !!document.querySelector,
  svg: !!document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1'),
  touch: Boolean('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch // eslint-disable-line
  ),
  orientationChange: 'onorientationchange' in window,
  history: !!(window.history && window.history.pushState),
  placeholder: !!('placeholder' in document.createElement('input') && 'placeholder' in document.createElement('textarea')),
  viewportUnit: function (el) {
    el.style.width = '100vw';
    var test = el.style.width !== '';
    return !!test;
  }(document.createElement('dummy')),
  inputs: {
    time: isInputTypeSupported('time'),
    date: isInputTypeSupported('date'),
    number: isInputTypeSupported('number'),
    email: isInputTypeSupported('email'),
    tel: isInputTypeSupported('tel'),
    url: isInputTypeSupported('url'),
    search: isInputTypeSupported('search')
  }
};