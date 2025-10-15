"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSidebarMenu;
var mediaQueries = _interopRequireWildcard(require("@volue/design-media-queries"));
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _viewportMonitor = _interopRequireDefault(require("./viewport-monitor"));
var _closest = _interopRequireDefault(require("../utils/closest"));
var _inheritPrototype = _interopRequireDefault(require("../utils/inherit-prototype"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
(0, _inheritPrototype.default)(SidebarNav, _emitterComponent.default);
function createSidebarMenu(element, options) {
  return new SidebarNav(element, options);
}
function SidebarNav(element, options) {
  this.element = element;
  this.currentView = mediaQueries.mqLargeAndUp;
  this.rememberCollapsedState = options ? !!options.rememberCollapsedState : false;
  this.closeAfterItemPick = options ? !!options.closeAfterItemPick : true;
  this.rememberCollapsedStateValue = this.rememberCollapsedState ? window.localStorage.getItem('waveSidebarNavCollapsedState') : null;
  this.viewportMonitor = new _viewportMonitor.default();
  this.listeners = [];
  this.header = this.element.querySelector('.sidebarNav-header');
  this.headerMenu = this.element.querySelector('.sidebarNav-headerMenu');
  this.headerMenuToggle = this.element.querySelector('.js-sidebarNav-headerMenuToggle');
  this.headerMenuContent = this.element.querySelector('.sidebarNav-headerMenuContent');
  this.menuContent = this.element.querySelector('.sidebarNav-menuContent');
  this.collapseButton = this.element.querySelector('.js-sidebarNav-collapse');
  this.headerOpenButton = this.element.querySelector('.js-sidebarNav-headerOpen');
  this.headerCloseButton = this.element.querySelector('.js-sidebarNav-headerClose');
  this._handleHeaderMenuToggleClick = this._handleHeaderMenuToggleClick.bind(this);
  this._handleCollapseButtonClick = this._handleCollapseButtonClick.bind(this);
  this._handleHeaderOpenButtonClick = this._handleHeaderOpenButtonClick.bind(this);
  this._handleHeaderCloseButtonClick = this._handleHeaderCloseButtonClick.bind(this);
  this._handleMenuClick = this._handleMenuClick.bind(this);
  this._handleMenuItemMouseEnter = this._handleMenuItemMouseEnter.bind(this);
  this._handleMenuItemMouseLeave = this._handleMenuItemMouseLeave.bind(this);
  this._handleBodyClick = this._handleBodyClick.bind(this);
  this._handleWindowResize = this._handleWindowResize.bind(this);
  this._init();
}
SidebarNav.prototype._init = function _init() {
  this._handleWindowResize(true);
  this._initListeners();
  this._initTransition();
};
SidebarNav.prototype._isHeaderMenuOpened = function _isHeaderMenuOpened() {
  if (!this.headerMenu) {
    return false;
  }
  return (0, _componentClasses.default)(this.headerMenu).contains('sidebarNav-headerMenu--opened');
};
SidebarNav.prototype._getCurrentMenuContent = function _getCurrentMenuContent() {
  return this._isHeaderMenuOpened() ? this.headerMenuContent : this.menuContent;
};
SidebarNav.prototype._restoreCollapsedState = function _restoreCollapsedState() {
  if (this.rememberCollapsedStateValue === 'collapsed') {
    this.collapse();
  } else if (this.rememberCollapsedStateValue === 'uncollapsed') {
    this.uncollapse();
  }
};
SidebarNav.prototype._initTransition = function _initTransition() {
  // eslint-disable-next-line no-unused-expressions
  this.element.offsetHeight;
  (0, _componentClasses.default)(this.element).add('sidebarNav--withTransition');
};
SidebarNav.prototype._initListeners = function _initListeners() {
  if (this.headerMenuToggle) {
    this._addListener(this.headerMenuToggle, 'click', this._handleHeaderMenuToggleClick);
  }
  if (this.headerOpenButton) {
    this._addListener(this.headerOpenButton, 'click', this._handleHeaderOpenButtonClick);
  }
  if (this.headerCloseButton) {
    this._addListener(this.headerCloseButton, 'click', this._handleHeaderCloseButtonClick);
  }
  if (this.collapseButton) {
    this._addListener(this.collapseButton, 'click', this._handleCollapseButtonClick);
  }
  this._addListener(this.element, 'click', this._handleMenuClick);
  var items = this.element.querySelectorAll('.sidebarNav-item');
  for (var item of items) {
    this._addListener(item, 'mouseenter', this._handleMenuItemMouseEnter);
    this._addListener(item, 'mouseleave', this._handleMenuItemMouseLeave);
  }
  this._addListener(window.document, 'click', this._handleBodyClick);
  this._addListener(window.document, 'touchstart', this._handleBodyClick);
  this.viewportMonitor.on('resize', this._handleWindowResize);
};
SidebarNav.prototype._resetFocus = function _resetFocus() {
  document.activeElement.blur();
  this.element.focus();
};
SidebarNav.prototype._addListener = function _addListener(element, event, fn) {
  element.addEventListener(event, fn);
  this.listeners.push(element, event, fn);
};
SidebarNav.prototype._handleHeaderMenuToggleClick = function _handleHeaderMenuToggleClick(event) {
  if (!this.headerMenu) {
    return;
  }
  if ((0, _componentClasses.default)(this.headerMenu).contains('sidebarNav-headerMenu--opened')) {
    (0, _componentClasses.default)(this.headerMenu).remove('sidebarNav-headerMenu--opened');
    event.preventDefault();
    this._resetFocus();
  } else {
    (0, _componentClasses.default)(this.headerMenu).add('sidebarNav-headerMenu--opened');
    this._closeAllSubmenus();
  }
};
SidebarNav.prototype._handleMenuClick = function _handleMenuClick(e) {
  var submenuContainer = (0, _closest.default)(e.target, '.sidebarNav-withSubmenu', true);
  if (submenuContainer) {
    if ((0, _componentClasses.default)(submenuContainer).contains('sidebarNav-withSubmenu--opened')) {
      (0, _componentClasses.default)(submenuContainer).remove('sidebarNav-withSubmenu--opened');
      e.preventDefault();
      this._resetFocus();
    } else {
      (0, _componentClasses.default)(submenuContainer).add('sidebarNav-withSubmenu--opened');
    }
  }
  if (this.closeAfterItemPick && (0, _closest.default)(e.target, 'a', true)) {
    this._closeAllSubmenus();
    if (this.currentView === mediaQueries.mqSmallOnly) {
      this._clearBodyClasses();
    } else if (this._isHeaderMenuOpened()) {
      if (this.headerMenu) {
        (0, _componentClasses.default)(this.headerMenu).remove('sidebarNav-headerMenu--opened');
      }
      this._resetFocus();
    }
  }
};
SidebarNav.prototype._removeTooltips = function _removeTooltips() {
  var tooltips = window.document.querySelectorAll('.sidebarNav-itemTooltip');
  tooltips.forEach(function (tooltip) {
    tooltip.classList.remove('sidebarNav-itemTooltip--visible');
    setTimeout(function () {
      tooltip.remove();
    }, 150);
  });
};
SidebarNav.prototype._handleMenuItemMouseEnter = function _handleMenuItemMouseEnter(e) {
  var item = e.target;
  if (!item) {
    return;
  }
  var itemName = item.querySelector('.sidebarNav-itemName');
  if (!itemName) {
    return;
  }
  if (this._isCollapsed() || itemName.scrollWidth > itemName.offsetWidth) {
    var tooltip = window.document.createElement('div');
    tooltip.classList.add('sidebarNav-itemTooltip');
    tooltip.innerText = itemName.textContent;
    window.document.body.append(tooltip);
    setTimeout(function () {
      tooltip.classList.add('sidebarNav-itemTooltip--visible');
    }, 0);
    var centerFactor = Math.round((item.offsetHeight - tooltip.offsetHeight) / 2);
    tooltip.style.top = item.getBoundingClientRect().top + centerFactor + 'px';
    var sidebarNav = window.document.querySelector('.sidebarNav');
    if (sidebarNav) {
      tooltip.style.left = sidebarNav.offsetWidth + 'px';
    }
  }
};
SidebarNav.prototype._handleMenuItemMouseLeave = function _handleMenuItemMouseLeave() {
  this._removeTooltips();
};
SidebarNav.prototype._handleBodyClick = function _handleBodyClick(event) {
  if (!(0, _closest.default)(event.target, '.sidebarNav-headerMenu', true)) {
    var headerMenu = this.element.querySelector('.sidebarNav-headerMenu');
    if (headerMenu) {
      (0, _componentClasses.default)(headerMenu).remove('sidebarNav-headerMenu--opened');
    }
  }
  if (!(0, _closest.default)(event.target, '.sidebarNav', true)) {
    this._closeAllSubmenus();
  }
  if (this.currentView === mediaQueries.mqSmallOnly && !(0, _closest.default)(event.target, '.sidebarNav', true)) {
    (0, _componentClasses.default)(window.document.body).remove('sidebarNav-uncollapsed');
    this._emitCollapseState();
  }
};
SidebarNav.prototype._clearBodyClasses = function _clearBodyClasses() {
  (0, _componentClasses.default)(window.document.body).remove('sidebarNav-uncollapsed');
  (0, _componentClasses.default)(window.document.body).remove('sidebarNav-collapsed');
};
SidebarNav.prototype._initLargeView = function _initLargeView() {
  this.currentView = mediaQueries.mqLargeAndUp;
  this._clearBodyClasses();
  if (this.rememberCollapsedState) {
    this._restoreCollapsedState();
  }
  this._emitCollapseState();
};
SidebarNav.prototype._initMediumView = function _initMediumView() {
  this.currentView = mediaQueries.mqMediumOnly;
  this._clearBodyClasses();
  if (this.rememberCollapsedState) {
    this._restoreCollapsedState();
  } else {
    this.collapse();
  }
  this._emitCollapseState();
};
SidebarNav.prototype._initSmallView = function _initSmallView() {
  this.currentView = mediaQueries.mqSmallOnly;
  this._clearBodyClasses();
  this._emitCollapseState();
};
SidebarNav.prototype._emitCollapseState = function _emitCollapseState() {
  if (this._isCollapsed()) {
    this.emit('collapse', this.currentView);
  } else {
    this.emit('uncollapse', this.currentView);
  }
};
SidebarNav.prototype._handleWindowResize = function _handleWindowResize(force) {
  if (this.viewportMonitor.mq(mediaQueries.mqLargeAndUp) && (force || this.currentView !== mediaQueries.mqLargeAndUp)) {
    this._initLargeView();
  } else if (this.viewportMonitor.mq(mediaQueries.mqMediumOnly) && (force || this.currentView !== mediaQueries.mqMediumOnly)) {
    this._initMediumView();
  } else if (this.viewportMonitor.mq(mediaQueries.mqSmallOnly) && (force || this.currentView !== mediaQueries.mqSmallOnly)) {
    this._initSmallView();
  }
};
SidebarNav.prototype._handleCollapseButtonClick = function _handleCollapseButtonClick(event) {
  event.preventDefault();
  if (this._isCollapsed()) {
    this.uncollapse();
  } else {
    this.collapse();
  }
  if (this.rememberCollapsedState) {
    this.rememberCollapsedStateValue = this._isCollapsed() ? 'collapsed' : 'uncollapsed';
    window.localStorage.setItem('waveSidebarNavCollapsedState', this.rememberCollapsedStateValue);
  }
  this._emitCollapseState();
};
SidebarNav.prototype._handleHeaderOpenButtonClick = function _handleHeaderOpenButtonClick(event) {
  event.preventDefault();
  (0, _componentClasses.default)(window.document.body).add('sidebarNav-uncollapsed');
  this._emitCollapseState();
};
SidebarNav.prototype._handleHeaderCloseButtonClick = function _handleHeaderCloseButtonClick(event) {
  event.preventDefault();
  (0, _componentClasses.default)(window.document.body).remove('sidebarNav-uncollapsed');
  this._resetFocus();
  this._emitCollapseState();
};
SidebarNav.prototype._closeAllSubmenus = function _closeAllSubmenus() {
  var submenuContainers = this.element.querySelectorAll('.sidebarNav-withSubmenu');
  if (submenuContainers && submenuContainers.length > 0) {
    Array.prototype.forEach.call(submenuContainers, function (submenuContainer) {
      (0, _componentClasses.default)(submenuContainer).remove('sidebarNav-withSubmenu--opened');
    });
  }
  if (document.activeElement && (0, _closest.default)(document.activeElement, '.sidebarNav-withSubmenu', true)) {
    this._resetFocus();
  }
};
SidebarNav.prototype._isCollapsed = function _isCollapsed() {
  if ((0, _componentClasses.default)(window.document.body).contains('sidebarNav-collapsed')) {
    return true;
  }
  if ((0, _componentClasses.default)(window.document.body).contains('sidebarNav-uncollapsed')) {
    return false;
  }
  return this.currentView === mediaQueries.mqSmallOnly;
};
SidebarNav.prototype.collapse = function collapse() {
  (0, _componentClasses.default)(window.document.body).remove('sidebarNav-uncollapsed');
  (0, _componentClasses.default)(window.document.body).add('sidebarNav-collapsed');
};
SidebarNav.prototype.uncollapse = function uncollapse() {
  (0, _componentClasses.default)(window.document.body).remove('sidebarNav-collapsed');
  (0, _componentClasses.default)(window.document.body).add('sidebarNav-uncollapsed');
};
SidebarNav.prototype._removeListeners = function _removeListeners() {
  this.listeners.forEach(function (listener) {
    listener[0].removeEventListener(listener[1], listener[2]);
  });
};
SidebarNav.prototype.destroy = function destroy() {
  this._removeListeners();
};