"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _componentDelegate = _interopRequireDefault(require("component-delegate"));
var _componentEvent = _interopRequireDefault(require("component-event"));
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _extend = _interopRequireDefault(require("extend"));
var _overlay = _interopRequireDefault(require("./overlay/overlay"));
var _closest = _interopRequireDefault(require("../utils/closest"));
var _inheritPrototype = _interopRequireDefault(require("../utils/inherit-prototype"));
var _parents = _interopRequireDefault(require("../utils/parents"));
var _unique = _interopRequireDefault(require("../utils/unique"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _default(sltor, options) {
  return new Toggle(sltor, options);
}
var defaults = {
  toggleClass: 'is-open'
};
function Toggle(sltor, options) {
  if (!sltor || typeof sltor !== 'string') {
    throw new Error('Wave.Toggle() requires a selector string to initialize');
  }
  this.options = (0, _extend.default)(true, {}, defaults, options);
  this._sltor = sltor;
  this._dataTarget = null;
  this._overlay = null;
  return this;
}
(0, _inheritPrototype.default)(Toggle, _emitterComponent.default);
Toggle.prototype.hasClass = function (_self, className) {
  var check = className || this.options.toggleClass;
  var target = (0, _closest.default)(_self, this._getDataTarget(_self));
  return (0, _componentClasses.default)(target).has(check);
};
Toggle.prototype._getDataTarget = function (_self) {
  this._dataTarget = _self.getAttribute('data-target') || 'li';
  return this._dataTarget;
};
Toggle.prototype._toggle = function (_self, className) {
  if (this.hasClass(_self, className)) {
    this.close(_self);
  } else {
    this.open(_self);
  }
};
Toggle.prototype._handleOverlayClick = function (_self, className) {
  this._toggle(_self, className);
};
Toggle.prototype.overlay = function (options) {
  var overlayOptions = (0, _extend.default)(true, {}, {
    closable: true
  }, options);
  var overlay = (0, _overlay.default)(overlayOptions);
  this.on('open', function () {
    overlay.show();
  });
  this.on('close', function () {
    overlay.hide();
  });
  this._overlay = overlay;
  return this;
};
Toggle.prototype.toggle = function (_self, className) {
  var overlay = this._overlay;
  if (overlay) {
    if (overlay.listeners('click').length !== 0) {
      overlay.removeListener('click');
    }
    overlay.setTarget(document.querySelector(this._getDataTarget(_self)));
    overlay.once('click', this._handleOverlayClick.bind(this, _self, className));
  }
  this._toggle(_self, className);
  this.emit('toggle');
  return this;
};
Toggle.prototype.open = function (_self) {
  var target = (0, _closest.default)(_self, this._getDataTarget(_self));
  (0, _componentClasses.default)(target).add(this.options.toggleClass);
  this.emit('open');
  return this;
};
Toggle.prototype.close = function (_self) {
  var target = (0, _closest.default)(_self, this._getDataTarget(_self));
  (0, _componentClasses.default)(target).remove(this.options.toggleClass);
  this.emit('close');
  return this;
};
Toggle.prototype.toggleAll = function (_self) {
  if (this.hasClass(_self)) {
    this.closeAll();
  } else {
    this.closeAll().open(_self);
  }
  this.emit('toggleAll');
  return this;
};
Toggle.prototype.closeAll = function () {
  var this_ = this;
  var nodes = document.querySelectorAll(this._sltor);
  var allParents = [];
  Array.prototype.forEach.call(nodes, function (node) {
    allParents.push.apply(allParents, (0, _parents.default)(node));
  });
  (0, _unique.default)(allParents).forEach(function (parent) {
    var parentClasses = (0, _componentClasses.default)(parent);
    if (parentClasses.has(this_.options.toggleClass)) {
      parentClasses.remove(this_.options.toggleClass);
    }
  });
  this.emit('closeAll');
  return this;
};
Toggle.prototype.onClickToggle = function () {
  var _this = this;
  this._onClickToggleHandler = _componentDelegate.default.bind(document.body, this._sltor, 'click', function handleOnClickToggle(e) {
    e.stopPropagation();
    e.preventDefault();
    _this.toggle(e.delegateTarget);
    _this.emit('onClickToggle');
  });
  return this;
};
Toggle.prototype.onClickToggleAll = function () {
  var _this = this;
  this._onClickToggleAllHandler = _componentDelegate.default.bind(document.body, this._sltor, 'click', function handleOnClickToggleAll(e) {
    e.stopPropagation();
    e.preventDefault();
    _this.toggleAll(e.delegateTarget);
    _this.emit('onClickToggleAll');
  });
  return this;
};
Toggle.prototype.offClickCloseAll = function () {
  var _this = this;
  _componentEvent.default.bind(document.documentElement, 'click', this._handleOffClickCloseAll = function handleOffClickCloseAll(/* e */
  ) {
    _this.closeAll();
    _this.emit('offClickCloseAll');
  });
  return this;
};
Toggle.prototype.destroy = function destroy() {
  // Unbind events
  if (this._onClickToggleHandler) {
    _componentDelegate.default.unbind(document.body, 'click', this._onClickToggleHandler);
    this._onClickToggleHandler = undefined;
  }
  if (this._onClickToggleAllHandler) {
    _componentDelegate.default.unbind(document.body, 'click', this._onClickToggleAllHandler);
    this._onClickToggleAllHandler = undefined;
  }
  if (this._handleOffClickCloseAll) {
    _componentEvent.default.unbind(document.documentElement, 'click', this._handleOffClickCloseAll);
    this._handleOffClickCloseAll = undefined;
  }
  this._sltor = undefined;
  this._dataTarget = null;
  if (this._overlay != null) {
    this._overlay.destroy();
    this._overlay = null;
  }
};