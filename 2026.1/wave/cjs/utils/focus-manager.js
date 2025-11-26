"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FocusManager;
function FocusManager(element) {
  if (!element) {
    throw new Error('FocusManager needs an element reference');
  }
  this.element = element;
  this.firstVisible = null;
  this.lastVisible = null;
  this._focusableElements = [];
}
FocusManager.prototype.setFocusableElements = function getFocusableElements() {
  // get all focusable elements inside element
  this._focusableElements = this.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])');
  this._setFirstVisible();
  this._setLastVisible();
};
FocusManager.prototype.clearFocusableElements = function clearFocusableElements() {
  this.firstVisible = null;
  this.lastVisible = null;
  this._focusableElements = [];
};
FocusManager.prototype.trapFocus = function trapFocus(event) {
  // mobile layout only
  if (this.firstVisible === document.activeElement && event.shiftKey) {
    // on Shift+Tab -> focus last focusable element when focus moves out of sidebar
    event.preventDefault();
    this.lastVisible.focus();
  }
  if (this.lastVisible === document.activeElement && !event.shiftKey) {
    // on Tab -> focus first focusable element when focus moves out of sidebar
    event.preventDefault();
    this.firstVisible.focus();
  }
};
FocusManager.prototype._setFirstVisible = function _setFirstVisible() {
  // get first visible focusable element inside the sidebar
  for (var i = 0; i < this._focusableElements.length; i++) {
    if (this._focusableElements[i].offsetWidth || this._focusableElements[i].offsetHeight || this._focusableElements[i].getClientRects().length) {
      this.firstVisible = this._focusableElements[i];
      return true;
    }
  }
};
FocusManager.prototype._setLastVisible = function _setLastVisible() {
  // get last visible focusable element inside the sidebar
  for (var i = this._focusableElements.length - 1; i >= 0; i--) {
    if (this._focusableElements[i].offsetWidth || this._focusableElements[i].offsetHeight || this._focusableElements[i].getClientRects().length) {
      this.lastVisible = this._focusableElements[i];
      return true;
    }
  }
};
FocusManager.moveFocus = function moveFocus(element) {
  if (!element) {
    element = document.getElementsByTagName('body')[0];
  }
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex', '-1');
    element.focus();
  }
};