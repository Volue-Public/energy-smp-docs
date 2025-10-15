"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSidebar;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _CustomEvent = _interopRequireDefault(require("../utils/CustomEvent"));
var _closest = _interopRequireDefault(require("../utils/closest"));
var _focusManager = _interopRequireDefault(require("../utils/focus-manager"));
var _raf = _interopRequireDefault(require("../utils/raf"));
var _tokenize = _interopRequireDefault(require("../utils/tokenize"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// track all active instances
var activeInstances = [];
var customEvent = new _CustomEvent.default('updateSidebar');
var resizeListener;
function resetLayout() {
  activeInstances.forEach(function each(instance) {
    instance.element.dispatchEvent(customEvent);
  });
}
function createSidebar(element, options) {
  var instance = new Sidebar(element, options);
  activeInstances.push(instance);
  return instance;
}
function Sidebar(element, options) {
  options = options || {};
  this.element = element;
  this.sidebarPanelElement = this.element.querySelector('.js-sidebar-panel');
  this.triggers = document.querySelectorAll('[aria-controls="' + this.element.getAttribute('id') + '"]');
  this.selectedTrigger = null;
  this.showClass = 'sidebar--is-visible';
  this.animatableClass = 'sidebar--is-animatable';
  this.staticClass = 'sidebar--static' + (options.staticClass ? ' ' + options.staticClass : '');
  this.tokenizedStaticClass = (0, _tokenize.default)(this.staticClass);
  this.readyClass = 'sidebar--loaded';
  this.layout = false; // this will be static or mobile
  this.focusManager = new _focusManager.default(this.element);
  this.startX = 0;
  this.currentX = 0;
  this.touchingSidebar = false;
  this.supportsPassive = undefined;
  this.transitionEndProperty = null;
  this.transitionEndTime = 0;
  this._update = this._update.bind(this);
  this._handleClick = this._handleClick.bind(this);
  this._handleSidebarPanelClick = this._handleSidebarPanelClick.bind(this);
  this._handleKeyDown = this._handleKeyDown.bind(this);
  this._handleTriggerClick = this._handleTriggerClick.bind(this);
  this._handleUpdateSidebar = this._handleUpdateSidebar.bind(this);
  this._handleTouchStart = this._handleTouchStart.bind(this);
  this._handleTouchMove = this._handleTouchMove.bind(this);
  this._handleTouchEnd = this._handleTouchEnd.bind(this);
  this._handleTransitionEnd = this._handleTransitionEnd.bind(this);
  this._init();
}
Sidebar.prototype._applyPassive = function _applyPassive() {
  if (this.supportsPassive !== undefined) {
    return this.supportsPassive ? {
      passive: true
    } : false;
  }

  // feature detect
  var isSupported = false;
  try {
    document.addEventListener('test', null, {
      get passive() {
        isSupported = true;
      }
    });
  } catch (e) {}
  this.supportsPassive = isSupported;
  return this._applyPassive();
};
Sidebar.prototype._handleTouchStart = function _handleTouchStart(event) {
  if (!(0, _componentClasses.default)(this.element).has(this.showClass)) {
    return;
  }
  this.startX = event.touches[0].pageX;
  this.currentX = this.startX;
  this.touchingSidebar = true;
  (0, _raf.default)(this._update);
};
Sidebar.prototype._handleTouchMove = function _handleTouchMove(event) {
  if (!this.touchingSidebar) {
    return;
  }
  this.currentX = event.touches[0].pageX;
};
Sidebar.prototype._handleTouchEnd = function _handleTouchEnd(event) {
  if (!this.touchingSidebar) {
    return;
  }
  this.touchingSidebar = false;
  var translateX = Math.min(0, this.currentX - this.startX);
  this.sidebarPanelElement.style.transform = '';
  if (translateX < 0) {
    this.close();
  }
};
Sidebar.prototype._update = function _update() {
  if (!this.touchingSidebar) {
    return;
  }
  (0, _raf.default)(this._update);
  var translateX = Math.min(0, this.currentX - this.startX);
  this.sidebarPanelElement.style.transform = 'translateX(' + translateX + 'px)';
};
Sidebar.prototype._handleTransitionEnd = function _handleTransitionEnd(event) {
  if (event.propertyName !== this.transitionEndProperty && event.elapsedTime !== this.transitionEndTime) {
    return;
  }
  this.transitionEndProperty = null;
  this.transitionEndTime = 0;
  (0, _componentClasses.default)(this.element).remove(this.animatableClass);
  this.element.removeEventListener('transitionend', this._handleTransitionEnd);
};
Sidebar.prototype._handleKeyDown = function _handleKeyDown(event) {
  // mobile layout only
  if (event.keyCode && event.keyCode === 27 || event.key && event.key === 'Escape') {
    // close sidebar window on esc
    this.close();
  } else if (event.keyCode && event.keyCode === 9 || event.key && event.key === 'Tab') {
    // trap focus inside sidebar
    this.focusManager.trapFocus(event);
  }
};
Sidebar.prototype._handleClick = function _handleClick(event) {
  // mobile layout only
  // close sidebar when clicking on close button or sidebar bg layer
  if ((0, _closest.default)(event.target, '.js-sidebar-closeBtn', true) || (0, _componentClasses.default)(event.target).has('js-sidebar-overlay')) {
    event.preventDefault();
    this.close();
  }
};
Sidebar.prototype._handleTriggerClick = function _handleTriggerClick(event) {
  event.preventDefault();
  if ((0, _componentClasses.default)(this.element).has(this.showClass)) {
    this.selectedTrigger = event.target;
    this.close();
    return;
  }
  this.selectedTrigger = event.target;
  this.show();
  this._initEvents();
};
Sidebar.prototype._handleSidebarPanelClick = function _handleSidebarPanelClick(event) {
  var sublistControl = (0, _closest.default)(event.target, '.js-sidebar-sublistControl', true);
  if (sublistControl != null) {
    var listItem = sublistControl.parentElement;
    var listItemClasses = (0, _componentClasses.default)(listItem);
    var isExpanded = listItemClasses.has('sidebar-navItem--expanded');
    sublistControl.setAttribute('aria-expanded', !isExpanded);
    listItemClasses.toggle('sidebar-navItem--expanded', !isExpanded);
  }
};
Sidebar.prototype._handleUpdateSidebar = function _handleUpdateSidebar(/* event */
) {
  this.checkLayout();
};
Sidebar.prototype._init = function _init() {
  // handle changes in layout -> mobile to static and viceversa
  this._initResize();
  if (this.triggers) {
    // open sidebar when clicking on trigger buttons - mobile layout only
    for (var i = 0; i < this.triggers.length; i++) {
      this.triggers[i].addEventListener('click', this._handleTriggerClick);
    }
  }
  this.sidebarPanelElement.addEventListener('click', this._handleSidebarPanelClick);
};
Sidebar.prototype._initEvents = function _initEvents() {
  // mobile layout only
  // add event listeners
  this.element.addEventListener('keydown', this._handleKeyDown);
  this.element.addEventListener('click', this._handleClick);
  this.element.addEventListener('touchstart', this._handleTouchStart, this._applyPassive());
  this.element.addEventListener('touchmove', this._handleTouchMove, this._applyPassive());
  this.element.addEventListener('touchend', this._handleTouchEnd);
};
Sidebar.prototype._cancelEvents = function _cancelEvents() {
  // mobile layout only
  // remove event listeners
  this.element.removeEventListener('keydown', this._handleKeyDown);
  this.element.removeEventListener('click', this._handleClick);
  this.element.removeEventListener('touchstart', this._handleTouchStart);
  this.element.removeEventListener('touchmove', this._handleTouchMove);
  this.element.removeEventListener('touchend', this._handleTouchEnd);
};
Sidebar.prototype._initResize = function _initResize() {
  if (!resizeListener) {
    window.addEventListener('resize', resizeListener = function resizeListener(/* event */
    ) {
      (0, _raf.default)(resetLayout);
    });
  }

  // custom event emitted when window is resized - detect only if the sidebar--static@{breakpoint} class was added
  var beforeContent = getComputedStyle(this.element, ':before').getPropertyValue('content');
  if (beforeContent && beforeContent !== '' && beforeContent !== 'none') {
    this.checkLayout();
    this.element.addEventListener('updateSidebar', this._handleUpdateSidebar);
  }
  (0, _componentClasses.default)(this.element).add(this.readyClass);
};
Sidebar.prototype.checkLayout = function checkLayout() {
  var layout = getComputedStyle(this.element, ':before').getPropertyValue('content').replace(/'|"/g, '');
  var elementClasses = (0, _componentClasses.default)(this.element);
  if (layout === this.layout) {
    return;
  }
  this.layout = layout;
  if (layout !== 'static') {
    elementClasses.add('is-hidden');
  }
  this.tokenizedStaticClass.forEach(function (className) {
    elementClasses.toggle(className, layout === 'static');
  });
  if (layout !== 'static') {
    setTimeout(function () {
      elementClasses.remove('is-hidden');
    });
  }

  // reset element role
  if (layout === 'static') {
    this.element.removeAttribute('role', 'alertdialog');
  } else {
    this.element.setAttribute('role', 'alertdialog');
  }

  // reset mobile behaviour
  if (layout === 'static' && elementClasses.has(this.showClass)) {
    this.close();
  }
};
Sidebar.prototype.show = function show() {
  (0, _componentClasses.default)(this.element).add(this.animatableClass).add(this.showClass);
  this.focusManager.setFocusableElements();
  this.transitionEndProperty = 'transform';
  this.transitionEndTime = 0.33;
  this.element.addEventListener('transitionend', this._handleTransitionEnd);
  _focusManager.default.moveFocus(this.element);
};
Sidebar.prototype.close = function close() {
  (0, _componentClasses.default)(this.element).add(this.animatableClass).remove(this.showClass);
  this.focusManager.clearFocusableElements();
  this.transitionEndProperty = 'transform';
  this.transitionEndTime = 0.13;
  this.element.addEventListener('transitionend', this._handleTransitionEnd);
  if (this.selectedTrigger) {
    this.selectedTrigger.focus();
  }
  this.element.removeAttribute('tabindex');
  this._cancelEvents();
};
Sidebar.prototype.destroy = function destroy() {
  this._cancelEvents();
  this.element.removeEventListener('transitionend', this._handleTransitionEnd);
  this.element.removeEventListener('updateSidebar', this._handleUpdateSidebar);
  this.sidebarPanelElement.removeEventListener('click', this._handleSidebarPanelClick);
  if (this.triggers.length > 0) {
    for (var i = 0; i < this.triggers.length; i++) {
      this.triggers[i].removeEventListener('click', this._handleTriggerClick);
    }
  }
  this.focusManager.clearFocusableElements();
  (0, _componentClasses.default)(this.element).remove(this.animatableClass).remove(this.showClass).remove('is-hidden');
  this.element.removeAttribute('tabindex');
  this.element.removeAttribute('role', 'alertdialog');
  activeInstances.splice(activeInstances.indexOf(this), 1);
  if (activeInstances.length === 0) {
    window.removeEventListener('resize', resizeListener);
    resizeListener = undefined;
  }
};