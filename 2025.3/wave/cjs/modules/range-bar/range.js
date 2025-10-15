"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Range;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _componentEvent = _interopRequireDefault(require("component-event"));
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Range(options) {
  this.bar = options.bar;
  this.id = options.id;
  this.readonly = options.readonly;
  this.el = document.createElement('div');
  var elClassName = 'rangeBar-range';
  if (this.readonly === true) {
    elClassName += ' rangeBar-range--readonly';
  }
  if (options.color != null) {
    elClassName += ' fill-' + options.color;
  } else {
    elClassName += ' fill-accent--bold';
  }
  this.el.className = elClassName;
  if (this.readonly === false) {
    this.leftHandler = document.createElement('div');
    this.leftHandler.className = 'rangeBar-handle';
    this.el.appendChild(this.leftHandler);
    this.rightHandler = document.createElement('div');
    this.rightHandler.className = 'rangeBar-handle';
    this.el.appendChild(this.rightHandler);
  }
  this.pressed = false;
  this._value = options.value;
  this._handleMouseMove = this.handleMouseMove.bind(this);
  this._handleMouseUp = this.handleMouseUp.bind(this);
  this._handleMouseDown = this.handleMouseDown.bind(this);
  _componentEvent.default.bind(document, 'mousemove', this._handleMouseMove);
  _componentEvent.default.bind(this.bar.el, 'mousedown', this._handleMouseDown);
  _componentEvent.default.bind(document, 'mouseup', this._handleMouseUp);
  this.el.ondragstart = function () {
    return false;
  };
  this.emitter = new _emitterComponent.default();
  this.setValue(options.value);
}
Range.prototype.removeEvents = function removeEvents() {
  _componentEvent.default.unbind(this.bar.el, 'mousedown', this._handleMouseDown);
  _componentEvent.default.unbind(document, 'mousemove', this._handleMouseMove);
  _componentEvent.default.unbind(document, 'mouseup', this._handleMouseUp);
};
Range.prototype.handleMouseDown = function handleMouseDown(event) {
  if (this.readonly === true) {
    return;
  }
  if (event.target === this.el) {
    this.pressed = true;
    this.pressedMode = 'this';
  }
  if (event.target === this.rightHandler) {
    this.pressed = true;
    this.pressedMode = 'right';
    (0, _componentClasses.default)(document.body).add('with-rangeBar--is-resizing');
  }
  if (event.target === this.leftHandler) {
    this.pressed = true;
    this.pressedMode = 'left';
    (0, _componentClasses.default)(document.body).add('with-rangeBar--is-resizing');
  }
  if (this.pressed) {
    this.pressedPosition = this.bar.roundUserValue(this.bar.getCursor(event));
    this.emitter.emit('click', this.data());
  }
};
Range.prototype.handleMouseMove = function handleMouseMove(event) {
  if (this.pressed) {
    var cursor = this.bar.getCursor(event);
    var difference = cursor - this.pressedPosition;
    var roundDifference = this.bar.roundUserValue(difference);

    // eslint-disable-next-line eqeqeq
    if (roundDifference == 0) {
      return;
    }
    var newRight = this.right;
    var newLeft = this.left;
    if (this.pressedMode === 'this') {
      newRight += roundDifference;
      newLeft += roundDifference;
    }
    if (this.pressedMode === 'right') {
      newRight += roundDifference;
    }
    if (this.pressedMode === 'left') {
      newLeft += roundDifference;
    }
    if (newLeft < this.bar.options.min) {
      return;
    }
    if (newRight > this.bar.options.max) {
      return;
    }
    if (newRight < newLeft) {
      return;
    }
    var intersection = false;
    for (var i = 0; i < this.bar.rangeList.length; i++) {
      var range = this.bar.rangeList[i];
      if (intersection) {
        break;
      }
      if (range === this) {
        continue;
      }
      if (range.left < newRight && newRight <= range.right) {
        intersection = true;
      }
      if (range.left <= newLeft && newLeft < range.right) {
        intersection = true;
      }
      if (newLeft <= range.left && range.right <= newRight) {
        intersection = true;
      }
    }
    if (intersection) {
      return;
    }
    this.pressedPosition += roundDifference;
    if (newRight - newLeft < this.bar.options.minSize) {
      return;
    }
    this.setValue([newLeft, newRight]);
    this.emitter.emit('changing', this.data());
  }
};
Range.prototype.handleMouseUp = function handleMouseUp(event) {
  (0, _componentClasses.default)(document.body).remove('with-rangeBar--is-resizing');
  if ([this.el, this.leftHandler, this.rightHandler].indexOf(event.target) === -1 && !this.pressed) {
    return;
  }
  this.pressed = false;
  this.pressedPosition = undefined;
  var oldValue = this._value;
  var newValue = this.data().val;
  // eslint-disable-next-line eqeqeq
  if (newValue[0] != oldValue[0] || newValue[1] != oldValue[1]) {
    this.emitter.emit('change', this.data());
    this._value = [newValue[0], newValue[1]];
  }
};
Range.prototype.render = function render() {
  var percentLeft = this.bar.unitToPercent(this.bar.userToUnit(this.left));
  var percentRight = this.bar.unitToPercent(this.bar.userToUnit(this.right));
  this.el.style.left = percentLeft + '%';
  this.el.style.width = percentRight - percentLeft + '%';
};
Range.prototype.setValue = function setValue(value) {
  this.left = value[0];
  this.right = value[1];
  this.render();
};
Range.prototype.getValue = function getValue() {
  return [this.left, this.right].map(this.bar.options.valueFormat);
};
Range.prototype.data = function data() {
  return {
    id: this.id,
    val: this.getValue(),
    el: this.el,
    readonly: this.readonly
  };
};