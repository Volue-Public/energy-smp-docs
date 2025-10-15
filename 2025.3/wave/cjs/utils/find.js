"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = find;
var _hasFind = typeof Array.prototype.find === 'function';
function find(array, predicate, context) {
  if (_hasFind) {
    return array.find(predicate, context);
  }
  context = context || this;
  var length = array.length;
  var i;
  if (typeof predicate !== 'function') {
    throw new TypeError(predicate + ' is not a function');
  }
  for (i = 0; i < length; i++) {
    if (predicate.call(context, array[i], i, array)) {
      return array[i];
    }
  }
}