"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initWave;
var _inputToggles = require("./legacy/input-toggles");
var _menu = _interopRequireDefault(require("./modules/menu"));
var _modal = require("./modules/modal/modal");
var _toggle = _interopRequireDefault(require("./modules/toggle"));
var _domReady = _interopRequireDefault(require("./utils/dom-ready"));
var _hasFeature = _interopRequireDefault(require("./utils/has-feature"));
var _isStyleSupported = _interopRequireDefault(require("./utils/is-style-supported"));
var _stubs = require("./utils/stubs");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function initWave(options) {
  options = options || {};

  // Cutting the mustard test - check if this web browser has the basic features
  // we need
  if (!((0, _hasFeature.default)('querySelector') && (0, _hasFeature.default)('addEventListener') && Array.prototype.forEach)) {
    throw new Error('Browser unsupported. Please try a newer web browser.');
  }
  (0, _stubs.init)();

  // Polyfill to support modern functionality in IE11
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

  // Append capability specific classes to the root element
  (function (docEl) {
    docEl.className = docEl.className.replace('no-js', '');
    docEl.className += ' has-js';
    if ((0, _isStyleSupported.default)('display', 'flex') || (0, _isStyleSupported.default)('display', '-webkit-flex') || (0, _isStyleSupported.default)('display', '-moz-flex') || (0, _isStyleSupported.default)('display', '-ms-flex')) {
      docEl.className += ' has-flexbox';
    }
    if ((0, _isStyleSupported.default)('animation-name')) {
      docEl.className += ' has-animation';
    }
    if ((0, _hasFeature.default)('touch')) {
      docEl.className += ' has-touch';
    }
    if ((0, _hasFeature.default)('viewportUnit')) {
      docEl.className += ' has-viewportUnit';
    }
  })(document.documentElement);
  if (options.avoidSideEffects === true) {
    return;
  }

  // Auto-instantiate some behaviours
  (0, _domReady.default)(function () {
    (0, _modal.listen)();

    // Dropdowns
    (0, _toggle.default)('.js-triggerDropdown', {
      toggleClass: 'dropdown--is-open'
    }).onClickToggleAll().offClickCloseAll();

    // Collabsible panels
    (0, _toggle.default)('.js-triggerExpand', {
      toggleClass: 'collapsiblePanel--is-expanded'
    }).onClickToggle();

    // Side drawer
    (0, _toggle.default)('.js-toggleSideDrawer', {
      toggleClass: 'sideDrawer--is-open'
    }).onClickToggleAll().offClickCloseAll();
    var collapsibleNavs = document.querySelectorAll('.nav--collapse');
    if (_menu.default.autoInit && collapsibleNavs.length > 0) {
      for (var i = 0; i < collapsibleNavs.length; i++) {
        var collapsibleNav = collapsibleNavs[i];
        (0, _menu.default)(collapsibleNav, {
          trigger: collapsibleNav
        });
      }
    }
    (0, _inputToggles.init)();
  });
}