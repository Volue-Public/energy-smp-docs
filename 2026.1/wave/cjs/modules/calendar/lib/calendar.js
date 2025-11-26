"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCalendar;
var _domify = _interopRequireDefault(require("domify"));
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _extend = _interopRequireDefault(require("extend"));
var _days = _interopRequireDefault(require("./days"));
var _inheritPrototype = _interopRequireDefault(require("../../../utils/inherit-prototype"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Calendar-component v0.1.0
 * MIT License
 * @preserve
 */

function createCalendar(date, options) {
  return new Calendar(date, options);
}

/**
 * Initialize a new `Calendar`
 *
 * Events:
 *  - `prev` when the prev link is clicked
 *  - `next` when the next link is clicked
 *  - `change` (date) when the selected date is modified
 */
function Calendar(options) {
  _emitterComponent.default.call(this);
  var self = this;
  this.options = options ? (0, _extend.default)(true, {}, this.constructor.defaults, options) : this.constructor.defaults;
  this.el = (0, _domify.default)('<div class=calendar></div>');
  this.days = new _days.default(this.options);
  this.el.appendChild(this.days.el);
  this.on('change', this.show.bind(this));
  this.days.on('prev', this.prev.bind(this));
  this.days.on('next', this.next.bind(this));
  this.days.on('year', this.menuChange.bind(this, 'year'));
  this.days.on('month', this.menuChange.bind(this, 'month'));
  this.show(this.options.date || new Date());
  this.days.on('change', function (date) {
    self.emit('change', date);
  });
}
Calendar.defaults = {
  i18n: {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  firstDay: 1,
  // Monday
  date: null
};
(0, _inheritPrototype.default)(Calendar, _emitterComponent.default);

/**
 * Add class for styling purposes
 */
Calendar.prototype.addClass = function (cls) {
  this.el.className += ' ' + cls;
  return this;
};

/**
 * Select `date`
 */
Calendar.prototype.select = function (date) {
  if (this.days.validRange.valid(date)) {
    this.selected = date;
    this.days.select(date);
  }
  this.show(date);
  return this;
};

/**
 * Show `date`
 */
Calendar.prototype.show = function (date) {
  this._date = date;
  this.days.show(date);
  return this;
};

/**
 * Set minimum valid date
 */
Calendar.prototype.min = function (date) {
  this.days.validRange.min(date);
  this.show(this._date);
  return this;
};

/**
 * Set maximum valid date
 */
Calendar.prototype.max = function (date) {
  this.days.validRange.max(date);
  this.show(this._date);
  return this;
};

/**
 * Enable a year dropdown
 */
Calendar.prototype.showYearSelect = function (from, to) {
  from = from || this._date.getFullYear() - 10;
  to = to || this._date.getFullYear() + 10;
  this.days.yearMenu(from, to);
  this.show(this._date);
  return this;
};

/**
 * Enable a month dropdown
 */
Calendar.prototype.showMonthSelect = function () {
  this.days.monthMenu();
  this.show(this._date);
  return this;
};

/**
 * Return the previous month
 */
Calendar.prototype._prevMonth = function () {
  var date = new Date(this._date);
  date.setDate(1);
  date.setMonth(date.getMonth() - 1);
  return date;
};

/**
 * Return the next month
 */
Calendar.prototype._nextMonth = function () {
  var date = new Date(this._date);
  date.setDate(1);
  date.setMonth(date.getMonth() + 1);
  return date;
};

/**
 * Show the prev view
 */
Calendar.prototype.prev = function () {
  this.show(this._prevMonth());
  this.emit('view change', this.days.selectedMonth(), 'prev');
  return this;
};

/**
 * Show the next view
 */
Calendar.prototype.next = function () {
  this.show(this._nextMonth());
  this.emit('view change', this.days.selectedMonth(), 'next');
  return this;
};

/**
 * Switch to the year or month selected by dropdown menu
 */
Calendar.prototype.menuChange = function (action) {
  var date = this.days.selectedMonth();
  this.show(date);
  this.emit('view change', date, action);
  return this;
};