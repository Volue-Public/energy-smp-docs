"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createMultiSelect;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _componentEvent = _interopRequireDefault(require("component-event"));
var _domify = _interopRequireDefault(require("domify"));
var _emitterComponent = _interopRequireDefault(require("emitter-component"));
var _extend = _interopRequireDefault(require("extend"));
var _mark = _interopRequireDefault(require("mark.js"));
var _template = _interopRequireDefault(require("./template"));
var _templateChecklistItem = _interopRequireDefault(require("./template-checklist-item"));
var _templateGroup = _interopRequireDefault(require("./template-group"));
var _templateListItem = _interopRequireDefault(require("./template-list-item"));
var _closest = _interopRequireDefault(require("../../utils/closest"));
var _inheritPrototype = _interopRequireDefault(require("../../utils/inherit-prototype"));
var _raf = _interopRequireDefault(require("../../utils/raf"));
var _transitEnd = _interopRequireDefault(require("../../utils/transit-end"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function createMultiSelect(el, options) {
  return new MultiSelect(el, options);
}
var defaults = {
  itemsList: [],
  selectedList: [],
  inputId: null,
  labelColor: 'accent--strong',
  labelOutline: false,
  itemIsObject: false,
  uniqueIdProperty: null,
  labelProperty: null,
  labelTemplate: null,
  emptyStateText: 'All options were selected',
  filteredStateText: 'Some options are hidden by filter',
  removeSelectedItemText: 'Remove {label}',
  removeAllText: 'Remove all items from selection',
  groups: null,
  groupBy: null,
  ungroupedHeader: '',
  groupDefaultCollapsed: false,
  hideGroupCheckbox: false,
  hideGroupCollapseButton: false,
  horizontalScroll: false
};
function MultiSelect(selector, options) {
  var el = typeof selector === 'object' ? selector.get ? selector.get(0) : selector : document.querySelector(selector);
  if (!el) {
    throw new Error('Wave.MultiSelect() requires a DOM element to initialize');
  }
  _emitterComponent.default.call(this);
  this.options = (0, _extend.default)(true, {}, defaults, options);
  this._appended = false;
  var multiSelectElement = (0, _domify.default)(_template.default);
  this.labelList = multiSelectElement.firstChild;
  this.dropdownList = multiSelectElement.lastChild;

  // https://www.w3.org/TR/wai-aria/#combobox
  multiSelectElement.setAttribute('role', 'combobox');
  // multiSelectElement.setAttribute('aria-owns', this.dropdownList.id); // Not needed because dropdownList is descendant of element.
  multiSelectElement.setAttribute('aria-expanded', false);
  if (this.options.groups || this.options.groupBy || this.options.useCheckboxes) {
    this.dropdownList.setAttribute('role', 'tree');
    multiSelectElement.setAttribute('aria-haspopup', 'tree');
  } else {
    this.dropdownList.setAttribute('role', 'listbox');
    multiSelectElement.setAttribute('aria-haspopup', 'listbox');
  }
  if (el.tagName === 'INPUT') {
    (0, _componentClasses.default)(el).add('multiSelect-element');
    this.options.inputId = el.id;
    el.after(multiSelectElement);
    el.setAttribute('role', 'searchbox');
    el.setAttribute('aria-multiline', false);
    el.setAttribute('aria-autocomplete', 'list');
    this.labelList.firstChild.replaceWith(el);
  } else {
    // Merge original element classes and properties into multiSelectElement
    el.classList.forEach(function (className) {
      if (!(0, _componentClasses.default)(multiSelectElement).contains(className)) {
        (0, _componentClasses.default)(multiSelectElement).add(className);
      }
    });
    var i;
    for (i = 0; i < el.attributes.length; i++) {
      if (el.attributes[i].name !== 'class') {
        multiSelectElement.setAttribute(el.attributes[i].name, el.attributes[i].value);
      }
    }
    multiSelectElement.id = el.id;

    // Replace original element with multiSelectElement
    el.replaceWith(multiSelectElement);
  }
  if (multiSelectElement.id) {
    this.id = 'multiSelect_' + multiSelectElement.id;
  } else if (this.options.inputId) {
    this.id = 'multiSelect_' + this.options.inputId;
  } else {
    var idCounter = 0;
    while (document.getElementById('multiSelect_' + idCounter) !== null) {
      idCounter += 1;
    }
    this.id = 'multiSelect_' + idCounter;
  }
  this.el = multiSelectElement;
  this.classes = (0, _componentClasses.default)(this.el);
  this.dropdownList.id = this.id + '_dropdownList';
  this.inputElement = this.labelList.firstChild;
  this.inputElementLabel = this.inputElement.nextElementSibling;
  this.unselectAllButton = this.inputElementLabel.nextElementSibling;
  this.arrowButton = this.labelList.lastChild;
  this.emptyStateElement = this.dropdownList.firstChild;
  this.filteredStateElement = this.emptyStateElement.nextElementSibling;
  if (this.options.inputId) {
    this.inputElement.id = this.options.inputId;
  }
  this.emptyStateElement.innerText = this.options.emptyStateText;
  this.filteredStateElement.innerText = this.options.filteredStateText;
  this.arrowButton.firstChild.setAttribute('aria-controls', this.dropdownList.id);
  this.unselectAllButton.firstChild.setAttribute('title', this.options.removeAllText);
  if (!this.inputElement.id) {
    this.inputElement.id = this.id + '_inputElement';
  }
  this.inputElement.setAttribute('aria-controls', this.dropdownList.id);
  var externalLabel = document.querySelector('label[for="' + this.el.id + '"]');
  if (externalLabel && externalLabel.htmlFor) {
    // Change label target to input element
    externalLabel.htmlFor = this.inputElement.id;
  } else {
    // Get label aready targetting input element (if any)
    externalLabel = document.querySelector('label[for="' + this.inputElement.id + '"]');
  }
  if (externalLabel) {
    if (!externalLabel.id) {
      externalLabel.id = this.id + '_externalLabel';
    }
    this.el.setAttribute('aria-labelledby', externalLabel.id);
  }
  var self = this;
  self.itemsDictionary = {};
  if (self.options.itemsList.length > 0 && typeof self.options.itemsList[0] === 'object') {
    self.options.itemIsObject = true;
  }
  if (self.options.itemsList.length === 0 && self.options.selectedList.length > 0 && typeof self.options.selectedList[0] === 'object') {
    self.options.itemIsObject = true;
  }

  // Build key dictionary
  var itemsTempDictionary = {};
  self.options.itemsList.forEach(function (item) {
    var itemKey = getItemKey.call(self, item); // This will populate self.itemsDictionary inside getItemKey
    itemsTempDictionary[itemKey] = item;
  });

  // Filter items to exclude duplicates
  if (self.options.itemIsObject) {
    // Rebuild list to make sure selected list references actual item from itemsList
    var selectedList = self.options.selectedList.slice();
    self.options.selectedList = [];
    selectedList.forEach(function (item) {
      var selectedKey = getItemKey.call(self, item);
      if (itemsTempDictionary[selectedKey]) {
        // Use item from itemsList - not copy with same key from selected list
        self.options.selectedList.push(itemsTempDictionary[selectedKey]);
      } else {
        if (selectedKey && selectedKey !== item) {
          // Only add if key is valid and not same as the value itself
          self.options.selectedList.push(item);
        }
      }
    });
  }
  var selectedListItemKeys = self.options.selectedList.map(function (item) {
    return getItemKey.call(self, item);
  });
  self.options.itemsList = self.options.itemsList.filter(function (item) {
    var itemKey = getItemKey.call(self, item);
    return selectedListItemKeys.indexOf(itemKey) === -1;
  });
  var ungroupedKey = '_ungrouped';
  if (self.options.groups || self.options.groupBy || self.options.useCheckboxes) {
    self.groupsDictionary = {};
    self.itemGroupMapping = {}; // itemGroupMapping[itemKey] = groupKey
    self.options.useCheckboxes = true;
    self.groupsDictionary[ungroupedKey] = {
      key: ungroupedKey,
      label: self.options.ungroupedHeader,
      items: []
    };
  }
  if (self.options.groups) {
    self.options.groups.forEach(function (group) {
      var groupKey = group.label || ungroupedKey;
      if (!Object.hasOwnProperty.call(self.groupsDictionary, groupKey)) {
        self.groupsDictionary[groupKey] = group;
      }
      var _group = self.groupsDictionary[groupKey];
      if (!_group.key) {
        _group.key = groupKey;
      }
      if (!_group.items) {
        _group.items = [];
      }
      if (group.items) {
        group.items.forEach(function (item) {
          var itemKey = getItemKey.call(self, item);
          self.itemGroupMapping[itemKey] = groupKey;
          if (_group !== group) {
            _group.items.push(item);
          }
        });
      }
    });
  }
  if (self.options.useCheckboxes) {
    for (var itemKey in self.itemsDictionary) {
      var item = self.itemsDictionary[itemKey];
      var groupKey = ungroupedKey;
      var groupLabel;
      if (self.options.groupBy && item[self.options.groupBy]) {
        groupKey = item[self.options.groupBy];
        if (self.options.groupByLabel && item[self.options.groupByLabel]) {
          groupLabel = item[self.options.groupByLabel];
        } else {
          groupLabel = groupKey;
        }
      }
      self.itemGroupMapping[itemKey] = groupKey;
      var group;
      if (Object.hasOwnProperty.call(self.groupsDictionary, groupKey)) {
        group = self.groupsDictionary[groupKey];
        if (group.items) {
          group.items.push(item);
        } else {
          group.items = [item];
        }
      } else {
        group = {
          key: groupKey,
          items: [item]
        };
        self.groupsDictionary[groupKey] = group;
      }
      if (!group.label) {
        if (groupKey === ungroupedKey) {
          group.label = self.options.ungroupedHeader || '';
        } else {
          group.label = groupLabel || groupKey;
        }
      }
    }
  }
  if (self.groupsDictionary) {
    self.emptyStateElement.remove();
    if (self.options.groupDefaultCollapsed && self.options.hideGroupCollapseButton) {
      self.options.groupDefaultCollapsed = false; // Don't collapse group if it cannot be expanded...
    }
    for (var groupName in self.groupsDictionary) {
      group = self.groupsDictionary[groupName];
      var label = group.label || groupName;
      if (!label || label === ungroupedKey) {
        label = '';
      }
      if (!group.items || group.items.length === 0) {
        // No items - do not create group element unless specified in options. Group without label should never be shown when empty.
        if (!self.options.showEmptyGroups || label === '') {
          continue;
        }
      }
      var groupElement = (0, _domify.default)(_templateGroup.default);
      groupElement.id = self.id + '_group_' + groupName;
      if (!self.options.groupDefaultCollapsed || group.defaultCollapsed === false) {
        toggleGroup.call(self, groupElement);
      }
      if (self.options.hideGroupCheckbox && group.hideCheckbox !== false || group.hideCheckbox) {
        (0, _componentClasses.default)(groupElement).add('hideCheckbox');
        var groupCheckbox = groupElement.querySelector('.multiSelect-groupCheckbox');
        if (groupCheckbox) {
          groupCheckbox.disabled = true;
        }
      }
      if (self.options.hideGroupCollapseButton && group.hideCollapseButton !== false || group.hideCollapseButton) {
        (0, _componentClasses.default)(groupElement).add('hideCollapseButton');
      } else {
        self.inputElement.setAttribute('aria-haspopup', 'tree');
      }
      var groupLabelElement = groupElement.querySelector('.multiSelect-groupLabel');
      groupLabelElement.id = groupElement.id + '_groupLabel';
      groupLabelElement.innerText = label;
      var groupContent = groupElement.querySelector('.multiSelect-groupContent');
      groupContent.id = groupElement.id + '_groupContent';
      groupContent.setAttribute('aria-labeledby', groupLabelElement.id);
      groupElement.setAttribute('aria-labeledby', groupLabelElement.id);
      self.dropdownList.insertBefore(groupElement, self.filteredStateElement);
      group.items.forEach(function (item) {
        createListItemHTML.call(self, groupContent, item, groupName);
      });
      groupElement.setAttribute('aria-expanded', (0, _componentClasses.default)(groupElement).contains('is-open'));
    }
  } else {
    self.options.itemsList.forEach(function (item) {
      createListItemHTML.call(self, self.dropdownList, item);
    });
  }
  self.options.selectedList.forEach(function (item) {
    var itemKey = getItemKey.call(self, item);
    var groupKey = self.itemGroupMapping && self.itemGroupMapping[itemKey];
    createListItemHTML.call(self, self.labelList, item, groupKey);
  });
  if (self.groupsDictionary) {
    var groupElements = self.dropdownList.querySelectorAll('.multiSelect-group');
    if (groupElements) {
      groupElements.forEach(function (groupElement) {
        var groupCheckbox = groupElement.querySelector('.multiSelect-groupHeader > .formControl > input.multiSelect-groupCheckbox');
        var itemCheckboxesInGroup = groupElement.querySelectorAll('.multiSelect-groupContent > .multiSelect-item > .formControl > input.multiSelect-itemCheckbox');
        if (groupCheckbox && itemCheckboxesInGroup) {
          var anySelected = false;
          var allSelected = true;
          itemCheckboxesInGroup.forEach(function (itemCheckbox) {
            if (itemCheckbox.checked) {
              anySelected = true;
            } else {
              allSelected = false;
            }
          });
          if (allSelected) {
            groupCheckbox.checked = true;
            groupCheckbox.indeterminate = false;
          } else if (anySelected) {
            groupCheckbox.indeterminate = true;
          } else {
            groupCheckbox.checked = false;
            groupCheckbox.indeterminate = false;
          }
        }
      });
    }
  }
  if (self.options.horizontalScroll) {
    var list = self.labelList;
    (0, _componentClasses.default)(list).add('wsNW');
    (0, _componentClasses.default)(list).add('scrollable-x');
  }
  initializeEvents.call(self);
}
(0, _inheritPrototype.default)(MultiSelect, _emitterComponent.default);
MultiSelect.prototype.getSelected = function () {
  var self = this;
  var selectedList = [];
  var selectedElements = self.labelList.getElementsByClassName('multiSelect-item');
  for (var i = 0; i < selectedElements.length; i++) {
    var item = getItemFromElement.call(self, selectedElements[i]);
    if (typeof item !== 'undefined' && item !== null) {
      selectedList.push(item);
    }
  }
  return selectedList;
};
MultiSelect.prototype.getUnselected = function () {
  var self = this;
  var unselectedList = [];
  for (var i = 0; i < self.dropdownList.childNodes.length; i++) {
    var item = getItemFromElement.call(self, self.dropdownList.childNodes[i]);
    if (typeof item !== 'undefined' && item !== null) {
      unselectedList.push(item);
    }
  }
  return unselectedList;
};
MultiSelect.prototype.unselectItem = function (item) {
  var self = this;
  var key = getItemKey.call(self, item);
  self.labelList.querySelectorAll('.multiSelect-item').forEach(function (itemElement) {
    if (itemElement.dataset._key === key) {
      var closeButton = itemElement.querySelector('.multiSelect-closeButton');
      swapItemDOM.call(self, closeButton, self.dropdownList);
    }
  });
};
MultiSelect.prototype.unselectAll = function () {
  var self = this;
  self.labelList.querySelectorAll('.multiSelect-closeButton').forEach(function (closeButton) {
    swapItemDOM.call(self, closeButton, self.dropdownList, null, true);
  });
  updateGroupCheckboxState.call(self);
};
MultiSelect.prototype.setUnselected = function (newUnselectedList) {
  var self = this;
  newUnselectedList = newUnselectedList.filter(item => item !== self.emptyStateElement.innerText && item !== self.filteredStateElement.innerText);
  self.dropdownList.innerHTML = '';
  self.dropdownList.appendChild(self.emptyStateElement);
  self.dropdownList.appendChild(self.filteredStateElement);
  newUnselectedList.forEach(function (item) {
    createListItemHTML.call(self, self.dropdownList, item);
  });
};
MultiSelect.prototype.setSelected = function (newSelectedList) {
  var self = this;
  var selectedElements = self.labelList.getElementsByClassName('multiSelect-item');
  Array.from(selectedElements).forEach(element => element.remove());
  newSelectedList.forEach(function (item) {
    var itemKey = getItemKey.call(self, item);
    var groupKey = self.itemGroupMapping && self.itemGroupMapping[itemKey];
    createListItemHTML.call(self, self.labelList, item, groupKey);
  });
};
function getItemFromElement(itemElement) {
  var self = this;
  if (self.options.itemIsObject) {
    if (itemElement.dataset._key && Object.prototype.hasOwnProperty.call(self.itemsDictionary, itemElement.dataset._key)) return self.itemsDictionary[itemElement.dataset._key];
  } else {
    return itemElement.textContent;
  }
  return null;
}
function getItemKey(item) {
  if (typeof item === 'string') return item;
  var self = this;
  var itemKey = item._key || '';
  if (self.options.uniqueIdProperty && Object.prototype.hasOwnProperty.call(item, self.options.uniqueIdProperty) && String(item[self.options.uniqueIdProperty]) !== '') {
    itemKey = String(item[self.options.uniqueIdProperty]);
  }
  if (!itemKey) {
    // Build key from item property values
    for (var prop in item) {
      if (Object.prototype.hasOwnProperty.call(item, prop)) {
        var fieldValue = item[prop];
        var typeOfField = typeof fieldValue;
        if (typeOfField !== 'object' && typeOfField !== 'function') {
          itemKey += fieldValue;
        }
      }
    }
    item._key = itemKey;
  }
  if (!self.itemsDictionary[itemKey]) {
    self.options.itemIsObject = true;
    self.itemsDictionary[itemKey] = item;
  }
  return itemKey;
}
function createListItemHTML(list, item, groupName) {
  var self = this;
  var listItem = self.options.useCheckboxes && !(0, _componentClasses.default)(list).contains('multiSelect-labelList') ? (0, _domify.default)(_templateChecklistItem.default) : (0, _domify.default)(_templateListItem.default);
  var labelText = '';
  var labelElement;
  if (typeof item === 'object') {
    self.options.itemIsObject = true;
    var o = {
      labelProperty: item._multiSelect && item._multiSelect.labelProperty || self.options.labelProperty,
      labelTemplate: item._multiSelect && item._multiSelect.labelTemplate || self.options.labelTemplate,
      labelPropertySeparator: item._multiSelect && item._multiSelect.labelPropertySeparator || self.options.labelPropertySeparator,
      ignoreUnsupportedTypes: item._multiSelect && item._multiSelect.ignoreUnsupportedTypes || self.options.ignoreUnsupportedTypes
    };
    var hasLabelField = o.labelProperty && Object.prototype.hasOwnProperty.call(item, o.labelProperty);
    if (o.labelTemplate) {
      labelText = o.labelTemplate;
      hasLabelField = false; // Use template instead
    } else if (hasLabelField) {
      labelText = item[o.labelProperty];
    }
    for (var prop in item) {
      if (prop.indexOf('_') !== 0 && Object.prototype.hasOwnProperty.call(item, prop)) {
        var fieldValue = item[prop];
        var typeOfField = typeof fieldValue;
        if (typeOfField !== 'function') {
          listItem.dataset[prop] = JSON.stringify(fieldValue);
        }
        if (!hasLabelField) {
          switch (typeOfField) {
            case 'string':
            case 'number':
              fieldValue = htmlEnc(fieldValue);
              if (o.labelTemplate) {
                labelText = labelText.replace('{' + prop + '}', fieldValue);
              } else {
                if (labelText !== '') {
                  labelText += self.options.labelPropertySeparator || ' | ';
                }
                labelText += fieldValue;
              }
              break;
            default:
              if (o.labelTemplate) {
                labelText = labelText.replace('{' + prop + '}', '');
              }
              if (!o.ignoreUnsupportedTypes) {
                console.warn('Attribute [' + prop + '] on this item has unsupported type ' + typeOfField + ' as display text for label. Convert value to string if needed. If you want to suppress this warning, you can set option ignoreUnsupportedTypes: true');
              }
              break;
          }
        }
      }
    }
    if (item._multiSelect && item._multiSelect.labelColor) {
      listItem.dataset._labelColor = item._multiSelect.labelColor;
    }
    if (item._multiSelect && item._multiSelect.labelOutline === true) {
      listItem.dataset._labelOutline = 'true';
    } else if (item._multiSelect && item._multiSelect.labelOutline === false) {
      listItem.dataset._labelOutline = 'false';
    }
    labelText = labelText.replace('<script', '<s').replace('</script', '</s');
    labelElement = (0, _domify.default)(labelText);
  } else {
    labelText = item;
    labelElement = document.createTextNode(labelText);
  }
  listItem.dataset._key = getItemKey.call(self, item);
  if (groupName) {
    listItem.dataset._group = groupName;
  }
  var itemLabel = listItem.querySelector('.multiSelect-itemLabel');
  itemLabel.appendChild(labelElement);

  // Set tooltip/aria-label on close button
  var closeButton = listItem.querySelector('.multiSelect-closeButton');
  if (closeButton) {
    var closeTooltip = this.options.removeSelectedItemText.replace('{label}', listItem.innerText);
    closeButton.setAttribute('title', closeTooltip);
  }
  listItem.id = self.id + '_item_' + listItem.dataset._key;
  if ((0, _componentClasses.default)(list).contains('multiSelect-labelList')) {
    if (list.querySelector('.multiSelect-item[data-_key="' + listItem.dataset._key + '"]')) {
      // Already added - don't add duplicate
      return;
    }
    list.insertBefore(listItem, self.inputElement);
    if (self.groupsDictionary) {
      var originItemCheckbox = self.dropdownList.querySelector('.multiSelect-item[data-_key="' + listItem.dataset._key + '"] > .formControl > input.multiSelect-itemCheckbox');
      if (originItemCheckbox && !originItemCheckbox.checked) {
        originItemCheckbox.checked = true;
      }
    }
    updateLabelStyle.call(self, listItem);
  } else {
    if (self.groupsDictionary) {
      listItem.setAttribute('role', 'listitem');
      var listItemCheckbox = listItem.querySelector('input.multiSelect-itemCheckbox');
      listItemCheckbox.id = self.id + '_itemCheckbox_' + listItem.dataset._key;
      list.appendChild(listItem);
    } else {
      listItem.setAttribute('role', 'option');
      list.insertBefore(listItem, self.emptyStateElement);
    }
  }
}
function updateLabelStyle(itemElement) {
  var self = this;
  var groupOptions = self.options;
  if (self.itemGroupMapping && self.groupsDictionary && (itemElement.dataset._group || itemElement.dataset._key)) {
    var groupKey = itemElement.dataset._group || self.itemGroupMapping[itemElement.dataset._key];
    if (groupKey) {
      var group = self.groupsDictionary[groupKey];
      if (group) {
        groupOptions = {
          labelColor: group.labelColor || self.options.labelColor,
          labelOutline: group.labelOutline || self.options.labelOutline
        };
      }
    }
  }
  var labelColor = itemElement.dataset._labelColor || groupOptions.labelColor || 'accent--strong';
  var labelOutline = groupOptions.labelOutline;
  labelColor = labelColor.trim().replace('fill-', ''); // Remove fill-prefix, as this is added later if not labelOutline
  if (Object.prototype.hasOwnProperty.call(itemElement.dataset, '_labelOutline')) {
    if (itemElement.dataset._labelOutline === 'false') {
      labelOutline = false;
      if (labelColor === 'accent') {
        labelColor = 'accent--strong';
      }
    } else if (itemElement.dataset._labelOutline === 'true') {
      labelOutline = true;
      if (labelColor === 'accent') {
        // fg-accent--moderate is the preferred accent color for outlined button
        labelColor = 'fg-accent--moderate';
      }
    }
  }
  if (!labelOutline) {
    labelColor = 'fill-' + labelColor;
  }
  if ((0, _componentClasses.default)(itemElement.parentNode).contains('multiSelect-labelList')) {
    (0, _componentClasses.default)(itemElement).add('label');
    (0, _componentClasses.default)(itemElement).add(labelColor);
    if (labelOutline) {
      (0, _componentClasses.default)(itemElement).add('label--outline');
    }
  } else {
    (0, _componentClasses.default)(itemElement).remove('label');
    (0, _componentClasses.default)(itemElement).remove(labelColor);
    (0, _componentClasses.default)(itemElement).remove('label--outline');
  }
}
function htmlEnc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&#34;');
}
function initializeEvents() {
  var self = this;
  if (self.options) {
    var blurTimeout, cancelBlurTimeout;
    var clearBlurTimeout = function (event) {
      if (blurTimeout) {
        clearTimeout(blurTimeout);
        blurTimeout = null;
      }
    };
    var onBlur = function (event) {
      clearBlurTimeout(event);
      blurTimeout = setTimeout(function () {
        blurTimeout = null;
        if (cancelBlurTimeout) {
          return;
        }
        // Check if focused element is internal in this control
        if ((0, _closest.default)(document.activeElement, '.multiSelect') !== self.el) {
          closeOriginList.call(self);
        }
      }, 0);
    };
    var cancelBlur = function (event) {
      // if mousedown or focus on anything inside this component - then blur should be cancelled

      // Stop blurTimeout
      clearBlurTimeout(event);

      // Also make sure closing of dropdown is cancelled if cancelBlur is triggered before onBlur.
      cancelBlurTimeout = setTimeout(function () {
        cancelBlurTimeout = null;
        clearBlurTimeout(event);
      }, 10);
    };
    _componentEvent.default.bind(self.el, 'focusout', onBlur, false);
    _componentEvent.default.bind(self.el, 'mousedown', cancelBlur, false);
    _componentEvent.default.bind(self.el, 'focusin', cancelBlur, false);
    _componentEvent.default.bind(self.dropdownList, 'transitionend', function (event) {
      if (event.target === self.dropdownList) {
        var targetContainer = (0, _closest.default)(event.target, '.is-transitioning');
        if (targetContainer) {
          (0, _componentClasses.default)(targetContainer).remove('is-transitioning');
        }
      }
    }, false);
    _componentEvent.default.bind(self.dropdownList, 'click', function (event) {
      if ((0, _componentClasses.default)(event.target).contains('multiSelect-item') || (0, _componentClasses.default)(event.target).contains('formControl-state')) {
        swapItemDOM.call(self, event.target, self.labelList, event);
        event.stopPropagation();
      } else if ((0, _componentClasses.default)(event.target.parentNode).contains('multiSelect-groupButton')) {
        var groupElement = (0, _closest.default)(event.target, '.multiSelect-group');
        if (groupElement) {
          toggleGroup.call(self, groupElement);
          setActive.call(self, groupElement);
        }
      } else {
        // Make sure input element always has focus no matter what clicked inside this control
        if (self.el.getAttribute('aria-expanded') === 'true') {
          self.inputElement.focus();
        }
      }
    }, false);
    _componentEvent.default.bind(self.labelList, 'click', function (event) {
      if ((0, _componentClasses.default)(event.target).contains('multiSelect-closeButton')) {
        swapItemDOM.call(self, event.target, self.dropdownList, event);
        event.stopPropagation();
        cancelBlur(event); // Make sure list is not closed
      } else if (event.target !== self.arrowButton.firstChild) {
        openOriginList.call(self, event);
        self.inputElement.focus();
        event.stopPropagation();
      }
    }, false);
    _componentEvent.default.bind(self.arrowButton.firstChild,
    // clickable <button> element is firstChild of arrowButton wrapper
    'click', function (event) {
      toggleOriginList.call(self, event);
      event.stopPropagation();
    }, false);
    _componentEvent.default.bind(self.unselectAllButton.firstChild,
    // clickable <button> element is firstChild of unselectAllButton wrapper
    'click', function (event) {
      cancelBlur(event); // Make sure list is not closed
      self.unselectAll();
      event.stopPropagation();
      event.target.focus(); // Make sure keyup event is not triggered on input textbox, which would cause last removed element to be reselected
      (0, _raf.default)(function () {
        self.inputElement.focus();
      });
    }, false);
    var backspaceTimeout = null;
    function backspaceTimeoutReset() {
      backspaceTimeout = null;
    }
    _componentEvent.default.bind(self.inputElement, 'keyup', function (event) {
      var key = event.keyCode || event.charCode;
      if (event.target !== self.inputElement) {
        return;
      }
      switch (key) {
        case 13:
          // Enter
          event.preventDefault();
          var selectedItem = getActive.call(self, !self.options.hideGroupCheckbox);
          if (selectedItem) {
            if (self.options.useCheckboxes) {
              var checkboxElement = selectedItem.querySelector('input[type=checkbox]');
              swapItemDOM.call(self, checkboxElement, self.labelList);
            } else {
              swapItemDOM.call(self, selectedItem, self.labelList);
            }
            filterOriginList.call(self, true);
            self.inputElement.focus();
          }
          break;
        case 27:
          // Esc
          var closeList = true;
          setActive.call(self, null);
          if (event.target.value) {
            // Remove filter text
            event.target.value = '';
            filterOriginList.call(self);
            closeList = false;
          }
          setIndexedItem.call(self, null); // Clear is-indexed item

          if (closeList) {
            // If none of the above is done, then close dropdown.
            closeOriginList.call(self, event);
          }
          break;
        case 8:
          if (backspaceTimeout) {
            clearTimeout(backspaceTimeout);
            backspaceTimeout = null;
          }
          filterOriginList.call(self);
          openOriginList.call(self, event);
          break;
        default:
          openOriginList.call(self, event);
          break;
      }
    }, false);
    _componentEvent.default.bind(self.inputElement, 'input', function (event) {
      filterOriginList.call(self);
      resizeInputElement.call(self, '');
    });
    _componentEvent.default.bind(self.inputElement, 'keydown', function (event) {
      var key = event.keyCode || event.charCode;
      var string = event.target.value;
      var activeElement, elementClasses, navigateTextContent;
      switch (key) {
        case 33:
          // Page up
          event.preventDefault();
          if (event.ctrlKey) {
            self.dropdownList.scrollTop -= 320;
          } else if (self.dropdownList.childNodes.length > 0) {
            for (var index = 0; index < (self.options.useCheckboxes ? 8 : 5); index++) {
              selectionUp.call(self);
            }
            scrollItemUp.call(self); // Scroll up to selected element
          }
          break;
        case 34:
          // Page down
          event.preventDefault();
          if (event.ctrlKey) {
            self.dropdownList.scrollTop += 200;
          } else if (self.dropdownList.childNodes.length > 0) {
            var selectors = ['.multiSelect-dropdownList > .multiSelect-item:not([aria-hidden=true])', '.multiSelect-dropdownList > .multiSelect-group', '.multiSelect-dropdownList > .multiSelect-group[aria-expanded=true] > .multiSelect-groupContent > .multiSelect-item:not([aria-hidden=true])'];
            var visibleElements = self.el.querySelectorAll(selectors.join(','));
            var skipCount = self.options.useCheckboxes ? 8 : 5;
            if (visibleElements.length > skipCount) {
              getDropdownListVisibleItem(visibleElements[skipCount], 'up'); // If not last element
            } else {
              selectionDown.call(self, visibleElements[visibleElements.length - 1]);
            }
            scrollItemDown.call(self);
          }
          break;
        case 40:
          // Arrow down
          event.preventDefault();
          if (event.ctrlKey) {
            self.dropdownList.scrollTop += 40;
          } else if (self.dropdownList.childNodes.length > 0) {
            selectionDown.call(self);
            scrollItemDown.call(self);
          }
          break;
        case 38:
          // Arrow up
          event.preventDefault();
          if (event.ctrlKey) {
            self.dropdownList.scrollTop -= 40;
          } else if (self.dropdownList.childNodes.length > 0) {
            var selectedItem = selectionUp.call(self);
            scrollItemUp.call(self, selectedItem);
          }
          break;
        case 37:
          // Arrow left
          navigateTextContent = !event.altKey && self.inputElement.value.length > 0 && self.inputElement.selectionStart > 0;
          if (!event.altKey && self.inputElement.value.length > 0 && self.inputElement.selectionStart > 0) {
            navigateTextContent = true;
          }
          if (!navigateTextContent) {
            event.preventDefault();
            activeElement = getActive.call(self, !self.options.hideGroupCollapseButton);
            if (activeElement) {
              elementClasses = (0, _componentClasses.default)(activeElement);
              if (elementClasses.contains('multiSelect-group')) {
                if (activeElement.getAttribute('aria-expanded') === 'true') {
                  toggleGroup.call(self, activeElement);
                }
              } else if (elementClasses.contains('multiSelect-item')) {
                // Set group as active element
                var parentGroupElement = (0, _closest.default)(activeElement, '.multiSelect-group');
                if (parentGroupElement) {
                  setActive.call(self, parentGroupElement);
                  scrollItemUp.call(self, parentGroupElement);
                }
              }
            }
          }
          break;
        case 39:
          // Arrow right
          event.preventDefault();
          activeElement = getActive.call(self, !self.options.hideGroupCollapseButton);
          if (activeElement) {
            elementClasses = (0, _componentClasses.default)(activeElement);
            if (elementClasses.contains('multiSelect-group')) {
              if (activeElement.getAttribute('aria-expanded') === 'false') {
                toggleGroup.call(self, activeElement);
              } else {
                // Set first visible item in group as active element
                var firstItemInGroup = activeElement.querySelector('.multiSelect-item:not([aria-hidden="true"])');
                if (firstItemInGroup) {
                  setActive.call(self, firstItemInGroup);
                }
              }
            }
          }
          break;
        case 13:
          // Enter
          activeElement = getActive.call(self, !self.options.hideGroupCheckbox);
          if (activeElement) {
            if (self.options.useCheckboxes) {
              var checkboxElement = activeElement.querySelector('input[type=checkbox]');
              if (checkboxElement.indeterminate) {
                checkboxElement.indeterminate = false;
                checkboxElement.checked = true;
              }
              checkboxElement.checked = !checkboxElement.checked;
            } else {
              setIndexedItem.call(self, activeElement);
            }
          }
          break;
        case 8:
          // Backspace
          if (backspaceTimeout) {
            clearTimeout(backspaceTimeout);
          } else if (string === '' && self.labelList.childNodes.length > 0) {
            var lastItem = self.labelList.querySelector('.multiSelect-item:last-of-type');
            if (lastItem) {
              var closeButton = lastItem.querySelector('.multiSelect-closeButton');
              swapItemDOM.call(self, closeButton, self.dropdownList);
            }
          }
          backspaceTimeout = setTimeout(backspaceTimeoutReset, 1000);
          resizeInputElement.call(self, '');
          break;
        case 46:
          // Delete
          resizeInputElement.call(self, '');
          break;
        default:
          if (event.key.length === 1) {
            resizeInputElement.call(self, event.key);
          }
          break;
      }
    }, false);
  }
}
function resizeInputElement(inputChar) {
  var self = this;
  self.inputElementLabel.innerText = self.inputElement.value + (inputChar || '');

  // Make sure individual spaces take up place in size calculation. This can be spaces that are trimmed, or multiple spaces that are normally squished to one in HTML.
  self.inputElementLabel.innerHTML = self.inputElementLabel.innerHTML.replace(/\s/g, '&nbsp;');
  (0, _raf.default)(function () {
    self.inputElement.style.width = self.inputElementLabel.clientWidth + 2 + 'px';
  });
}
function swapItemDOM(trigger, list, evt, dontUpdateGroupState) {
  var self = this;
  var itemElement;
  var groupElement;
  if (!trigger) return;
  var isOpen = (0, _componentClasses.default)(self.el).contains('is-open');
  if ((0, _componentClasses.default)(trigger).contains('multiSelect-labelList')) {
    // This is the empty area around the labels. Set focus to the search box.
    if (isOpen) self.inputElement.focus();
    return;
  }
  itemElement = (0, _componentClasses.default)(trigger).contains('multiSelect-item') ? trigger : (0, _closest.default)(trigger, '.multiSelect-item');
  if (!itemElement) {
    // Trigger is neither label nor close button
    if ((0, _componentClasses.default)(trigger).contains('multiSelect-groupCheckbox')) {
      groupElement = (0, _closest.default)(trigger, '.multiSelect-group');
      if (groupElement) {
        var itemElementsInGroup = groupElement.querySelectorAll('.multiSelect-itemCheckbox');
        if (itemElementsInGroup) {
          itemElementsInGroup.forEach(function (itemCheckbox) {
            itemCheckbox.checked = trigger.checked;
            swapItemDOM.call(self, itemCheckbox, self.dropdownList, evt, true);
          });
        }
      }
      // Set group as active element
      setActive.call(self, groupElement);
    }
    if (isOpen) self.inputElement.focus();
    return;
  }
  var remove = (0, _componentClasses.default)(itemElement.parentNode).contains('multiSelect-labelList');
  if (remove && !(0, _componentClasses.default)(trigger).contains('multiSelect-closeButton')) {
    return; // Do not remove if trigger is not close button
  }
  if (!itemElement) {
    return;
  }
  if (evt) {
    evt.stopPropagation();
    evt.stopImmediatePropagation();
  }
  if (self.options.useCheckboxes) {
    if (remove) {
      // Close button on label is clicked
      // Uncheck checkbox in dropdown
      var itemCheckboxToUncheck = self.dropdownList.querySelector('[data-_key="' + itemElement.dataset._key + '"] > .formControl > input.multiSelect-itemCheckbox');
      itemCheckboxToUncheck.checked = false;

      // Remove label from labelList
      itemElement.remove();

      // Get current element in dropdownList
      itemElement = (0, _closest.default)(itemCheckboxToUncheck, '.multiSelect-item');
      groupElement = (0, _closest.default)(itemElement, '.multiSelect-group');
    } else {
      // Checkbox element is clicked
      groupElement = (0, _closest.default)(trigger, '.multiSelect-group');
      if (trigger.checked === false) {
        remove = true;
        // Remove label
        var labelElementToRemove = self.labelList.querySelector('.multiSelect-item[data-_key="' + itemElement.dataset._key + '"]');
        if (labelElementToRemove) {
          labelElementToRemove.remove();
        }
      } else {
        // Create label element in destination list
        var item = getItemFromElement.call(self, itemElement);
        createListItemHTML.call(self, self.labelList, item, itemElement.dataset._group);
      }
    }
    itemElement.setAttribute('aria-selected', !remove);
    if (!dontUpdateGroupState && !(0, _componentClasses.default)(groupElement).contains('hideCheckbox')) {
      updateGroupCheckboxState.call(self, groupElement);
    }
    if (isOpen) {
      // Only do this if list is open
      self.inputElement.value = '';
      filterOriginList.call(self, true);
      resizeInputElement.call(self);
      if (!dontUpdateGroupState) {
        if (!(0, _componentClasses.default)(groupElement).contains('is-open')) {
          (0, _componentClasses.default)(groupElement).add('is-open');
        }
        setActive.call(self, itemElement);
        scrollItemVisible.call(self, itemElement);
      }
      self.inputElement.focus();
    }
  } else {
    if (!remove) {
      var indexedItem = itemElement.nextElementSibling || itemElement.previousElementSibling;
      if (indexedItem) {
        setIndexedItem.call(self, indexedItem);
        scrollItemUp.call(self, indexedItem);
      }
    }
    itemElement.parentNode.removeChild(itemElement);
    if (remove) {
      list.insertBefore(itemElement, list.childNodes[0]);
      setIndexedItem.call(self, itemElement);
      scrollItemDown.call(self, itemElement);
    } else {
      list.insertBefore(itemElement, self.inputElement);
    }
    var selectedItem = getActive.call(self);
    if (selectedItem) {
      (0, _componentClasses.default)(selectedItem).remove('is-active');
    }
    itemElement.setAttribute('aria-selected', !remove);
    if (isOpen) {
      // Only do this if list is open
      self.inputElement.value = '';
      filterOriginList.call(self);
      resizeInputElement.call(self);
      self.inputElement.focus();
    }
    updateLabelStyle.call(self, itemElement);
  }
  var itemObject = self.options.itemIsObject ? self.itemsDictionary[itemElement.dataset._key] : itemElement.firstChild.innerText;
  if (remove) {
    this.emit('unselect', itemObject);
  } else {
    this.emit('select', itemObject);
  }
}
function updateGroupCheckboxState(groupElement) {
  if (!groupElement) {
    var groupElements = this.dropdownList.querySelectorAll('.multiSelect-group');
    groupElements.forEach(updateGroupCheckboxState);
    return;
  }

  // Update group selected state
  var anySelected = false;
  var allSelected = true;
  var itemCheckboxesInGroup = groupElement.querySelectorAll('.multiSelect-item > .formControl > input.multiSelect-itemCheckbox');
  itemCheckboxesInGroup.forEach(function (itemCheckbox) {
    if (itemCheckbox.checked) {
      anySelected = true;
    } else {
      allSelected = false;
    }
  });
  var groupCheckbox = groupElement.querySelector('.multiSelect-groupHeader > .formControl > input.multiSelect-groupCheckbox');
  if (groupCheckbox) {
    if (allSelected) {
      groupCheckbox.checked = true;
      groupCheckbox.indeterminate = false;
    } else if (anySelected) {
      groupCheckbox.indeterminate = true;
    } else {
      groupCheckbox.checked = false;
      groupCheckbox.indeterminate = false;
    }
  }
}
function markSearchStringInHtml(htmlElement, searchString) {
  // https://markjs.io
  var marker = new _mark.default(htmlElement);
  var markOptions = {
    element: 'mark',
    separateWordSearch: false,
    diacritics: false,
    // Turned off to make sure norwegian characters are treated as uniqe letters (i.e. make sure 'å' is not same as as 'a' etc.)
    acrossElements: true
  };
  marker.unmark({
    done: function () {
      marker.mark(searchString, markOptions);
    }
  });
}
function filterOriginList(dontScroll) {
  var self = this;
  var string = self.inputElement.value;
  var stringEncoded = htmlEnc(string);
  var items = self.dropdownList.querySelectorAll('.multiSelect-item');
  var setThisActive = null;
  var first = true;
  var hasExactMatch = false;
  var groupElement;
  if (self.options.useCheckboxes) {
    // Reset groups filter states before apply new filter
    var groups = self.dropdownList.querySelectorAll('.multiSelect-group');
    groups.forEach(function (groupEl) {
      (0, _componentClasses.default)(groupEl).remove('has-match');
      (0, _componentClasses.default)(groupEl).remove('has-hidden');
    });
  }
  items.forEach(function (itemElement) {
    var isMatch = false;
    var isExactMatch = false;
    var itemClasses = (0, _componentClasses.default)(itemElement);
    if (!itemClasses.contains('multiSelect-item')) {
      return;
    }
    var labelElement = itemElement.querySelector('.multiSelect-itemLabel');
    var labelText = labelElement.innerText;
    if (labelText && labelText.toLowerCase().indexOf(string.toLowerCase()) !== -1) {
      isMatch = true;
      isExactMatch = labelText.toLowerCase() === string.toLowerCase();
    }
    if (isMatch) {
      if (self.options.useCheckboxes) {
        // Tag group where this is contained (if search string is not empty)
        groupElement = (0, _closest.default)(itemElement, '.multiSelect-group');
        if (string && groupElement) {
          (0, _componentClasses.default)(groupElement).add('has-match');
        }
      }
      if (itemClasses.contains('is-unique-match')) {
        itemClasses.remove('is-active');
        itemClasses.remove('is-unique-match');
        if (self.groupsDictionary) {
          groupElement = (0, _closest.default)(itemElement, '.multiSelect-group');
          if (groupElement && !(0, _componentClasses.default)(groupElement).contains('is-open')) {
            groupElement.setAttribute('aria-expanded', 'false');
          }
        }
        setIndexedItem.call(self, itemElement);
      }
      itemClasses.remove('is-hidden');
      itemElement.setAttribute('aria-hidden', false);

      // Highlight matched text
      markSearchStringInHtml(labelElement, stringEncoded);

      // Activate matched item if unique match
      if (first) {
        first = false;
        setThisActive = itemElement;
        hasExactMatch = isExactMatch;
      } else if (isExactMatch) {
        setThisActive = itemElement;
        hasExactMatch = true;
      } else if (!hasExactMatch) {
        setThisActive = null;
      }
    } else {
      itemClasses.add('is-hidden');
      itemElement.setAttribute('aria-hidden', true);
      itemClasses.remove('is-active');
      itemClasses.remove('is-indexed');
      itemClasses.remove('is-unique-match');
      if (self.groupsDictionary) {
        groupElement = (0, _closest.default)(itemElement, '.multiSelect-group');
        if (groupElement) {
          (0, _componentClasses.default)(groupElement).add('has-hidden');
          if (!(0, _componentClasses.default)(groupElement).contains('is-open')) {
            groupElement.setAttribute('aria-expanded', 'false');
          }
        }
      }
    }
  });
  var isActive = getActive.call(this);
  if (setThisActive) {
    if (isActive !== setThisActive) {
      if (setThisActive) {
        setActive.call(self, setThisActive);
        (0, _componentClasses.default)(setThisActive).add('is-unique-match');
        isActive = setThisActive;
        if (self.groupsDictionary) {
          groupElement = (0, _closest.default)(isActive, '.multiSelect-group');
          if (groupElement) {
            groupElement.setAttribute('aria-expanded', 'true');
          }
        }
      }
    }
  }
  var isIndexed = getIndexed.call(this);
  if (isActive) {
    if (isIndexed) {
      setIndexedItem.call(self, null); // Reset all is-indexed
    }
    if (self.groupsDictionary) {
      groupElement = (0, _closest.default)(isActive, '.multiSelect-group');
      if (groupElement && groupElement.getAttribute('aria-expanded') === 'false') {
        setActive.call(self, groupElement); // If active is inside collapsed group, set active to group instead
        isActive = groupElement;
      }
    }
    if (!dontScroll) {
      scrollItemVisible.call(self, isActive);
    }
  } else if (isIndexed) {
    if (self.groupsDictionary) {
      groupElement = (0, _closest.default)(isIndexed, '.multiSelect-group');
      if (groupElement && groupElement.getAttribute('aria-expanded') === 'false') {
        // If indexed is inside collapsed group, index should be cleared and active set on group
        isIndexed = null;
        setIndexedItem.call(self, null);
        setActive.call(self, groupElement);
        if (!dontScroll) {
          scrollItemVisible.call(self, groupElement);
        }
      }
    }
    if (isIndexed) {
      setIndexedItem.call(self, isIndexed); // Set indexed to only this
      if (!dontScroll) {
        scrollItemVisible.call(self, isIndexed);
      }
    }
  }
}
function selectionUp() {
  var self = this;
  var includeGroup = !(self.options.hideGroupCheckbox && self.options.hideGroupCollapseButton);
  var selectedItem = getActive.call(self, includeGroup);
  var indexedItem = getIndexed.call(self);
  var prevItem;
  openOriginList.call(self);
  if (!selectedItem) {
    prevItem = indexedItem || self.el.querySelector('.multiSelect-dropdownList > span:last-of-type, .multiSelect-dropdownList > div.multiSelect-group[aria-expanded="true"]:last-of-type > .multiSelect-groupContent > span:last-of-type');
    if (!prevItem && includeGroup) {
      prevItem = self.el.querySelector('.multiSelect-dropdownList > div.multiSelect-group:last-of-type');
    }
    if (prevItem && (0, _componentClasses.default)(prevItem).contains('is-hidden')) {
      prevItem = getNextVisibleItem(prevItem, 'up', includeGroup);
    }
    if (prevItem) {
      (0, _componentClasses.default)(prevItem).add('is-active');
      (0, _componentClasses.default)(prevItem).remove('is-indexed');
      if (indexedItem) {
        (0, _componentClasses.default)(indexedItem).remove('is-indexed');
      }
    }
    return prevItem;
  }
  prevItem = getNextVisibleItem(selectedItem, 'up', includeGroup);
  if (prevItem) {
    (0, _componentClasses.default)(prevItem).remove('is-indexed');
    if (indexedItem) {
      (0, _componentClasses.default)(indexedItem).remove('is-indexed');
    }
    if (selectedItem) {
      (0, _componentClasses.default)(selectedItem).remove('is-active');
    }
    (0, _componentClasses.default)(prevItem).add('is-active');
  }
}
function selectionDown() {
  var self = this;
  var includeGroup = !(self.options.hideGroupCheckbox && self.options.hideGroupCollapseButton);
  var selectedItem = getActive.call(self, includeGroup);
  var indexedItem = getIndexed.call(self);
  var nextItem;
  var group;
  openOriginList.call(self);
  if (!selectedItem) {
    var selector = '.multiSelect-item:not([aria-hidden="true"])';
    if (includeGroup) {
      selector += ',.multiSelect-group';
    }
    nextItem = indexedItem ? getDropdownListVisibleItem(indexedItem, 'down', includeGroup) : self.dropdownList.querySelector(selector);
    if (nextItem) {
      (0, _componentClasses.default)(nextItem).add('is-active');
      (0, _componentClasses.default)(nextItem).remove('is-indexed');
      if (indexedItem) {
        (0, _componentClasses.default)(indexedItem).remove('is-indexed');
      }
      this.inputElement.setAttribute('aria-activedescendant', nextItem.id);
      if (self.options.groupsDictionary) {
        group = (0, _closest.default)(nextItem, '.multiSelect-group');
        if (group && (!group.hasAttribute('aria-expanded') || group.getAttribute('aria-expanded') === 'false')) {
          toggleGroup.call(self, group);
        }
      }
    }
    return;
  }
  nextItem = getNextVisibleItem(selectedItem, 'down', includeGroup);
  if (nextItem) {
    (0, _componentClasses.default)(nextItem).remove('is-indexed');
    if (indexedItem) {
      (0, _componentClasses.default)(indexedItem).remove('is-indexed');
    }
    if (selectedItem) {
      (0, _componentClasses.default)(selectedItem).remove('is-active');
    }
    (0, _componentClasses.default)(nextItem).add('is-active');
    this.inputElement.setAttribute('aria-activedescendant', nextItem.id);
  }
}
function getActive(canBeGroup) {
  if (canBeGroup) {
    return this.dropdownList.querySelector('.is-active'); // Can be item or group
  } else {
    return this.dropdownList.querySelector('.multiSelect-item.is-active'); // Only item (not group)
  }
}
function setActive(element) {
  var activeElements = this.dropdownList.querySelectorAll('.is-active'); // Can be item or group
  activeElements.forEach(function (elem) {
    if (elem) {
      (0, _componentClasses.default)(elem).remove('is-active');
    }
  });
  if (element) {
    (0, _componentClasses.default)(element).add('is-active');
    this.inputElement.setAttribute('aria-activedescendant', element.id);
  }
}
function getIndexed() {
  return this.dropdownList.querySelector('.multiSelect-item.is-indexed');
}
function setIndexedItem(element) {
  var self = this;
  var indexedItem = element;
  if (!indexedItem) {
    var selectedItem = getActive.call(self);
    if (selectedItem) {
      indexedItem = selectedItem;
    }
  }
  // Remove is-indexed state on all before setting this
  var indexedItems = self.dropdownList.querySelectorAll('.multiSelect-item.is-indexed');
  for (var ii = 0; ii < indexedItems.length; ii++) {
    (0, _componentClasses.default)(indexedItems[ii]).remove('is-indexed');
  }
  if (indexedItem) {
    (0, _componentClasses.default)(indexedItem).add('is-indexed');
  }
}
function scrollItemVisible(element, delayedStart) {
  var self = this;
  var selectedItem = element || getActive.call(self, true) || getIndexed.call(self);
  if (!selectedItem) return;
  if ((0, _componentClasses.default)(selectedItem).contains('multiSelect-group')) {
    selectedItem = selectedItem.querySelector('.multiSelect-groupHeader');
  }
  if (!delayedStart && self.dropdownList.clientHeight < selectedItem.clientHeight + 10) {
    (0, _transitEnd.default)(self.dropdownList, function () {
      scrollItemVisible.call(self, element, true);
    });
    return;
  }
  var itemPositionTop = selectedItem.offsetTop;
  var selectedItemHeight = selectedItem.clientHeight + 5;
  if (itemPositionTop < self.dropdownList.scrollTop) {
    self.dropdownList.scrollTop = itemPositionTop - 5;
    return true;
  } else if (itemPositionTop + selectedItemHeight > self.dropdownList.scrollTop + self.dropdownList.clientHeight) {
    self.dropdownList.scrollTop = itemPositionTop + selectedItemHeight - self.dropdownList.clientHeight;
    return true;
  }
}
function scrollItemDown(element, delayedStart) {
  var self = this;
  var selectedItem = element || getActive.call(self, true) || getIndexed.call(self);
  if (!selectedItem) return;
  if ((0, _componentClasses.default)(selectedItem).contains('multiSelect-group')) {
    selectedItem = selectedItem.querySelector('.multiSelect-groupHeader');
  }
  if (!delayedStart && self.dropdownList.clientHeight < selectedItem.clientHeight + 10) {
    (0, _transitEnd.default)(self.dropdownList, function () {
      scrollItemDown.call(self, element, true);
    });
    return;
  }
  var itemPositionTop = selectedItem.offsetTop;
  var selectedItemHeight = selectedItem.clientHeight + 5;
  if (itemPositionTop < self.dropdownList.scrollTop) {
    self.dropdownList.scrollTop = itemPositionTop - 5;
    return true;
  } else if (itemPositionTop + selectedItemHeight > self.dropdownList.scrollTop + self.dropdownList.clientHeight) {
    self.dropdownList.scrollTop = itemPositionTop + selectedItemHeight - self.dropdownList.clientHeight;
    return true;
  } else if (itemPositionTop >= self.dropdownList.scrollTop + self.dropdownList.clientHeight - 2 * selectedItemHeight) {
    self.dropdownList.scrollTop = self.dropdownList.scrollTop + selectedItemHeight;
    return true;
  }
}
function scrollItemUp(element, delayedStart) {
  var self = this;
  var selectedItem = element || getActive.call(self, true) || getIndexed.call(self);
  if (!selectedItem) return;
  if ((0, _componentClasses.default)(selectedItem).contains('multiSelect-group')) {
    selectedItem = selectedItem.querySelector('.multiSelect-groupHeader');
  }
  if (!delayedStart && self.dropdownList.clientHeight < selectedItem.clientHeight + 10) {
    (0, _transitEnd.default)(self.dropdownList, function () {
      scrollItemUp.call(self, element, true);
    });
    return;
  }
  var itemPositionTop = selectedItem.offsetTop;
  var selectedItemHeight = selectedItem.clientHeight + 5;
  if (itemPositionTop > self.dropdownList.scrollTop + self.dropdownList.clientHeight - selectedItemHeight) {
    self.dropdownList.scrollTop = itemPositionTop + self.dropdownList.clientHeight - selectedItemHeight;
    return true;
  } else if (itemPositionTop < self.dropdownList.scrollTop) {
    self.dropdownList.scrollTop = itemPositionTop - selectedItemHeight;
    return true;
  } else if (itemPositionTop < self.dropdownList.scrollTop + selectedItemHeight) {
    self.dropdownList.scrollTop = self.dropdownList.scrollTop - selectedItemHeight;
    return true;
  }
}
function getNextVisibleItem(startElement, direction, includeGroup) {
  var selectCandidate;
  var group = (0, _componentClasses.default)(startElement).contains('multiSelect-group') ? startElement : null;
  if (direction === 'down') {
    if (group) {
      if ((0, _componentClasses.default)(group).contains('is-open') || (0, _componentClasses.default)(group).contains('has-match')) {
        selectCandidate = group.querySelector('.multiSelect-groupContent > .multiSelect-item:not([aria-hidden="true"])');
      }
    } else {
      // startElement.id can contain space, so we cannot use # as selector for id.
      selectCandidate = startElement.parentNode.querySelector('[id="' + startElement.id + '"] ~ .multiSelect-item:not([aria-hidden="true"])');
    }
    if (!selectCandidate) {
      if (!group) {
        group = (0, _closest.default)(startElement, '.multiSelect-group');
      }
      while (!selectCandidate && group && group.nextElementSibling) {
        if (includeGroup) {
          selectCandidate = group.nextElementSibling;
        } else {
          selectCandidate = group.nextElementSibling.querySelector('.multiSelect-groupContent > .multiSelect-item:not([aria-hidden="true"])');
        }
        group = group.nextElementSibling;
      }
    }
  } else {
    // direction === 'up'
    if (!group) {
      selectCandidate = startElement.previousElementSibling;
    }
    if (selectCandidate) {
      while ((0, _componentClasses.default)(selectCandidate).contains('is-hidden') && selectCandidate.previousElementSibling) {
        selectCandidate = selectCandidate.previousElementSibling;
      }
    }
    if (selectCandidate && (0, _componentClasses.default)(selectCandidate).contains('is-hidden')) {
      selectCandidate = null;
    }
    if (!selectCandidate) {
      if (!group) {
        group = (0, _closest.default)(startElement, '.multiSelect-group');
        if (includeGroup) {
          // startElement is first in group (no previousElementSibling). This means that next up is the containing group.
          return group;
        }
      }
      while (!selectCandidate && group && group.previousElementSibling) {
        if ((0, _componentClasses.default)(group.previousElementSibling).contains('is-open') || (0, _componentClasses.default)(group).contains('has-match')) {
          selectCandidate = group.previousElementSibling.querySelector('.multiSelect-groupContent > span:last-of-type');
        }
        if (includeGroup && !selectCandidate) {
          selectCandidate = group.previousElementSibling;
        }
        if (selectCandidate && (0, _componentClasses.default)(selectCandidate).contains('is-hidden')) {
          return getNextVisibleItem(selectCandidate, direction, includeGroup);
        }
      }
    }
    if (selectCandidate && (0, _componentClasses.default)(selectCandidate).contains('is-hidden')) {
      selectCandidate = null;
    }
  }
  return selectCandidate;
}
function getDropdownListVisibleItem(selectCandidate, direction, includeGroup) {
  if ((0, _componentClasses.default)(selectCandidate).contains('is-hidden')) {
    selectCandidate = getNextVisibleItem(selectCandidate, direction, includeGroup);
  }
  return selectCandidate;
}
function toggleGroup(groupElement) {
  var self = this;
  if ((0, _componentClasses.default)(groupElement).contains('is-open')) {
    (0, _componentClasses.default)(groupElement).remove('is-open');
    groupElement.setAttribute('aria-expanded', 'false');
  } else {
    (0, _componentClasses.default)(groupElement).add('is-open');
    groupElement.setAttribute('aria-expanded', 'true');
    if (self.el.getAttribute('aria-expanded') === 'true') {
      (0, _raf.default)(function () {
        self.inputElement.focus();
      });
    }
  }
}
function openOriginList(event) {
  toggleOriginList.call(this, event, true);
}
function closeOriginList(event) {
  toggleOriginList.call(this, event, false);
}
function toggleOriginList(event, force) {
  var self = this;
  if (self._isTogglingListOpen) {
    return;
  }
  var isOpen = (0, _componentClasses.default)(self.el).contains('is-open');
  var newOpen = !isOpen;
  if (typeof force === 'boolean') {
    newOpen = force;
  }
  if (event) {
    event.stopPropagation();
  }
  self._isTogglingListOpen = true;
  if (newOpen) {
    if (!(0, _componentClasses.default)(self.el).contains('is-open') && 'ontransitionend' in self.el) {
      (0, _componentClasses.default)(self.el).add('is-transitioning');
    }
    (0, _raf.default)(function () {
      (0, _componentClasses.default)(self.el).add('is-open');
    });
    self.el.setAttribute('aria-expanded', 'true');
    self.arrowButton.firstChild.setAttribute('aria-expanded', 'true');
    self.inputElement.focus();
  } else {
    if ((0, _componentClasses.default)(self.el).contains('is-open') && 'ontransitionend' in self.el) {
      (0, _componentClasses.default)(self.el).add('is-transitioning');
    }
    (0, _componentClasses.default)(self.el).remove('is-open');
    var selectedItem = getActive.call(self);
    if (selectedItem) {
      (0, _componentClasses.default)(selectedItem).remove('is-active');
    }
    setIndexedItem.call(self, null);
    self.el.setAttribute('aria-expanded', 'false');
    self.arrowButton.firstChild.setAttribute('aria-expanded', 'false');
    self.dropdownList.scrollTop = 0;
  }
  (0, _raf.default)(function () {
    self._isTogglingListOpen = false;
  });
}