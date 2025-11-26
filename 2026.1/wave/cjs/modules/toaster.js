"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createToaster;
var _designIcons = require("@volue/design-icons");
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _domify = _interopRequireDefault(require("domify"));
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _extend = _interopRequireDefault(require("extend"));
var _delay = _interopRequireDefault(require("../utils/delay"));
var _inheritPrototype = _interopRequireDefault(require("../utils/inherit-prototype"));
var _setImmediate = _interopRequireDefault(require("../utils/set-immediate"));
var _transitEnd = _interopRequireDefault(require("../utils/transit-end"));
var _uuid = _interopRequireDefault(require("../utils/uuid"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var document = window.document;
var DEFAULTS = {
  position: 'bottomLeft',
  animation: 'slideUp',
  duration: 5000,
  template: '<div class="toaster-item"></div>',
  dismissLabel: 'Dismiss',
  closable: false
};
var TOAST_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success'
};
function createToaster(options) {
  return new Toaster(options);
}
createToaster.TOAST_TYPES = TOAST_TYPES;
function Toaster(options) {
  _emitterComponent.default.call(this);
  options = this.options = (0, _extend.default)(true, {}, DEFAULTS, options);
  this._items = [];
  this._ids = [];
  this._actionHandlers = [];
  this._wrapper = createWrapper();
  this._wrapper.className = 'toaster toaster--' + options.position;
  if (options.wrapperClass) {
    this._wrapper.className += ' ' + options.wrapperClass;
  }
  this._closeHandler = function handleClose(e) {
    this.hide(e.currentTarget.parentNode);
  }.bind(this);
}
(0, _inheritPrototype.default)(Toaster, _emitterComponent.default);

/**
 * Gets the list of toast items
 */
Toaster.prototype.getElements = function () {
  return this._items;
};
Toaster.prototype.getElementsById = function (id) {
  var toastElements = this._items;
  return this._ids.reduce(function idsReducer(toastElementsById, id, idx) {
    toastElementsById[id] = toastElements[idx];
    return toastElementsById;
  }, Object.create(null));
};
Toaster.prototype.create = function (content, options) {
  options = (0, _extend.default)(true, {}, this.options, options || {});
  var self = this;
  var template;
  if (options.type) {
    template = getToastTemplate(options);
  } else {
    template = options.template;
  }
  var itemId = options.id || (0, _uuid.default)();
  var item = (0, _domify.default)(template);
  var itemClasses = (0, _componentClasses.default)(item);
  if (typeof content === 'string') {
    if (options.closable || options.type) {
      var contentEl = document.createElement('div');
      contentEl.className = 'notification-message';
      contentEl.innerHTML = content;
      item.appendChild(contentEl);
    } else {
      item.innerHTML = content;
    }
  } else {
    item.appendChild(content);
  }
  if (options.closable) {
    var closeTrigger = item.querySelector('.js-dismissWaveToast');
    if (closeTrigger !== null) {
      closeTrigger.addEventListener('click', this._closeHandler);
    }
  }
  var actionHandler;
  if (options.action) {
    actionHandler = function handleAction(event) {
      options.action.onAction(item, event);
    };
    var actionButton = item.querySelector('.js-waveToastAction');
    if (actionButton !== null) {
      actionButton.addEventListener('click', actionHandler);
    }
  }
  if (options.type) {
    var svgIcon = item.querySelector('.notification-icon svg');
    if (svgIcon !== null) {
      svgIcon.removeAttribute('stroke-width');
      svgIcon.setAttribute('focusable', 'false');
      svgIcon.setAttribute('aria-hidden', 'true');
    }
  }

  // Add `.toaster-item` class if it's missing in the template
  if (!itemClasses.has('toaster-item')) {
    itemClasses.add('toaster-item');
  }
  itemClasses.add('toaster-item--' + options.animation).add('is-hidden');
  this._wrapper.insertBefore(item, this._wrapper.firstChild);
  this._items.push(item);
  this._actionHandlers.push(actionHandler);
  this._ids.push(itemId);

  // Set a timeout, so transition can trigger
  (0, _delay.default)(15)(function () {
    self.show(item);
  });
  if (options.duration) {
    (0, _delay.default)(parseInt(options.duration, 10) + 15)(function () {
      self.hide(item);
    });
  }
};

/**
 * Hides the toast item after the duration is up
 * Also removes the element from the DOM once the transition is complete
 */
Toaster.prototype.hide = function (element) {
  // pass the element
  this.emit('hiding', element);
  (0, _componentClasses.default)(element).remove('is-shown').add('is-hidden');
  var closeTrigger = element.querySelector('.js-dismissWaveToast');
  if (closeTrigger !== null) {
    closeTrigger.removeEventListener('click', this._closeHandler);
  }
  var actionButton = element.querySelector('.js-waveToastAction');
  if (actionButton !== null) {
    var handlerToRemove = this._actionHandlers[this._items.indexOf(element)];
    if (handlerToRemove != null) {
      actionButton.removeEventListener('click', handlerToRemove);
    }
  }
  (0, _transitEnd.default)(element, function () {
    var idx = this._items.indexOf(element);
    element.parentNode.removeChild(element);
    if (idx !== -1) {
      this._items.splice(idx, 1);
      this._ids.splice(idx, 1);
      this._actionHandlers.splice(idx, 1);
    }
    this.emit('hide');
  }.bind(this));
};

/**
 * Reveals the toast item after it has been placed in the container
 */
Toaster.prototype.show = function (element) {
  this.emit('showing', element);
  (0, _setImmediate.default)(function () {
    (0, _componentClasses.default)(element).remove('is-hidden').add('is-shown');
  });
  (0, _transitEnd.default)(element, function () {
    this.emit('show', element);
  }.bind(this));
};
function createWrapper() {
  return document.body.appendChild(document.createElement('div'));
}
function getToastTemplate(options) {
  var template;
  var closeButtonMarkup = '';
  var itemClasses = 'toaster-item toaster-item--elevated fill-neutral--minimal notification notification--headless notification--' + String(options.type);
  if (options.closable) {
    closeButtonMarkup = ['<button type="button" class="notification-dismissBtn btn btn--ghost btn--icon js-dismissWaveToast" aria-label="' + options.dismissLabel + '">', '<i class="pf pf-close" aria-hidden="true"></i>', '</button>'].join('');
  }
  var actionMarkup = '';
  if (options.action) {
    actionMarkup = ['<div class="notification-actions">', '<button type="button" class="btn btn--outline js-waveToastAction">', options.action.label, '</button>', '</div>'].join('');
  }
  var iconWrapperMarkup = '';
  if (options.type) {
    var notificationIcon = getNotificationIcon(options.type);
    iconWrapperMarkup = notificationIcon ? ['<div class="notification-icon">', '<div class="svgIcon svgIcon--stroked">', notificationIcon, '</div>', '</div>'].join('') : '';
  }
  switch (options.type) {
    case TOAST_TYPES.INFO:
      template = '<div class="' + itemClasses + '" aria-live="polite">' + iconWrapperMarkup + actionMarkup + closeButtonMarkup + '</div>';
      break;
    case TOAST_TYPES.WARNING:
      template = '<div class="' + itemClasses + '" role="alert">' + iconWrapperMarkup + actionMarkup + closeButtonMarkup + '</div>';
      break;
    case TOAST_TYPES.ERROR:
      template = '<div class="' + itemClasses + '" role="alert">' + iconWrapperMarkup + actionMarkup + closeButtonMarkup + '</div>';
      break;
    case TOAST_TYPES.SUCCESS:
      template = '<div class="' + itemClasses + '" aria-live="polite">' + iconWrapperMarkup + actionMarkup + closeButtonMarkup + '</div>';
      break;
  }
  return template || options.template;
}
function getNotificationIcon(type) {
  switch (type) {
    case TOAST_TYPES.INFO:
      return _designIcons.info;
    case TOAST_TYPES.WARNING:
      return _designIcons.warning;
    case TOAST_TYPES.ERROR:
      return _designIcons.error;
    case TOAST_TYPES.SUCCESS:
      return _designIcons.validation;
  }
}