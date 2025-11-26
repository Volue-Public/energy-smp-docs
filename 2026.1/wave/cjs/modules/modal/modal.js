"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createModal;
exports.listen = listen;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _componentDelegate = _interopRequireDefault(require("component-delegate"));
var _componentEvent = _interopRequireDefault(require("component-event"));
var _domify = _interopRequireDefault(require("domify"));
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _extend = _interopRequireDefault(require("extend"));
var _template = _interopRequireDefault(require("./template"));
var _delay = _interopRequireDefault(require("../../utils/delay"));
var _hasFeature = _interopRequireDefault(require("../../utils/has-feature"));
var _inheritPrototype = _interopRequireDefault(require("../../utils/inherit-prototype"));
var _once = _interopRequireDefault(require("../../utils/once"));
var _transitEnd = _interopRequireDefault(require("../../utils/transit-end"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var document = window.document;
var hasTouch = (0, _hasFeature.default)('touch');
var isBound;
function createModal(options) {
  return new Modal(options);
}
var defaults = {
  preserveDom: false,
  closable: true
};
function Modal(options) {
  this.options = (0, _extend.default)(true, {}, defaults, options);
  this._lastFocus = document.activeElement;
  this.body = document.body;
  this.modal = (0, _domify.default)(_template.default);
  this.contentHolder = this.modal.querySelector('.modal-content');
  if (this.options.contentClass) {
    this.contentHolder.className += ' ' + this.options.contentClass;
  }
  this.modalActionTrigger = null;
  this.modalCloseTrigger = null;
  if (this.options.content) {
    this.content(this.options.content, false);
  }
  this._trapFocus = hasTouch ? null : this._trapFocus.bind(this);
  if (this.options.modalAction && typeof this.options.modalAction === 'function') {
    this.options.modalAction = this.options.modalAction.bind(this);
  }
  this._appendOnce = (0, _once.default)(this._append, this);
  return this;
}
(0, _inheritPrototype.default)(Modal, _emitterComponent.default);
Modal.prototype.closable = function (closable) {
  closable = closable === undefined ? true : closable;
  this.options.closable = closable;
  this._closable(closable);
  return this;
};
Modal.prototype._closable = function (closable) {
  var _this = this;
  if (closable === false) {
    if (this._handleModalClick) {
      _componentEvent.default.unbind(this.modal, 'click', this._handleModalClick);
      this._handleModalClick = undefined;
    }
    if (this._handleKeydown) {
      _componentEvent.default.unbind(document, 'keydown', this._handleKeydown);
      this._handleKeydown = undefined;
    }
    return this;
  }

  /**
   * Close overlay
   */
  if (!this._handleModalClick) {
    _componentEvent.default.bind(this.modal, 'click', this._handleModalClick = function handleModalClick(e) {
      e.stopImmediatePropagation();
      if (e.target.className !== 'modal-container') {
        return;
      }
      _this.hide({
        wasDismissed: true
      });
    });
  }

  /**
   * Esc
   */
  if (!this._handleKeydown) {
    _componentEvent.default.bind(document, 'keydown', this._handleKeydown = function handleKeydown(e) {
      if (e.keyCode !== 27 || !_this._shown) {
        return;
      }
      _this.hide({
        wasDismissed: true
      });
    });
  }
};

/**
 * Trap focus
 */
Modal.prototype._trapFocus = function (e) {
  if (this.modal.tabIndex !== 0) {
    return;
  }
  if (this.modal !== e.target && !this.modal.contains(e.target)) {
    this.modal.focus();
  }
};
Modal.prototype._append = function () {
  this.body.appendChild(this.modal);
};
Modal.prototype.show = function () {
  if (this._shown) {
    return this;
  }
  var _this = this;
  this.emit('showing');

  // Kill the scroll on the body
  (0, _componentClasses.default)(this.body).add('ofH');
  if (this.options.preserveDom) {
    this.modal.style.display = 'block';
    this._appendOnce();
  } else {
    this._append();
  }

  // Add action for the trigger element click event
  if (this.modalActionTrigger && this.options.modalAction) {
    this._actionClickHandler = _componentDelegate.default.bind(this.contentHolder, '.js-modalAction', 'click', this.options.modalAction);
  }

  // Force the layout to be computed
  // eslint-disable-next-line no-unused-expressions
  this.modal.offsetLeft;
  (0, _componentClasses.default)(this.modal).remove('modal--is-hidden');

  // Account for transitions
  (0, _transitEnd.default)(this.modal, function () {
    if (_this._isHiding) {
      return;
    }
    if (_this.options.closable) {
      _this._closable();
    }
    if (_this._trapFocus) {
      // Set focus to specific element inside active modal box
      var focus = _this.modal.querySelector('[autofocus]');
      if (focus != null) {
        focus.focus();
      } else {
        _this.modal.focus();
      }

      // prevent infinite focus loop
      _componentEvent.default.unbind(document, 'focusin', _this._trapFocus);
      _componentEvent.default.bind(document, 'focusin', _this._trapFocus);
    }
    if (_this.modalCloseTrigger) {
      _this._closeClickHandler = _componentDelegate.default.bind(_this.contentHolder, '.js-modalClose', 'click', function handleCloseClick(e) {
        e.preventDefault();
        _componentDelegate.default.unbind(_this.contentHolder, 'click', _this._closeClickHandler);
        _this._closeClickHandler = undefined;
        _this.hide({
          wasDismissed: true
        });
      });
    }
    _this._shown = true;
    _this.emit('show');
  });

  // If multiple modals are displayed, focus only the top one
  var lastModalN;
  Array.prototype.forEach.call(document.querySelectorAll('.modal'), function (modal) {
    modal.removeAttribute('tabindex');
    var n = parseInt(modal.getAttribute('data-modal-n'));
    if (n > lastModalN || lastModalN === undefined) {
      lastModalN = n;
    }
  });
  _this.modal.tabIndex = 0;

  // Set data-modal-n attribute to know the display order of modals
  _this.modal.setAttribute('data-modal-n', lastModalN >= 0 ? lastModalN + 1 : 0);
  return this;
};
Modal.prototype.hide = function (data) {
  var _this = this;
  var eventData = (0, _extend.default)({
    wasDismissed: false
  }, data);
  this._isHiding = true;
  this.emit('hiding');
  (0, _componentClasses.default)(this.modal).add('modal--is-hidden');

  // delay() wrap
  // fixes https://bugzilla.mozilla.org/show_bug.cgi?id=625289
  (0, _delay.default)(25)(function () {
    (0, _componentClasses.default)(_this.body).remove('ofH');
  });
  if (this.modalCloseTrigger && this._closeClickHandler) {
    _componentDelegate.default.unbind(this.contentHolder, 'click', this._closeClickHandler);
  }

  // Account for transitions
  (0, _transitEnd.default)(this.modal, function (elem) {
    if (_this.modalActionTrigger && _this._actionClickHandler) {
      _componentDelegate.default.unbind(_this.contentHolder, 'click', _this._actionClickHandler);
    }
    if (_this.options.closable) {
      _this._closable(false);
    }
    if (_this.options.preserveDom) {
      elem.style.display = 'none';
    } else if (elem.parentNode != null) {
      elem.parentNode.removeChild(elem);
    }
    if (_this._trapFocus) {
      _componentEvent.default.unbind(document, 'focusin', _this._trapFocus);

      // Restore focus
      _this._lastFocus && _this._lastFocus.focus();
    }
    _this._shown = false;
    _this._isHiding = false;
    _this.emit('hide', eventData);
  });
  _this.modal.removeAttribute('tabindex');
  var modals = Array.from(document.querySelectorAll('.modal'));

  // Sort modals by display order
  modals.sort(function (a, b) {
    return parseInt(b.getAttribute('data-modal-n')) - parseInt(a.getAttribute('data-modal-n'));
  });

  // Check if another modal is displayed. If so, set the tabindex attribute to shift focus to it
  for (var i = 0; i < modals.length; i++) {
    var modal = modals[i];
    if (modal && !modal.classList.contains('modal--is-hidden')) {
      modal.tabIndex = 0;
      return;
    }
  }
  return this;
};
Modal.prototype.content = function (content, emitEvent) {
  emitEvent = emitEvent === undefined ? true : emitEvent;
  if (!content) {
    return this.contentHolder.innerHTML;
  }
  if (typeof content === 'string') {
    this.contentHolder.innerHTML = content;
  } else {
    this.contentHolder.appendChild(content);
  }
  this.modalActionTrigger = this.modal.querySelector('.js-modalAction');
  this.modalCloseTrigger = this.modal.querySelector('.js-modalClose');
  if (emitEvent) {
    this.emit('content', content);
  }
  return this;
};

/**
 * Shorthand for accessing DOM elements within modal
 */
Modal.prototype.$ = function (selector) {
  if (this.modal) {
    return this.modal.querySelector(selector);
  }
};

/**
 * Enable the `.js-triggerModal` api
 */
function listen() {
  if (isBound) {
    return;
  }
  isBound = true;
  return _componentDelegate.default.bind(document.body, '.js-triggerModal', 'click', function (e) {
    e.preventDefault();
    var target = e.delegateTarget.getAttribute('data-target');
    if (!target) return;
    var targetNode = document.querySelector(target);
    var contentClass = targetNode.getAttribute('data-modal-content-class');
    if (targetNode != null) {
      var newModal = new Modal({
        content: targetNode.innerHTML,
        contentClass: contentClass || ''
      });
      newModal.show();
    }
  });
}