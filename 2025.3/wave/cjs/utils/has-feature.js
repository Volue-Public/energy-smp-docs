"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hasFeature;
var _justSafeGet = _interopRequireDefault(require("just-safe-get"));
var _featureTests = _interopRequireDefault(require("./feature-tests"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function hasFeature(feature) {
  return (0, _justSafeGet.default)(_featureTests.default, feature);
}