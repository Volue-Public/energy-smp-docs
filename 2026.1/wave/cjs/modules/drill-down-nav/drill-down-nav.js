"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createDrillDownNav;
var _componentClasses = _interopRequireDefault(require("component-classes"));
var _extend = _interopRequireDefault(require("extend"));
var _group2 = _interopRequireDefault(require("./group"));
var _panel = _interopRequireDefault(require("./panel"));
var _trigger = _interopRequireDefault(require("./trigger"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var reduce = function reduce(arr, fnc, initial) {
  return Array.prototype.reduce.call(arr, fnc, initial);
};
var DEFAULTS = {
  rootSelector: false,
  subNavClass: 'drillDownNav-sub',
  subNavContentClass: 'drillDownNav-subContent',
  sectionClass: 'drillDownNav-section',
  sectionsWrapperClass: 'drillDownNav-sectionsWrapper',
  subNavToggleSelector: '.drillDownNav-trigger'
};
function createDrillDownNav(el, options) {
  return new DrillDownNav(el, options);
}
function DrillDownNav(el, options) {
  var _this = this;
  this.el = el;
  this.options = (0, _extend.default)(true, {}, DEFAULTS, options);
  var parentNode = this.options.rootSelector ? this.el.querySelector(this.options.rootSelector) : this.el;
  var sectionsWrapperNode = this.el.querySelector('.' + this.options.sectionsWrapperClass);
  var group = this.rootGroup = new _group2.default({
    state: 'open',
    afterStateChange: function afterStateChange(_group, hasActivePanel) {
      if (sectionsWrapperNode != null) {
        (0, _componentClasses.default)(sectionsWrapperNode).toggle('no-scroll', hasActivePanel);
      }
    }
  });
  this.panels = getSectionNodes(parentNode, this.options.sectionClass).reduce(function (flattenedPanels, sectionNode) {
    var section = new Section(sectionNode, group, null, _this.options);
    flattenedPanels.push(section.panel);
    if (section.subPanels.length > 0) {
      flattenedPanels.push.apply(flattenedPanels, section.subPanels);
    }
    return flattenedPanels;
  }, []);
}
DrillDownNav.prototype.close = function close(group) {
  group = group !== undefined ? group : this.rootGroup;
  if (group.activePanel) {
    if (group.activePanel.options.subGroup) {
      this.close(group.activePanel.options.subGroup);
    }
    group.removeActivePanel();
  }
};
DrillDownNav.prototype.openPanel = function openPanel(panel) {
  this.close(); // close all groups

  (function open(panel) {
    if (panel.group) {
      panel.group.setActivePanel(panel);
      panel.setState(true);
      var parentPanel = panel.options.parent;
      if (parentPanel != null) {
        open(parentPanel);
        parentPanel.setIsVisible(false);
      }
    }
  })(panel);
};
function Section(node, group, parentPanel, options) {
  this.header = node.querySelector('header');
  var nav = node.querySelector('.' + options.subNavClass);
  var navContent = nav.querySelector('.' + options.subNavContentClass);
  var navHeader = getChildHeaderOf(nav);
  if (navHeader != null) {
    this.navHeader = navHeader;
  } else {
    this.navHeader = this.header.cloneNode(true);
    nav.insertBefore(this.navHeader, nav.firstChild);
  }
  this.headerTrigger = options.subNavToggleSelector === 'header' ? this.header : this.header.querySelector(options.subNavToggleSelector);
  this.navHeaderTrigger = options.subNavToggleSelector === 'header' ? this.navHeader : this.navHeader.querySelector(options.subNavToggleSelector);
  var panel = this.panel = new _panel.default(node, {
    group,
    parent: parentPanel
  });
  new _trigger.default(this.headerTrigger, {
    panel
  }); // eslint-disable-line no-new
  new _trigger.default(this.navHeaderTrigger, {
    panel
  }); // eslint-disable-line no-new

  var subSections = getSectionNodes(navContent, options.sectionClass);
  if (subSections.length) {
    var subGroup = panel.options.subGroup = new _group2.default({
      state: 'open',
      parent: group
    });
    subSections.forEach(function (node) {
      return new Section(node, subGroup, panel, options);
    });
    this.subPanels = subGroup.panels;
  } else {
    this.subPanels = [];
  }
}
function getSectionNodes(node, sectionClass) {
  return reduce(node.children, function sectionNodesReducer(sectionNodes, node) {
    if (node.tagName.toLowerCase() === 'section') {
      if ((0, _componentClasses.default)(node).has(sectionClass)) {
        sectionNodes.push(node);
        return sectionNodes;
      }
      sectionNodes = reduce(node.children, sectionNodesReducer, sectionNodes);
    }
    return sectionNodes;
  }, []);
}
function getChildHeaderOf(node) {
  var children = node.children;
  var child;
  var foundHeader;
  var i;
  if (children) {
    for (i = 0; i < children.length; i++) {
      child = children[i];
      if ((0, _componentClasses.default)(child).has('drillDownNav-header')) {
        foundHeader = child;
        break;
      }
    }
  }
  return foundHeader;
}