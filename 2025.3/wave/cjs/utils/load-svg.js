"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadSvg;
var _xhr = _interopRequireDefault(require("xhr"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Load SVG over xhr
 */

function loadSvg(options, cb) {
  if (typeof options === 'string') {
    options = {
      uri: options
    };
  }
  (0, _xhr.default)(options, function (err, resp, body) {
    if (err) {
      return cb(err);
    }
    if (!/^2/.test(resp.statusCode)) {
      return cb(new Error('http status code: ' + resp.statusCode));
    }
    var div = document.createElement('div');
    div.innerHTML = body;
    var svg = div.querySelector('svg');
    if (!svg) {
      return cb(new Error('SVG not present in resource'));
    }
    cb(null, svg);
  });
}