"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "debounce", {
  enumerable: true,
  get: function () {
    return _debounce.default;
  }
});
Object.defineProperty(exports, "empty", {
  enumerable: true,
  get: function () {
    return _empty.default;
  }
});
exports.featureTests = void 0;
Object.defineProperty(exports, "getScrollbarSize", {
  enumerable: true,
  get: function () {
    return _getScrollbarSize.default;
  }
});
Object.defineProperty(exports, "hasFeature", {
  enumerable: true,
  get: function () {
    return _hasFeature.default;
  }
});
Object.defineProperty(exports, "isAndroidStockBrowser", {
  enumerable: true,
  get: function () {
    return _isAndroidStockBrowser.default;
  }
});
Object.defineProperty(exports, "isMobile", {
  enumerable: true,
  get: function () {
    return _isMobile.default;
  }
});
Object.defineProperty(exports, "isStyleSupported", {
  enumerable: true,
  get: function () {
    return _isStyleSupported.default;
  }
});
Object.defineProperty(exports, "loadCss", {
  enumerable: true,
  get: function () {
    return _loadCss.default;
  }
});
Object.defineProperty(exports, "loadSvg", {
  enumerable: true,
  get: function () {
    return _loadSvg.default;
  }
});
exports.raf = void 0;
Object.defineProperty(exports, "rafThrottle", {
  enumerable: true,
  get: function () {
    return _rafThrottle.default;
  }
});
Object.defineProperty(exports, "smoothScroll", {
  enumerable: true,
  get: function () {
    return _smoothScroll.default;
  }
});
var _deepKeys = _interopRequireDefault(require("./deep-keys"));
var _featureTests2 = _interopRequireDefault(require("./feature-tests"));
var _raf2 = _interopRequireDefault(require("./raf"));
var _debounce = _interopRequireDefault(require("./debounce"));
var _empty = _interopRequireDefault(require("./empty"));
var _getScrollbarSize = _interopRequireDefault(require("./get-scrollbar-size"));
var _hasFeature = _interopRequireDefault(require("./has-feature"));
var _isAndroidStockBrowser = _interopRequireDefault(require("./is-android-stock-browser"));
var _isMobile = _interopRequireDefault(require("./is-mobile"));
var _isStyleSupported = _interopRequireDefault(require("./is-style-supported"));
var _loadCss = _interopRequireDefault(require("./load-css"));
var _loadSvg = _interopRequireDefault(require("./load-svg"));
var _rafThrottle = _interopRequireDefault(require("./raf-throttle"));
var _smoothScroll = _interopRequireDefault(require("./smooth-scroll"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var raf = exports.raf = _raf2.default.bind(window);
var featureTests = exports.featureTests = (0, _deepKeys.default)(_featureTests2.default).map(function (t) {
  return t.join('.');
});