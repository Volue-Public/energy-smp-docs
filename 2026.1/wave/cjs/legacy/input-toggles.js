"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = void 0;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _componentEvent = _interopRequireDefault(require("component-event"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function updateToggleStates(inputEl) {
  var inputName = inputEl.name;
  if (!(inputName && document.querySelector('[data-toggle="' + inputName + '"]'))) {
    return; // Only run if toggles exists
  }
  var toggles = Array.prototype.slice.call(document.querySelectorAll('[data-toggle="' + inputName + '"]')); // Get toggles
  var inputs = document.querySelectorAll('input[name="' + inputName + '"]'); // Get inputs
  var activeToggles = toggles.filter(function (_toggle, i) {
    try {
      var checked = inputs[i].checked;
    } catch (e) {
      console.error('Entries with data-toggle="' + inputs[0].name + '" has less entries than input buttons with that name.', e.stack);
    }
    return checked;
  });
  activeToggles.forEach(function (activeToggle) {
    (0, _componentClasses.default)(activeToggle).add('is-active');
  });
  toggles.filter(function (toggle) {
    return activeToggles.indexOf(toggle) < 0;
  }).forEach(function (toggle) {
    (0, _componentClasses.default)(toggle).remove('is-active');
  });
}
var init = exports.init = function init() {
  _componentEvent.default.bind(document.documentElement, 'input', function handleInput(e) {
    updateToggleStates(e.target);
  });
  Array.prototype.forEach.call(document.querySelectorAll('input:checked'), updateToggleStates);
};