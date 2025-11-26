"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStepsWizard;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _componentEvent = _interopRequireDefault(require("component-event"));
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _extend = _interopRequireDefault(require("extend"));
var _debounce = _interopRequireDefault(require("../utils/debounce"));
var _getElementIndex = _interopRequireDefault(require("../utils/get-element-index"));
var _inheritPrototype = _interopRequireDefault(require("../utils/inherit-prototype"));
var _trim = _interopRequireDefault(require("../utils/trim"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var defaults = {
  selectedItem: {
    step: -1
  },
  addClickHandlers: true,
  enableOverview: true,
  onlyAlignLabels: false,
  shouldScrollToTop: false
};
function createStepsWizard(el, options) {
  return new StepsWizard(el, options);
}
function StepsWizard(el, options) {
  if (!el) {
    throw new Error('Wave.StepsWizard() requires a DOM element to initialize');
  }
  _emitterComponent.default.call(this);
  this.el = el;
  this.options = (0, _extend.default)(true, {}, defaults, options);
  this._stepsNav = this.el.querySelector('.steps-nav');
  this._stepsLabels = this._stepsNav.querySelectorAll('.steps-label:not(.steps-parent)');
  this._stepsContent = this.el.querySelector('.steps-content');
  this._prevBtn = this.el.querySelector('.steps-button.fL');
  this._prevBtnLabel = this._prevBtn.querySelector('.steps-button-label');
  this._prevBtnIcon = this._prevBtn.querySelector('.pf');
  this._nextBtn = this.el.querySelector('.steps-button.fR');
  this._nextBtnLabel = this._nextBtn.querySelector('.steps-button-label');
  this._nextBtnIcon = this._nextBtn.querySelector('.pf');
  this._initialActiveStepLabel = null;
  this._nextText = (0, _trim.default)(this._nextBtnLabel.textContent);
  this._nextIcon = this._nextBtnIcon.className;
  this._prevText = (0, _trim.default)(this._prevBtnLabel.textContent);
  this._prevIcon = this._prevBtnIcon.className;
  this._currentStep = this.options.selectedItem.step;
  this._totalSteps = this._stepsLabels.length;
  this._canMoveNext = false;
  this._canMovePrev = false;
  this._states = [];
  this._initialized = false;
  if (this.options.enableOverview) {
    _componentEvent.default.bind(this._stepsNav, 'click', this._handleStepsNavClick = function (e) {
      (0, _componentClasses.default)(e.currentTarget).toggle('is-active');
    });
  }
  _componentEvent.default.bind(window, 'resize', this.handleResize = (0, _debounce.default)(this.alignLabels.bind(this), 100));
  this.alignLabels();
  if (this.options.onlyAlignLabels) {
    return;
  }

  // Bind click handlers
  if (this.options.addClickHandlers) {
    _componentEvent.default.bind(this._prevBtn, 'click', this._handlePrevBtnClick = this.prev.bind(this));
    _componentEvent.default.bind(this._nextBtn, 'click', this._handleNextBtnClick = this.next.bind(this));
  }
  this._updateStates();
  this.selectedItem(this.options.selectedItem);
}
(0, _inheritPrototype.default)(StepsWizard, _emitterComponent.default);
StepsWizard.prototype._isFirst = function () {
  return this._currentStep === 1;
};
StepsWizard.prototype._isLast = function () {
  return this._currentStep === this._totalSteps;
};
StepsWizard.prototype._isEnabledInternal = function (index) {
  return this._states[index].state === 'enabled';
};
StepsWizard.prototype.isEnabled = function (stepNum) {
  return this._isEnabledInternal(stepNum - 1);
};
StepsWizard.prototype._updateStates = function () {
  var _this = this;
  var index;
  while (this._states.length > 0) {
    this._states.pop();
  }
  Array.prototype.forEach.call(this._stepsNav.querySelectorAll('.steps-label'), function (label, i) {
    index = i + 1;
    _this._states.push((0, _componentClasses.default)(label).has('is-disabled') ? {
      step: index,
      state: 'disabled'
    } : {
      step: index,
      state: 'enabled'
    });
  });
  return this;
};
StepsWizard.prototype.getStates = function () {
  return this._states;
};
StepsWizard.prototype._getIndexOfClosestEnabledStep = function (direction, offset) {
  var index;
  var interval;
  var isClosestEnabledStep = false;
  direction = direction || 'next';
  offset = offset || 0;
  index = this._currentStep - 1 + offset;
  interval = direction === 'next' ? 1 : -1;
  while (!isClosestEnabledStep && index >= 0 && index < this._totalSteps) {
    index = index + interval;
    if (this._states[index] !== undefined && this._isEnabledInternal(index)) {
      isClosestEnabledStep = true;
      index = index + 1;
    }
  }
  if (!isClosestEnabledStep) {
    index = this._currentStep;
  }
  return index;
};
StepsWizard.prototype._setCanMove = function (stepNum, closestNextIndex, closestPrevIndex) {
  closestNextIndex = closestNextIndex || this._getIndexOfClosestEnabledStep('next');
  closestPrevIndex = closestPrevIndex || this._getIndexOfClosestEnabledStep('previous');
  this._canMoveNext = stepNum - closestNextIndex !== 0;
  this._canMovePrev = stepNum - closestPrevIndex !== 0;
};
StepsWizard.prototype._updateButtonsState = function () {
  this._setCanMove(this._currentStep);
  this._nextBtn.disabled = this._canMoveNext ? false : !this._isLast();
  this._prevBtn.disabled = this._canMovePrev ? false : !this._isFirst();
};
StepsWizard.prototype._show = function () {
  var cancelText = this._prevBtn.getAttribute('data-cancel-text');
  var submitText = this._nextBtn.getAttribute('data-submit-text');
  var cancelIconClass = this._prevBtn.getAttribute('data-cancel-icon-class');
  var submitIconClass = this._nextBtn.getAttribute('data-submit-icon-class');
  var currentStep;
  var target;
  var activePanel;
  var targetPanel;

  // Change button text of first step
  if (cancelText) {
    this._prevBtnLabel.textContent = this._isFirst() ? cancelText : this._prevText;
  }

  // Change button text of last step
  if (submitText) {
    this._nextBtnLabel.textContent = this._isLast() ? submitText : this._nextText;
  }

  // Change button icon of first step
  if (cancelIconClass) {
    this._prevBtnIcon.className = this._isFirst() ? cancelIconClass : this._prevIcon;
  }

  // Change button text of last step
  if (submitIconClass) {
    this._nextBtnIcon.className = this._isLast() ? submitIconClass : this._nextIcon;
  }

  // Check if there are any enabled next or previous steps and update the nav buttons state accordingly
  this._updateButtonsState();

  // Reset active class for steps labels
  var activeStepLabels = this._stepsNav.querySelectorAll('.steps-label--is-active');
  Array.prototype.forEach.call(activeStepLabels, function (label) {
    (0, _componentClasses.default)(label).remove('steps-label--is-active');
  });
  currentStep = this._stepsLabels[this._currentStep - 1];
  // Set active class for current step label
  (0, _componentClasses.default)(currentStep).add('steps-label--is-active');
  target = currentStep.getAttribute('data-step');

  // Set active class for target step
  activePanel = this._stepsContent.querySelector('.steps-panel.is-active');
  if (activePanel != null) {
    (0, _componentClasses.default)(activePanel).remove('is-active');
  }
  targetPanel = this._stepsContent.querySelector('.steps-panel[data-step="' + target + '"]');
  (0, _componentClasses.default)(targetPanel).add('is-active');
  if (this._initialized) {
    this.emit('change', {
      step: this._currentStep
    });

    // Cause steps labels to realign
    this.alignLabels();
    if (this.options.shouldScrollToTop) {
      this._stepsContent.scrollTop = 0;
    }
  } else {
    this.emit('init');
  }
  this._initialized = true;
};
StepsWizard.prototype.previous = StepsWizard.prototype.prev = function (e) {
  e && e.preventDefault();
  var shouldCancel = false;
  if (this._currentStep > 1) {
    this.emit('navigate', {
      step: this._currentStep,
      direction: 'previous',
      cancel: function cancel() {
        shouldCancel = true;
      }
    });
    if (shouldCancel) return;
    this._currentStep -= this._currentStep - this._getIndexOfClosestEnabledStep('previous');
    this._show();
    this._prevBtn.blur();
  } else if (this._currentStep === 1) {
    this.emit('back');
  }
};
StepsWizard.prototype.next = function (e) {
  e && e.preventDefault();
  var shouldCancel = false;
  if (this._currentStep + 1 <= this._totalSteps) {
    this.emit('navigate', {
      step: this._currentStep,
      direction: 'next',
      cancel: function cancel() {
        shouldCancel = true;
      }
    });
    if (shouldCancel) return;
    this._currentStep += this._getIndexOfClosestEnabledStep('next') - this._currentStep;
    this._show();
    this._nextBtn.blur();
  } else if (this._currentStep === this._totalSteps) {
    this.emit('finish');
  }
};
StepsWizard.prototype.enable = function (stepNum) {
  var index = stepNum - 1; // index is 0-based

  (0, _componentClasses.default)(this._stepsLabels[index]).remove('is-disabled');
  this._states[index].state = 'enabled';
  this._updateButtonsState();
  return this;
};
StepsWizard.prototype.disable = function (stepNum) {
  var index = stepNum - 1; // index is 0-based

  if (this._currentStep === stepNum) {
    return this;
  }
  (0, _componentClasses.default)(this._stepsLabels[index]).add('is-disabled');
  this._states[index].state = 'disabled';
  this._updateButtonsState();
  return this;
};
StepsWizard.prototype.selectedItem = function (selectedItem) {
  var returnValue, step, closestNextIndex, closestPrevIndex, activeStepLabel;
  if (selectedItem) {
    step = selectedItem.step || -1;
    if (step >= 1 && step <= this._totalSteps) {
      this._currentStep = step;
      if (this.isEnabled(step)) {
        this._show();
      } else {
        closestNextIndex = this._getIndexOfClosestEnabledStep('next');
        closestPrevIndex = this._getIndexOfClosestEnabledStep('previous');
        this._setCanMove(step, closestNextIndex, closestPrevIndex);
        if (this._canMovePrev) {
          this._currentStep = closestPrevIndex;
          this._show();
        } else if (this._canMoveNext) {
          this._currentStep = closestNextIndex;
          this._show();
        }
      }
    } else {
      activeStepLabel = this._initialActiveStepLabel = this._stepsNav.querySelector('.steps-label--is-active');
      if (activeStepLabel != null) {
        step = activeStepLabel.getAttribute('data-step');
      }
      if (step == null || isNaN(step) || step === -1) {
        throw new Error('Initial step in step wizard not set');
      } else {
        this._currentStep = parseInt(step, 10);
        this._setCanMove(this._currentStep);
        this._show();
      }
    }
    returnValue = this;
  } else {
    returnValue = {
      step: this._currentStep
    };
  }
  return returnValue;
};
StepsWizard.prototype.destroy = function () {
  // Unbind events
  _componentEvent.default.unbind(window, 'resize', this.handleResize);
  if (this._handleStepsNavClick) {
    _componentEvent.default.unbind(this._stepsNav, 'click', this._handleStepsNavClick);
  }
  if (this._handlePrevBtnClick) {
    _componentEvent.default.unbind(this._prevBtn, 'click', this._handlePrevBtnClick);
  }
  if (this._handleNextBtnClick) {
    _componentEvent.default.unbind(this._nextBtn, 'click', this._handleNextBtnClick);
  }

  // Cleanup
  while (this._states.length > 0) {
    this._states.pop();
  }
  this._prevBtn.disabled = false;
  this._nextBtn.disabled = false;
  this._prevBtnIcon.className = this._prevIcon;
  this._nextBtnIcon.className = this._nextIcon;
  this._prevBtnLabel.textContent = this._prevText;
  this._nextBtnLabel.textContent = this._nextText;
  (0, _componentClasses.default)(this._stepsNav).remove('is-active');
  var labels = this._stepsNav.querySelectorAll('.steps-label');
  Array.prototype.forEach.call(labels, function (label) {
    (0, _componentClasses.default)(label).remove('steps-label--is-active').remove('is-collapsed');
  });
  if (this._initialActiveStepLabel != null) {
    (0, _componentClasses.default)(this._initialActiveStepLabel).add('steps-label--is-active');
  }
  var activePanel = this._stepsContent.querySelector('.steps-panel.is-active');
  if (activePanel != null) {
    (0, _componentClasses.default)(activePanel).remove('is-active');
  }
};
StepsWizard.prototype.alignLabels = function () {
  var minLeft = this._prevBtn ? this._prevBtn.getBoundingClientRect().right : 0;
  var maxRight = this._nextBtn ? this._nextBtn.getBoundingClientRect().left : window.innerWidth;
  var labels = this._stepsNav.querySelectorAll('.steps-label');
  Array.prototype.forEach.call(labels, function (label) {
    (0, _componentClasses.default)(label).remove('is-collapsed');
  });
  var label0 = labels[0];
  var labelN = labels[labels.length - 1];
  var active = (0, _getElementIndex.default)(this._stepsNav.querySelector('.steps-label--is-active'));
  var ii = 0;
  if (label0 && label0.getBoundingClientRect().left < minLeft || labelN && labelN.getBoundingClientRect().right > maxRight) {
    if (active < labels.length / 2) {
      // Active step is before half way - hide from end if not room for all
      // Hide from end and stop at next step (not including - closest siblings should be shown)
      for (ii = labels.length - 1; ii > active + 2; ii--) {
        if (label0.getBoundingClientRect().left < minLeft || labelN.getBoundingClientRect().right > maxRight) {
          (0, _componentClasses.default)(labels[ii]).add('is-collapsed');
        }
      }
      // Hide from start in case still not enough room
      if (label0.getBoundingClientRect().left < minLeft || labelN.getBoundingClientRect().right > maxRight) {
        for (ii = 0; ii < active - 1; ii++) {
          if (label0.getBoundingClientRect().left < minLeft || labelN.getBoundingClientRect().right > maxRight) {
            (0, _componentClasses.default)(labels[ii]).add('is-collapsed');
          }
        }
      }
    } else {
      // Active step is past half way - hide from start if not room for all
      // Hide from start and stop at previous step (not including - closest siblings should be shown)
      for (ii = 0; ii < active - 2; ii++) {
        if (label0.getBoundingClientRect().left < minLeft || labelN.getBoundingClientRect().right > maxRight) {
          (0, _componentClasses.default)(labels[ii]).add('is-collapsed');
        }
      }
      // Hide from end in case still not enough room
      if (label0.getBoundingClientRect().left < minLeft || labelN.getBoundingClientRect().right > maxRight) {
        for (ii = labels.length - 1; ii > active + 1; ii--) {
          if (label0.getBoundingClientRect().left < minLeft || labelN.getBoundingClientRect().right > maxRight) {
            (0, _componentClasses.default)(labels[ii]).add('is-collapsed');
          }
        }
      }
    }
  }
};