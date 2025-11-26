"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isAndroidStockBrowser;
function isAndroidStockBrowser() {
  var nua = navigator.userAgent;
  return nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1 && !(nua.indexOf('Chrome') > -1);
}