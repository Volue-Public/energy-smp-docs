"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Days;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _componentEvent = _interopRequireDefault(require("component-event"));
var _domify = _interopRequireDefault(require("domify"));
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _inGroupsOf = _interopRequireDefault(require("in-groups-of"));
var _rangeComponent = _interopRequireDefault(require("range-component"));
var _dayRange = _interopRequireDefault(require("./day-range"));
var _template = _interopRequireDefault(require("./template"));
var _utils = require("./utils");
var _empty = _interopRequireDefault(require("../../../utils/empty"));
var _inheritPrototype = _interopRequireDefault(require("../../../utils/inherit-prototype"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Get days in `month` for `year`
 */
function daysInMonth(month, year) {
  return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}

/**
 * Check if `year` is a leap year
 */
function isLeapYear(year) {
  // eslint-disable-next-line eqeqeq
  return year % 400 == 0 || year % 4 == 0 && year % 100 != 0 || year == 0;
}

/**
 * Initialize a new `Days` view
 *
 * Emits:
 *   - `prev` when prev link is clicked
 *   - `next` when next link is clicked
 *   - `change` (date) when a date is selected
 */
function Days(config) {
  _emitterComponent.default.call(this);
  var self = this;
  this.config = config;
  this.el = (0, _domify.default)(_template.default);
  (0, _componentClasses.default)(this.el).add('calendar-days');
  this.head = this.el.tHead;
  this.body = this.el.tBodies[0];
  this.title = this.head.querySelector('.calendar-title');
  this.select(new Date());
  this.validRange = new _dayRange.default();
  if (this.config.firstDay > 0) {
    this.config.i18n.days = toEnd(this.config.i18n.days, 0, this.config.firstDay);
  }

  // emit "day"
  _componentEvent.default.bind(this.body, 'click', function (e) {
    if (e.target.tagName !== 'A') {
      return true;
    }
    e.preventDefault();
    var el = e.target;
    var data = el.getAttribute('data-date').split('-');
    if (!self.validRange.valid(data)) {
      return false;
    }
    var year = data[0];
    var month = data[1];
    var day = data[2];
    var date = new Date(year, month, day);
    self.select(date);
    self.emit('change', date);
    return false;
  });

  // emit "prev"
  _componentEvent.default.bind(this.el.querySelector('.calendar-prev'), 'click', function (ev) {
    ev.preventDefault();
    self.emit('prev');
    return false;
  });

  // emit "next"
  _componentEvent.default.bind(this.el.querySelector('.calendar-next'), 'click', function (ev) {
    ev.preventDefault();
    self.emit('next');
    return false;
  });
}
(0, _inheritPrototype.default)(Days, _emitterComponent.default);

/**
 * Select the given `date`
 */
Days.prototype.select = function (date) {
  this.selected = date;
  return this;
};

/**
 * Show date selection
 */
Days.prototype.show = function (date) {
  var year = date.getFullYear();
  var month = date.getMonth();
  this._showSelectedYear(year);
  this._showSelectedMonth(month);
  var subhead = this.head.querySelector('.calendar-subheading');
  if (subhead) {
    subhead.parentElement.removeChild(subhead);
  }
  this.head.appendChild(this._renderHeading(2));
  (0, _empty.default)(this.body);
  this.body.appendChild(this._renderDays(date));
};

/**
 * Enable a year dropdown
 */
Days.prototype.yearMenu = function (from, to) {
  this.selectYear = true;
  this.title.querySelector('.calendar-year').innerHTML = yearDropdown(from, to);
  var self = this;
  _componentEvent.default.bind(this.title.querySelector('.calendar-year .calendar-select'), 'change', function () {
    self.emit('year');
    return false;
  });
};

/**
 * Enable a month dropdown
 */
Days.prototype.monthMenu = function () {
  this.selectMonth = true;
  this.title.querySelector('.calendar-month').innerHTML = monthDropdown.call(this);
  var self = this;
  _componentEvent.default.bind(this.title.querySelector('.calendar-month .calendar-select'), 'change', function () {
    self.emit('month');
    return false;
  });
};

/**
 * Return current year of view from title
 */
Days.prototype._titleYear = function () {
  if (this.selectYear) {
    return this.title.querySelector('.calendar-year .calendar-select').value;
  } else {
    return this.title.querySelector('.calendar-year').innerHTML;
  }
};

/**
 * Return current month of view from title
 */
Days.prototype._titleMonth = function () {
  if (this.selectMonth) {
    return this.title.querySelector('.calendar-month .calendar-select').value;
  } else {
    return this.title.querySelector('.calendar-month').innerHTML;
  }
};

/**
 * Return a date based on the field-selected month
 */
Days.prototype.selectedMonth = function () {
  return new Date(this._titleYear(), this._titleMonth(), 1);
};

/**
 * Render days of the week heading with
 * the given `length`, for example 2 for "Tue",
 * 3 for "Tue" etc
 */
Days.prototype._renderHeading = function (len) {
  var rows = '<tr class=calendar-subheading>' + this.config.i18n.days.map(function (day) {
    return '<th><abbr title=' + day + '>' + day.slice(0, len) + '</abbr></th>';
  }).join('') + '</tr>';
  return (0, _domify.default)(rows);
};

/**
 * Render days for `date`
 */
Days.prototype._renderDays = function (date) {
  var rows = this._rowsFor(date);
  var html = rows.map(function (row) {
    return '<tr>' + row.join('') + '</tr>';
  }).join('\n');
  return (0, _domify.default)(html);
};

/**
 * Return rows array for `date`
 *
 * This method calculates the "overflow"
 * from the previous month and into
 * the next in order to display an
 * even 5 rows
 */
Days.prototype._rowsFor = function (date) {
  var selected = this.selected;
  var selectedDay = selected.getDate();
  var selectedMonth = selected.getMonth();
  var selectedYear = selected.getFullYear();
  var month = date.getMonth();
  var year = date.getFullYear();

  // calculate overflow
  var start = new Date(date);
  start.setDate(1);
  var before = start.getDay();
  if (this.config.firstDay > 0) {
    before -= this.config.firstDay;
    if (before < 0) {
      before += 7;
    }
  }
  var total = daysInMonth(month, year);
  var perRow = 7;
  var totalShown = perRow * Math.ceil((total + before) / perRow);
  var after = totalShown - (total + before);
  var cells = [];

  // cells before
  cells = cells.concat(cellsBefore(before, month, year, this.validRange));

  // current cells
  for (var i = 0; i < total; ++i) {
    var day = i + 1;
    var select = day == selectedDay && month == selectedMonth && year == selectedYear; // eslint-disable-line eqeqeq
    cells.push(renderDay([year, month, day], this.validRange, select, 'calendar-day'));
  }

  // after cells
  cells = cells.concat(cellsAfter(after, month, year, this.validRange));
  return (0, _inGroupsOf.default)(cells, 7);
};

/**
 * Update view title or select input for `year`
 */
Days.prototype._showSelectedYear = function (year) {
  if (this.selectYear) {
    this.title.querySelector('.calendar-year .calendar-label').firstChild.textContent = year;
    this.title.querySelector('.calendar-year .calendar-select').value = year;
  } else {
    this.title.querySelector('.calendar-year').innerHTML = year;
  }
};

/**
 * Update view title or select input for `month`
 */
Days.prototype._showSelectedMonth = function (month) {
  if (this.selectMonth) {
    this.title.querySelector('.calendar-month .calendar-label').firstChild.textContent = this.config.i18n.months[month];
    this.title.querySelector('.calendar-month .calendar-select').value = month;
  } else {
    this.title.querySelector('.calendar-month').innerHTML = this.config.i18n.months[month];
  }
};

/**
 * Return `n` days before `month`
 */
function cellsBefore(n, month, year, validRange) {
  var cells = [];
  // eslint-disable-next-line eqeqeq
  if (month == 0) {
    --year;
  }
  var prev = (0, _utils.clamp)(month - 1);
  var before = daysInMonth(prev, year);
  while (n--) {
    cells.push(renderDay([year, prev, before--], validRange, false, 'calendar-day calendar-day--prev'));
  }
  return cells.reverse();
}

/**
 * Return `n` days after `month`
 */
function cellsAfter(n, month, year, validRange) {
  var cells = [];
  var day = 0;
  // eslint-disable-next-line eqeqeq
  if (month == 11) {
    ++year;
  }
  var next = (0, _utils.clamp)(month + 1);
  while (n--) {
    cells.push(renderDay([year, next, ++day], validRange, false, 'calendar-day calendar-day--next'));
  }
  return cells;
}

/**
 * Day template
 */
function renderDay(ymd, validRange, selected, style) {
  var date = 'data-date=' + ymd.join('-');
  var styles = [];
  var tdClass = '';
  var aClass = '';
  if (selected) {
    tdClass = ' class="is-selected"';
  }
  if (style) {
    styles.push(style);
  }
  if (!validRange.valid(ymd)) {
    styles.push('calendar-day--is-invalid');
  }
  if (styles.length) {
    aClass = ' class="' + styles.join(' ') + '"';
  }
  return '<td' + tdClass + '><a ' + date + aClass + '>' + ymd[2] + '</a></td>';
}

/**
 * Year dropdown template
 */
function yearDropdown(from, to) {
  var years = (0, _rangeComponent.default)(from, to, 'inclusive');
  var options = years.map(yearOption).join('');
  return ['<span class="calendar-label btn btn--ghost">', '<select class="calendar-select">' + options + '</select>', '</span>'].join('\n');
}

/**
 * Month dropdown template
 */
function monthDropdown() {
  var options = this.config.i18n.months.map(monthOption).join('');
  return ['<span class="calendar-label btn btn--ghost">', '<select class="calendar-select">' + options + '</select>', '</span>'].join('\n');
}

/**
 * Year dropdown option template
 */
function yearOption(year) {
  return '<option value="' + year + '">' + year + '</option>';
}

/**
 * Month dropdown option template
 */
function monthOption(month, i) {
  return '<option value="' + i + '">' + month + '</option>';
}

/**
 * Move multiple items from some arbitrary position
 * to the end
 */
function toEnd(list, from, count) {
  list.push.apply(list, list.splice(from, count));
  return list;
}