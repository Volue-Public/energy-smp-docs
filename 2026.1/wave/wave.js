(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Wave"] = factory();
	else
		root["Wave"] = factory();
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 978:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var getDocument = __webpack_require__(15);

/**
 * Module exports.
 */

module.exports = getBoundingClientRect;

/**
 * Returns the "bounding client rectangle" of the given `TextNode`,
 * `HTMLElement`, or `Range`.
 *
 * @param {Node} node
 * @return {TextRectangle}
 * @public
 */

function getBoundingClientRect (node) {
  var rect = null;
  var doc = getDocument(node);

  if (node.nodeType === 3 /* TEXT_NODE */) {
    // see: http://stackoverflow.com/a/6966613/376773
    var range = doc.createRange();
    range.selectNodeContents(node);
    node = range;
  }

  if ('function' === typeof node.getBoundingClientRect) {
    rect = node.getBoundingClientRect();

    if (node.startContainer && rect.left === 0 && rect.top === 0) {
      // Range instances sometimes report all `0`s
      // see: http://stackoverflow.com/a/6847328/376773
      var span = doc.createElement('span');

      // Ensure span has dimensions and position by
      // adding a zero-width space character
      span.appendChild(doc.createTextNode('\u200b'));
      node.insertNode(span);
      rect = span.getBoundingClientRect();

      // Remove temp SPAN and glue any broken text nodes back together
      var spanParent = span.parentNode;
      spanParent.removeChild(span);
      spanParent.normalize();
    }

  }

  return rect;
}


/***/ }),

/***/ 318:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * Module dependencies.
 */

try {
  var index = __webpack_require__(688);
} catch (err) {
  var index = __webpack_require__(688);
}

/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function(el){
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  if (!el || !el.nodeType) {
    throw new Error('A DOM element reference is required');
  }
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function(name){
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function(name){
  if ('[object RegExp]' == toString.call(name)) {
    return this.removeMatching(name);
  }

  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove all classes matching `re`.
 *
 * @param {RegExp} re
 * @return {ClassList}
 * @api private
 */

ClassList.prototype.removeMatching = function(re){
  var arr = this.array();
  for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i])) {
      this.remove(arr[i]);
    }
  }
  return this;
};

/**
 * Toggle class `name`, can force state via `force`.
 *
 * For browsers that support classList, but do not support `force` yet,
 * the mistake will be detected and corrected.
 *
 * @param {String} name
 * @param {Boolean} force
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function(name, force){
  // classList
  if (this.list) {
    if ("undefined" !== typeof force) {
      if (force !== this.list.toggle(name, force)) {
        this.list.toggle(name); // toggle again to correct
      }
    } else {
      this.list.toggle(name);
    }
    return this;
  }

  // fallback
  if ("undefined" !== typeof force) {
    if (!force) {
      this.remove(name);
    } else {
      this.add(name);
    }
  } else {
    if (this.has(name)) {
      this.remove(name);
    } else {
      this.add(name);
    }
  }

  return this;
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function(){
  var className = this.el.getAttribute('class') || '';
  var str = className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(re);
  if ('' === arr[0]) arr.shift();
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has =
ClassList.prototype.contains = function(name){
  return this.list
    ? this.list.contains(name)
    : !! ~index(this.array(), name);
};


/***/ }),

/***/ 773:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * Module Dependencies
 */

try {
  var matches = __webpack_require__(360)
} catch (err) {
  var matches = __webpack_require__(360)
}

/**
 * Export `closest`
 */

module.exports = closest

/**
 * Closest
 *
 * @param {Element} el
 * @param {String} selector
 * @param {Element} scope (optional)
 */

function closest (el, selector, scope) {
  scope = scope || document.documentElement;

  // walk up the dom
  while (el && el !== scope) {
    if (matches(el, selector)) return el;
    el = el.parentNode;
  }

  // check scope for match
  return matches(el, selector) ? el : null;
}


/***/ }),

/***/ 837:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

try {
  var closest = __webpack_require__(773);
} catch(err) {
  var closest = __webpack_require__(773);
}

try {
  var event = __webpack_require__(461);
} catch(err) {
  var event = __webpack_require__(461);
}

/**
 * Delegate event `type` to `selector`
 * and invoke `fn(e)`. A callback function
 * is returned which may be passed to `.unbind()`.
 *
 * @param {Element} el
 * @param {String} selector
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, selector, type, fn, capture){
  return event.bind(el, type, function(e){
    var target = e.target || e.srcElement;
    e.delegateTarget = closest(target, selector, true, el);
    if (e.delegateTarget) fn.call(el, e);
  }, capture);
};

/**
 * Unbind event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  event.unbind(el, type, fn, capture);
};


/***/ }),

/***/ 612:
/***/ (function(__unused_webpack_module, exports) {

var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  el[bind](prefix + type, fn, capture || false);
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};

/***/ }),

/***/ 461:
/***/ (function(__unused_webpack_module, exports) {

var bind, unbind, prefix;

function detect () {
  bind = window.addEventListener ? 'addEventListener' : 'attachEvent';
  unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent';
  prefix = bind !== 'addEventListener' ? 'on' : '';
}

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  if (!bind) detect();
  el[bind](prefix + type, fn, capture || false);
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  if (!unbind) detect();
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};


/***/ }),

/***/ 754:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


/**
 * Module dependencies.
 */

try {
  var events = __webpack_require__(612);
} catch(err) {
  var events = __webpack_require__(612);
}

try {
  var delegate = __webpack_require__(837);
} catch(err) {
  var delegate = __webpack_require__(837);
}

/**
 * Expose `Events`.
 */

module.exports = Events;

/**
 * Initialize an `Events` with the given
 * `el` object which events will be bound to,
 * and the `obj` which will receive method calls.
 *
 * @param {Object} el
 * @param {Object} obj
 * @api public
 */

function Events(el, obj) {
  if (!(this instanceof Events)) return new Events(el, obj);
  if (!el) throw new Error('element required');
  if (!obj) throw new Error('object required');
  this.el = el;
  this.obj = obj;
  this._events = {};
}

/**
 * Subscription helper.
 */

Events.prototype.sub = function(event, method, cb){
  this._events[event] = this._events[event] || {};
  this._events[event][method] = cb;
};

/**
 * Bind to `event` with optional `method` name.
 * When `method` is undefined it becomes `event`
 * with the "on" prefix.
 *
 * Examples:
 *
 *  Direct event handling:
 *
 *    events.bind('click') // implies "onclick"
 *    events.bind('click', 'remove')
 *    events.bind('click', 'sort', 'asc')
 *
 *  Delegated event handling:
 *
 *    events.bind('click li > a')
 *    events.bind('click li > a', 'remove')
 *    events.bind('click a.sort-ascending', 'sort', 'asc')
 *    events.bind('click a.sort-descending', 'sort', 'desc')
 *
 * @param {String} event
 * @param {String|function} [method]
 * @return {Function} callback
 * @api public
 */

Events.prototype.bind = function(event, method){
  var e = parse(event);
  var el = this.el;
  var obj = this.obj;
  var name = e.name;
  var method = method || 'on' + name;
  var args = [].slice.call(arguments, 2);

  // callback
  function cb(){
    var a = [].slice.call(arguments).concat(args);
    obj[method].apply(obj, a);
  }

  // bind
  if (e.selector) {
    cb = delegate.bind(el, e.selector, name, cb);
  } else {
    events.bind(el, name, cb);
  }

  // subscription for unbinding
  this.sub(name, method, cb);

  return cb;
};

/**
 * Unbind a single binding, all bindings for `event`,
 * or all bindings within the manager.
 *
 * Examples:
 *
 *  Unbind direct handlers:
 *
 *     events.unbind('click', 'remove')
 *     events.unbind('click')
 *     events.unbind()
 *
 * Unbind delegate handlers:
 *
 *     events.unbind('click', 'remove')
 *     events.unbind('click')
 *     events.unbind()
 *
 * @param {String|Function} [event]
 * @param {String|Function} [method]
 * @api public
 */

Events.prototype.unbind = function(event, method){
  if (0 == arguments.length) return this.unbindAll();
  if (1 == arguments.length) return this.unbindAllOf(event);

  // no bindings for this event
  var bindings = this._events[event];
  if (!bindings) return;

  // no bindings for this method
  var cb = bindings[method];
  if (!cb) return;

  events.unbind(this.el, event, cb);
};

/**
 * Unbind all events.
 *
 * @api private
 */

Events.prototype.unbindAll = function(){
  for (var event in this._events) {
    this.unbindAllOf(event);
  }
};

/**
 * Unbind all events for `event`.
 *
 * @param {String} event
 * @api private
 */

Events.prototype.unbindAllOf = function(event){
  var bindings = this._events[event];
  if (!bindings) return;

  for (var method in bindings) {
    this.unbind(event, method);
  }
};

/**
 * Parse `event`.
 *
 * @param {String} event
 * @return {Object}
 * @api private
 */

function parse(event) {
  var parts = event.split(/ +/);
  return {
    name: parts.shift(),
    selector: parts.join(' ')
  }
}


/***/ }),

/***/ 688:
/***/ (function(module) {

module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};

/***/ }),

/***/ 360:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * Module dependencies.
 */

try {
  var query = __webpack_require__(957);
} catch (err) {
  var query = __webpack_require__(957);
}

/**
 * Element prototype.
 */

var Element = (__webpack_require__(276).Element);
var proto = Element && Element.prototype || {};

/**
 * Vendor function.
 */

var vendor = proto.matches
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (!el || el.nodeType !== 1) return false;
  if (vendor) return vendor.call(el, selector);
  var nodes = query.all(selector, el.parentNode);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}


/***/ }),

/***/ 957:
/***/ (function(module, exports) {

function one(selector, el) {
  return el.querySelector(selector);
}

exports = module.exports = function(selector, el){
  el = el || document;
  return one(selector, el);
};

exports.all = function(selector, el){
  el = el || document;
  return el.querySelectorAll(selector);
};

exports.engine = function(obj){
  if (!obj.one) throw new Error('.one callback required');
  if (!obj.all) throw new Error('.all callback required');
  one = obj.one;
  exports.all = obj.all;
  return exports;
};


/***/ }),

/***/ 553:
/***/ (function(module) {

module.exports=dataset;

/*global document*/


// replace namesLikeThis with names-like-this
function toDashed(name) {
  return name.replace(/([A-Z])/g, function(u) {
    return "-" + u.toLowerCase();
  });
}

var fn;

if (typeof document !== "undefined" && document.head && document.head.dataset) {
  fn = {
    set: function(node, attr, value) {
      node.dataset[attr] = value;
    },
    get: function(node, attr) {
      return node.dataset[attr];
    },
    del: function (node, attr) {
      delete node.dataset[attr];
    }
  };
} else {
  fn = {
    set: function(node, attr, value) {
      node.setAttribute('data-' + toDashed(attr), value);
    },
    get: function(node, attr) {
      return node.getAttribute('data-' + toDashed(attr));
    },
    del: function (node, attr) {
      node.removeAttribute('data-' + toDashed(attr));
    }
  };
}

function dataset(node, attr, value) {
  var self = {
    set: set,
    get: get,
    del: del
  };

  function set(attr, value) {
    fn.set(node, attr, value);
    return self;
  }

  function del(attr) {
    fn.del(node, attr);
    return self;
  }

  function get(attr) {
    return fn.get(node, attr);
  }

  if (arguments.length === 3) {
    return set(attr, value);
  }
  if (arguments.length == 2) {
    return get(attr);
  }

  return self;
}


/***/ }),

/***/ 864:
/***/ (function(module) {


/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var innerHTMLBug = false;
var bugTestDiv;
if (typeof document !== 'undefined') {
  bugTestDiv = document.createElement('div');
  // Setup
  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
  // Make sure that link elements get serialized correctly by innerHTML
  // This requires a wrapper element in IE
  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
  bugTestDiv = undefined;
}

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.polyline =
map.ellipse =
map.polygon =
map.circle =
map.text =
map.line =
map.path =
map.rect =
map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = Object.prototype.hasOwnProperty.call(map, tag) ? map[tag] : map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}


/***/ }),

/***/ 839:
/***/ (function(module) {

module.exports = el;

// see: http://www.w3.org/html/wg/drafts/html/master/single-page.html#void-elements
var voids = [
  'area', 'base', 'br', 'col', 'embed',
  'hr', 'img', 'input', 'keygen', 'link',
  'menuitem', 'meta', 'param', 'source', 'track', 'wbr'
];

function el(tag, content, attrs) {
  var attrStr, classes, ids, text;

  if (typeof content !== 'string') {
    attrs = content;
    content = '';
  }

  tag = tag || '';
  content = content || '';
  attrs = attrs || {};

  classes = tag.split('.');
  tag = classes.shift() || 'div';
  if (classes.length) {
    classes = classes.join(' ');
    if (attrs['class']) {
      attrs['class'] += ' ' + classes;
    } else {
      attrs['class'] = classes;
    }
  }
  ids = tag.split('#');
  if (ids.length > 1) {
    tag = ids[0] || 'div';
    attrs.id = ids[1];
  }

  attrStr = Object.keys(attrs).map(function(attr) {
    return attr +  '="' + attrs[attr] + '"';
  }).join(' ');


  text = ['<',
    tag,
    attrStr ? ' ' + attrStr :  '',
    '>'
  ];
  if(voids.indexOf(tag) < 0) {
    text = text.concat([
      content,
      '</',
      tag,
      '>'
    ]);
  }
  return text.join('');
}

/***/ }),

/***/ 642:
/***/ (function(module) {


/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),

/***/ 954:
/***/ (function(module) {

"use strict";


var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var defineProperty = Object.defineProperty;
var gOPD = Object.getOwnPropertyDescriptor;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

// If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
var setProperty = function setProperty(target, options) {
	if (defineProperty && options.name === '__proto__') {
		defineProperty(target, options.name, {
			enumerable: true,
			configurable: true,
			value: options.newValue,
			writable: true
		});
	} else {
		target[options.name] = options.newValue;
	}
};

// Return undefined instead of __proto__ if '__proto__' is not an own property
var getProperty = function getProperty(obj, name) {
	if (name === '__proto__') {
		if (!hasOwn.call(obj, name)) {
			return void 0;
		} else if (gOPD) {
			// In early versions of node, obj['__proto__'] is buggy when obj has
			// __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
			return gOPD(obj, name).value;
		}
	}

	return obj[name];
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = getProperty(target, name);
				copy = getProperty(options, name);

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						setProperty(target, { name: name, newValue: extend(deep, clone, copy) });

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						setProperty(target, { name: name, newValue: copy });
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


/***/ }),

/***/ 15:
/***/ (function(module) {


/**
 * Module exports.
 */

module.exports = getDocument;

// defined by w3c
var DOCUMENT_NODE = 9;

/**
 * Returns `true` if `w` is a Document object, or `false` otherwise.
 *
 * @param {?} d - Document object, maybe
 * @return {Boolean}
 * @private
 */

function isDocument (d) {
  return d && d.nodeType === DOCUMENT_NODE;
}

/**
 * Returns the `document` object associated with the given `node`, which may be
 * a DOM element, the Window object, a Selection, a Range. Basically any DOM
 * object that references the Document in some way, this function will find it.
 *
 * @param {Mixed} node - DOM node, selection, or range in which to find the `document` object
 * @return {Document} the `document` object associated with `node`
 * @public
 */

function getDocument(node) {
  if (isDocument(node)) {
    return node;

  } else if (isDocument(node.ownerDocument)) {
    return node.ownerDocument;

  } else if (isDocument(node.document)) {
    return node.document;

  } else if (node.parentNode) {
    return getDocument(node.parentNode);

  // Range support
  } else if (node.commonAncestorContainer) {
    return getDocument(node.commonAncestorContainer);

  } else if (node.startContainer) {
    return getDocument(node.startContainer);

  // Selection support
  } else if (node.anchorNode) {
    return getDocument(node.anchorNode);
  }
}


/***/ }),

/***/ 988:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof __webpack_require__.g !== "undefined") {
    win = __webpack_require__.g;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;


/***/ }),

/***/ 276:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

(function($){try{$('export default global')}catch(e){try{$('export default self')}catch(e){try{module.exports=__webpack_require__.g}catch(e){try{self.global=self}catch(e){window.global=window}}}}}(eval))

/***/ }),

/***/ 724:
/***/ (function(module) {


module.exports = function(arr, n){
  var ret = [];
  var group = [];
  var len = arr.length;
  var per = len * (n / len);

  for (var i = 0; i < len; ++i) {
    group.push(arr[i]);
    if ((i + 1) % n == 0) {
      ret.push(group);
      group = [];
    }
  }

  if (group.length) ret.push(group);

  return ret;
};

/***/ }),

/***/ 681:
/***/ (function(module) {

module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  if (!fn) {
    return false
  }
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};


/***/ }),

/***/ 633:
/***/ (function(module) {


/**
 * Key name map.
 */

var map = {
  8: 'backspace',
  9: 'tab',
  13: 'enter',
  16: 'shift',
  17: 'ctrl',
  18: 'alt',
  20: 'capslock',
  27: 'esc',
  32: 'space',
  33: 'pageup',
  34: 'pagedown',
  35: 'end',
  36: 'home',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  45: 'ins',
  46: 'del',
  91: 'meta',
  93: 'meta',
  224: 'meta'
};

/**
 * Return key name for `n`.
 *
 * @param {Number} n
 * @return {String}
 * @api public
 */

module.exports = function(n){
  return map[n];
};

/***/ }),

/***/ 141:
/***/ (function(module) {

/*!***************************************************
* mark.js v8.11.1
* https://markjs.io/
* Copyright (c) 2014–2018, Julian Kühnel
* Released under the MIT license https://git.io/vwTVl
*****************************************************/

(function (global, factory) {
	 true ? module.exports = factory() :
	0;
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var DOMIterator = function () {
  function DOMIterator(ctx) {
    var iframes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var exclude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var iframesTimeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5000;
    classCallCheck(this, DOMIterator);

    this.ctx = ctx;
    this.iframes = iframes;
    this.exclude = exclude;
    this.iframesTimeout = iframesTimeout;
  }

  createClass(DOMIterator, [{
    key: 'getContexts',
    value: function getContexts() {
      var ctx = void 0,
          filteredCtx = [];
      if (typeof this.ctx === 'undefined' || !this.ctx) {
        ctx = [];
      } else if (NodeList.prototype.isPrototypeOf(this.ctx)) {
        ctx = Array.prototype.slice.call(this.ctx);
      } else if (Array.isArray(this.ctx)) {
        ctx = this.ctx;
      } else if (typeof this.ctx === 'string') {
        ctx = Array.prototype.slice.call(document.querySelectorAll(this.ctx));
      } else {
        ctx = [this.ctx];
      }
      ctx.forEach(function (ctx) {
        var isDescendant = filteredCtx.filter(function (contexts) {
          return contexts.contains(ctx);
        }).length > 0;
        if (filteredCtx.indexOf(ctx) === -1 && !isDescendant) {
          filteredCtx.push(ctx);
        }
      });
      return filteredCtx;
    }
  }, {
    key: 'getIframeContents',
    value: function getIframeContents(ifr, successFn) {
      var errorFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

      var doc = void 0;
      try {
        var ifrWin = ifr.contentWindow;
        doc = ifrWin.document;
        if (!ifrWin || !doc) {
          throw new Error('iframe inaccessible');
        }
      } catch (e) {
        errorFn();
      }
      if (doc) {
        successFn(doc);
      }
    }
  }, {
    key: 'isIframeBlank',
    value: function isIframeBlank(ifr) {
      var bl = 'about:blank',
          src = ifr.getAttribute('src').trim(),
          href = ifr.contentWindow.location.href;
      return href === bl && src !== bl && src;
    }
  }, {
    key: 'observeIframeLoad',
    value: function observeIframeLoad(ifr, successFn, errorFn) {
      var _this = this;

      var called = false,
          tout = null;
      var listener = function listener() {
        if (called) {
          return;
        }
        called = true;
        clearTimeout(tout);
        try {
          if (!_this.isIframeBlank(ifr)) {
            ifr.removeEventListener('load', listener);
            _this.getIframeContents(ifr, successFn, errorFn);
          }
        } catch (e) {
          errorFn();
        }
      };
      ifr.addEventListener('load', listener);
      tout = setTimeout(listener, this.iframesTimeout);
    }
  }, {
    key: 'onIframeReady',
    value: function onIframeReady(ifr, successFn, errorFn) {
      try {
        if (ifr.contentWindow.document.readyState === 'complete') {
          if (this.isIframeBlank(ifr)) {
            this.observeIframeLoad(ifr, successFn, errorFn);
          } else {
            this.getIframeContents(ifr, successFn, errorFn);
          }
        } else {
          this.observeIframeLoad(ifr, successFn, errorFn);
        }
      } catch (e) {
        errorFn();
      }
    }
  }, {
    key: 'waitForIframes',
    value: function waitForIframes(ctx, done) {
      var _this2 = this;

      var eachCalled = 0;
      this.forEachIframe(ctx, function () {
        return true;
      }, function (ifr) {
        eachCalled++;
        _this2.waitForIframes(ifr.querySelector('html'), function () {
          if (! --eachCalled) {
            done();
          }
        });
      }, function (handled) {
        if (!handled) {
          done();
        }
      });
    }
  }, {
    key: 'forEachIframe',
    value: function forEachIframe(ctx, filter, each) {
      var _this3 = this;

      var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

      var ifr = ctx.querySelectorAll('iframe'),
          open = ifr.length,
          handled = 0;
      ifr = Array.prototype.slice.call(ifr);
      var checkEnd = function checkEnd() {
        if (--open <= 0) {
          end(handled);
        }
      };
      if (!open) {
        checkEnd();
      }
      ifr.forEach(function (ifr) {
        if (DOMIterator.matches(ifr, _this3.exclude)) {
          checkEnd();
        } else {
          _this3.onIframeReady(ifr, function (con) {
            if (filter(ifr)) {
              handled++;
              each(con);
            }
            checkEnd();
          }, checkEnd);
        }
      });
    }
  }, {
    key: 'createIterator',
    value: function createIterator(ctx, whatToShow, filter) {
      return document.createNodeIterator(ctx, whatToShow, filter, false);
    }
  }, {
    key: 'createInstanceOnIframe',
    value: function createInstanceOnIframe(contents) {
      return new DOMIterator(contents.querySelector('html'), this.iframes);
    }
  }, {
    key: 'compareNodeIframe',
    value: function compareNodeIframe(node, prevNode, ifr) {
      var compCurr = node.compareDocumentPosition(ifr),
          prev = Node.DOCUMENT_POSITION_PRECEDING;
      if (compCurr & prev) {
        if (prevNode !== null) {
          var compPrev = prevNode.compareDocumentPosition(ifr),
              after = Node.DOCUMENT_POSITION_FOLLOWING;
          if (compPrev & after) {
            return true;
          }
        } else {
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'getIteratorNode',
    value: function getIteratorNode(itr) {
      var prevNode = itr.previousNode();
      var node = void 0;
      if (prevNode === null) {
        node = itr.nextNode();
      } else {
        node = itr.nextNode() && itr.nextNode();
      }
      return {
        prevNode: prevNode,
        node: node
      };
    }
  }, {
    key: 'checkIframeFilter',
    value: function checkIframeFilter(node, prevNode, currIfr, ifr) {
      var key = false,
          handled = false;
      ifr.forEach(function (ifrDict, i) {
        if (ifrDict.val === currIfr) {
          key = i;
          handled = ifrDict.handled;
        }
      });
      if (this.compareNodeIframe(node, prevNode, currIfr)) {
        if (key === false && !handled) {
          ifr.push({
            val: currIfr,
            handled: true
          });
        } else if (key !== false && !handled) {
          ifr[key].handled = true;
        }
        return true;
      }
      if (key === false) {
        ifr.push({
          val: currIfr,
          handled: false
        });
      }
      return false;
    }
  }, {
    key: 'handleOpenIframes',
    value: function handleOpenIframes(ifr, whatToShow, eCb, fCb) {
      var _this4 = this;

      ifr.forEach(function (ifrDict) {
        if (!ifrDict.handled) {
          _this4.getIframeContents(ifrDict.val, function (con) {
            _this4.createInstanceOnIframe(con).forEachNode(whatToShow, eCb, fCb);
          });
        }
      });
    }
  }, {
    key: 'iterateThroughNodes',
    value: function iterateThroughNodes(whatToShow, ctx, eachCb, filterCb, doneCb) {
      var _this5 = this;

      var itr = this.createIterator(ctx, whatToShow, filterCb);
      var ifr = [],
          elements = [],
          node = void 0,
          prevNode = void 0,
          retrieveNodes = function retrieveNodes() {
        var _getIteratorNode = _this5.getIteratorNode(itr);

        prevNode = _getIteratorNode.prevNode;
        node = _getIteratorNode.node;

        return node;
      };
      while (retrieveNodes()) {
        if (this.iframes) {
          this.forEachIframe(ctx, function (currIfr) {
            return _this5.checkIframeFilter(node, prevNode, currIfr, ifr);
          }, function (con) {
            _this5.createInstanceOnIframe(con).forEachNode(whatToShow, function (ifrNode) {
              return elements.push(ifrNode);
            }, filterCb);
          });
        }
        elements.push(node);
      }
      elements.forEach(function (node) {
        eachCb(node);
      });
      if (this.iframes) {
        this.handleOpenIframes(ifr, whatToShow, eachCb, filterCb);
      }
      doneCb();
    }
  }, {
    key: 'forEachNode',
    value: function forEachNode(whatToShow, each, filter) {
      var _this6 = this;

      var done = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

      var contexts = this.getContexts();
      var open = contexts.length;
      if (!open) {
        done();
      }
      contexts.forEach(function (ctx) {
        var ready = function ready() {
          _this6.iterateThroughNodes(whatToShow, ctx, each, filter, function () {
            if (--open <= 0) {
              done();
            }
          });
        };
        if (_this6.iframes) {
          _this6.waitForIframes(ctx, ready);
        } else {
          ready();
        }
      });
    }
  }], [{
    key: 'matches',
    value: function matches(element, selector) {
      var selectors = typeof selector === 'string' ? [selector] : selector,
          fn = element.matches || element.matchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.webkitMatchesSelector;
      if (fn) {
        var match = false;
        selectors.every(function (sel) {
          if (fn.call(element, sel)) {
            match = true;
            return false;
          }
          return true;
        });
        return match;
      } else {
        return false;
      }
    }
  }]);
  return DOMIterator;
}();

var Mark$1 = function () {
  function Mark(ctx) {
    classCallCheck(this, Mark);

    this.ctx = ctx;
    this.ie = false;
    var ua = window.navigator.userAgent;
    if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
      this.ie = true;
    }
  }

  createClass(Mark, [{
    key: 'log',
    value: function log(msg) {
      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'debug';

      var log = this.opt.log;
      if (!this.opt.debug) {
        return;
      }
      if ((typeof log === 'undefined' ? 'undefined' : _typeof(log)) === 'object' && typeof log[level] === 'function') {
        log[level]('mark.js: ' + msg);
      }
    }
  }, {
    key: 'escapeStr',
    value: function escapeStr(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    }
  }, {
    key: 'createRegExp',
    value: function createRegExp(str) {
      if (this.opt.wildcards !== 'disabled') {
        str = this.setupWildcardsRegExp(str);
      }
      str = this.escapeStr(str);
      if (Object.keys(this.opt.synonyms).length) {
        str = this.createSynonymsRegExp(str);
      }
      if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
        str = this.setupIgnoreJoinersRegExp(str);
      }
      if (this.opt.diacritics) {
        str = this.createDiacriticsRegExp(str);
      }
      str = this.createMergedBlanksRegExp(str);
      if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
        str = this.createJoinersRegExp(str);
      }
      if (this.opt.wildcards !== 'disabled') {
        str = this.createWildcardsRegExp(str);
      }
      str = this.createAccuracyRegExp(str);
      return str;
    }
  }, {
    key: 'createSynonymsRegExp',
    value: function createSynonymsRegExp(str) {
      var syn = this.opt.synonyms,
          sens = this.opt.caseSensitive ? '' : 'i',
          joinerPlaceholder = this.opt.ignoreJoiners || this.opt.ignorePunctuation.length ? '\0' : '';
      for (var index in syn) {
        if (syn.hasOwnProperty(index)) {
          var value = syn[index],
              k1 = this.opt.wildcards !== 'disabled' ? this.setupWildcardsRegExp(index) : this.escapeStr(index),
              k2 = this.opt.wildcards !== 'disabled' ? this.setupWildcardsRegExp(value) : this.escapeStr(value);
          if (k1 !== '' && k2 !== '') {
            str = str.replace(new RegExp('(' + this.escapeStr(k1) + '|' + this.escapeStr(k2) + ')', 'gm' + sens), joinerPlaceholder + ('(' + this.processSynomyms(k1) + '|') + (this.processSynomyms(k2) + ')') + joinerPlaceholder);
          }
        }
      }
      return str;
    }
  }, {
    key: 'processSynomyms',
    value: function processSynomyms(str) {
      if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
        str = this.setupIgnoreJoinersRegExp(str);
      }
      return str;
    }
  }, {
    key: 'setupWildcardsRegExp',
    value: function setupWildcardsRegExp(str) {
      str = str.replace(/(?:\\)*\?/g, function (val) {
        return val.charAt(0) === '\\' ? '?' : '\x01';
      });
      return str.replace(/(?:\\)*\*/g, function (val) {
        return val.charAt(0) === '\\' ? '*' : '\x02';
      });
    }
  }, {
    key: 'createWildcardsRegExp',
    value: function createWildcardsRegExp(str) {
      var spaces = this.opt.wildcards === 'withSpaces';
      return str.replace(/\u0001/g, spaces ? '[\\S\\s]?' : '\\S?').replace(/\u0002/g, spaces ? '[\\S\\s]*?' : '\\S*');
    }
  }, {
    key: 'setupIgnoreJoinersRegExp',
    value: function setupIgnoreJoinersRegExp(str) {
      return str.replace(/[^(|)\\]/g, function (val, indx, original) {
        var nextChar = original.charAt(indx + 1);
        if (/[(|)\\]/.test(nextChar) || nextChar === '') {
          return val;
        } else {
          return val + '\0';
        }
      });
    }
  }, {
    key: 'createJoinersRegExp',
    value: function createJoinersRegExp(str) {
      var joiner = [];
      var ignorePunctuation = this.opt.ignorePunctuation;
      if (Array.isArray(ignorePunctuation) && ignorePunctuation.length) {
        joiner.push(this.escapeStr(ignorePunctuation.join('')));
      }
      if (this.opt.ignoreJoiners) {
        joiner.push('\\u00ad\\u200b\\u200c\\u200d');
      }
      return joiner.length ? str.split(/\u0000+/).join('[' + joiner.join('') + ']*') : str;
    }
  }, {
    key: 'createDiacriticsRegExp',
    value: function createDiacriticsRegExp(str) {
      var sens = this.opt.caseSensitive ? '' : 'i',
          dct = this.opt.caseSensitive ? ['aàáảãạăằắẳẵặâầấẩẫậäåāą', 'AÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ', 'cçćč', 'CÇĆČ', 'dđď', 'DĐĎ', 'eèéẻẽẹêềếểễệëěēę', 'EÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ', 'iìíỉĩịîïī', 'IÌÍỈĨỊÎÏĪ', 'lł', 'LŁ', 'nñňń', 'NÑŇŃ', 'oòóỏõọôồốổỗộơởỡớờợöøō', 'OÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌ', 'rř', 'RŘ', 'sšśșş', 'SŠŚȘŞ', 'tťțţ', 'TŤȚŢ', 'uùúủũụưừứửữựûüůū', 'UÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪ', 'yýỳỷỹỵÿ', 'YÝỲỶỸỴŸ', 'zžżź', 'ZŽŻŹ'] : ['aàáảãạăằắẳẵặâầấẩẫậäåāąAÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ', 'cçćčCÇĆČ', 'dđďDĐĎ', 'eèéẻẽẹêềếểễệëěēęEÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ', 'iìíỉĩịîïīIÌÍỈĨỊÎÏĪ', 'lłLŁ', 'nñňńNÑŇŃ', 'oòóỏõọôồốổỗộơởỡớờợöøōOÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌ', 'rřRŘ', 'sšśșşSŠŚȘŞ', 'tťțţTŤȚŢ', 'uùúủũụưừứửữựûüůūUÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪ', 'yýỳỷỹỵÿYÝỲỶỸỴŸ', 'zžżźZŽŻŹ'];
      var handled = [];
      str.split('').forEach(function (ch) {
        dct.every(function (dct) {
          if (dct.indexOf(ch) !== -1) {
            if (handled.indexOf(dct) > -1) {
              return false;
            }
            str = str.replace(new RegExp('[' + dct + ']', 'gm' + sens), '[' + dct + ']');
            handled.push(dct);
          }
          return true;
        });
      });
      return str;
    }
  }, {
    key: 'createMergedBlanksRegExp',
    value: function createMergedBlanksRegExp(str) {
      return str.replace(/[\s]+/gmi, '[\\s]+');
    }
  }, {
    key: 'createAccuracyRegExp',
    value: function createAccuracyRegExp(str) {
      var _this = this;

      var chars = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~¡¿';
      var acc = this.opt.accuracy,
          val = typeof acc === 'string' ? acc : acc.value,
          ls = typeof acc === 'string' ? [] : acc.limiters,
          lsJoin = '';
      ls.forEach(function (limiter) {
        lsJoin += '|' + _this.escapeStr(limiter);
      });
      switch (val) {
        case 'partially':
        default:
          return '()(' + str + ')';
        case 'complementary':
          lsJoin = '\\s' + (lsJoin ? lsJoin : this.escapeStr(chars));
          return '()([^' + lsJoin + ']*' + str + '[^' + lsJoin + ']*)';
        case 'exactly':
          return '(^|\\s' + lsJoin + ')(' + str + ')(?=$|\\s' + lsJoin + ')';
      }
    }
  }, {
    key: 'getSeparatedKeywords',
    value: function getSeparatedKeywords(sv) {
      var _this2 = this;

      var stack = [];
      sv.forEach(function (kw) {
        if (!_this2.opt.separateWordSearch) {
          if (kw.trim() && stack.indexOf(kw) === -1) {
            stack.push(kw);
          }
        } else {
          kw.split(' ').forEach(function (kwSplitted) {
            if (kwSplitted.trim() && stack.indexOf(kwSplitted) === -1) {
              stack.push(kwSplitted);
            }
          });
        }
      });
      return {
        'keywords': stack.sort(function (a, b) {
          return b.length - a.length;
        }),
        'length': stack.length
      };
    }
  }, {
    key: 'isNumeric',
    value: function isNumeric(value) {
      return Number(parseFloat(value)) == value;
    }
  }, {
    key: 'checkRanges',
    value: function checkRanges(array) {
      var _this3 = this;

      if (!Array.isArray(array) || Object.prototype.toString.call(array[0]) !== '[object Object]') {
        this.log('markRanges() will only accept an array of objects');
        this.opt.noMatch(array);
        return [];
      }
      var stack = [];
      var last = 0;
      array.sort(function (a, b) {
        return a.start - b.start;
      }).forEach(function (item) {
        var _callNoMatchOnInvalid = _this3.callNoMatchOnInvalidRanges(item, last),
            start = _callNoMatchOnInvalid.start,
            end = _callNoMatchOnInvalid.end,
            valid = _callNoMatchOnInvalid.valid;

        if (valid) {
          item.start = start;
          item.length = end - start;
          stack.push(item);
          last = end;
        }
      });
      return stack;
    }
  }, {
    key: 'callNoMatchOnInvalidRanges',
    value: function callNoMatchOnInvalidRanges(range, last) {
      var start = void 0,
          end = void 0,
          valid = false;
      if (range && typeof range.start !== 'undefined') {
        start = parseInt(range.start, 10);
        end = start + parseInt(range.length, 10);
        if (this.isNumeric(range.start) && this.isNumeric(range.length) && end - last > 0 && end - start > 0) {
          valid = true;
        } else {
          this.log('Ignoring invalid or overlapping range: ' + ('' + JSON.stringify(range)));
          this.opt.noMatch(range);
        }
      } else {
        this.log('Ignoring invalid range: ' + JSON.stringify(range));
        this.opt.noMatch(range);
      }
      return {
        start: start,
        end: end,
        valid: valid
      };
    }
  }, {
    key: 'checkWhitespaceRanges',
    value: function checkWhitespaceRanges(range, originalLength, string) {
      var end = void 0,
          valid = true,
          max = string.length,
          offset = originalLength - max,
          start = parseInt(range.start, 10) - offset;
      start = start > max ? max : start;
      end = start + parseInt(range.length, 10);
      if (end > max) {
        end = max;
        this.log('End range automatically set to the max value of ' + max);
      }
      if (start < 0 || end - start < 0 || start > max || end > max) {
        valid = false;
        this.log('Invalid range: ' + JSON.stringify(range));
        this.opt.noMatch(range);
      } else if (string.substring(start, end).replace(/\s+/g, '') === '') {
        valid = false;
        this.log('Skipping whitespace only range: ' + JSON.stringify(range));
        this.opt.noMatch(range);
      }
      return {
        start: start,
        end: end,
        valid: valid
      };
    }
  }, {
    key: 'getTextNodes',
    value: function getTextNodes(cb) {
      var _this4 = this;

      var val = '',
          nodes = [];
      this.iterator.forEachNode(NodeFilter.SHOW_TEXT, function (node) {
        nodes.push({
          start: val.length,
          end: (val += node.textContent).length,
          node: node
        });
      }, function (node) {
        if (_this4.matchesExclude(node.parentNode)) {
          return NodeFilter.FILTER_REJECT;
        } else {
          return NodeFilter.FILTER_ACCEPT;
        }
      }, function () {
        cb({
          value: val,
          nodes: nodes
        });
      });
    }
  }, {
    key: 'matchesExclude',
    value: function matchesExclude(el) {
      return DOMIterator.matches(el, this.opt.exclude.concat(['script', 'style', 'title', 'head', 'html']));
    }
  }, {
    key: 'wrapRangeInTextNode',
    value: function wrapRangeInTextNode(node, start, end) {
      var hEl = !this.opt.element ? 'mark' : this.opt.element,
          startNode = node.splitText(start),
          ret = startNode.splitText(end - start);
      var repl = document.createElement(hEl);
      repl.setAttribute('data-markjs', 'true');
      if (this.opt.className) {
        repl.setAttribute('class', this.opt.className);
      }
      repl.textContent = startNode.textContent;
      startNode.parentNode.replaceChild(repl, startNode);
      return ret;
    }
  }, {
    key: 'wrapRangeInMappedTextNode',
    value: function wrapRangeInMappedTextNode(dict, start, end, filterCb, eachCb) {
      var _this5 = this;

      dict.nodes.every(function (n, i) {
        var sibl = dict.nodes[i + 1];
        if (typeof sibl === 'undefined' || sibl.start > start) {
          if (!filterCb(n.node)) {
            return false;
          }
          var s = start - n.start,
              e = (end > n.end ? n.end : end) - n.start,
              startStr = dict.value.substr(0, n.start),
              endStr = dict.value.substr(e + n.start);
          n.node = _this5.wrapRangeInTextNode(n.node, s, e);
          dict.value = startStr + endStr;
          dict.nodes.forEach(function (k, j) {
            if (j >= i) {
              if (dict.nodes[j].start > 0 && j !== i) {
                dict.nodes[j].start -= e;
              }
              dict.nodes[j].end -= e;
            }
          });
          end -= e;
          eachCb(n.node.previousSibling, n.start);
          if (end > n.end) {
            start = n.end;
          } else {
            return false;
          }
        }
        return true;
      });
    }
  }, {
    key: 'wrapMatches',
    value: function wrapMatches(regex, ignoreGroups, filterCb, eachCb, endCb) {
      var _this6 = this;

      var matchIdx = ignoreGroups === 0 ? 0 : ignoreGroups + 1;
      this.getTextNodes(function (dict) {
        dict.nodes.forEach(function (node) {
          node = node.node;
          var match = void 0;
          while ((match = regex.exec(node.textContent)) !== null && match[matchIdx] !== '') {
            if (!filterCb(match[matchIdx], node)) {
              continue;
            }
            var pos = match.index;
            if (matchIdx !== 0) {
              for (var i = 1; i < matchIdx; i++) {
                pos += match[i].length;
              }
            }
            node = _this6.wrapRangeInTextNode(node, pos, pos + match[matchIdx].length);
            eachCb(node.previousSibling);
            regex.lastIndex = 0;
          }
        });
        endCb();
      });
    }
  }, {
    key: 'wrapMatchesAcrossElements',
    value: function wrapMatchesAcrossElements(regex, ignoreGroups, filterCb, eachCb, endCb) {
      var _this7 = this;

      var matchIdx = ignoreGroups === 0 ? 0 : ignoreGroups + 1;
      this.getTextNodes(function (dict) {
        var match = void 0;
        while ((match = regex.exec(dict.value)) !== null && match[matchIdx] !== '') {
          var start = match.index;
          if (matchIdx !== 0) {
            for (var i = 1; i < matchIdx; i++) {
              start += match[i].length;
            }
          }
          var end = start + match[matchIdx].length;
          _this7.wrapRangeInMappedTextNode(dict, start, end, function (node) {
            return filterCb(match[matchIdx], node);
          }, function (node, lastIndex) {
            regex.lastIndex = lastIndex;
            eachCb(node);
          });
        }
        endCb();
      });
    }
  }, {
    key: 'wrapRangeFromIndex',
    value: function wrapRangeFromIndex(ranges, filterCb, eachCb, endCb) {
      var _this8 = this;

      this.getTextNodes(function (dict) {
        var originalLength = dict.value.length;
        ranges.forEach(function (range, counter) {
          var _checkWhitespaceRange = _this8.checkWhitespaceRanges(range, originalLength, dict.value),
              start = _checkWhitespaceRange.start,
              end = _checkWhitespaceRange.end,
              valid = _checkWhitespaceRange.valid;

          if (valid) {
            _this8.wrapRangeInMappedTextNode(dict, start, end, function (node) {
              return filterCb(node, range, dict.value.substring(start, end), counter);
            }, function (node) {
              eachCb(node, range);
            });
          }
        });
        endCb();
      });
    }
  }, {
    key: 'unwrapMatches',
    value: function unwrapMatches(node) {
      var parent = node.parentNode;
      var docFrag = document.createDocumentFragment();
      while (node.firstChild) {
        docFrag.appendChild(node.removeChild(node.firstChild));
      }
      parent.replaceChild(docFrag, node);
      if (!this.ie) {
        parent.normalize();
      } else {
        this.normalizeTextNode(parent);
      }
    }
  }, {
    key: 'normalizeTextNode',
    value: function normalizeTextNode(node) {
      if (!node) {
        return;
      }
      if (node.nodeType === 3) {
        while (node.nextSibling && node.nextSibling.nodeType === 3) {
          node.nodeValue += node.nextSibling.nodeValue;
          node.parentNode.removeChild(node.nextSibling);
        }
      } else {
        this.normalizeTextNode(node.firstChild);
      }
      this.normalizeTextNode(node.nextSibling);
    }
  }, {
    key: 'markRegExp',
    value: function markRegExp(regexp, opt) {
      var _this9 = this;

      this.opt = opt;
      this.log('Searching with expression "' + regexp + '"');
      var totalMatches = 0,
          fn = 'wrapMatches';
      var eachCb = function eachCb(element) {
        totalMatches++;
        _this9.opt.each(element);
      };
      if (this.opt.acrossElements) {
        fn = 'wrapMatchesAcrossElements';
      }
      this[fn](regexp, this.opt.ignoreGroups, function (match, node) {
        return _this9.opt.filter(node, match, totalMatches);
      }, eachCb, function () {
        if (totalMatches === 0) {
          _this9.opt.noMatch(regexp);
        }
        _this9.opt.done(totalMatches);
      });
    }
  }, {
    key: 'mark',
    value: function mark(sv, opt) {
      var _this10 = this;

      this.opt = opt;
      var totalMatches = 0,
          fn = 'wrapMatches';

      var _getSeparatedKeywords = this.getSeparatedKeywords(typeof sv === 'string' ? [sv] : sv),
          kwArr = _getSeparatedKeywords.keywords,
          kwArrLen = _getSeparatedKeywords.length,
          sens = this.opt.caseSensitive ? '' : 'i',
          handler = function handler(kw) {
        var regex = new RegExp(_this10.createRegExp(kw), 'gm' + sens),
            matches = 0;
        _this10.log('Searching with expression "' + regex + '"');
        _this10[fn](regex, 1, function (term, node) {
          return _this10.opt.filter(node, kw, totalMatches, matches);
        }, function (element) {
          matches++;
          totalMatches++;
          _this10.opt.each(element);
        }, function () {
          if (matches === 0) {
            _this10.opt.noMatch(kw);
          }
          if (kwArr[kwArrLen - 1] === kw) {
            _this10.opt.done(totalMatches);
          } else {
            handler(kwArr[kwArr.indexOf(kw) + 1]);
          }
        });
      };

      if (this.opt.acrossElements) {
        fn = 'wrapMatchesAcrossElements';
      }
      if (kwArrLen === 0) {
        this.opt.done(totalMatches);
      } else {
        handler(kwArr[0]);
      }
    }
  }, {
    key: 'markRanges',
    value: function markRanges(rawRanges, opt) {
      var _this11 = this;

      this.opt = opt;
      var totalMatches = 0,
          ranges = this.checkRanges(rawRanges);
      if (ranges && ranges.length) {
        this.log('Starting to mark with the following ranges: ' + JSON.stringify(ranges));
        this.wrapRangeFromIndex(ranges, function (node, range, match, counter) {
          return _this11.opt.filter(node, range, match, counter);
        }, function (element, range) {
          totalMatches++;
          _this11.opt.each(element, range);
        }, function () {
          _this11.opt.done(totalMatches);
        });
      } else {
        this.opt.done(totalMatches);
      }
    }
  }, {
    key: 'unmark',
    value: function unmark(opt) {
      var _this12 = this;

      this.opt = opt;
      var sel = this.opt.element ? this.opt.element : '*';
      sel += '[data-markjs]';
      if (this.opt.className) {
        sel += '.' + this.opt.className;
      }
      this.log('Removal selector "' + sel + '"');
      this.iterator.forEachNode(NodeFilter.SHOW_ELEMENT, function (node) {
        _this12.unwrapMatches(node);
      }, function (node) {
        var matchesSel = DOMIterator.matches(node, sel),
            matchesExclude = _this12.matchesExclude(node);
        if (!matchesSel || matchesExclude) {
          return NodeFilter.FILTER_REJECT;
        } else {
          return NodeFilter.FILTER_ACCEPT;
        }
      }, this.opt.done);
    }
  }, {
    key: 'opt',
    set: function set$$1(val) {
      this._opt = _extends({}, {
        'element': '',
        'className': '',
        'exclude': [],
        'iframes': false,
        'iframesTimeout': 5000,
        'separateWordSearch': true,
        'diacritics': true,
        'synonyms': {},
        'accuracy': 'partially',
        'acrossElements': false,
        'caseSensitive': false,
        'ignoreJoiners': false,
        'ignoreGroups': 0,
        'ignorePunctuation': [],
        'wildcards': 'disabled',
        'each': function each() {},
        'noMatch': function noMatch() {},
        'filter': function filter() {
          return true;
        },
        'done': function done() {},
        'debug': false,
        'log': window.console
      }, val);
    },
    get: function get$$1() {
      return this._opt;
    }
  }, {
    key: 'iterator',
    get: function get$$1() {
      return new DOMIterator(this.ctx, this.opt.iframes, this.opt.exclude, this.opt.iframesTimeout);
    }
  }]);
  return Mark;
}();

function Mark(ctx) {
  var _this = this;

  var instance = new Mark$1(ctx);
  this.mark = function (sv, opt) {
    instance.mark(sv, opt);
    return _this;
  };
  this.markRegExp = function (sv, opt) {
    instance.markRegExp(sv, opt);
    return _this;
  };
  this.markRanges = function (sv, opt) {
    instance.markRanges(sv, opt);
    return _this;
  };
  this.unmark = function (opt) {
    instance.unmark(opt);
    return _this;
  };
  return this;
}

return Mark;

})));


/***/ }),

/***/ 580:
/***/ (function(module) {

var trim = function(string) {
  return string.replace(/^\s+|\s+$/g, '');
}
  , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  var headersArr = trim(headers).split('\n')

  for (var i = 0; i < headersArr.length; i++) {
    var row = headersArr[i]
    var index = row.indexOf(':')
    , key = trim(row.slice(0, index)).toLowerCase()
    , value = trim(row.slice(index + 1))

    if (typeof(result[key]) === 'undefined') {
      result[key] = value
    } else if (isArray(result[key])) {
      result[key].push(value)
    } else {
      result[key] = [ result[key], value ]
    }
  }

  return result
}


/***/ }),

/***/ 370:
/***/ (function(module) {


module.exports = function(from, to, inclusive){
  var ret = [];
  if (inclusive) to++;

  for (var n = from; n < to; ++n) {
    ret.push(n);
  }

  return ret;
}

/***/ }),

/***/ 698:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var window = __webpack_require__(988)
var isFunction = __webpack_require__(681)
var parseHeaders = __webpack_require__(580)
var xtend = __webpack_require__(999)

module.exports = createXHR
// Allow use of default import syntax in TypeScript
module.exports["default"] = createXHR;
createXHR.XMLHttpRequest = window.XMLHttpRequest || noop
createXHR.XDomainRequest = "withCredentials" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest

forEachArray(["get", "put", "post", "patch", "head", "delete"], function(method) {
    createXHR[method === "delete" ? "del" : method] = function(uri, options, callback) {
        options = initParams(uri, options, callback)
        options.method = method.toUpperCase()
        return _createXHR(options)
    }
})

function forEachArray(array, iterator) {
    for (var i = 0; i < array.length; i++) {
        iterator(array[i])
    }
}

function isEmpty(obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)) return false
    }
    return true
}

function initParams(uri, options, callback) {
    var params = uri

    if (isFunction(options)) {
        callback = options
        if (typeof uri === "string") {
            params = {uri:uri}
        }
    } else {
        params = xtend(options, {uri: uri})
    }

    params.callback = callback
    return params
}

function createXHR(uri, options, callback) {
    options = initParams(uri, options, callback)
    return _createXHR(options)
}

function _createXHR(options) {
    if(typeof options.callback === "undefined"){
        throw new Error("callback argument missing")
    }

    var called = false
    var callback = function cbOnce(err, response, body){
        if(!called){
            called = true
            options.callback(err, response, body)
        }
    }

    function readystatechange() {
        if (xhr.readyState === 4) {
            setTimeout(loadFunc, 0)
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = undefined

        if (xhr.response) {
            body = xhr.response
        } else {
            body = xhr.responseText || getXml(xhr)
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    function errorFunc(evt) {
        clearTimeout(timeoutTimer)
        if(!(evt instanceof Error)){
            evt = new Error("" + (evt || "Unknown XMLHttpRequest Error") )
        }
        evt.statusCode = 0
        return callback(evt, failureResponse)
    }

    // will load the data & process the response in a special response object
    function loadFunc() {
        if (aborted) return
        var status
        clearTimeout(timeoutTimer)
        if(options.useXDR && xhr.status===undefined) {
            //IE8 CORS GET successful response doesn't have a status field, but body is fine
            status = 200
        } else {
            status = (xhr.status === 1223 ? 204 : xhr.status)
        }
        var response = failureResponse
        var err = null

        if (status !== 0){
            response = {
                body: getBody(),
                statusCode: status,
                method: method,
                headers: {},
                url: uri,
                rawRequest: xhr
            }
            if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
                response.headers = parseHeaders(xhr.getAllResponseHeaders())
            }
        } else {
            err = new Error("Internal XMLHttpRequest Error")
        }
        return callback(err, response, response.body)
    }

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new createXHR.XDomainRequest()
        }else{
            xhr = new createXHR.XMLHttpRequest()
        }
    }

    var key
    var aborted
    var uri = xhr.url = options.uri || options.url
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var timeoutTimer
    var failureResponse = {
        body: undefined,
        headers: {},
        statusCode: 0,
        method: method,
        url: uri,
        rawRequest: xhr
    }

    if ("json" in options && options.json !== false) {
        isJson = true
        headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json") //Don't override existing accept header declared by user
        if (method !== "GET" && method !== "HEAD") {
            headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json") //Don't override existing accept header declared by user
            body = JSON.stringify(options.json === true ? body : options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = loadFunc
    xhr.onerror = errorFunc
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    xhr.onabort = function(){
        aborted = true;
    }
    xhr.ontimeout = errorFunc
    xhr.open(method, uri, !sync, options.username, options.password)
    //has to be after open
    if(!sync) {
        xhr.withCredentials = !!options.withCredentials
    }
    // Cannot set timeout with sync request
    // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
    // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
    if (!sync && options.timeout > 0 ) {
        timeoutTimer = setTimeout(function(){
            if (aborted) return
            aborted = true//IE9 may still call readystatechange
            xhr.abort("timeout")
            var e = new Error("XMLHttpRequest timeout")
            e.code = "ETIMEDOUT"
            errorFunc(e)
        }, options.timeout )
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    } else if (options.headers && !isEmpty(options.headers)) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }

    if ("beforeSend" in options &&
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    // Microsoft Edge browser sends "undefined" when send is called with undefined value.
    // XMLHttpRequest spec says to pass null as body to indicate no body
    // See https://github.com/naugtur/xhr/issues/100.
    xhr.send(body || null)

    return xhr


}

function getXml(xhr) {
    // xhr.responseXML will throw Exception "InvalidStateError" or "DOMException"
    // See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseXML.
    try {
        if (xhr.responseType === "document") {
            return xhr.responseXML
        }
        var firefoxBugTakenEffect = xhr.responseXML && xhr.responseXML.documentElement.nodeName === "parsererror"
        if (xhr.responseType === "" && !firefoxBugTakenEffect) {
            return xhr.responseXML
        }
    } catch (e) {}

    return null
}

function noop() {}


/***/ }),

/***/ 999:
/***/ (function(module) {

module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
!function() {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  BreakpointManager: function() { return /* reexport */ createBreakpointManager; },
  Calendar: function() { return /* reexport */ createCalendar; },
  DatePicker: function() { return /* reexport */ createDatePicker; },
  DrillDownNav: function() { return /* reexport */ createDrillDownNav; },
  FileInput: function() { return /* reexport */ createFileInput; },
  Menu: function() { return /* reexport */ createMenu; },
  MobileInput: function() { return /* reexport */ createMobileInput; },
  Modal: function() { return /* reexport */ createModal; },
  MultiSelect: function() { return /* reexport */ createMultiSelect; },
  NumberStepper: function() { return /* reexport */ createNumberStepper; },
  Overlay: function() { return /* reexport */ createOverlay; },
  ProgressBar: function() { return /* reexport */ createProgressBar; },
  RangeBar: function() { return /* reexport */ createRangeBar; },
  Sidebar: function() { return /* reexport */ createSidebar; },
  SidebarNav: function() { return /* reexport */ createSidebarMenu; },
  Spinner: function() { return /* reexport */ createSpinner; },
  StepsWizard: function() { return /* reexport */ createStepsWizard; },
  Sticky: function() { return /* reexport */ sticky; },
  TextareaAutosize: function() { return /* reexport */ textarea_autosize; },
  TimePicker: function() { return /* reexport */ time_picker; },
  Toaster: function() { return /* reexport */ createToaster; },
  Toggle: function() { return /* reexport */ toggle; },
  ToggleSwitch: function() { return /* reexport */ createToggleSwitch; },
  ViewportMonitor: function() { return /* reexport */ viewport_monitor; },
  "default": function() { return /* reexport */ initWave; },
  utils: function() { return /* reexport */ utils_namespaceObject; }
});

// NAMESPACE OBJECT: ./src/utils/index.js
var utils_namespaceObject = {};
__webpack_require__.r(utils_namespaceObject);
__webpack_require__.d(utils_namespaceObject, {
  debounce: function() { return debounce; },
  empty: function() { return empty; },
  featureTests: function() { return featureTests; },
  getScrollbarSize: function() { return getScrollbarSize; },
  hasFeature: function() { return hasFeature; },
  isAndroidStockBrowser: function() { return isAndroidStockBrowser; },
  isMobile: function() { return isMobile; },
  isStyleSupported: function() { return isStyleSupported; },
  loadCss: function() { return loadCss; },
  loadSvg: function() { return loadSvg; },
  raf: function() { return utils_raf; },
  rafThrottle: function() { return rafThrottle; },
  smoothScroll: function() { return smoothScroll; }
});

;// ./src/utils/deep-keys.js
/**
 * Creates an array composed of the own enumerable
 * property names(including nested) of an object
 */

function deepKeys(object, prefix) {
  if (typeof prefix === 'undefined') {
    prefix = [];
  }

  var keys = [];

  for (var k in object) {
    if (!Object.hasOwnProperty.call(object, k)) {
      continue;
    }

    if (typeof object[k] !== 'object') {
      keys.push(prefix.concat([k]));
    }

    if (typeof object[k] === 'object' && object[k] !== null) {
      keys = keys.concat(deepKeys(object[k], prefix.concat([k])));
    }
  }

  return keys;
}

;// ./src/utils/feature-tests.js
/**
 * Input feature detection
 */
function isInputTypeSupported(typeName) {
  var input = document.createElement('input');
  var smile = ':)';

  input.setAttribute('type', typeName);

  var bool = input.type !== 'text';

  if (bool) {
    input.value = smile;
    input.style.cssText = 'position:absolute;visibility:hidden;';

    if (/^(search|tel)$/.test(typeName)) {
      // pass this through as true
    } else if (/^(url|email)$/.test(typeName)) {
      bool = input.checkValidity && input.checkValidity() === false;
    } else {
      // eslint-disable-next-line eqeqeq
      bool = input.value != smile;
    }
  }

  return bool;
}

/* harmony default export */ var feature_tests = ({
  bind: !!function () {}.bind,
  addEventListener: !!window.addEventListener,
  querySelector: !!document.querySelector,
  svg: !!document.implementation.hasFeature(
    'http://www.w3.org/TR/SVG11/feature#Image',
    '1.1'
  ),
  touch: Boolean(
    'ontouchstart' in window ||
    (window.DocumentTouch && document instanceof DocumentTouch) // eslint-disable-line
  ),
  orientationChange: 'onorientationchange' in window,
  history: !!(window.history && window.history.pushState),
  placeholder: !!(
    'placeholder' in document.createElement('input') &&
    'placeholder' in document.createElement('textarea')
  ),
  viewportUnit: (function (el) {
    el.style.width = '100vw';
    var test = el.style.width !== '';
    return !!test;
  })(document.createElement('dummy')),
  inputs: {
    time: isInputTypeSupported('time'),
    date: isInputTypeSupported('date'),
    number: isInputTypeSupported('number'),
    email: isInputTypeSupported('email'),
    tel: isInputTypeSupported('tel'),
    url: isInputTypeSupported('url'),
    search: isInputTypeSupported('search')
  }
});

;// ./src/utils/detect.js
function detect(target, prefixes) {
  var prefixIdx;
  var prefix;
  var testName;
  var scope = this || window;

  prefixes = (prefixes || ['ms', 'o', 'moz', 'webkit']).concat('');

  prefixIdx = prefixes.length;

  while (prefixIdx--) {
    prefix = prefixes[prefixIdx];

    // capitalize first letter so that a test for
    // requestAnimationFrame would result in a search for
    // webkitRequestAnimationFrame
    testName =
      prefix +
      (prefix ? target.charAt(0).toUpperCase() + target.slice(1) : target);

    if (typeof scope[testName] === 'function') {
      return scope[testName];
    }
  }
}

;// ./src/utils/raf.js
/**
 * RequestAnimationFrame polyfill
 */



var requestAnimationFrame = detect('requestAnimationFrame', ['webkit', 'moz']);

var lastTime = 0;

requestAnimationFrame =
  requestAnimationFrame ||
  function (callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function () {
      // eslint-disable-next-line n/no-callback-literal
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

/* harmony default export */ var raf = (requestAnimationFrame);

;// ./src/utils/debounce.js
/**
 * Helper for limiting the rate at which the function can fire
 */

function debounce(fn, wait, isImmediate) {
  var timeout, result;

  return function () {
    var args = arguments;
    var context = this;

    function delayed() {
      if (!isImmediate) {
        result = fn.apply(context, args);
      }

      timeout = null;
    }

    if (timeout) {
      clearTimeout(timeout);
    } else if (isImmediate) {
      result = fn.apply(context, args);
    }

    timeout = setTimeout(delayed, wait);

    return result;
  };
}

;// ./src/utils/empty.js
/**
 * Empty dom elements, arrays and array-like objects
 */

function empty(x) {
  // Arrays
  if (Array.isArray(x)) {
    x.length = 0;
  }

  // HTML Elements
  else if (x instanceof HTMLElement) {
    while (x.firstChild) {
      x.removeChild(x.firstChild);
    }
  }

  // Array-like objects
  else if (typeof x.length === 'number') {
    Array.prototype.splice.call(x, 0, x.length);
  }
}

;// ./src/utils/get-scrollbar-size.js
/**
 * Scrollbar size detection
 */

function getScrollbarSize() {
  var div = document.createElement('div');
  var styles = {
    width: '50px',
    height: '50px',
    overflow: 'scroll',
    position: 'absolute',
    top: '-999px'
  };

  for (var prop in styles) {
    if (Object.prototype.hasOwnProperty.call(styles, prop)) {
      div.style[prop] = styles[prop];
    }
  }

  document.body.appendChild(div);
  var scrollbarSize = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);

  return scrollbarSize;
}

;// ../.yarn/cache/just-safe-get-npm-4.2.0-533ef188bf-15f970991e.zip/node_modules/just-safe-get/index.mjs
var objectSafeGet = get;

/*
  const obj = {a: {aa: {aaa: 2}}, b: 4};

  get(obj, 'a.aa.aaa'); // 2
  get(obj, ['a', 'aa', 'aaa']); // 2

  get(obj, 'b.bb.bbb'); // undefined
  get(obj, ['b', 'bb', 'bbb']); // undefined

  get(obj.a, 'aa.aaa'); // 2
  get(obj.a, ['aa', 'aaa']); // 2

  get(obj.b, 'bb.bbb'); // undefined
  get(obj.b, ['bb', 'bbb']); // undefined

  get(obj.b, 'bb.bbb', 42); // 42
  get(obj.b, ['bb', 'bbb'], 42); // 42

  get(null, 'a'); // undefined
  get(undefined, ['a']); // undefined

  get(null, 'a', 42); // 42
  get(undefined, ['a'], 42); // 42

  const obj = {a: {}};
  const sym = Symbol();
  obj.a[sym] = 4;
  get(obj.a, sym); // 4
*/

function get(obj, propsArg, defaultValue) {
  if (!obj) {
    return defaultValue;
  }
  var props, prop;
  if (Array.isArray(propsArg)) {
    props = propsArg.slice(0);
  }
  if (typeof propsArg == 'string') {
    props = propsArg.split('.');
  }
  if (typeof propsArg == 'symbol') {
    props = [propsArg];
  }
  if (!Array.isArray(props)) {
    throw new Error('props arg must be an array, a string or a symbol');
  }
  while (props.length) {
    prop = props.shift();
    if (!obj) {
      return defaultValue;
    }
    obj = obj[prop];
    if (obj === undefined) {
      return defaultValue;
    }
  }
  return obj;
}



;// ./src/utils/has-feature.js




function hasFeature(feature) {
  return objectSafeGet(feature_tests, feature);
}

;// ./src/utils/is-android-stock-browser.js
function isAndroidStockBrowser() {
  var nua = navigator.userAgent;
  return (
    nua.indexOf('Mozilla/5.0') > -1 &&
    nua.indexOf('Android ') > -1 &&
    nua.indexOf('AppleWebKit') > -1 &&
    !(nua.indexOf('Chrome') > -1)
  );
}

;// ./src/utils/is-mobile.js
/* eslint-disable no-useless-escape */
function isMobile() {
  var check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    ) {
      check = true;
    }
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

;// ./src/utils/is-style-supported.js
/**
 * Detect support for CSS styles and assignable values
 */

var el = window.document.createElement('div');
var prefixes = ['Webkit', 'Moz', 'O', 'ms'];
var camelRe = /-([a-z]|[0-9])/gi;
var cache = {};
var key;
var is_style_supported_length;
var support;
var camel;
var capitalized;
var prefixed;

function isStyleSupported(style, value) {
  value = arguments.length === 2 ? value : 'inherit';

  key = style + ':' + value;
  if (key in cache) {
    return cache[key];
  }
  support = supports(style, value);
  if (!support) {
    camel = toCamelCase(style);
    capitalized = camel.charAt(0).toUpperCase() + camel.slice(1);
    el.style.cssText = style + ':' + value;
    support = camel in el.style && el.style[camel] !== '';
    is_style_supported_length = prefixes.length;
    while (!support && is_style_supported_length--) {
      prefixed = '-' + prefixes[is_style_supported_length].toLowerCase() + '-' + style;
      support = supports(prefixed, value);
      if (!support) {
        camel = prefixes[is_style_supported_length] + capitalized;
        el.style.cssText = prefixed + ':' + value;
        support = camel in el.style && el.style[camel] !== '';
      }
    }
  }

  return (cache[key] = support);
}

/**
 * Convert css notation (hypenated) to DOM notation (camel cased)
 */
function toCamelCase(style) {
  return style.replace(camelRe, function (all, letter) {
    return (letter + '').toUpperCase();
  });
}

/**
 * Encapsulate the different native APIs in a function
 */
function supports(style, value) {
  // Check for the standard native method first
  if ('CSS' in window && 'supports' in window.CSS) {
    return window.CSS.supports(style, value);
  }
  // Check for Opera's native method
  if ('supportsCSS' in window) {
    return window.supportsCSS(style, value);
  }
  return false;
}

;// ./src/utils/load-css.js
/**
 * Load CSS asynchronously
 */

function loadCss(href, options, callback) {
  if (typeof options === 'boolean') {
    options = {
      prepend: options
    };
  }

  options = options || {};

  var link = document.createElement('link');
  var head = document.getElementsByTagName('head')[0];
  var sheets = document.styleSheets;

  link.rel = 'stylesheet';
  link.href = href;
  link.media = 'only x';

  if (options.prepend) {
    head.insertBefore(link, head.childNodes[0]);
  } else {
    head.appendChild(link);
  }

  function toggleMedia() {
    var defined;

    for (var i = 0; i < sheets.length; i++) {
      if (sheets[i].href && ~sheets[i].href.indexOf(href)) {
        defined = true;
      }
    }

    if (defined) {
      link.media = 'all';
      callback && callback();
    } else {
      setTimeout(toggleMedia);
    }
  }

  toggleMedia();

  return link;
}

// EXTERNAL MODULE: ../.yarn/cache/xhr-npm-2.6.0-c4a4d64db8-31f34aba70.zip/node_modules/xhr/index.js
var xhr = __webpack_require__(698);
var xhr_default = /*#__PURE__*/__webpack_require__.n(xhr);
;// ./src/utils/load-svg.js
/**
 * Load SVG over xhr
 */



function loadSvg(options, cb) {
  if (typeof options === 'string') {
    options = { uri: options };
  }

  xhr_default()(options, function (err, resp, body) {
    if (err) {
      return cb(err);
    }

    if (!/^2/.test(resp.statusCode)) {
      return cb(new Error('http status code: ' + resp.statusCode));
    }

    var div = document.createElement('div');
    div.innerHTML = body;

    var svg = div.querySelector('svg');
    if (!svg) {
      return cb(new Error('SVG not present in resource'));
    }

    cb(null, svg);
  });
}

;// ./src/utils/raf-throttle.js
/**
 * Throttle a function by requestAnimationFrame
 */



function rafThrottle(fn) {
  var busy = false;

  return function () {
    if (busy) {
      return;
    }

    busy = true;

    fn.apply(this, arguments);

    raf(function () {
      busy = false;
    });
  };
}

;// ./src/utils/smooth-scroll.js
/**
 * Utility that enables smooth scrolling
 */



var smooth_scroll_document = window.document;
var documentEl = smooth_scroll_document.documentElement;

function smoothScroll(el, destination, duration, callback) {
  var startTop, startLeft, setElementScroll, destinationTop, destinationLeft;

  if (typeof el === 'undefined') {
    throw new Error(
      'Wave.utils.smoothScroll() requires a DOM element or Window object'
    );
  }

  if (el === window) {
    startTop =
      el.pageYOffset || documentEl.scrollTop || smooth_scroll_document.body.scrollTop || 0;
    startLeft =
      el.pageXOffset || documentEl.scrollLeft || smooth_scroll_document.body.scrollLeft || 0;
    setElementScroll = function (element, x, y) {
      el.scrollTo(x, y);
    };
  } else {
    startTop = el.scrollTop || 0;
    startLeft = el.scrollLeft || 0;
    setElementScroll = function (element, x, y) {
      el.scrollLeft = x;
      el.scrollTop = y;
    };
  }

  if (!!callback && typeof callback !== 'function') {
    throw new Error(
      'Wave.utils.smoothScroll(): callback parameter must be a function'
    );
  }

  callback = callback || function () {};

  if (typeof destination === 'number') {
    destinationTop = destination;
    destinationLeft = startLeft;
  } else {
    destinationTop = getFirstNum(destination.top, startTop);
    destinationLeft = getFirstNum(destination.left, startLeft);
  }

  timer(
    function (i) {
      setElementScroll(
        el,
        startLeft * (1 - i) + destinationLeft * i,
        startTop * (1 - i) + destinationTop * i
      );
    },
    getFirstNum(duration, 300),
    callback
  );
}

// AnimationFrame manager
function timer(fn, duration, callback) {
  var start = new Date().getTime();
  var end = start + duration;
  var current = start;
  var lastPercent = 0;

  raf(step);

  function step() {
    current = new Date().getTime();
    lastPercent = (current - start) / duration;

    fn((lastPercent = lastPercent < 1 ? lastPercent : 1));

    if (current > end) {
      // eslint-disable-next-line eqeqeq
      if (lastPercent != 1) {
        raf(function () {
          fn(1);
        });
      } else {
        callback();
      }
    } else {
      raf(step);
    }
  }
}

function getFirstNum() {
  var index = -1;
  var length = arguments.length;

  while (++index < length) {
    if (typeof arguments[index] === 'number') {
      return arguments[index];
    }
  }
}

;// ./src/utils/index.js




var utils_raf = raf.bind(window);
var featureTests = deepKeys(feature_tests).map(function (t) {
  return t.join('.');
});














// EXTERNAL MODULE: ../.yarn/cache/component-classes-npm-1.2.6-fc526f926e-aa70f282b8.zip/node_modules/component-classes/index.js
var component_classes = __webpack_require__(318);
var component_classes_default = /*#__PURE__*/__webpack_require__.n(component_classes);
// EXTERNAL MODULE: ../.yarn/cache/component-event-npm-0.2.1-a101b35adf-bf828d43cb.zip/node_modules/component-event/index.js
var component_event = __webpack_require__(461);
;// ./src/legacy/input-toggles.js



function updateToggleStates(inputEl) {
  var inputName = inputEl.name;
  if (
    !(inputName && document.querySelector('[data-toggle="' + inputName + '"]'))
  ) {
    return; // Only run if toggles exists
  }

  var toggles = Array.prototype.slice.call(
    document.querySelectorAll('[data-toggle="' + inputName + '"]')
  ); // Get toggles
  var inputs = document.querySelectorAll('input[name="' + inputName + '"]'); // Get inputs
  var activeToggles = toggles.filter(function (_toggle, i) {
    try {
      var checked = inputs[i].checked;
    } catch (e) {
      console.error(
        'Entries with data-toggle="' +
          inputs[0].name +
          '" has less entries than input buttons with that name.',
        e.stack
      );
    }
    return checked;
  });

  activeToggles.forEach(function (activeToggle) {
    component_classes_default()(activeToggle).add('is-active');
  });
  toggles
    .filter(function (toggle) {
      return activeToggles.indexOf(toggle) < 0;
    })
    .forEach(function (toggle) {
      component_classes_default()(toggle).remove('is-active');
    });
}

var init = function init() {
  component_event.bind(
    document.documentElement,
    'input',
    function handleInput(e) {
      updateToggleStates(e.target);
    }
  );

  Array.prototype.forEach.call(
    document.querySelectorAll('input:checked'),
    updateToggleStates
  );
};

;// ./src/modules/menu.js



var menu_document = window.document;

function createMenu(el, options) {
  return new Menu(el, options);
}

createMenu.autoInit = true;

function Menu(el, options) {
  if (!el) {
    throw new Error('Wave.Menu() requires a DOM element to initialize');
  }

  this.el = el;
  this.trigger = options.trigger;
  this._handleClickOutside = this._handleClickOutside.bind(this);
  this._handleTriggerClick = this._handleTriggerClick.bind(this);

  if (this.trigger) {
    component_event.bind(this.trigger, 'click', this._handleTriggerClick);
  }
}

Menu.prototype.open = function () {
  var self = this;

  component_classes_default()(this.el).add('is-active');

  setTimeout(function () {
    component_event.bind(
      menu_document.documentElement,
      'click',
      self._handleClickOutside
    );
  }, 0);

  return this;
};

Menu.prototype.close = function () {
  component_event.unbind(
    menu_document.documentElement,
    'click',
    this._handleClickOutside
  );
  component_classes_default()(this.el).remove('is-active');

  return this;
};

Menu.prototype.toggle = function () {
  if (this.isOpen()) {
    this.close();
  } else {
    this.open();
  }

  return this;
};

Menu.prototype.isOpen = function () {
  return component_classes_default()(this.el).has('is-active');
};

Menu.prototype.destroy = function () {
  component_classes_default()(this.el).remove('is-active');

  component_event.unbind(
    menu_document.documentElement,
    'click',
    this._handleClickOutside
  );
  component_event.unbind(this.trigger, 'click', this._handleTriggerClick);
};

Menu.prototype._handleClickOutside = function (e) {
  if (!this.el.contains(e.target) && this.isOpen()) {
    this.close();
  }
};

Menu.prototype._handleTriggerClick = function (e) {
  if (e.target === this.trigger) {
    this.toggle();
  }
};

// EXTERNAL MODULE: ../.yarn/cache/component-delegate-npm-0.2.4-fae163e6fc-2d3ed3d961.zip/node_modules/component-delegate/index.js
var component_delegate = __webpack_require__(837);
// EXTERNAL MODULE: ../.yarn/cache/domify-npm-1.4.2-71a7158f40-1b064d9702.zip/node_modules/domify/index.js
var domify = __webpack_require__(864);
var domify_default = /*#__PURE__*/__webpack_require__.n(domify);
// EXTERNAL MODULE: ../.yarn/cache/emitter-component-npm-1.1.2-51b7876345-d30a241962.zip/node_modules/emitter-component/index.js
var emitter_component = __webpack_require__(642);
var emitter_component_default = /*#__PURE__*/__webpack_require__.n(emitter_component);
// EXTERNAL MODULE: ../.yarn/cache/extend-npm-3.0.2-e1ca07ac54-59e89e2dc7.zip/node_modules/extend/index.js
var extend = __webpack_require__(954);
var extend_default = /*#__PURE__*/__webpack_require__.n(extend);
;// ./src/modules/modal/template.js
/* eslint-disable prettier/prettier */
/* harmony default export */ var template = ([
  '<div class="modal modal--is-hidden">',
    '<div class="modal-inner">',
      '<div class="modal-container">',
        '<div class="modal-content"></div>',
      '</div>',
    '</div>',
  '</div>'
].join(''));

;// ./src/utils/delay.js
/**
 * Delay a function call
 */
function delay(time) {
  time = time || 10;

  return function (fn) {
    var args = arguments;

    setTimeout(function () {
      fn.apply(this, args);
    }, time);
  };
}

;// ./src/utils/inherit-prototype.js
function inheritPrototype(child, parent) {
  var p = Object.create(parent.prototype);
  p.constructor = child;
  child.prototype = p;
  child.super_ = parent;
  return p;
}

;// ./src/utils/once.js
/**
 * Ensure the function is only executed once
 */

function once(func, context) {
  var result;

  return function () {
    if (func) {
      result = func.apply(context || this, arguments);
      func = null;
    }

    return result;
  };
}

;// ./src/utils/which-transition-event.js
var transitions = {
  transition: 'transitionend',
  OTransition: 'oTransitionEnd',
  MozTransition: 'transitionend',
  WebkitTransition: 'webkitTransitionEnd'
};
var memo;

function whichTransitionEvent() {
  if (memo === undefined) {
    var el = document.createElement('fakeelement');

    for (var t in transitions) {
      if (el.style[t] !== undefined) {
        memo = transitions[t];
        return memo;
      }
    }
  }

  return memo;
}

;// ./src/utils/transit-end.js
/**
 * Transitionend event helper
 */






var TRANSITION_END_EVENT = whichTransitionEvent();

function transitEnd(elem, callback) {
  if (isStyleSupported('transition-property')) {
    component_event.bind(elem, TRANSITION_END_EVENT, function transitHandle() {
      component_event.unbind(elem, TRANSITION_END_EVENT, transitHandle);
      callback(elem);
    });
  } else {
    callback(elem);
  }
}

;// ./src/modules/modal/modal.js














var modal_document = window.document;

var hasTouch = hasFeature('touch');
var isBound;

function createModal(options) {
  return new Modal(options);
}

var defaults = {
  preserveDom: false,
  closable: true
};

function Modal(options) {
  this.options = extend_default()(true, {}, defaults, options);

  this._lastFocus = modal_document.activeElement;

  this.body = modal_document.body;
  this.modal = domify_default()(template);

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

  if (
    this.options.modalAction &&
    typeof this.options.modalAction === 'function'
  ) {
    this.options.modalAction = this.options.modalAction.bind(this);
  }

  this._appendOnce = once(this._append, this);

  return this;
}

inheritPrototype(Modal, (emitter_component_default()));

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
      component_event.unbind(this.modal, 'click', this._handleModalClick);
      this._handleModalClick = undefined;
    }
    if (this._handleKeydown) {
      component_event.unbind(modal_document, 'keydown', this._handleKeydown);
      this._handleKeydown = undefined;
    }

    return this;
  }

  /**
   * Close overlay
   */
  if (!this._handleModalClick) {
    component_event.bind(
      this.modal,
      'click',
      (this._handleModalClick = function handleModalClick(e) {
        e.stopImmediatePropagation();

        if (e.target.className !== 'modal-container') {
          return;
        }

        _this.hide({ wasDismissed: true });
      })
    );
  }

  /**
   * Esc
   */
  if (!this._handleKeydown) {
    component_event.bind(
      modal_document,
      'keydown',
      (this._handleKeydown = function handleKeydown(e) {
        if (e.keyCode !== 27 || !_this._shown) {
          return;
        }

        _this.hide({ wasDismissed: true });
      })
    );
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
  component_classes_default()(this.body).add('ofH');

  if (this.options.preserveDom) {
    this.modal.style.display = 'block';
    this._appendOnce();
  } else {
    this._append();
  }

  // Add action for the trigger element click event
  if (this.modalActionTrigger && this.options.modalAction) {
    this._actionClickHandler = component_delegate.bind(
      this.contentHolder,
      '.js-modalAction',
      'click',
      this.options.modalAction
    );
  }

  // Force the layout to be computed
  // eslint-disable-next-line no-unused-expressions
  this.modal.offsetLeft;

  component_classes_default()(this.modal).remove('modal--is-hidden');

  // Account for transitions
  transitEnd(this.modal, function () {
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
      component_event.unbind(modal_document, 'focusin', _this._trapFocus);
      component_event.bind(modal_document, 'focusin', _this._trapFocus);
    }

    if (_this.modalCloseTrigger) {
      _this._closeClickHandler = component_delegate.bind(
        _this.contentHolder,
        '.js-modalClose',
        'click',
        function handleCloseClick(e) {
          e.preventDefault();
          component_delegate.unbind(
            _this.contentHolder,
            'click',
            _this._closeClickHandler
          );
          _this._closeClickHandler = undefined;

          _this.hide({ wasDismissed: true });
        }
      );
    }

    _this._shown = true;
    _this.emit('show');
  });

  // If multiple modals are displayed, focus only the top one
  var lastModalN;
  Array.prototype.forEach.call(
    modal_document.querySelectorAll('.modal'),
    function (modal) {
      modal.removeAttribute('tabindex');
      var n = parseInt(modal.getAttribute('data-modal-n'));
      if (n > lastModalN || lastModalN === undefined) {
        lastModalN = n;
      }
    }
  );
  _this.modal.tabIndex = 0;

  // Set data-modal-n attribute to know the display order of modals
  _this.modal.setAttribute(
    'data-modal-n',
    lastModalN >= 0 ? lastModalN + 1 : 0
  );

  return this;
};

Modal.prototype.hide = function (data) {
  var _this = this;
  var eventData = extend_default()({ wasDismissed: false }, data);

  this._isHiding = true;
  this.emit('hiding');

  component_classes_default()(this.modal).add('modal--is-hidden');

  // delay() wrap
  // fixes https://bugzilla.mozilla.org/show_bug.cgi?id=625289
  delay(25)(function () {
    component_classes_default()(_this.body).remove('ofH');
  });

  if (this.modalCloseTrigger && this._closeClickHandler) {
    component_delegate.unbind(this.contentHolder, 'click', this._closeClickHandler);
  }

  // Account for transitions
  transitEnd(this.modal, function (elem) {
    if (_this.modalActionTrigger && _this._actionClickHandler) {
      component_delegate.unbind(_this.contentHolder, 'click', _this._actionClickHandler);
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
      component_event.unbind(modal_document, 'focusin', _this._trapFocus);

      // Restore focus
      _this._lastFocus && _this._lastFocus.focus();
    }

    _this._shown = false;
    _this._isHiding = false;

    _this.emit('hide', eventData);
  });

  _this.modal.removeAttribute('tabindex');

  var modals = Array.from(modal_document.querySelectorAll('.modal'));

  // Sort modals by display order
  modals.sort(function (a, b) {
    return (
      parseInt(b.getAttribute('data-modal-n')) -
      parseInt(a.getAttribute('data-modal-n'))
    );
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

  return component_delegate.bind(
    modal_document.body,
    '.js-triggerModal',
    'click',
    function (e) {
      e.preventDefault();

      var target = e.delegateTarget.getAttribute('data-target');

      if (!target) return;

      var targetNode = modal_document.querySelector(target);
      var contentClass = targetNode.getAttribute('data-modal-content-class');

      if (targetNode != null) {
        var newModal = new Modal({
          content: targetNode.innerHTML,
          contentClass: contentClass || ''
        });
        newModal.show();
      }
    }
  );
}

;// ./src/modules/overlay/template.js
/* harmony default export */ var overlay_template = ('<div class="overlay overlay--is-hidden"></div>');

;// ./src/modules/overlay/overlay.js









var overlay_document = window.document;
var body = overlay_document.body;

function createOverlay(options) {
  return new Overlay(options);
}

function Overlay(options) {
  emitter_component_default().call(this);

  this.options = options || {};

  this._hidden = true;
  this._closable = this.options.closable;
  this.target = this.options.target || body;
  this.el = domify_default()(overlay_template);

  this._handleClick = this._handleClick.bind(this);
  component_event.bind(this.el, 'click', this._handleClick);

  if (body === this.target) {
    component_classes_default()(this.el).add('overlay--fixed');
  }

  if (this.options.overlayClass) {
    this.el.className += ' ' + this.options.overlayClass;
  }

  if (this.options.zIndex) {
    this.el.style.zIndex = this.options.zIndex;
  }
}

inheritPrototype(Overlay, (emitter_component_default()));

Overlay.prototype.show = function () {
  var _this = this;

  if (this._hidden === false || this._animating) {
    return;
  }

  this._hidden = false;
  this._animating = true;

  this.emit('showing');

  this.target.appendChild(this.el);

  // Force the layout to be computed
  // eslint-disable-next-line no-unused-expressions
  this.el.offsetHeight;

  component_classes_default()(this.el).remove('overlay--is-hidden').add('overlay--is-shown');

  transitEnd(this.el, function () {
    _this._animating = false;
    _this.emit('show');
  });

  return this;
};

Overlay.prototype.hide = function () {
  var _this = this;

  if (this._hidden) {
    return;
  }

  this._hidden = true;
  this._animating = true;

  this.emit('hiding');

  // Force the layout to be computed
  // eslint-disable-next-line no-unused-expressions
  this.el.offsetHeight;

  component_classes_default()(this.el).remove('overlay--is-shown').add('overlay--is-hidden');

  transitEnd(this.el, function () {
    _this._animating = false;
    _this.emit('hide');

    _this.el.parentNode.removeChild(_this.el);
  });

  return this;
};

/**
 * Sets a new target for overlay
 */
Overlay.prototype.setTarget = function (target) {
  this.target = target;
  this.emit('settarget');

  return this;
};

/**
 * When the overlay is clicked, emit an event so that the view that is using this overlay can choose
 * to close it
 */
Overlay.prototype._handleClick = function (e) {
  if (this._closable) {
    this.emit('click', e);
  }
};

Overlay.prototype.getElement = function () {
  return this.el;
};

Overlay.prototype.destroy = function () {
  component_event.unbind(this.el, 'click', this._handleClick);
  this._handleClick = undefined;

  this.el = null;
  this.target = null;
};

;// ./src/utils/matches.js
var proto = window.Element.prototype;
var nativeMatches =
  proto.matches ||
  proto.matchesSelector ||
  proto.webkitMatchesSelector ||
  proto.mozMatchesSelector ||
  proto.msMatchesSelector ||
  proto.oMatchesSelector;

function matches(element, test) {
  // eslint-disable-next-line eqeqeq
  if (element && element.nodeType == 1 && test) {
    // eslint-disable-next-line eqeqeq
    if (typeof test === 'string' || test.nodeType == 1) {
      // eslint-disable-next-line eqeqeq
      return element == test || matchesSelector(element, test);
    } else if ('length' in test) {
      for (var i = 0, item; (item = test[i]); i++) {
        // eslint-disable-next-line eqeqeq
        if (element == item || matchesSelector(element, item)) return true;
      }
    }
  }
  return false;
}

function matchesSelector(element, selector) {
  if (typeof selector !== 'string') return false;
  if (nativeMatches) return nativeMatches.call(element, selector);
  var nodes = element.parentNode.querySelectorAll(selector);
  for (var i = 0, node; (node = nodes[i]); i++) {
    // eslint-disable-next-line eqeqeq
    if (node == element) return true;
  }
  return false;
}

;// ./src/utils/parents.js
function parents(element) {
  var list = [];
  // eslint-disable-next-line eqeqeq
  while (element && element.parentNode && element.parentNode.nodeType == 1) {
    element = element.parentNode;
    list.push(element);
  }
  return list;
}

;// ./src/utils/closest.js



function closest(element, selector, shouldCheckSelf) {
  // eslint-disable-next-line eqeqeq
  if (!(element && element.nodeType == 1 && selector)) return;
  var parentElements = (shouldCheckSelf ? [element] : []).concat(
    parents(element)
  );

  for (var i = 0, parent; (parent = parentElements[i]); i++) {
    if (matches(parent, selector)) return parent;
  }
}

;// ./src/utils/unique.js
function unique(arr) {
  var uniqueArray = [];

  for (var i = 0; i < arr.length; i += 1) {
    if (uniqueArray.indexOf(arr[i]) === -1) {
      uniqueArray.push(arr[i]);
    }
  }

  return uniqueArray;
}

;// ./src/modules/toggle.js












/* harmony default export */ function toggle(sltor, options) {
  return new Toggle(sltor, options);
}

var toggle_defaults = {
  toggleClass: 'is-open'
};

function Toggle(sltor, options) {
  if (!sltor || typeof sltor !== 'string') {
    throw new Error('Wave.Toggle() requires a selector string to initialize');
  }

  this.options = extend_default()(true, {}, toggle_defaults, options);

  this._sltor = sltor;
  this._dataTarget = null;
  this._overlay = null;

  return this;
}

inheritPrototype(Toggle, (emitter_component_default()));

Toggle.prototype.hasClass = function (_self, className) {
  var check = className || this.options.toggleClass;
  var target = closest(_self, this._getDataTarget(_self));

  return component_classes_default()(target).has(check);
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
  var overlayOptions = extend_default()(true, {}, { closable: true }, options);
  var overlay = createOverlay(overlayOptions);

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
    overlay.once(
      'click',
      this._handleOverlayClick.bind(this, _self, className)
    );
  }

  this._toggle(_self, className);

  this.emit('toggle');
  return this;
};

Toggle.prototype.open = function (_self) {
  var target = closest(_self, this._getDataTarget(_self));
  component_classes_default()(target).add(this.options.toggleClass);

  this.emit('open');
  return this;
};

Toggle.prototype.close = function (_self) {
  var target = closest(_self, this._getDataTarget(_self));
  component_classes_default()(target).remove(this.options.toggleClass);

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
    allParents.push.apply(allParents, parents(node));
  });

  unique(allParents).forEach(function (parent) {
    var parentClasses = component_classes_default()(parent);
    if (parentClasses.has(this_.options.toggleClass)) {
      parentClasses.remove(this_.options.toggleClass);
    }
  });

  this.emit('closeAll');
  return this;
};

Toggle.prototype.onClickToggle = function () {
  var _this = this;

  this._onClickToggleHandler = component_delegate.bind(
    document.body,
    this._sltor,
    'click',
    function handleOnClickToggle(e) {
      e.stopPropagation();
      e.preventDefault();

      _this.toggle(e.delegateTarget);
      _this.emit('onClickToggle');
    }
  );

  return this;
};

Toggle.prototype.onClickToggleAll = function () {
  var _this = this;

  this._onClickToggleAllHandler = component_delegate.bind(
    document.body,
    this._sltor,
    'click',
    function handleOnClickToggleAll(e) {
      e.stopPropagation();
      e.preventDefault();

      _this.toggleAll(e.delegateTarget);
      _this.emit('onClickToggleAll');
    }
  );

  return this;
};

Toggle.prototype.offClickCloseAll = function () {
  var _this = this;

  component_event.bind(
    document.documentElement,
    'click',
    (this._handleOffClickCloseAll = function handleOffClickCloseAll(/* e */) {
      _this.closeAll();
      _this.emit('offClickCloseAll');
    })
  );

  return this;
};

Toggle.prototype.destroy = function destroy() {
  // Unbind events
  if (this._onClickToggleHandler) {
    component_delegate.unbind(document.body, 'click', this._onClickToggleHandler);
    this._onClickToggleHandler = undefined;
  }
  if (this._onClickToggleAllHandler) {
    component_delegate.unbind(document.body, 'click', this._onClickToggleAllHandler);
    this._onClickToggleAllHandler = undefined;
  }
  if (this._handleOffClickCloseAll) {
    component_event.unbind(
      document.documentElement,
      'click',
      this._handleOffClickCloseAll
    );
    this._handleOffClickCloseAll = undefined;
  }

  this._sltor = undefined;
  this._dataTarget = null;

  if (this._overlay != null) {
    this._overlay.destroy();
    this._overlay = null;
  }
};

;// ./src/utils/dom-ready.js
/**
 * Execute callback when `DOMContentLoaded` fires for `document`,
 * or immediately if called afterwards
 */

function domReady(handler) {
  if (
    /complete|loaded|interactive/.test(document.readyState) &&
    document.body
  ) {
    handler();
  } else {
    document.addEventListener('DOMContentLoaded', handler, false);
  }
}

;// ./src/utils/stubs.js
var stubs_init = function init() {
  // stub console (console object is not defined in IE9)
  if (!window.console) {
    window.console = {};
    var methods = ['info', 'log', 'warn', 'debug', 'error'];
    for (var i = methods.length - 1; i > -1; i--) {
      window.console[methods[i]] = function () {};
    }
  }
};

;// ./src/init.js









function initWave(options) {
  options = options || {};

  // Cutting the mustard test - check if this web browser has the basic features
  // we need
  if (
    !(
      hasFeature('querySelector') &&
      hasFeature('addEventListener') &&
      Array.prototype.forEach
    )
  ) {
    throw new Error('Browser unsupported. Please try a newer web browser.');
  }

  stubs_init();

  // Polyfill to support modern functionality in IE11
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

  // Append capability specific classes to the root element
  (function (docEl) {
    docEl.className = docEl.className.replace('no-js', '');
    docEl.className += ' has-js';

    if (
      isStyleSupported('display', 'flex') ||
      isStyleSupported('display', '-webkit-flex') ||
      isStyleSupported('display', '-moz-flex') ||
      isStyleSupported('display', '-ms-flex')
    ) {
      docEl.className += ' has-flexbox';
    }
    if (isStyleSupported('animation-name')) {
      docEl.className += ' has-animation';
    }
    if (hasFeature('touch')) {
      docEl.className += ' has-touch';
    }
    if (hasFeature('viewportUnit')) {
      docEl.className += ' has-viewportUnit';
    }
  })(document.documentElement);

  if (options.avoidSideEffects === true) {
    return;
  }

  // Auto-instantiate some behaviours
  domReady(function () {
    listen();

    // Dropdowns
    toggle('.js-triggerDropdown', {
      toggleClass: 'dropdown--is-open'
    })
      .onClickToggleAll()
      .offClickCloseAll();

    // Collabsible panels
    toggle('.js-triggerExpand', {
      toggleClass: 'collapsiblePanel--is-expanded'
    }).onClickToggle();

    // Side drawer
    toggle('.js-toggleSideDrawer', {
      toggleClass: 'sideDrawer--is-open'
    })
      .onClickToggleAll()
      .offClickCloseAll();

    var collapsibleNavs = document.querySelectorAll('.nav--collapse');
    if (createMenu.autoInit && collapsibleNavs.length > 0) {
      for (var i = 0; i < collapsibleNavs.length; i++) {
        var collapsibleNav = collapsibleNavs[i];
        createMenu(collapsibleNav, { trigger: collapsibleNav });
      }
    }

    init();
  });
}

;// ./src/utils/is-in-dom-tree.js
/**
 * Check to see whether a node has been added to the DOM
 */

function isInDOMTree(node) {
  return !!findUltimateAncestor(node).body;
}

function findUltimateAncestor(node) {
  var ancestor = node;
  while (ancestor.parentNode) {
    ancestor = ancestor.parentNode;
  }
  return ancestor;
}

;// ./src/modules/range-bar/base.js


function Base() {}

Base.prototype.unitToPercent = function unitToPercent(value) {
  return 100 * value;
};

Base.prototype.pixelToUnit = function pixelToUnit(value) {
  if (!isInDOMTree(this.el)) {
    throw new Error('element is not in dom!');
  }
  var rect = this.el.getBoundingClientRect();
  var width = rect.width;
  // eslint-disable-next-line eqeqeq
  if (width == 0) {
    throw new Error('element width is 0 or element is not attached to dom');
  }
  return value / width;
};

Base.prototype.unitToUser = function unitToUser(value) {
  return (this.options.max - this.options.min) * value + this.options.min;
};

Base.prototype.userToUnit = function userToUnit(value) {
  return (value - this.options.min) / (this.options.max - this.options.min);
};

Base.prototype.roundUserValue = function roundUserValue(value) {
  return (
    this.options.min +
    Math.floor((value - this.options.min) / this.options.step) *
      this.options.step
  );
};

Base.prototype.getCursor = function getCursor(event) {
  // event is mousemove event
  // returns unitValue of place where the event has been made
  var rect = this.el.getBoundingClientRect();
  var x = event.clientX - rect.left;
  return this.unitToUser(this.pixelToUnit(x));
};

;// ./src/modules/range-bar/label.js
function Label(options) {
  this.el = document.createElement('div');
  this.el.className = 'rangeBar-label';

  if (typeof options.label === 'function') {
    this.el.textContent = options.label.call(this, [options.min, options.max]);
  } else {
    this.el.textContent = options.label;
  }
}

;// ./src/modules/range-bar/mark.js
function Mark(options) {
  this.el = document.createElement('span');
  this.el.className = 'rangeBar-bgMark';
  this.el.style.left = this.getPercentageOffset(options.pos);
}

Mark.prototype.getPercentageOffset = function getPercentageOffset(pos) {
  return pos * 100 + '%';
};

;// ./src/modules/range-bar/range.js




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

  component_event.bind(document, 'mousemove', this._handleMouseMove);
  component_event.bind(this.bar.el, 'mousedown', this._handleMouseDown);
  component_event.bind(document, 'mouseup', this._handleMouseUp);
  this.el.ondragstart = function () {
    return false;
  };

  this.emitter = new (emitter_component_default())();
  this.setValue(options.value);
}

Range.prototype.removeEvents = function removeEvents() {
  component_event.unbind(this.bar.el, 'mousedown', this._handleMouseDown);
  component_event.unbind(document, 'mousemove', this._handleMouseMove);
  component_event.unbind(document, 'mouseup', this._handleMouseUp);
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

    component_classes_default()(document.body).add('with-rangeBar--is-resizing');
  }
  if (event.target === this.leftHandler) {
    this.pressed = true;
    this.pressedMode = 'left';

    component_classes_default()(document.body).add('with-rangeBar--is-resizing');
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
  component_classes_default()(document.body).remove('with-rangeBar--is-resizing');

  if (
    [this.el, this.leftHandler, this.rightHandler].indexOf(event.target) ===
      -1 &&
    !this.pressed
  ) {
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

;// ./src/utils/find.js
var _hasFind = typeof Array.prototype.find === 'function';

function find(array, predicate, context) {
  if (_hasFind) {
    return array.find(predicate, context);
  }

  context = context || this;
  var length = array.length;
  var i;

  if (typeof predicate !== 'function') {
    throw new TypeError(predicate + ' is not a function');
  }

  for (i = 0; i < length; i++) {
    if (predicate.call(context, array[i], i, array)) {
      return array[i];
    }
  }
}

;// ./src/modules/range-bar/bar.js










function identity(value) {
  return value;
}

var DEFAULTS = {
  readonly: false,
  maxRanges: Infinity,
  valueParse: identity,
  valueFormat: identity
};

function Bar(options) {
  Base.call(this);

  this.options = extend_default()(true, {}, DEFAULTS, options);

  this.el = document.createElement('div');

  var elClassName = 'rangeBar-bar';
  if (this.options.barClass != null) {
    elClassName += ' ' + this.options.barClass;
  }
  this.el.className = elClassName;

  this.el.ondragstart = function () {
    return false;
  };

  this.rangeIdCount = 0;
  this.rangeList = [];

  if (this.options.bgMarks != null) {
    for (var i = 0; i < this.options.bgMarks; ++i) {
      this.addMark(i / this.options.bgMarks);
    }
  }

  if (this.options.initialRanges != null) {
    this.setValue(options.initialRanges, /* emitEvents */ false);
  }

  if (this.options.label != null) {
    var label = new Label({
      label: this.options.label,
      min: this.options.min,
      max: this.options.max
    });

    this.el.appendChild(label.el);
  }

  this.emitter = new (emitter_component_default())();
}

inheritPrototype(Bar, Base);

Bar.prototype.getRangeId = function getRangeId() {
  // Just return some unique number
  this.rangeIdCount += 1;
  return this.rangeIdCount;
};

Bar.prototype.proxyRangeEvent = function proxyRangeEvent(eventName, range) {
  var _this = this;

  range.emitter.on(eventName, function () {
    _this.emitter.emit(eventName, {
      data: _this.data(),
      range: range.data()
    });
  });
};

Bar.prototype.add = function add(value, options) {
  var _this = this;

  if (this.rangeList.length >= this.options.maxRanges) {
    return false;
  }

  options = extend_default()(
    {},
    {
      id: this.getRangeId(),
      value,
      readonly: this.options.readonly,
      emitEvents: true
    },
    options,
    {
      bar: this
    }
  );

  var range = new Range(options);
  this.el.appendChild(range.el);

  this.rangeList.push(range);

  var rangeId = range.id;

  ['remove', 'changing', 'change', 'click'].forEach(function (eventName) {
    _this.proxyRangeEvent(eventName, range);
  });

  range.emitter.on('remove', function () {
    _this.remove(rangeId);
  });

  if (options.emitEvents) {
    ['change', 'add'].forEach(function (eventName) {
      _this.emitter.emit(eventName, {
        data: _this.data(),
        range: range.data()
      });
    });
  }

  return range;
};

Bar.prototype.remove = function remove(rangeId) {
  var range = find(this.rangeList, function (range) {
    return range.id === rangeId;
  });
  if (range) {
    range.removeEvents();
    this.el.removeChild(range.el);
    this.rangeList = this.rangeList.filter(function (range) {
      return range.id !== rangeId;
    });
    return true;
  } else {
    return false;
  }
};

Bar.prototype.getInsideRange = function getInsideRange(cursor) {
  for (var i = 0; i < this.rangeList.length; i++) {
    var range = this.rangeList[i];
    if (range.left < cursor && cursor < range.right) {
      return range;
    }
  }

  return false;
};

Bar.prototype.getValue = function getValue() {
  return this.rangeList.map(function (range) {
    return range.getValue();
  });
};

Bar.prototype.setValue = function setValue(ranges, emitEvents) {
  if (ranges == null || !Array.isArray(ranges)) {
    return;
  }

  emitEvents = emitEvents !== false;

  var _this = this;

  if (this.rangeList.length > ranges.length) {
    for (var i = ranges.length - 1, l = this.rangeList.length - 1; i < l; --l) {
      this.remove(l);
    }

    this.rangeList.length = ranges.length;
  }

  ranges.forEach(function (range, i) {
    var rangeValue;
    var rangeColor;
    if (range === Object(range) && !Array.isArray(range)) {
      rangeValue = range.value;
      rangeColor = range.color;
    } else {
      rangeValue = range;
    }

    rangeValue = rangeValue.map(_this.options.valueParse);

    if (_this.rangeList[i] != null) {
      _this.rangeList[i].setValue(rangeValue);
    } else {
      _this.add(rangeValue, {
        emitEvents,
        color: rangeColor
      });
    }
  });
};

Bar.prototype.data = function data() {
  return this.rangeList.map(function (range) {
    return range.data();
  });
};

Bar.prototype.addMark = function addMark(pos) {
  var mark = new Mark({ pos });
  this.el.appendChild(mark.el);
};

Bar.prototype.render = function render() {
  this.rangeList.forEach(function (range) {
    range.render();
  });
};

;// ./src/utils/is-integer.js
/**
 * Check to see whether the value is a number
 */

function isInteger(value) {
  return (
    !isNaN(parseFloat(value)) && isFinite(value) && Math.floor(value) == value // eslint-disable-line eqeqeq
  );
}

;// ./src/modules/range-bar/range-bar.js






function createRangeBar(options) {
  return new RangeBar(options);
}

function RangeBar(options) {
  options = this._transformOptions(options);
  this._validateOptions(options);
  this._bar = new Bar(options);

  this.el = document.createElement('div');
  this.el.className = 'rangeBar';
  this.el.appendChild(this._bar.el);
}

RangeBar.prototype._transformOptions = function _transformOptions(options) {
  if (options.valueParse) {
    ['min', 'max', 'step', 'minSize'].forEach(function (key) {
      if (options[key] !== undefined) {
        options[key] = options.valueParse(options[key]);
      }
    });
  }

  return options;
};

RangeBar.prototype._validateOptions = function _validateOptions(options) {
  ['min', 'max', 'step'].forEach(function (key) {
    var value = options[key];

    if (value === undefined) {
      throw Error('Rangebar: ' + key + ' option is mandatory');
    }
    if (!isInteger(value)) {
      throw Error('Rangebar: ' + key + ' option should be integer');
    }
  });

  if (options.max <= options.min) {
    throw Error('Rangebar: max should be greater than min');
  }
  if ((options.max - options.min) % options.step !== 0) {
    throw Error(
      'Rangebar: there should be an integer number of steps between min and max'
    );
  }
  if (options.minSize === undefined) {
    options.minSize = options.step;
  }
  if (options.minSize % options.step !== 0) {
    throw Error(
      'Rangebar: there should be an integer number of steps in minSize'
    );
  }
  ['maxRanges', 'bgMarks'].forEach(function (key) {
    var value = options[key];

    if (value !== undefined && !isInteger(value)) {
      throw Error('Rangebar: ' + key + ' should be integer');
    }
  });
  if ([true, false, undefined].indexOf(options.readonly) === -1) {
    throw Error('Rangebar: readonly option should be true, false or undefined');
  }
  if (
    options.initialRanges !== undefined &&
    !Array.isArray(options.initialRanges)
  ) {
    throw Error('Rangebar: initialRanges option should be array');
  }
};

RangeBar.prototype._transformValue = function _transformValue(value) {
  if (this._bar.options.valueParse) {
    value = value.map(this._bar.options.valueParse);
  }

  return value;
};

RangeBar.prototype._validateValue = function _validateValue(value) {
  // eslint-disable-next-line eqeqeq
  if (!Array.isArray(value) || value.length != 2) {
    throw Error;
  }
};

RangeBar.prototype.add = function add(value, options) {
  options = extend_default()({}, options);
  value = this._transformValue(value);
  this._validateValue(value);

  if (
    options.id !== undefined &&
    find(this._bar.rangeList, function (range) {
      return range.id === options.id;
    })
  ) {
    throw Error('Rangebar: range with this id already exists');
  }

  if (
    this._bar.getInsideRange(value[0]) ||
    this._bar.getInsideRange(value[1])
  ) {
    throw Error('Rangebar: intersection');
  }

  this._bar.rangeList.forEach(function (range) {
    if (value[0] <= range.left && range.right <= value[1]) {
      throw Error('Rangebar: intersection');
    }
  });

  return this._bar.add(value, options);
};

RangeBar.prototype.remove = function remove(rangeId) {
  if (!isInteger(rangeId)) {
    throw new Error('Rangebar: wrong data');
  }

  return this._bar.remove(rangeId);
};

RangeBar.prototype.removeAll = function removeAll() {
  var _this = this;
  this._bar.rangeList.forEach(function (range) {
    _this._bar.remove(range.id);
  });
};

RangeBar.prototype.rangeValue = function rangeValue(rangeId, value) {
  if (!isInteger(rangeId)) {
    throw Error('Ranngebar: rangeId should be integer');
  }
  var range = find(this._bar.rangeList, function (range) {
    return range.id === rangeId;
  });
  if (!range) {
    return false;
  }
  if (value === undefined) {
    return range.getValue();
  } else {
    return range.setValue(value);
  }
};

RangeBar.prototype.rangeData = function rangeData(rangeId, data) {
  if (!isInteger(rangeId)) {
    throw Error('Rangebar: rangeId should be integer');
  }
  var range = find(this._bar.rangeList, function (range) {
    return range.id === rangeId;
  });
  if (!range) {
    return false;
  }
  return range.data(data);
};

RangeBar.prototype.render = function render() {
  this._bar.render();
};

RangeBar.prototype.val = function val() {
  return this._bar.getValue();
};

RangeBar.prototype.setVal = function setVal(ranges) {
  this._bar.setValue(ranges);
};

RangeBar.prototype.data = function data() {
  return this._bar.data();
};

RangeBar.prototype.on = function on(subject, cb) {
  this._bar.emitter.on(subject, cb);
};

RangeBar.prototype.off = function off(subject, cb) {
  this._bar.emitter.off(subject, cb);
};

;// ./src/modules/spinner/template.js
/* eslint-disable prettier/prettier */
/* harmony default export */ var spinner_template = ([
  '<div class="spinner">',
    '<div class="spinner-dot spinner-dot--first"></div>',
    '<div class="spinner-dot spinner-dot--second"></div>',
    '<div class="spinner-dot spinner-dot--third"></div>',
    '<div class="spinner-dot spinner-dot--fourth"></div>',
  '</div>'
].join(''));

;// ./src/modules/spinner/template-inline.js
/* harmony default export */ var template_inline = ('<span class="inlineSpinner mRs"></span>');

;// ./src/modules/spinner/spinner.js










function createSpinner(el, options) {
  return new Spinner(el, options);
}

var spinner_defaults = {
  color: 'fg-accent--moderate',
  inline: false
};

function Spinner(el, options) {
  if (!el) {
    throw new Error('Wave.Spinner() requires a DOM element to initialize');
  }

  emitter_component_default().call(this);

  this.options = extend_default()(true, {}, spinner_defaults, options);
  this._appended = false;
  this._inline = this.options.inline;
  this.el = el;
}

inheritPrototype(Spinner, (emitter_component_default()));

Spinner.prototype.overlay = function (options) {
  // Prevent appending the overlay if spinner is inline
  if (this._inline) {
    return this;
  }

  var overlayOptions = extend_default()(true, {}, { target: this.el }, options);

  var _this = this;
  var overlay = createOverlay(overlayOptions);

  this.on('show', function () {
    overlay.show();
  });

  this.on('hide', function () {
    overlay.hide();
  });

  overlay.on('click', function () {
    _this.hide();
  });

  this._overlay = overlay;

  return this;
};

Spinner.prototype.show = function () {
  if (!this.el || this._appended) {
    return;
  }

  if (!this._inline) {
    this.spinner = domify_default()(spinner_template);
    component_classes_default()(this.spinner).add(this.options.color);

    if (this.options.position) {
      this.spinner.style.position = this.options.position;
    }

    if (this.options.offset) {
      if (this.options.offset === '50%') {
        component_classes_default()(this.spinner).add('tC').add('lC');
      } else {
        this.spinner.style.top = this.options.offset;
      }
    }

    // Append to overlay if overlay is present
    if (this._overlay) {
      // this.options.color = 'white';
      this.el = this._overlay.getElement();
    }
  } else {
    this.spinner = domify_default()(template_inline);
    component_classes_default()(this.spinner).add(this.options.color);
  }

  if (!this.options.insertionType || this.options.insertionType !== 'prepend') {
    this.el.appendChild(this.spinner);
  } else {
    this.el.insertBefore(this.spinner, this.el.firstChild);
  }

  this._appended = true;

  this.emit('show');

  return this;
};

Spinner.prototype.hide = function () {
  if (this._appended) {
    this.spinner.parentNode.removeChild(this.spinner);
    this._appended = false;
  }

  this.emit('hide');

  return this;
};

/**
 * Returns a boolean specifying if the spinner is shown
 */
Spinner.prototype.isShown = function () {
  return this._appended;
};

;// ./src/modules/progress-bar/template.js
/* eslint-disable prettier/prettier */
/* harmony default export */ var progress_bar_template = ([
  '<div class="progressBar">',
    '<div class="progressBar-indicator js-indicatorBar"></div>',
    '<div class="progressBar-caption js-barCaption fg-neutral--moderate"></div>',
  '</div>'
].join(''));

;// ./src/modules/progress-bar/progress-bar.js










function createProgressBar(el, options) {
  return new ProgressBar(el, options);
}

var progress_bar_defaults = {
  color: 'info--strong',
  htmlCaption: false,
  captionPadding: 20
};

function ProgressBar(el, options) {
  if (!el) {
    throw new Error('Wave.ProgressBar() requires a DOM element to initialize');
  }

  emitter_component_default().call(this);

  this.options = extend_default()(true, {}, progress_bar_defaults, options);
  this.el = el;

  this._progress = 0;
  this._color = this.options.color;
  this._status = null;

  this._render();
}

inheritPrototype(ProgressBar, (emitter_component_default()));

ProgressBar.prototype._hasCaption = false;

ProgressBar.prototype._render = function () {
  this.progressBar = domify_default()(progress_bar_template);

  if (this.options.progressBarClass) {
    this.progressBar.className += ' ' + this.options.progressBarClass;
  }

  this.barCaption = this.progressBar.querySelector('.js-barCaption');

  if (this.options.captionClass) {
    this.barCaption.className += ' ' + this.options.captionClass;
  }

  if (this.options.caption) {
    this._setCaption(this.options.caption);
  }

  this.indicatorBar = this.progressBar.querySelector('.js-indicatorBar');
  component_classes_default()(this.indicatorBar).add('fill-' + this._color);

  this.el.appendChild(this.progressBar);

  this._boundHandleResize = debounce(this._handleResize.bind(this), 100);
  component_event.bind(window, 'resize', this._boundHandleResize);
};

/**
 * Set new progress value
 */
ProgressBar.prototype.setProgress = function (progress) {
  if (
    progress !== undefined &&
    typeof progress === 'number' &&
    progress <= 100 &&
    progress >= 0
  ) {
    // Force the layout to be computed
    // eslint-disable-next-line no-unused-expressions
    this.progressBar.offsetHeight;

    this.indicatorBar.style.width = progress + '%';

    this._progress = progress;
    this._positionCaption();

    this.emit('progress', progress);
  } else {
    throw Error('Progressbar: progress must be a number between 0 and 100');
  }

  return this;
};

/**
 * Set background fill for indicator bar
 */
ProgressBar.prototype.setFill = function (color) {
  if (color !== undefined && typeof color === 'string') {
    component_classes_default()(this.indicatorBar)
      .remove('fill-' + this._color)
      .add('fill-' + color);
    this._color = color;
  } else {
    throw Error('Progressbar: background color must be a string');
  }

  return this;
};

/**
 * Set progress bar's caption
 */
ProgressBar.prototype.setCaption = function (caption) {
  this._setCaption(caption);

  return this;
};

ProgressBar.prototype._setCaption = function (caption) {
  if (this.options.htmlCaption) {
    this.barCaption.innerHTML = caption;
  } else {
    this.barCaption.textContent = caption;
  }
  this._hasCaption = true;
};

ProgressBar.prototype._positionCaption = function () {
  var progressBarWidth = this.progressBar.clientWidth;
  var barCaptionWidth = this.barCaption.clientWidth;
  var left = 0;
  var padding = this.options.captionPadding;
  var offset = (this._progress / 100) * progressBarWidth;

  if (barCaptionWidth + padding < offset) {
    left = offset - barCaptionWidth - padding / 2;
  } else {
    left = offset + padding / 2;
  }

  this.barCaption.style.left = left + 'px';
};

ProgressBar.prototype._handleResize = function () {
  this._hasCaption && this._positionCaption();
};

/**
 * Get current progress
 */
ProgressBar.prototype.getProgress = function () {
  return this._progress;
};

/**
 * Get or set the progress bar's status
 */
ProgressBar.prototype.status = function (status) {
  if (status === undefined) {
    return this._status;
  }

  var progressBarClasses = component_classes_default()(this.progressBar);

  if (this._status != null) {
    progressBarClasses.remove('progressBar--' + this._status);
  }
  if (status != null) {
    progressBarClasses.add('progressBar--' + status);
  }
  this._status = status;

  this.emit('status', status);

  return this;
};

/**
 * Hides progress bar
 */
ProgressBar.prototype.hide = function () {
  component_classes_default()(this.progressBar).add('progressBar--is-hidden');
  return this;
};

/**
 * Shows progress bar
 */
ProgressBar.prototype.show = function () {
  component_classes_default()(this.progressBar).remove('progressBar--is-hidden');
  return this;
};

;// ./src/utils/sanitize-integer.js
/**
 * Sanitize integer
 */

function sanitizeInteger(value, stdValue, options) {
  var num = parseInt(value, 10);
  options = options || {};

  if (isNaN(num) || (options.min && num < options.min)) {
    num = stdValue;
  }

  return num;
}

;// ./src/utils/unwrap.js
/**
 * Unwraps a DOM element.
 */

function unwrap(wrapper) {
  // place childNodes in document fragment
  var docFrag = document.createDocumentFragment();
  while (wrapper.firstChild) {
    var child = wrapper.removeChild(wrapper.firstChild);
    docFrag.appendChild(child);
  }

  // replace wrapper with document fragment
  wrapper.parentNode.replaceChild(docFrag, wrapper);
}

;// ./src/modules/number-stepper.js









var number_stepper_hasTouch = hasFeature('touch');
var number_stepper_document = window.document;

function createNumberStepper(el, options) {
  return new NumberStepper(el, options);
}

var number_stepper_defaults = {
  labels: {
    up: '&#9650;',
    down: '&#9660;'
  },
  delay: 150
};

function NumberStepper(el, options) {
  if (!el || el.nodeName !== 'INPUT') {
    throw new Error(
      'Wave.NumberInput() requires an <input> DOM element to initialize'
    );
  }

  this.options = extend_default()(true, {}, number_stepper_defaults, options);

  this._init(el);
}

NumberStepper.prototype._init = function (el) {
  this.el = el;

  var arrowsTemplate = [
    '<div class="numberStepper-arrows">',
    '<div class="numberStepper-arrow numberStepper-arrow--up"><span class="txtAssistive">' +
      this.options.labels.up +
      '</span></div>',
    '<div class="numberStepper-arrow numberStepper-arrow--down"><span class="txtAssistive">' +
      this.options.labels.down +
      '</span></div>',
    '</div>'
  ].join('\n');

  component_classes_default()(this.el).add('numberStepper-input');

  var containerNode = number_stepper_document.createElement('div');
  containerNode.className =
    'numberStepper' +
    (this.options.stepperClass ? ' ' + this.options.stepperClass : '');

  // Modify DOM
  this.el.parentNode.insertBefore(containerNode, this.el);
  containerNode.appendChild(this.el);

  this.container = containerNode;

  var min = parseFloat(this.el.getAttribute('min'));
  var max = parseFloat(this.el.getAttribute('max'));
  var stepInterval = parseFloat(this.el.getAttribute('step')) || 1;

  this._min = typeof min !== 'undefined' && !isNaN(min) ? min : false;
  this._max = typeof max !== 'undefined' && !isNaN(max) ? max : false;
  this._stepInterval =
    typeof stepInterval !== 'undefined' && !isNaN(stepInterval)
      ? stepInterval
      : 1;

  this._timer = null;
  this._digits = digits(this._stepInterval);

  if (this.el.disabled) {
    component_classes_default()(this.container).add('numberStepper--is-disabled');
  }

  // Bind `this` on event callbacks
  this._handleMouseUp = this._handleMouseUp.bind(this);
  this._handleMouseDown = this._handleMouseDown.bind(this);
  this._handleKeyup = this._handleKeyup.bind(this);

  // Bind events
  this._keyupHandler = component_delegate.bind(
    this.container,
    '.numberStepper-input',
    'keypress',
    this._handleKeyup
  );

  if (!number_stepper_hasTouch) {
    this.el.insertAdjacentHTML('afterend', arrowsTemplate);
    this._mouseDownHandler = component_delegate.bind(
      this.container,
      '.numberStepper-arrow',
      'mousedown',
      this._handleMouseDown
    );
  }

  // Store the numberStepper instance
  this.el.numberStepper = this;

  return this;
};

/**
 * Handle `keypress` event
 */
NumberStepper.prototype._handleKeyup = function (e) {
  if (e.keyCode === 38 || e.keyCode === 40) {
    e.preventDefault();

    this._step(e.keyCode === 38 ? this._stepInterval : -this._stepInterval);
  }
};

/**
 * Handle `mousedown` event
 */
NumberStepper.prototype._handleMouseDown = function (e) {
  var _this = this;

  // Reset the states
  this._handleMouseUp(e);

  if (
    !this.el.disabled &&
    !component_classes_default()(this.container).has('numberStepper--is-disabled')
  ) {
    var change = component_classes_default()(e.target).has('numberStepper-arrow--up')
      ? this._stepInterval
      : -this._stepInterval;

    this._timer = startTimer(
      this._timer,
      sanitizeInteger(this.options.delay, number_stepper_defaults.delay, { min: 0 }),
      function () {
        _this._step(change, false);
      }
    );

    this._step(change);

    component_event.bind(number_stepper_document.body, 'mouseup', this._handleMouseUp);
  }
};

/**
 * Handle `mouseup` event
 */
NumberStepper.prototype._handleMouseUp = function (e) {
  e.preventDefault();
  e.stopPropagation();

  clearTimer(this._timer);

  component_event.unbind(number_stepper_document.body, 'mouseup', this._handleMouseUp);
};

NumberStepper.prototype._step = function (change) {
  var originalValue = parseFloat(this.el.value);
  var value = change;
  var event;

  if (typeof originalValue === 'undefined' || isNaN(originalValue)) {
    if (this._min !== false) {
      value = this._min;
    } else {
      value = 0;
    }
  } else if (this._min !== false && originalValue < this._min) {
    value = this._min;
  } else {
    value += originalValue;
  }

  var exp = Math.pow(10, this._digits);
  var diff =
    Math.round((value - this._min) * exp) %
    Math.round(this._stepInterval * exp);

  if (diff !== 0) {
    value -= diff / exp;
  }

  if (this._min !== false && value < this._min) {
    value = this._min;
  }
  if (this._max !== false && value > this._max) {
    value -= this._stepInterval;
  }

  if (value !== originalValue) {
    value = roundNum(value, this._digits);
    event = number_stepper_document.createEvent('HTMLEvents');
    event.initEvent('change', true, false);

    this.el.value = value;
    this.el.dispatchEvent(event);
  }
};

/**
 * Enables number stepper
 */
NumberStepper.prototype.enable = function () {
  this.el.disabled = false;
  component_classes_default()(this.container).remove('numberStepper--is-disabled');

  return this;
};

/**
 * Disables number stepper
 */
NumberStepper.prototype.disable = function () {
  this.el.disabled = true;
  component_classes_default()(this.container).add('numberStepper--is-disabled');

  return this;
};

/**
 * Removes instance of module
 */
NumberStepper.prototype.destroy = function () {
  // Unbind events
  component_delegate.unbind(this.container, 'keypress', this._keyupHandler);
  component_delegate.unbind(this.container, 'mousedown', this._mouseDownHandler);
  component_event.unbind(number_stepper_document.body, 'mouseup', this._handleMouseUp);

  if (!number_stepper_hasTouch) {
    var arrowsContainer = this.container.querySelector('.numberStepper-arrows');
    arrowsContainer.parentNode.removeChild(arrowsContainer);
  }

  component_classes_default()(this.el).remove('numberStepper-input');
  unwrap(this.container);

  // Remove the numberStepper instance
  this.el.numberStepper = undefined;
};

/**
 * Return significant digit count
 */
function digits(value) {
  var test = String(value);
  if (test.indexOf('.') > -1) {
    return test.length - test.indexOf('.') - 1;
  } else {
    return 0;
  }
}

/**
 * Rounds a number to a sepcific significant digit count
 */
function roundNum(value, digits) {
  var exp = Math.pow(10, digits);
  return Math.round(value * exp) / exp;
}

/**
 * Starts timer
 */
function startTimer(timer, time, callback) {
  clearTimer(timer);
  return setInterval(callback, time);
}

/**
 * Clears timer
 */
function clearTimer(timer) {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

// EXTERNAL MODULE: ../.yarn/cache/component-events-npm-1.0.10-b87bf0d660-24bea39380.zip/node_modules/component-events/index.js
var component_events = __webpack_require__(754);
var component_events_default = /*#__PURE__*/__webpack_require__.n(component_events);
;// ./src/utils/string-interpolate.js
/**
 * Simple string interpolation
 */

function stringInterpolate(str, obj) {
  var keys = str.match(/({.+?})/g);

  keys.forEach(function (v, i) {
    var key = keys[i].replace(/{(.+)}/, '$1');

    if (obj[key]) {
      str = str.replace(keys[i], obj[key]);
    }
  });

  return str;
}

;// ./src/modules/file-input.js







var file_input_document = window.document;

function createFileInput(el, options) {
  return new FileInput(el, options);
}

function FileInput(el, options) {
  if (!el || el.nodeName !== 'INPUT') {
    throw new Error(
      'Wave.FileInput() requires an <input> DOM element to initialize'
    );
  }

  this.options = options || {};

  this._init(el);
}

inheritPrototype(FileInput, (emitter_component_default()));

FileInput.prototype._init = function (el) {
  this.el = el;

  this.container = this.el.parentNode;
  this.labelNode = this.container.children[0];
  this.labelTxt =
    this.options.labelTxt ||
    this.el.getAttribute('data-label') ||
    '{number} files selected';

  this._renderFileInfo();

  this.events = component_events_default()(this.el, this);
  this.events.bind('change', '_handleChange');
  this.events.bind('focus', '_handleFocus');
  this.events.bind('blur', '_handleBlur');

  return this;
};

FileInput.prototype._handleFocus = function () {
  component_classes_default()(this.container).add('fileInput--is-focused');
};

FileInput.prototype._handleBlur = function () {
  component_classes_default()(this.container).remove('fileInput--is-focused');
};

FileInput.prototype._handleChange = function (e) {
  var files = [];
  var input = e.target;

  if (input.files) {
    files = input.files;
  } else {
    var file = this.value;
    if (file) {
      files[0] = {
        // Normalize strings and remove the path
        name: file.replace(/\\/g, '/').split('/').pop()
      };
    }
  }

  if (this.options.onChange && typeof this.options.onChange === 'function') {
    this.options.onChange.call(input, this, files);
  }

  this.emit('changed', files);

  this._updateLabel(files);
};

FileInput.prototype._updateLabel = function (files) {
  var len = files.length;

  if (len !== 0) {
    if (!component_classes_default()(this.labelNode).has('fileInput-label--is-hidden')) {
      component_classes_default()(this.labelNode).add('fileInput-label--is-hidden');
      component_classes_default()(this.fileInfoNode).remove('fileInput-info--is-hidden');
    }

    if (len === 1) {
      this._updateFileInfo(files[0].name);
    } else {
      this._updateFileInfo(stringInterpolate(this.labelTxt, { number: len }));
    }
  } else {
    component_classes_default()(this.fileInfoNode).add('fileInput-info--is-hidden');
    component_classes_default()(this.labelNode).remove('fileInput-label--is-hidden');
  }

  return this;
};

FileInput.prototype._renderFileInfo = function () {
  this.fileInfoNode = file_input_document.createElement('span');
  this.fileInfoNode.className = 'fileInput-info fileInput-info--is-hidden';

  this.container.appendChild(this.fileInfoNode);

  return this;
};

FileInput.prototype._updateFileInfo = function (name) {
  this.fileInfoNode.innerHTML = name;

  return this;
};

/**
 * Enables file input
 */
FileInput.prototype.enable = function () {
  this.el.removeAttribute('disabled');
  component_classes_default()(this.container).remove('fileInput--is-disabled');

  return this;
};

/**
 * Disables file input
 */
FileInput.prototype.disable = function () {
  this.el.setAttribute('disabled', 'disabled');
  component_classes_default()(this.container).add('fileInput--is-disabled');

  return this;
};

FileInput.prototype.destroy = function () {
  this.events.unbind();
  this.container.removeChild(this.fileInfoNode);
  component_classes_default()(this.labelNode).remove('fileInput-label--is-hidden');
};

;// ./src/modules/textarea-autosize.js


/* harmony default export */ function textarea_autosize(el) {
  return new TextareaAutosize(el);
}

function TextareaAutosize(el) {
  if (!el) {
    throw new Error(
      'Wave.TextareaAutosize() requires a DOM element to initialize'
    );
  }

  this._init(el);
}

TextareaAutosize.prototype._init = function (el) {
  this.el = el;

  var height = this.el.offsetHeight;
  var style = window.getComputedStyle(this.el);
  var diff;

  if (style.boxSizing === 'content-box') {
    diff = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
  } else {
    diff =
      parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
  }

  if (isNaN(diff) || this.el.scrollHeight + diff < height) {
    diff = 0;
  }

  this._diff = diff;

  if (containsText(this.el.value)) {
    this.el.style.height = this.el.scrollHeight + 'px';
  }

  // Bind events
  this._boundInputHandler = this._handleInput.bind(this);
  component_event.bind(this.el, 'input', this._boundInputHandler);
};

/**
 * Handle `input` event
 */
TextareaAutosize.prototype._handleInput = function (e) {
  e.target.style.height = '0px';
  e.target.style.height = e.target.scrollHeight + this._diff + 'px';
};

TextareaAutosize.prototype.triggerInput = function () {
  var event = document.createEvent('HTMLEvents');
  event.initEvent('input', true, false);
  this.el.dispatchEvent(event);

  return this;
};

/**
 * Unbind events
 */
TextareaAutosize.prototype.destroy = function () {
  component_event.unbind(this.el, 'input', this._boundInputHandler);
  this._boundInputHandler = undefined;

  return this;
};

function containsText(val) {
  return val.replace(/\s/g, '').length > 0;
}

;// ./src/modules/mobile-input.js





var mobile_input_hasTouch = hasFeature('touch');

function createMobileInput(el, options) {
  return new MobileInput(el, options);
}

function MobileInput(el, options) {
  if (!el || el.nodeName !== 'INPUT') {
    throw new Error(
      'Wave.MobileInput() requires an <input> DOM element to initialize'
    );
  }

  options = options || {};

  this.options = options;

  if (!mobile_input_hasTouch) {
    return;
  }

  if (
    typeof options.type === 'string' &&
    hasFeature('inputs.' + options.type)
  ) {
    this._init(el, options.type);
  }
}

MobileInput.prototype._title = null;
MobileInput.prototype._pattern = null;
MobileInput.prototype._hasFieldHint = false;
MobileInput.prototype._converted = false;

MobileInput.prototype._init = function (el, type) {
  this.el = el;

  if (this.el.hasAttribute('title')) {
    this._title = this.el.getAttribute('title');
    this.el.removeAttribute('title');
  }

  // The pattern attribute works with the url, tel and email input types
  if (!/^(url|tel|email)$/.test(type) && this.el.hasAttribute('pattern')) {
    this._pattern = this.el.getAttribute('pattern');
    this.el.removeAttribute('pattern');
  }

  this._lastType = this.el.type;
  this.el.type = type;

  var fieldLabel = closest(this.el, 'label');
  var fieldHint = fieldLabel && fieldLabel.querySelector('.fieldHint');

  if (/^(date|time)$/.test(type) && fieldHint != null) {
    this._hasFieldHint = true;
    this._fieldHint = fieldHint;
    component_classes_default()(fieldHint).add('is-hidden');
  }

  this._converted = true;

  // Store the MobileInput instance
  this.el.MobileInput = this;

  return this;
};

/**
 * Return boolean whether the input is converted
 */
MobileInput.prototype.isConverted = function () {
  return this._converted;
};

/**
 * Removes instance of module
 */
MobileInput.prototype.destroy = function () {
  if (!mobile_input_hasTouch) {
    return;
  }

  if (this._title) {
    this.el.setAttribute('title', this._title);
  }

  if (this._pattern) {
    this.el.setAttribute('pattern', this._pattern);
  }

  if (this._hasFieldHint) {
    component_classes_default()(this._fieldHint).remove('is-hidden');
  }

  this.el.type = this._lastType;
  this._converted = false;

  // Remove the MobileInput instance
  this.el.MobileInput = undefined;
};

;// ./src/utils/get-element-index.js
/**
 * Get element index in a container
 */

function getElementIndex(element) {
  if (!element) {
    return -1;
  }

  var index = 0;

  while ((element = element.previousElementSibling)) {
    index++;
  }

  return index;
}

;// ./src/utils/trim.js
/**
 * Trims string whitespace.
 */

var _hasTrim = typeof String.prototype.trim === 'function';

function trim(str) {
  if (_hasTrim) {
    return str.trim();
  }

  return str.replace(/^\s*|\s*$/g, '');
}

;// ./src/modules/steps-wizard.js










var steps_wizard_defaults = {
  selectedItem: { step: -1 },
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

  emitter_component_default().call(this);

  this.el = el;

  this.options = extend_default()(true, {}, steps_wizard_defaults, options);

  this._stepsNav = this.el.querySelector('.steps-nav');
  this._stepsLabels = this._stepsNav.querySelectorAll(
    '.steps-label:not(.steps-parent)'
  );
  this._stepsContent = this.el.querySelector('.steps-content');
  this._prevBtn = this.el.querySelector('.steps-button.fL');
  this._prevBtnLabel = this._prevBtn.querySelector('.steps-button-label');
  this._prevBtnIcon = this._prevBtn.querySelector('.pf');
  this._nextBtn = this.el.querySelector('.steps-button.fR');
  this._nextBtnLabel = this._nextBtn.querySelector('.steps-button-label');
  this._nextBtnIcon = this._nextBtn.querySelector('.pf');
  this._initialActiveStepLabel = null;

  this._nextText = trim(this._nextBtnLabel.textContent);
  this._nextIcon = this._nextBtnIcon.className;
  this._prevText = trim(this._prevBtnLabel.textContent);
  this._prevIcon = this._prevBtnIcon.className;

  this._currentStep = this.options.selectedItem.step;
  this._totalSteps = this._stepsLabels.length;
  this._canMoveNext = false;
  this._canMovePrev = false;
  this._states = [];
  this._initialized = false;

  if (this.options.enableOverview) {
    component_event.bind(
      this._stepsNav,
      'click',
      (this._handleStepsNavClick = function (e) {
        component_classes_default()(e.currentTarget).toggle('is-active');
      })
    );
  }

  component_event.bind(
    window,
    'resize',
    (this.handleResize = debounce(this.alignLabels.bind(this), 100))
  );

  this.alignLabels();

  if (this.options.onlyAlignLabels) {
    return;
  }

  // Bind click handlers
  if (this.options.addClickHandlers) {
    component_event.bind(
      this._prevBtn,
      'click',
      (this._handlePrevBtnClick = this.prev.bind(this))
    );
    component_event.bind(
      this._nextBtn,
      'click',
      (this._handleNextBtnClick = this.next.bind(this))
    );
  }

  this._updateStates();

  this.selectedItem(this.options.selectedItem);
}

inheritPrototype(StepsWizard, (emitter_component_default()));

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

  Array.prototype.forEach.call(
    this._stepsNav.querySelectorAll('.steps-label'),
    function (label, i) {
      index = i + 1;

      _this._states.push(
        component_classes_default()(label).has('is-disabled')
          ? { step: index, state: 'disabled' }
          : { step: index, state: 'enabled' }
      );
    }
  );

  return this;
};

StepsWizard.prototype.getStates = function () {
  return this._states;
};

StepsWizard.prototype._getIndexOfClosestEnabledStep = function (
  direction,
  offset
) {
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

StepsWizard.prototype._setCanMove = function (
  stepNum,
  closestNextIndex,
  closestPrevIndex
) {
  closestNextIndex =
    closestNextIndex || this._getIndexOfClosestEnabledStep('next');
  closestPrevIndex =
    closestPrevIndex || this._getIndexOfClosestEnabledStep('previous');

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
    this._prevBtnLabel.textContent = this._isFirst()
      ? cancelText
      : this._prevText;
  }

  // Change button text of last step
  if (submitText) {
    this._nextBtnLabel.textContent = this._isLast()
      ? submitText
      : this._nextText;
  }

  // Change button icon of first step
  if (cancelIconClass) {
    this._prevBtnIcon.className = this._isFirst()
      ? cancelIconClass
      : this._prevIcon;
  }

  // Change button text of last step
  if (submitIconClass) {
    this._nextBtnIcon.className = this._isLast()
      ? submitIconClass
      : this._nextIcon;
  }

  // Check if there are any enabled next or previous steps and update the nav buttons state accordingly
  this._updateButtonsState();

  // Reset active class for steps labels
  var activeStepLabels = this._stepsNav.querySelectorAll(
    '.steps-label--is-active'
  );
  Array.prototype.forEach.call(activeStepLabels, function (label) {
    component_classes_default()(label).remove('steps-label--is-active');
  });
  currentStep = this._stepsLabels[this._currentStep - 1];
  // Set active class for current step label
  component_classes_default()(currentStep).add('steps-label--is-active');

  target = currentStep.getAttribute('data-step');

  // Set active class for target step
  activePanel = this._stepsContent.querySelector('.steps-panel.is-active');
  if (activePanel != null) {
    component_classes_default()(activePanel).remove('is-active');
  }

  targetPanel = this._stepsContent.querySelector(
    '.steps-panel[data-step="' + target + '"]'
  );
  component_classes_default()(targetPanel).add('is-active');

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

    this._currentStep -=
      this._currentStep - this._getIndexOfClosestEnabledStep('previous');
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

    this._currentStep +=
      this._getIndexOfClosestEnabledStep('next') - this._currentStep;
    this._show();

    this._nextBtn.blur();
  } else if (this._currentStep === this._totalSteps) {
    this.emit('finish');
  }
};

StepsWizard.prototype.enable = function (stepNum) {
  var index = stepNum - 1; // index is 0-based

  component_classes_default()(this._stepsLabels[index]).remove('is-disabled');
  this._states[index].state = 'enabled';
  this._updateButtonsState();

  return this;
};

StepsWizard.prototype.disable = function (stepNum) {
  var index = stepNum - 1; // index is 0-based

  if (this._currentStep === stepNum) {
    return this;
  }

  component_classes_default()(this._stepsLabels[index]).add('is-disabled');
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
      activeStepLabel = this._initialActiveStepLabel =
        this._stepsNav.querySelector('.steps-label--is-active');
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
  component_event.unbind(window, 'resize', this.handleResize);
  if (this._handleStepsNavClick) {
    component_event.unbind(this._stepsNav, 'click', this._handleStepsNavClick);
  }
  if (this._handlePrevBtnClick) {
    component_event.unbind(this._prevBtn, 'click', this._handlePrevBtnClick);
  }
  if (this._handleNextBtnClick) {
    component_event.unbind(this._nextBtn, 'click', this._handleNextBtnClick);
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

  component_classes_default()(this._stepsNav).remove('is-active');
  var labels = this._stepsNav.querySelectorAll('.steps-label');
  Array.prototype.forEach.call(labels, function (label) {
    component_classes_default()(label).remove('steps-label--is-active').remove('is-collapsed');
  });
  if (this._initialActiveStepLabel != null) {
    component_classes_default()(this._initialActiveStepLabel).add('steps-label--is-active');
  }

  var activePanel = this._stepsContent.querySelector('.steps-panel.is-active');
  if (activePanel != null) {
    component_classes_default()(activePanel).remove('is-active');
  }
};

StepsWizard.prototype.alignLabels = function () {
  var minLeft = this._prevBtn ? this._prevBtn.getBoundingClientRect().right : 0;
  var maxRight = this._nextBtn
    ? this._nextBtn.getBoundingClientRect().left
    : window.innerWidth;

  var labels = this._stepsNav.querySelectorAll('.steps-label');
  Array.prototype.forEach.call(labels, function (label) {
    component_classes_default()(label).remove('is-collapsed');
  });
  var label0 = labels[0];
  var labelN = labels[labels.length - 1];
  var active = getElementIndex(
    this._stepsNav.querySelector('.steps-label--is-active')
  );
  var ii = 0;

  if (
    (label0 && label0.getBoundingClientRect().left < minLeft) ||
    (labelN && labelN.getBoundingClientRect().right > maxRight)
  ) {
    if (active < labels.length / 2) {
      // Active step is before half way - hide from end if not room for all
      // Hide from end and stop at next step (not including - closest siblings should be shown)
      for (ii = labels.length - 1; ii > active + 2; ii--) {
        if (
          label0.getBoundingClientRect().left < minLeft ||
          labelN.getBoundingClientRect().right > maxRight
        ) {
          component_classes_default()(labels[ii]).add('is-collapsed');
        }
      }
      // Hide from start in case still not enough room
      if (
        label0.getBoundingClientRect().left < minLeft ||
        labelN.getBoundingClientRect().right > maxRight
      ) {
        for (ii = 0; ii < active - 1; ii++) {
          if (
            label0.getBoundingClientRect().left < minLeft ||
            labelN.getBoundingClientRect().right > maxRight
          ) {
            component_classes_default()(labels[ii]).add('is-collapsed');
          }
        }
      }
    } else {
      // Active step is past half way - hide from start if not room for all
      // Hide from start and stop at previous step (not including - closest siblings should be shown)
      for (ii = 0; ii < active - 2; ii++) {
        if (
          label0.getBoundingClientRect().left < minLeft ||
          labelN.getBoundingClientRect().right > maxRight
        ) {
          component_classes_default()(labels[ii]).add('is-collapsed');
        }
      }
      // Hide from end in case still not enough room
      if (
        label0.getBoundingClientRect().left < minLeft ||
        labelN.getBoundingClientRect().right > maxRight
      ) {
        for (ii = labels.length - 1; ii > active + 1; ii--) {
          if (
            label0.getBoundingClientRect().left < minLeft ||
            labelN.getBoundingClientRect().right > maxRight
          ) {
            component_classes_default()(labels[ii]).add('is-collapsed');
          }
        }
      }
    }
  }
};

;// ./src/modules/breakpoint-manager.js









var breakpoint_manager_document = window.document;
var head = breakpoint_manager_document.head;
var debounceTime;

function createBreakpointManager(options) {
  return new BreakpointManager(options);
}

function BreakpointManager(options) {
  emitter_component_default().call(this);

  this.options = options || {};

  debounceTime = this.options.debounceTime || 100;

  this._isReady = false;
  this._isStarted = false;
  this._changeEventName = hasFeature('orientationChange')
    ? 'orientationchange'
    : 'resize';

  domReady(this._handleDomReady.bind(this));
}

inheritPrototype(BreakpointManager, (emitter_component_default()));

BreakpointManager.prototype.currentBP = null;

/**
 * Start listening to window#resize
 */
BreakpointManager.prototype.start = function () {
  this._isStarted = true;
  this._boundChange = debounce(this._change.bind(this), debounceTime);
  component_event.bind(window, this._changeEventName, this._boundChange);

  return this;
};

/**
 * Stop listening to window#resize
 */
BreakpointManager.prototype.stop = function () {
  this._isStarted = false;

  if (this._boundChange) {
    component_event.unbind(window, this._changeEventName, this._boundChange);
  }

  return this;
};

/**
 * Fetch all breakpoints
 */
BreakpointManager.prototype.getAll = function () {
  var BPs = [];
  var allBP = parseMQ(breakpoint_manager_document.querySelector('title')).split(',');

  for (var i = 0; i < allBP.length; i++) {
    BPs.push(trim(allBP[i]));
  }

  return this._isReady ? BPs : null;
};

/**
 * Fetch the breakpoint in use
 */
BreakpointManager.prototype.getCurrent = function (callback) {
  var nowBP = parseMQ(head);

  return this._isReady
    ? typeof callback === 'undefined'
      ? nowBP
      : callback(nowBP)
    : null;
};

/**
 * Fire events whenever the breakpoint changes
 */
BreakpointManager.prototype._change = function () {
  var _this = this;

  this.getCurrent(function (bp) {
    if (bp !== _this.currentBP) {
      _this.emit(bp);
      _this.emit('change', bp);
      _this.currentBP = bp;
    }
  });
};

BreakpointManager.prototype._handleDomReady = function () {
  this._isReady =
    window.getComputedStyle(head, null).getPropertyValue('clear') !== 'none';
  this._isStarted && this._change();
};

function parseMQ(el) {
  var str = window.getComputedStyle(el, null).getPropertyValue('font-family');
  return str.replace(/"/g, '').replace(/'/g, '');
}

;// ./src/modules/viewport-monitor.js





var viewport_monitor_document = window.document;
var viewport_monitor_documentEl = viewport_monitor_document.documentElement;
var matchMedia = window.matchMedia || window.msMatchMedia;
var isResized = false;
var isScrolled = false;
var instance = null;

/* harmony default export */ function viewport_monitor() {
  return new ViewportMonitor();
}

function ViewportMonitor() {
  // Singleton
  if (!instance) {
    instance = this;

    this._init();
  }

  return instance;
}

inheritPrototype(ViewportMonitor, (emitter_component_default()));

ViewportMonitor.prototype._init = function () {
  var self = this;

  window.addEventListener(
    'resize',
    function () {
      isResized = true;
    },
    false
  );

  window.addEventListener(
    'scroll',
    function () {
      isScrolled = true;
    },
    false
  );

  this._lastOffset = getScrollY();
  this.refresh();

  // call update() only once per frame to improve performance
  (function loop() {
    raf(loop);
    update.call(self);
  })();

  return this;
};

ViewportMonitor.prototype._calcDimensions = function () {
  this.height = getHeight();
  this.width = getWidth();

  return this;
};

ViewportMonitor.prototype._calcScroll = function () {
  this.scrollY = getScrollY();
  this.scrollX = getScrollX();

  return this;
};

ViewportMonitor.prototype._calcScrollDirection = function () {
  var offset = this.scrollY;
  var diff = offset - this._lastOffset;
  var direction = Math.abs(diff) / diff;

  this._lastOffset = offset;

  // eslint-disable-next-line eqeqeq
  if (!isNaN(direction) && direction != this.scrollDirection) {
    this.scrollDirection = direction;
  }

  return this;
};

ViewportMonitor.prototype._calcOffset = function () {
  this.top = this.scrollY;
  this.right = this.scrollX + this.width;
  this.bottom = this.scrollY + this.height;
  this.left = this.scrollX;

  return this;
};

ViewportMonitor.prototype._calcOrientation = function () {
  var screenOrientation =
    window.screen.orientation ||
    window.screen.mozOrientation ||
    window.screen.msOrientation ||
    undefined;
  var orientation;

  if (screenOrientation) {
    orientation =
      typeof screenOrientation === 'string'
        ? screenOrientation.split('-')[0]
        : screenOrientation.type.split('-')[0];
  } else if (matchMedia) {
    orientation = matchMedia('(orientation: portrait)').matches
      ? 'portrait'
      : 'landscape';
  } else {
    orientation = this.height >= this.width ? 'portrait' : 'landscape';
  }

  this.orientation = orientation;

  return this;
};

/**
 * Determines if scroll position is at maximum for the document
 */
ViewportMonitor.prototype.isScrollMax = function () {
  return this.height + this.scrollY >= viewport_monitor_document.body.scrollHeight;
};

/**
 * Determines if scroll position is at minimum for the document
 */
ViewportMonitor.prototype.isScrollMin = function () {
  return this.scrollY <= 0;
};

/**
 * Determines if a given element is in the viewport
 * `verge` acts as a cushion around the viewport
 */
ViewportMonitor.prototype.isInViewport = function (el, verge) {
  if (typeof el === 'undefined') {
    throw new Error(
      'Wave.ViewportMonitor.isInViewport() requires a DOM element'
    );
  }

  var rect = calibrate(el.getBoundingClientRect(), verge);

  return (
    rect.bottom >= 0 &&
    rect.right >= 0 &&
    rect.top <= this.height &&
    rect.left <= this.width
  );
};

/**
 * Determines if a given element is in the same x-axis section as the viewport
 */
ViewportMonitor.prototype.isInY = function (el, verge) {
  if (typeof el === 'undefined') {
    throw new Error('Wave.ViewportMonitor.isInY() requires a DOM element');
  }

  var rect = calibrate(el.getBoundingClientRect(), verge);

  return rect.bottom >= 0 && rect.top <= this.height;
};

/**
 * Determines if a given element is in the same y-axis section as the viewport
 */
ViewportMonitor.prototype.isInX = function (el, verge) {
  if (typeof el === 'undefined') {
    throw new Error('Wave.ViewportMonitor.isInX() requires a DOM element');
  }

  var rect = calibrate(el.getBoundingClientRect(), verge);

  return rect.right >= 0 && rect.left <= this.width;
};

/**
 * Determines if a media query is active
 */
ViewportMonitor.prototype.mq = matchMedia
  ? function (query) {
      return !!matchMedia.call(window, query).matches;
    }
  : function () {
      return false;
    };

/**
 * Update the viewport dimensions, positions and orientation
 */
ViewportMonitor.prototype.refresh = function () {
  this._calcDimensions();
  this._calcScroll();
  this._calcScrollDirection();
  this._calcOffset();
  this._calcOrientation();

  return this;
};

function update() {
  if (!isResized && !isScrolled) {
    return;
  }

  var evt = isResized ? 'resize' : 'scroll';

  this.refresh();

  isResized = false;
  isScrolled = false;

  this.emit(evt);
}

function getHeight() {
  return Math.max(viewport_monitor_documentEl.clientHeight, window.innerHeight || 0);
}

function getWidth() {
  return Math.max(viewport_monitor_documentEl.clientWidth, window.innerWidth || 0);
}

function getScrollY() {
  var scrollY = window.pageYOffset;

  if (typeof scrollY === 'number') {
    return scrollY;
  }

  return viewport_monitor_documentEl.scrollTop;
}

function getScrollX() {
  var scrollX = window.pageXOffset;

  if (typeof scrollX === 'number') {
    return scrollX;
  }

  return viewport_monitor_documentEl.scrollLeft;
}

function calibrate(coords, verge) {
  var o = {};

  verge = typeof verge === 'number' ? verge || 0 : 0;

  o.width = (o.right = coords.right + verge) - (o.left = coords.left - verge);
  o.height = (o.bottom = coords.bottom + verge) - (o.top = coords.top - verge);

  return o;
}

// EXTERNAL MODULE: ../.yarn/cache/in-groups-of-npm-0.0.1-b22cb4fe38-c16f9bbba6.zip/node_modules/in-groups-of/index.js
var in_groups_of = __webpack_require__(724);
var in_groups_of_default = /*#__PURE__*/__webpack_require__.n(in_groups_of);
// EXTERNAL MODULE: ../.yarn/cache/range-component-npm-1.0.0-abb702833e-3b722a9f8b.zip/node_modules/range-component/index.js
var range_component = __webpack_require__(370);
var range_component_default = /*#__PURE__*/__webpack_require__.n(range_component);
;// ../.yarn/cache/just-clone-npm-6.2.0-0ebdb2bfbe-36f9c208eb.zip/node_modules/just-clone/index.mjs
var collectionClone = clone;

/*
  Deep clones all properties except functions

  var arr = [1, 2, 3];
  var subObj = {aa: 1};
  var obj = {a: 3, b: 5, c: arr, d: subObj};
  var objClone = clone(obj);
  arr.push(4);
  subObj.bb = 2;
  obj; // {a: 3, b: 5, c: [1, 2, 3, 4], d: {aa: 1}}
  objClone; // {a: 3, b: 5, c: [1, 2, 3], d: {aa: 1, bb: 2}}
*/

function clone(obj) {
  let result = obj;
  var type = {}.toString.call(obj).slice(8, -1);
  if (type == 'Set') {
    return new Set([...obj].map(value => clone(value)));
  }
  if (type == 'Map') {
    return new Map([...obj].map(kv => [clone(kv[0]), clone(kv[1])]));
  }
  if (type == 'Date') {
    return new Date(obj.getTime());
  }
  if (type == 'RegExp') {
    return RegExp(obj.source, getRegExpFlags(obj));
  }
  if (type == 'Array' || type == 'Object') {
    result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
      // include prototype properties
      result[key] = clone(obj[key]);
    }
  }
  // primitives and non-supported objects (e.g. functions) land here
  return result;
}

function getRegExpFlags(regExp) {
  if (typeof regExp.source.flags == 'string') {
    return regExp.source.flags;
  } else {
    var flags = [];
    regExp.global && flags.push('g');
    regExp.ignoreCase && flags.push('i');
    regExp.multiline && flags.push('m');
    regExp.sticky && flags.push('y');
    regExp.unicode && flags.push('u');
    return flags.join('');
  }
}



;// ./src/utils/bounds.js
/**
 * Checking if value is inside or outside of bounds
 */



function Bounds(obj) {
  if (obj) return mixin(obj);
}

function calculateReversed(self) {
  return self._min && self._max && self.before(self._max);
}

function mixin(obj) {
  for (var key in Bounds.prototype) {
    obj[key] = Bounds.prototype[key];
  }
  return obj;
}

Bounds.prototype.compare = function (fn) {
  this._compare = fn;
  return this;
};

Bounds.prototype.distance = function (fn) {
  this._distance = fn;
  return this;
};

Bounds.prototype.min = function (v) {
  if (!arguments.length) {
    return this._min;
  }
  this._min = v;
  delete this._reversed;
  return this;
};

Bounds.prototype.max = function (v) {
  if (!arguments.length) {
    return this._max;
  }
  this._max = v;
  delete this._reversed;
  return this;
};

Bounds.prototype.before = function (v) {
  return this._min && this._compare(v, this._min) < 0;
};

Bounds.prototype.after = function (v) {
  return this._max && this._compare(v, this._max) > 0;
};

Bounds.prototype.out = function (v) {
  return this.before(v) || this.after(v);
};

Bounds.prototype.in = function (v) {
  return !this.out(v);
};

Bounds.prototype.valid = function (v) {
  if (this.reversed()) {
    return !this.after(v) || !this.before(v);
  }
  return this.in(v);
};

Bounds.prototype.invalid = function (v) {
  return !this.valid(v);
};

Bounds.prototype.reversed = function () {
  if (this._reversed === undefined) {
    this._reversed = calculateReversed(this);
  }
  return this._reversed;
};

Bounds.prototype.restrict = function (v) {
  if (this.reversed()) {
    if (this.after(v) && this.before(v)) {
      // select closer bound
      return this._distance(this._max, v) < this._distance(v, this._min)
        ? collectionClone(this._max)
        : collectionClone(this._min);
    }
    return v;
  }
  if (this.before(v)) {
    return collectionClone(this._min);
  }
  if (this.after(v)) {
    return collectionClone(this._max);
  }
  return v;
};

;// ./src/modules/calendar/lib/day-range.js


function date(d) {
  return Object.prototype.toString.call(d) === '[object Date]'
    ? d
    : new Date(d[0], d[1], d[2]);
}

function DayRange(min, max) {
  return this.min(min).max(max);
}

Bounds(DayRange.prototype);

DayRange.prototype._compare = function (a, b) {
  return date(a).getTime() - date(b).getTime();
};

DayRange.prototype._distance = function (a, b) {
  return Math.abs(this.compare(a, b));
};

;// ./src/modules/calendar/lib/template.js
/* eslint-disable prettier/prettier */
/* harmony default export */ var lib_template = ([
  '<table class="calendar-table">',
    '<thead>',
      '<tr>',
        '<td class="calendar-prev">',
          '<a class="btn btn--outline btn--icon" href="#">',
            '<span class="svgIcon svgIcon--stroked"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m16 20-8-8 8-8" /></svg></span>',
            '<span class="txtAssistive">&#8592;</span>',
          '</a>',
        '</td>',
        '<td colspan="5" class="calendar-title"><span class="calendar-month"></span> <span class="calendar-year"></span></td>',
        '<td class="calendar-next">',
          '<a class="btn btn--outline btn--icon" href="#">',
            '<span class="svgIcon svgIcon--stroked"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m8 20 8-8-8-8" /></svg></span>',
            '<span class="txtAssistive">&#8594;</span>',
          '</a>',
        '</td>',
      '</tr>',
    '</thead>',
    '<tbody></tbody>',
  '</table>'
].join(''));

;// ./src/modules/calendar/lib/utils.js
/**
 * Clamp `month`
 */
function clamp(month) {
  if (month > 11) {
    return 0;
  }
  if (month < 0) {
    return 11;
  }

  return month;
}

;// ./src/modules/calendar/lib/days.js













/**
 * Get days in `month` for `year`
 */
function daysInMonth(month, year) {
  return [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ][month];
}

/**
 * Check if `year` is a leap year
 */
function isLeapYear(year) {
  // eslint-disable-next-line eqeqeq
  return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0) || year == 0;
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
  emitter_component_default().call(this);
  var self = this;
  this.config = config;
  this.el = domify_default()(lib_template);
  component_classes_default()(this.el).add('calendar-days');
  this.head = this.el.tHead;
  this.body = this.el.tBodies[0];
  this.title = this.head.querySelector('.calendar-title');
  this.select(new Date());
  this.validRange = new DayRange();

  if (this.config.firstDay > 0) {
    this.config.i18n.days = toEnd(
      this.config.i18n.days,
      0,
      this.config.firstDay
    );
  }

  // emit "day"
  component_event.bind(this.body, 'click', function (e) {
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
  component_event.bind(
    this.el.querySelector('.calendar-prev'),
    'click',
    function (ev) {
      ev.preventDefault();

      self.emit('prev');
      return false;
    }
  );

  // emit "next"
  component_event.bind(
    this.el.querySelector('.calendar-next'),
    'click',
    function (ev) {
      ev.preventDefault();

      self.emit('next');
      return false;
    }
  );
}

inheritPrototype(Days, (emitter_component_default()));

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
  empty(this.body);
  this.body.appendChild(this._renderDays(date));
};

/**
 * Enable a year dropdown
 */
Days.prototype.yearMenu = function (from, to) {
  this.selectYear = true;
  this.title.querySelector('.calendar-year').innerHTML = yearDropdown(from, to);
  var self = this;
  component_event.bind(
    this.title.querySelector('.calendar-year .calendar-select'),
    'change',
    function () {
      self.emit('year');
      return false;
    }
  );
};

/**
 * Enable a month dropdown
 */
Days.prototype.monthMenu = function () {
  this.selectMonth = true;
  this.title.querySelector('.calendar-month').innerHTML =
    monthDropdown.call(this);
  var self = this;
  component_event.bind(
    this.title.querySelector('.calendar-month .calendar-select'),
    'change',
    function () {
      self.emit('month');
      return false;
    }
  );
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
  var rows =
    '<tr class=calendar-subheading>' +
    this.config.i18n.days
      .map(function (day) {
        return (
          '<th><abbr title=' + day + '>' + day.slice(0, len) + '</abbr></th>'
        );
      })
      .join('') +
    '</tr>';
  return domify_default()(rows);
};

/**
 * Render days for `date`
 */
Days.prototype._renderDays = function (date) {
  var rows = this._rowsFor(date);
  var html = rows
    .map(function (row) {
      return '<tr>' + row.join('') + '</tr>';
    })
    .join('\n');

  return domify_default()(html);
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
    var select =
      day == selectedDay && month == selectedMonth && year == selectedYear; // eslint-disable-line eqeqeq
    cells.push(
      renderDay([year, month, day], this.validRange, select, 'calendar-day')
    );
  }

  // after cells
  cells = cells.concat(cellsAfter(after, month, year, this.validRange));

  return in_groups_of_default()(cells, 7);
};

/**
 * Update view title or select input for `year`
 */
Days.prototype._showSelectedYear = function (year) {
  if (this.selectYear) {
    this.title.querySelector(
      '.calendar-year .calendar-label'
    ).firstChild.textContent = year;
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
    this.title.querySelector(
      '.calendar-month .calendar-label'
    ).firstChild.textContent = this.config.i18n.months[month];
    this.title.querySelector('.calendar-month .calendar-select').value = month;
  } else {
    this.title.querySelector('.calendar-month').innerHTML =
      this.config.i18n.months[month];
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
  var prev = clamp(month - 1);
  var before = daysInMonth(prev, year);
  while (n--) {
    cells.push(
      renderDay(
        [year, prev, before--],
        validRange,
        false,
        'calendar-day calendar-day--prev'
      )
    );
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
  var next = clamp(month + 1);
  while (n--) {
    cells.push(
      renderDay(
        [year, next, ++day],
        validRange,
        false,
        'calendar-day calendar-day--next'
      )
    );
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
  var years = range_component_default()(from, to, 'inclusive');
  var options = years.map(yearOption).join('');
  return [
    '<span class="calendar-label btn btn--ghost">',
    '<select class="calendar-select">' + options + '</select>',
    '</span>'
  ].join('\n');
}

/**
 * Month dropdown template
 */
function monthDropdown() {
  var options = this.config.i18n.months.map(monthOption).join('');

  return [
    '<span class="calendar-label btn btn--ghost">',
    '<select class="calendar-select">' + options + '</select>',
    '</span>'
  ].join('\n');
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

;// ./src/modules/calendar/lib/calendar.js
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
  emitter_component_default().call(this);

  var self = this;

  this.options = options
    ? extend_default()(true, {}, this.constructor.defaults, options)
    : this.constructor.defaults;
  this.el = domify_default()('<div class=calendar></div>');
  this.days = new Days(this.options);
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
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    days: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]
  },
  firstDay: 1, // Monday
  date: null
};

inheritPrototype(Calendar, (emitter_component_default()));

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

// EXTERNAL MODULE: ../.yarn/cache/keyname-npm-0.0.1-0c7feabee1-ee40892ae0.zip/node_modules/keyname/index.js
var keyname = __webpack_require__(633);
var keyname_default = /*#__PURE__*/__webpack_require__.n(keyname);
// EXTERNAL MODULE: ../.yarn/cache/bounding-client-rect-npm-1.0.5-c130aa2321-22a7fb5e6c.zip/node_modules/bounding-client-rect/index.js
var bounding_client_rect = __webpack_require__(978);
var bounding_client_rect_default = /*#__PURE__*/__webpack_require__.n(bounding_client_rect);
// EXTERNAL MODULE: ../.yarn/cache/component-query-npm-0.0.3-7e4160652a-1424f6e014.zip/node_modules/component-query/index.js
var component_query = __webpack_require__(957);
var component_query_default = /*#__PURE__*/__webpack_require__.n(component_query);
;// ./src/modules/tip/template.js
/* eslint-disable prettier/prettier */
/* harmony default export */ var tip_template = ([
  '<div class="tip tip-hide">',
      '<div class="tip-arrow"></div>',
      '<div class="tip-inner"></div>',
  '</div>'
].join(''));

;// ./src/modules/tip/tip.js
/**
 * tip-component v2.4.1
 * MIT License
 * @preserve
 */

/**
 * Module dependencies.
 */










var html = domify_default()(tip_template);

/**
 * Apply the average use-case of simply
 * showing a tool-tip on `el` hover.
 *
 * Options:
 *
 *  - `delay` hide delay in milliseconds [0]
 *  - `value` defaulting to the element's title attribute
 *
 * @param {Mixed} elem
 * @param {Object|String} options or value
 * @api public
 */

function tip(elem, options) {
  if (typeof options === 'string') options = { value: options };
  var els = typeof elem === 'string' ? component_query_default().all(elem) : [elem];
  for (var i = 0, el; (el = els[i]); i++) {
    var val = options.value || el.getAttribute('title');
    var tip = new Tip(val, options);
    el.setAttribute('title', '');
    tip.cancelHideOnHover();
    tip.attach(el);
  }
}

/**
 * Initialize a `Tip` with the given `content`.
 *
 * @param {Mixed} content
 * @api public
 */

function Tip(content, options) {
  options = options || {};
  if (!(this instanceof Tip)) return tip(content, options);
  emitter_component_default().call(this);
  this.classname = '';
  this.options = options;
  this.delay = options.delay || 300;
  this.pad = options.pad == null ? 15 : options.pad;
  this.el = html.cloneNode(true);
  this.events = component_events_default()(this.el, this);
  this.classes = component_classes_default()(this.el);
  this.inner = component_query_default()('.tip-inner', this.el);
  this.message(content);
  this.position('top');
  if (Tip.effect) this.effect(Tip.effect);
}

/**
 * Mixin emitter.
 */

emitter_component_default()(Tip.prototype);

/**
 * Set tip `content`.
 *
 * @param {String|Element} content
 * @return {Tip} self
 * @api public
 */

Tip.prototype.message = function (content) {
  if (typeof content === 'string') content = domify_default()(content);
  this.inner.appendChild(content);
  return this;
};

/**
 * Attach to the given `el` with optional hide `delay`.
 *
 * @param {Element} el
 * @param {Number} delay
 * @return {Tip}
 * @api public
 */

Tip.prototype.attach = function (el) {
  this.target = el;
  this.handleEvents = component_events_default()(el, this);
  this.handleEvents.bind('mouseover');
  this.handleEvents.bind('mouseout');
  return this;
};

/**
 * On mouse over
 *
 * @param {Event} e
 * @return {Tip}
 * @api private
 */

Tip.prototype.onmouseover = function () {
  this.show(this.target);
  this.cancelHide();
};

/**
 * On mouse out
 *
 * @param {Event} e
 * @return {Tip}
 * @api private
 */

Tip.prototype.onmouseout = function () {
  this.hide(this.delay);
};

/**
 * Cancel hide on hover, hide with the given `delay`.
 *
 * @param {Number} delay
 * @return {Tip}
 * @api public
 */

Tip.prototype.cancelHideOnHover = function () {
  this.events.bind('mouseover', 'cancelHide');
  this.events.bind('mouseout', 'hide');
  return this;
};

/**
 * Set the effect to `type`.
 *
 * @param {String} type
 * @return {Tip}
 * @api public
 */

Tip.prototype.effect = function (type) {
  this._effect = type;
  this.classes.add(type);
  return this;
};

/**
 * Set position:
 *
 *  - `top`
 *  - `top left`
 *  - `top right`
 *  - `bottom`
 *  - `bottom left`
 *  - `bottom right`
 *  - `left`
 *  - `right`
 *
 * @param {String} pos
 * @param {Object} options
 * @return {Tip}
 * @api public
 */

Tip.prototype.position = function (pos, options) {
  options = options || {};
  this._position = pos;
  this._auto = options.auto !== false;
  this.replaceClass(pos);
  this.emit('reposition');
  return this;
};

/**
 * Show the tip attached to `el`.
 *
 * Emits "show" (el) event.
 *
 * @param {String|Element|Number} el or x
 * @param {Number} [y]
 * @return {Tip}
 * @api public
 */

Tip.prototype.show = function (el) {
  if (typeof el === 'string') el = component_query_default()(el);

  // show it
  if (this.options.node != null && this.options.node instanceof HTMLElement) {
    this.options.node.appendChild(this.el);
  } else {
    document.body.appendChild(this.el);
  }

  if (this.options.hideArrow) {
    var tipArrow = component_query_default()('.tip-arrow', this.el);
    if (tipArrow) {
      tipArrow.remove();
    }
  }

  this.classes.add('tip-' + this._position.replace(/\s+/g, '-'));
  this.classes.remove('tip-hide');

  // x,y
  if (typeof el === 'number') {
    var x = arguments[0];
    var y = arguments[1];
    this.emit('show');
    this.el.style.top = y + 'px';
    this.el.style.left = x + 'px';
    return this;
  }

  // el
  this.target = el;
  this.reposition();
  this.emit('show', this.target);

  if (!this.winEvents) {
    this.winEvents = component_events_default()(window, this);
    this.winEvents.bind('resize', 'reposition');
    this.winEvents.bind('scroll', 'reposition');
  }

  return this;
};

/**
 * Reposition the tip if necessary.
 *
 * @api private
 */

Tip.prototype.reposition = function () {
  var pos = this._position;
  var off = this.offset(pos);
  var newpos = this._auto && this.suggested(pos, off);
  if (newpos && newpos !== pos) {
    pos = newpos;
    off = this.offset(pos);
  }
  this.replaceClass(pos);
  this.emit('reposition');
  this.el.style.top = off.top + 'px';
  this.el.style.left = off.left + 'px';
};

/**
 * Compute the "suggested" position favouring `pos`.
 *
 * Returns `pos` if no suggestion can be determined.
 *
 * @param {String} pos
 * @param {Object} offset
 * @return {String}
 * @api private
 */

Tip.prototype.suggested = function (pos, off) {
  var el = this.el;

  var ew = el.clientWidth;
  var eh = el.clientHeight;
  var top = window.scrollY || window.pageYOffset;
  var left = window.scrollX || window.pageXOffset;
  var w = window.innerWidth;
  var h = window.innerHeight;

  var good = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  // too low
  if (off.top + eh > top + h) good.bottom = false;

  // too high
  if (off.top < top) good.top = false;

  // too far to the right
  if (off.left + ew > left + w) good.right = false;

  // too far to the left
  if (off.left < left) good.left = false;

  var i;
  var positions = pos.split(/\s+/);

  // attempt to give the preferred position first, consider "bottom right"
  for (i = 0; i < positions.length; i++) {
    if (!good[positions[i]]) break;
    if (i === positions.length - 1) {
      // last one!
      return pos;
    }
  }

  // attempt to get close to preferred position, i.e. "bottom" or "right"
  for (i = 0; i < positions.length; i++) {
    if (good[positions[i]]) return positions[i];
  }

  if (good[pos]) return pos;
  if (good.top) return 'top';
  if (good.bottom) return 'bottom';
  if (good.left) return 'left';
  if (good.right) return 'right';
};

/**
 * Replace position class `name`.
 *
 * @param {String} name
 * @api private
 */

Tip.prototype.replaceClass = function (name) {
  name = name.split(' ').join('-');
  var classname = this.classname + ' tip tip-' + name;
  if (this._effect) classname += ' ' + this._effect;
  this.el.setAttribute('class', classname);
};

/**
 * Compute the offset for `.target`
 * based on the given `pos`.
 *
 * @param {String} pos
 * @return {Object}
 * @api private
 */

Tip.prototype.offset = function (pos) {
  var pad = this.pad;

  var tipRect = bounding_client_rect_default()(this.el);
  if (!tipRect)
    throw new Error('could not get bounding client rect of Tip element');
  var ew = tipRect.width;
  var eh = tipRect.height;

  var targetRect = bounding_client_rect_default()(this.target);
  if (!targetRect)
    throw new Error('could not get bounding client rect of `target`');
  var tw = targetRect.width;
  var th = targetRect.height;

  var to = offset(targetRect, document);
  if (!to) throw new Error('could not determine page offset of `target`');

  switch (pos) {
    case 'top':
      return {
        top: to.top - eh,
        left: to.left + tw / 2 - ew / 2
      };
    case 'bottom':
      return {
        top: to.top + th,
        left: to.left + tw / 2 - ew / 2
      };
    case 'right':
      return {
        top: to.top + th / 2 - eh / 2,
        left: to.left + tw
      };
    case 'left':
      return {
        top: to.top + th / 2 - eh / 2,
        left: to.left - ew
      };
    case 'top left':
      return {
        top: to.top - eh,
        left: to.left + tw / 2 - ew + pad
      };
    case 'top right':
      return {
        top: to.top - eh,
        left: to.left + tw / 2 - pad
      };
    case 'bottom left':
      return {
        top: to.top + th,
        left: to.left + tw / 2 - ew + pad
      };
    case 'bottom right':
      return {
        top: to.top + th,
        left: to.left + tw / 2 - pad
      };
    default:
      throw new Error('invalid position "' + pos + '"');
  }
};

/**
 * Cancel the `.hide()` timeout.
 *
 * @api private
 */

Tip.prototype.cancelHide = function () {
  clearTimeout(this._hide);
};

/**
 * Hide the tip with optional `ms` delay.
 *
 * Emits "hide" event.
 *
 * @param {Number} ms
 * @return {Tip}
 * @api public
 */

Tip.prototype.hide = function (ms) {
  var self = this;

  this.emit('hiding');

  // duration
  if (ms) {
    this._hide = setTimeout(this.hide.bind(this), ms);
    return this;
  }

  // hide
  this.classes.add('tip-hide');
  if (this._effect) {
    setTimeout(this.remove.bind(this), 300);
  } else {
    self.remove();
  }

  return this;
};

/**
 * Hide the tip without potential animation.
 *
 * @return {Tip}
 * @api public
 */

Tip.prototype.remove = function () {
  if (this.winEvents) {
    this.winEvents.unbind();
    this.winEvents = null;
  }
  this.emit('hide');

  var parent = this.el.parentNode;
  if (parent) parent.removeChild(this.el);
  return this;
};

/**
 * Extracted from `timoxley/offset`, but directly using a
 * TextRectangle instead of getting another version.
 *
 * @param {TextRectangle} box - result from a `getBoundingClientRect()` call
 * @param {Document} doc - Document instance to use
 * @return {Object} an object with `top` and `left` Number properties
 * @api private
 */

function offset(box, doc) {
  var body = doc.body || doc.getElementsByTagName('body')[0];
  var docEl = doc.documentElement || body.parentNode;
  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;
  var scrollTop = window.pageYOffset || docEl.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft;

  return {
    top: box.top + scrollTop - clientTop,
    left: box.left + scrollLeft - clientLeft
  };
}

;// ./src/modules/popover.js



function createPopover(options) {
  return new Popover(options);
}

function Popover(options) {
  options = options || {};

  Tip.call(this, '<div class="popover-content"></div>', {
    node: options.node,
    hideArrow: options.hideArrow
  });

  var className = 'popover';
  if (options.popoverClass) {
    className += ' ' + options.popoverClass;
  }

  this.el.className += ' ' + className;
  this.classname = className;

  this.content(options.content);
}

inheritPrototype(Popover, Tip);

Popover.prototype.content = function (content) {
  var contentEl = this.el.querySelector('.popover-content');

  if (typeof content === 'string') {
    contentEl.innerHTML = content;
  } else {
    contentEl.appendChild(content);
  }

  return this;
};

;// ./src/utils/click-outside.js


function clickOutside(elements, fn) {
  var self = {
    on,
    off,
    isClicked
  };
  var clickedEl;
  var handlers;

  function stop(e) {
    clickedEl = this;
    e.stopPropagation();
  }

  function pass() {
    clickedEl = undefined;
    fn();
  }

  function isClicked(el) {
    return el === clickedEl;
  }

  function on() {
    handlers = Array.prototype.map.call(elements, function (el) {
      return component_event.bind(el, 'mousedown', stop.bind(el));
    });

    component_event.bind(document.documentElement, 'mousedown', pass);

    return self;
  }

  function off() {
    component_event.unbind(document.documentElement, 'mousedown', pass);

    Array.prototype.forEach.call(elements, function (el, i) {
      component_event.unbind(el, 'mousedown', handlers[i]);
    });

    return self;
  }

  return self;
}

;// ./src/utils/set-immediate.js
/**
 * Shim for setImmediate()
 */

var _setImmediate;

if (typeof setImmediate === 'function') {
  _setImmediate = setImmediate;
} else {
  _setImmediate = function setImmediate(fn) {
    setTimeout(fn, 0);
  };
}

/* harmony default export */ var set_immediate = (_setImmediate);

;// ./src/modules/date-picker.js












var ISO_8601_FORMAT = 'YYYY-MM-DD';

function createDatePicker(el, options) {
  return new DatePicker(el, options);
}

function DatePicker(el, options) {
  if (!el || el.nodeName !== 'INPUT') {
    throw new Error(
      'Wave.DatePicker() requires an <input> DOM element to initialize'
    );
  }

  this.el = el;
  this.options = extend_default()(true, {}, this.constructor.defaults, options);

  if (
    this.options.useNativePickerOnTouchCapableDevices &&
    createMobileInput(this.el, { type: 'date' }).isConverted()
  ) {
    this._native = true;
    this.events = component_events_default()(this.el, this);
    this.events.bind('change', '_handleChange');

    // native date input always uses ISO-8601 date format
    this._initDateFormat(ISO_8601_FORMAT);

    return this;
  }

  this.cal = createCalendar(this.options).showMonthSelect().showYearSelect();

  this.cal.addClass('calendar--datepicker');

  this.cal.on(
    'change',
    function (date) {
      var value = this.value(date);
      value && this.el.focus();
    }.bind(this)
  );

  this.events = component_events_default()(this.el, this);
  this.events.bind('change', '_handleChange');
  this.events.bind('focus', '_handleFocus');
  this.events.bind('blur', '_handleBlur');
  this.events.bind('click', '_handleClick');
  this.events.bind('keydown', '_handleKeydown');

  this._initDateFormat(this.options.format);

  return this;
}

DatePicker.defaults = {
  format: ISO_8601_FORMAT,
  useNativePickerOnTouchCapableDevices: true,
  triggerChangeOnEmpty: false
};

inheritPrototype(DatePicker, (emitter_component_default()));

DatePicker.prototype._native = false;
DatePicker.prototype._position = 'bottom';

/**
 * Return boolean whether the native picker is enabled
 */
DatePicker.prototype.isNative = function () {
  return this._native;
};

DatePicker.prototype._initDateFormat = function (format) {
  var reDivider = /[^a-zA-Z0-9]/;

  format = format.toUpperCase();

  this._dayPos = format.indexOf('DD');
  this._monthPos = format.indexOf('MM');
  this._yearPos = format.indexOf('YYYY');
  this._divider = format.match(reDivider)[0];
};

DatePicker.prototype._processDate = function (date) {
  var dateArray = [];
  var finalString = '';
  var divider = this._divider;

  dateArray = [
    { value: ('0' + date.getDate()).slice(-2), position: this._dayPos },
    {
      value: ('0' + (1 + date.getMonth())).slice(-2),
      position: this._monthPos
    },
    { value: date.getFullYear(), position: this._yearPos }
  ];

  dateArray.sort(function (a, b) {
    if (a.position < b.position) {
      return -1;
    }
    if (a.position > b.position) {
      return 1;
    }

    return 0;
  });

  dateArray.forEach(function (entry) {
    finalString += entry.value + divider;
  });

  // Slice away the last divider
  return finalString.slice(0, -1);
};

DatePicker.prototype._parseInput = function () {
  var val = this.el.value;
  var t = /^[0-9]*$/;
  var day = val.substring(this._dayPos, this._dayPos + 2);
  var month = val.substring(this._monthPos, this._monthPos + 2);
  var year = val.substring(this._yearPos, this._yearPos + 4);

  if (t.test(year) && t.test(month) && t.test(day)) {
    year = parseInt(year, 10);
    month = parseInt(month, 10) - 1;
    day = parseInt(day, 10);

    var dat = new Date(year, month, day);

    if (
      dat.getDate() == day && // eslint-disable-line eqeqeq
      dat.getMonth() == month && // eslint-disable-line eqeqeq
      dat.getFullYear() == year // eslint-disable-line eqeqeq
    ) {
      return dat;
    }
  }

  return null;
};

/**
 * Get/set value
 */
DatePicker.prototype.value = function (date) {
  var self = this;
  var calDate;

  if (typeof date === 'undefined') {
    return this._parseInput();
  } else if (date === null) {
    calDate = new Date();
  } else {
    date = calDate = date instanceof Date ? date : new Date(date);

    if (date.toString() === 'Invalid Date') {
      return false;
    }
  }

  if (!this._native) {
    this.cal.select(calDate);
    set_immediate(function () {
      self.hide();
    });
  }

  this.el.value = date === null ? '' : this._processDate(date);

  this.emit('change', date);

  return true;
};

DatePicker.prototype.position = function (pos) {
  this._position = pos;

  return this;
};

DatePicker.prototype.min = function (date) {
  if (this._native) {
    return this;
  }

  date = date instanceof Date ? date : new Date(date);

  if (date.toString() === 'Invalid Date') {
    return this;
  }

  this.cal.min(date);

  return this;
};

DatePicker.prototype.max = function (date) {
  if (this._native) {
    return this;
  }

  date = date instanceof Date ? date : new Date(date);

  if (date.toString() === 'Invalid Date') {
    return this;
  }

  this.cal.max(date);

  return this;
};

/**
 * Show DatePicker
 */
DatePicker.prototype.show = function () {
  if (this._native) {
    return;
  }

  var self = this;
  var ev = document.createEvent('Event');

  ev.initEvent('click', true, true);
  document.dispatchEvent(ev);

  if (this._isVisible) {
    return;
  }

  this._isVisible = true;

  if (!self.popover) {
    this.popover = createPopover({
      content: this.cal.el,
      node: this.options.popoverNode,
      popoverClass: this.options.popoverClass
    })
      .on('show', function () {
        self.clickOutside.on();
        self.emit('show');
      })
      .on('hide', function () {
        self.emit('hide');
      });

    this.clickOutside = clickOutside(
      [this.el, this.popover.el],
      this.hide.bind(this)
    );

    if (this._position) {
      this.popover.position(this._position);
    }
  }

  this.popover.show(this.el);
};

/**
 * Hide DatePicker
 */
DatePicker.prototype.hide = function () {
  if (!this._isVisible || this._native) {
    return;
  }

  this._isVisible = false;

  this.clickOutside.off();
  this.popover.hide();
};

/**
 * Handle input clicks
 */
DatePicker.prototype._handleClick = function (e) {
  if (this.el.disabled) {
    return;
  }

  this.show();
};

DatePicker.prototype._handleKeydown = function (e) {
  switch (keyname_default()(e.which)) {
    case 'enter':
      e.preventDefault();
      this._handleChange(e);

      break;
    case 'esc':
      this.hide();

      break;
  }
};

/**
 * Handle focus/blur
 */
DatePicker.prototype._handleFocus = function (e) {
  this.show();
};

DatePicker.prototype._handleBlur = function (e) {
  if (!this.clickOutside.isClicked(this.popover.el)) {
    this.hide();
  }
};

/**
 * Handle date changes
 */
DatePicker.prototype._handleChange = function (e) {
  var date = this._parseInput();

  if (date) {
    this._setValue(date);
  } else if (this.options.triggerChangeOnEmpty && this.el.value === '') {
    this._setValue(null);
  }
};

DatePicker.prototype._setValue = function (val) {
  if (this._native) {
    this.emit('change', val);
  } else {
    this.value(val) && this.el.focus();
  }
};

// EXTERNAL MODULE: ../.yarn/cache/dataset-npm-0.3.2-541458807a-aae7642298.zip/node_modules/dataset/index.js
var dataset = __webpack_require__(553);
var dataset_default = /*#__PURE__*/__webpack_require__.n(dataset);
// EXTERNAL MODULE: ../.yarn/cache/el-component-npm-0.1.1-9f3fa9d4aa-4b31c8f94a.zip/node_modules/el-component/index.js
var el_component = __webpack_require__(839);
var el_component_default = /*#__PURE__*/__webpack_require__.n(el_component);
;// ./src/modules/clock/lib/time-range.js


function timeRange() {
  var self;

  /**
   * For standard range:
   * Hour is valid if any of the hour:minute combination is in bounds
   * it is invalid, if its 59th minute is before or if the 0th minute is after
   */
  function isValidHour(hour) {
    var min, max;
    min = self.min() ? self.min().hour : 0;
    max = self.max() ? self.max().hour : 23;
    if (self.reversed()) {
      return hour <= max || min <= hour;
    }
    return min <= hour && hour <= max;
  }

  function isValidMinute(hour, minute) {
    var v = {
      hour,
      minute
    };
    if (hour === undefined) {
      return true;
    }
    if (self.reversed()) {
      return !self.after(v) || !self.before(v);
    }
    return self.in(v);
  }

  // mixin bounds
  self = Bounds({
    isValidHour,
    isValidMinute
  });

  self.compare(function (a, b) {
    if (a.hour < b.hour) {
      return -1;
    }
    if (a.hour > b.hour) {
      return 1;
    }
    if (a.minute < b.minute) {
      return -1;
    }
    if (a.minute > b.minute) {
      return 1;
    }
    return 0;
  });

  self.distance(function (a, b) {
    return 60 * Math.abs(a.hour - b.hour) + Math.abs(a.minute - b.minute);
  });

  return self;
}

;// ./src/modules/clock/lib/clock.js
/**
 * Clock 1.2.1
 * (c) 2013 code42day
 * MIT License
 * @preserve
 */














var format = {
  table: function (caption, type, tbody) {
    return el_component_default()('table', el_component_default()('caption', caption) + el_component_default()('tbody', tbody), {
      class: type
    });
  },
  cell: function (value, type) {
    var attribs = {
      href: '#'
    };
    attribs['data-' + type] = value;
    return el_component_default()('td', el_component_default()('a', '' + value, attribs));
  },
  query: function (kind, value) {
    return 'a[data-' + kind + '="' + value + '"]';
  }
};

var MINUTES_IN_HOUR = 60;
var VALID_MINUTE_STEPS = [5, 10, 15];

function createClock(options) {
  return new Clock(options);
}

function Clock(options) {
  emitter_component_default().call(this);

  verifyOptions(options);

  this.options = extend_default()(true, {}, this.constructor.defaults, options);
  this.selected = {};
  this.el = renderClock.call(this);
  this.events = component_events_default()(this.el, this);
  this.events.bind('click .clock-hour a', '_handleHourClick');
  this.events.bind('click .clock-minute a', '_handleMinuteClick');
  this.valid = timeRange();
}

Clock.defaults = {
  i18n: {
    hours: 'Hour',
    minutes: 'Minute'
  }
};

inheritPrototype(Clock, (emitter_component_default()));

Clock.prototype._handleHourClick = function (e) {
  this._handleClick('hour', e.target);
  e.preventDefault();
};

Clock.prototype._handleMinuteClick = function (e) {
  this._handleClick('minute', e.target);
  e.preventDefault();
};

Clock.prototype._handleClick = function (kind, a) {
  var value = dataset_default()(a, kind);

  if (!component_classes_default()(a).has('is-invalid')) {
    this.selected[kind] = parseInt(value, 10);
    this.selectImpl(kind, this.selected[kind]);
    if (kind === 'hour') {
      this.selected = this.adjustMinutes(this.selected);
      this.markInvalid(this.selected.hour);
    }
    this.emit('change', this.selected, this.isComplete(kind));
  }
};

Clock.prototype.select = function (hm) {
  hm.minute = coerceMinutes(hm.minute, this.options.minuteStep);

  this.selectImpl('hour', hm.hour);
  this.selectImpl('minute', hm.minute);
  this.selected = hm;
  this.markInvalid(this.selected.hour);

  return this;
};

Clock.prototype._querySelector = function (kind, selector) {
  return this.el.querySelector('.clock-' + kind + ' ' + selector);
};
Clock.prototype._querySelectorAll = function (kind, selector) {
  return this.el.querySelectorAll('.clock-' + kind + ' ' + selector);
};

Clock.prototype.selectImpl = function (kind, value) {
  var selected = this._querySelector(kind, '.is-selected a');
  // deselect
  if (selected) {
    if (value === dataset_default()(selected, kind)) {
      // all is well
      return;
    }
    component_classes_default()(selected.parentNode).remove('is-selected');
  }
  // select
  selected = this._querySelector(kind, format.query(kind, value));
  if (selected) {
    component_classes_default()(selected.parentNode).add('is-selected');
  }
};

/**
 * Adjust minute value when hour changes as a result of select,
 * or the click on the calendar
 */
Clock.prototype.adjustMinutes = function (hm) {
  var adjusted;
  if (hm.minute !== undefined) {
    adjusted = this.valid.restrict(hm);
    // eslint-disable-next-line eqeqeq
    if (adjusted.minute != hm.minute) {
      this.selectImpl('minute', adjusted.minute);
    }
  }
  return adjusted || hm;
};

Clock.prototype.markInvalid = function (selectedHour, both) {
  var valid = this.valid;

  if (both) {
    markInvalid(this._querySelectorAll('hour', 'a'), 'hour', function (hour) {
      return valid.isValidHour(hour);
    });
  }

  markInvalid(
    this._querySelectorAll('minute', 'a'),
    'minute',
    function (minute) {
      return valid.isValidMinute(selectedHour, minute);
    }
  );
};

Clock.prototype.isComplete = function (kind) {
  this._complete = this._complete || {};

  if (kind) {
    this._complete[kind] = true;
  }
  if (this._complete.hour && this._complete.minute) {
    this._complete = {}; // reset complete
    return true;
  }
};

Clock.prototype.resetComplete = function () {
  this._complete = {};

  return this;
};

Clock.prototype.min = function (v) {
  if (!arguments.length) {
    return this.valid.min();
  }

  this.valid.min(v);
  this.markInvalid(this.selected.hour, true);

  return this;
};

Clock.prototype.max = function (v) {
  if (!arguments.length) {
    return this.valid.max();
  }

  this.valid.max(v);
  this.markInvalid(this.selected.hour, true);

  return this;
};

function renderTable(caption, type, rows) {
  var tbody = rows
    .map(function (row) {
      return '<tr>' + row.join('') + '</tr>';
    })
    .join('');

  return format.table(caption, type, tbody);
}

function renderHours() {
  var hours = range_component_default()(0, 24).map(function (hour) {
    return format.cell(hour, 'hour');
  });

  return renderTable(
    this.options.i18n.hours,
    'clock-hour',
    in_groups_of_default()(hours, 6)
  );
}

function renderMinutes() {
  var minuteStep = this.options.minuteStep || 1;
  var rangeB = MINUTES_IN_HOUR / minuteStep;
  var groupLength;

  if (minuteStep === 1) {
    groupLength = 6;
  } else if (minuteStep === 10) {
    groupLength = 3;
  } else {
    groupLength = 4;
  }

  var minutes = range_component_default()(0, rangeB).map(function (minute) {
    return format.cell(minute * minuteStep, 'minute');
  });

  return renderTable(
    this.options.i18n.minutes,
    'clock-minute',
    in_groups_of_default()(minutes, groupLength)
  );
}

function renderClock() {
  var html = [
    '<div class="clock">',
    '<div class="clock-col">' + renderHours.call(this) + '</div>',
    '<div class="clock-col">' + renderMinutes.call(this) + '</div>',
    '</div>'
  ].join('');

  return domify_default()(html);
}

function verifyOptions(options) {
  options = options || {};

  if (
    options.minuteStep != null &&
    (typeof options.minuteStep !== 'number' ||
      VALID_MINUTE_STEPS.indexOf(options.minuteStep) === -1)
  ) {
    throw new Error(
      'TimePicker: `options.numberStep` must be one of the numbers: ' +
        VALID_MINUTE_STEPS.join(', ')
    );
  }
}

function coerceMinutes(minutes, minuteStep) {
  if (!minutes) {
    return 0;
  }

  if (minuteStep === undefined) {
    return minutes;
  }

  minutes -= minutes % minuteStep;

  return minutes;
}

function markInvalid(nodes, kind, isValid) {
  function mark(node) {
    var cl = component_classes_default()(node);
    var v = dataset_default()(node, kind);

    if (isValid(v)) {
      cl.remove('is-invalid');
    } else {
      cl.add('is-invalid');
    }
  }

  var i;
  for (i = 0; i < nodes.length; i++) {
    mark(nodes[i]);
  }
}

;// ./src/modules/time-picker.js












/* harmony default export */ function time_picker(el, options) {
  return new TimePicker(el, options);
}

function TimePicker(el, options) {
  if (!el || el.nodeName !== 'INPUT') {
    throw new Error(
      'Wave.TimePicker() requires an <input> DOM element to initialize'
    );
  }

  this.el = el;
  this.options = extend_default()(true, {}, this.constructor.defaults, options);

  if (
    this.options.useNativePickerOnTouchCapableDevices &&
    createMobileInput(this.el, { type: 'time' }).isConverted()
  ) {
    this._native = true;
    this.events = component_events_default()(this.el, this);
    this.events.bind('change', '_handleChange');

    return;
  }

  this.clock = createClock(this.options);
  this.clock.on(
    'change',
    function (time, complete) {
      var value = this.value(time, complete);
      value && this.el.focus();
    }.bind(this)
  );

  this.events = component_events_default()(this.el, this);
  this.events.bind('change', '_handleChange');
  this.events.bind('focus', '_handleFocus');
  this.events.bind('blur', '_handleBlur');
  this.events.bind('click', '_handleClick');
  this.events.bind('keydown', '_handleKeydown');

  return this;
}

TimePicker.defaults = {
  useNativePickerOnTouchCapableDevices: true
};

inheritPrototype(TimePicker, (emitter_component_default()));

TimePicker.prototype._native = false;
TimePicker.prototype._position = 'bottom';

/**
 * Return boolean whether the native picker is enabled
 */
TimePicker.prototype.isNative = function () {
  return this._native;
};

TimePicker.prototype._parseTime = function parseTime(time) {
  var hour = parseInt(time.hour, 10);
  var minute = parseInt(time.minute, 10);

  return {
    hour: !isNaN(hour) && hour.toString().length < 3 ? hour : 0,
    minute: !isNaN(minute) && minute.toString().length < 3 ? minute : 0
  };
};

/**
 * Get/set value
 */
TimePicker.prototype.value = function (time, complete) {
  var self = this;

  if (!time) {
    if (!this.el.value.match(/\d{2}:\d{2}/)) {
      return null;
    }

    var parts = this.el.value.split(':');

    return {
      hour: parts[0],
      minute: parts[1]
    };
  }

  time = this._parseTime(time);

  if (!this._native) {
    this.clock.select({
      hour: time.hour,
      minute: time.minute
    });

    if (complete) {
      set_immediate(function () {
        self.hide();
      });
    }
  }

  this.el.value =
    ('0' + time.hour).slice(-2) + ':' + ('0' + time.minute).slice(-2);

  this.emit('change', time, complete);

  return true;
};

TimePicker.prototype.position = function (pos) {
  this._position = pos;

  return this;
};

TimePicker.prototype.min = function (v) {
  if (this._native) {
    return this;
  }

  this.clock.min(v);

  return this;
};

TimePicker.prototype.max = function (v) {
  if (this._native) {
    return this;
  }

  this.clock.max(v);

  return this;
};

/**
 * Show TimePicker
 */
TimePicker.prototype.show = function () {
  if (this._native) {
    return;
  }

  var self = this;
  var date = new Date();
  var ev = document.createEvent('Event');

  ev.initEvent('click', true, true);
  document.dispatchEvent(ev);

  if (this._isVisible) {
    return;
  }

  this._isVisible = true;

  // eslint-disable-next-line eqeqeq
  if (this.el.value == '') {
    this.clock.select({
      hour: date.getHours(),
      minute: date.getMinutes()
    });
  }

  if (!self.popover) {
    this.popover = createPopover({
      content: this.clock.el,
      node: this.options.popoverNode,
      popoverClass: this.options.popoverClass
    })
      .on('show', function () {
        self.clickOutside.on();
        self.emit('show');
      })
      .on('hide', function () {
        self.emit('hide');
      });

    this.clickOutside = clickOutside(
      [this.el, this.popover.el],
      this.hide.bind(this)
    );

    if (this._position) {
      this.popover.position(this._position);
    }
  }

  this.clock.resetComplete();
  this.popover.show(this.el);
};

/**
 * Hide TimePicker
 */
TimePicker.prototype.hide = function () {
  if (!this._isVisible || this._native) {
    return;
  }

  this._isVisible = false;

  this.clickOutside.off();
  this.popover.hide();

  return this;
};

/**
 * Handle input clicks
 */
TimePicker.prototype._handleClick = function (e) {
  if (this.el.disabled) {
    return;
  }

  this.show();
};

TimePicker.prototype._handleKeydown = function (e) {
  switch (keyname_default()(e.which)) {
    case 'enter':
      e.preventDefault();
      this._handleChange(e);

      break;
    case 'esc':
      this.hide();

      break;
  }
};

/**
 * Handle focus/blur
 */
TimePicker.prototype._handleFocus = function (e) {
  this.show();
};

TimePicker.prototype._handleBlur = function (e) {
  if (!this.clickOutside.isClicked(this.popover.el)) {
    this.hide();
  }
};

/**
 * Handle time changes
 */
TimePicker.prototype._handleChange = function (e) {
  var parts = this.el.value.split(':');
  var time;

  if (parts.length < 2) {
    return this.value(null);
  }

  time = {
    hour: parts[0],
    minute: parts[1]
  };

  if (this._native) {
    time = this._parseTime(time);
    this.emit('change', time, true);
  } else {
    this.value(time, true) && this.el.focus();
  }
};

;// ./src/utils/tokenize.js
/**
 * Break apart words
 */

function tokenize(string) {
  return string.split(/\s+/);
}

;// ./src/modules/sticky.js







var sticky_requestAnimationFrame = detect('requestAnimationFrame', ['webkit', 'moz']);
var sticky_document = window.document;
var zIndexOffset = 0;

var sticky_defaults = {
  zIndexBase: 0,
  zIndexManagement: true,
  stickyClass: 'sticky',
  placeholderClass: 'stickyPlaceholder',
  top: 0,
  onStuck: null,
  onUnstuck: null
};

/* harmony default export */ function sticky(nodes, options) {
  return new StickyWrapper(nodes, options);
}

function StickyWrapper(nodes, options) {
  if (nodes.length === undefined) {
    nodes = [nodes];
  }

  var i = 0;
  var len = nodes.length;

  for (i; i < len; i += 1) {
    this.collection.push(new Sticky(nodes[i], options));
  }

  return this;
}

StickyWrapper.prototype.collection = [];
StickyWrapper.prototype._waitingForUpdate = false;

StickyWrapper.prototype.destroy = function (node) {
  var i = 0;
  var len = this.collection.length;
  var instance;

  for (i; i < len; ++i) {
    instance = this.collection[i];

    if (instance.el === node) {
      instance.destroy();
      this.collection.splice(i, 1);
      return true;
    }
  }

  return false;
};

StickyWrapper.prototype.update = function () {
  if (!this._waitingForUpdate) {
    this._waitingForUpdate = true;

    // avoid too many repaints
    if (sticky_requestAnimationFrame) {
      sticky_requestAnimationFrame(this._update.bind(this));
    } else {
      setTimeout(this._update.bind(this), 15);
    }
  }
};

StickyWrapper.prototype._update = function () {
  this._waitingForUpdate = false;
  this.collection.forEach(checkPosition);
};

function Sticky(el, options) {
  if (!el) {
    throw new Error('Wave.Sticky() requires a DOM element to initialize');
  }

  this.el = el;
  this.options = extend_default()(true, {}, sticky_defaults, options);

  this._originalZindex = this.el.style.zIndex;
  this._originalTop = this.el.style.top;

  return this;
}

Sticky.prototype.destroy = function () {
  var self = this;

  if (this.options.stickyClass) {
    tokenize(this.options.stickyClass).forEach(function (token) {
      component_classes_default()(self.el).remove(token);
    });
  }

  if (this._placeholder) {
    this.el.parentNode.removeChild(this._placeholder);
    this._placeholder = null;
  }
};

Sticky.prototype._isFixed = false;

function checkPosition(sticky) {
  var offsetTop = sticky.el.getBoundingClientRect().top;

  if (!sticky._isFixed && offsetTop <= sticky.options.top) {
    if (!sticky._placeholder) {
      sticky._placeholder = sticky_document.createElement('div');

      if (sticky.el.id) {
        sticky._placeholder.id =
          sticky.options.placeholderClass + '-' + sticky.el.id;
      }

      sticky._placeholder.className = sticky.options.placeholderClass;
      sticky._placeholder.style.height = sticky.el.offsetHeight + 'px';
      sticky._placeholder.style.position = 'relative';
      sticky.el.nextElementSibling
        ? sticky.el.parentNode.insertBefore(
            sticky._placeholder,
            sticky.el.nextElementSibling
          )
        : sticky.el.parentNode.appendChild(sticky._placeholder);
    } else {
      sticky._placeholder.style.display = 'block';
    }

    sticky.el.style.top = sticky.options.top + 'px';

    if (sticky.options.stickyClass) {
      tokenize(sticky.options.stickyClass).forEach(function (token) {
        component_classes_default()(sticky.el).add(token);
      });
    }

    if (sticky.options.zIndexManagement) {
      sticky.el.style.zIndex = sticky.options.zIndexBase + zIndexOffset++;
    }

    sticky._isFixed = true;

    if (sticky.options.onStuck) {
      set_immediate(function () {
        sticky.options.onStuck.call(sticky, sticky.el);
      });
    }
  } else if (sticky._isFixed) {
    var originalTop = sticky.el.parentElement
      ? sticky.el.parentElement.getBoundingClientRect().top
      : 0;

    if (sticky.el.previousElementSibling) {
      originalTop =
        sticky.el.previousElementSibling.getBoundingClientRect().top +
        sticky.el.previousElementSibling.getBoundingClientRect().height;
    }

    if (originalTop > sticky.options.top) {
      sticky.el.style.top = sticky._originalTop;

      if (sticky.options.stickyClass) {
        tokenize(sticky.options.stickyClass).forEach(function (token) {
          component_classes_default()(sticky.el).remove(token);
        });
      }

      if (sticky.options.zIndexManagement) {
        sticky.el.style.zIndex = sticky._originalZindex;
      }

      sticky._isFixed = false;

      if (sticky._placeholder) {
        sticky._placeholder.style.display = 'none';
      }

      if (sticky.options.onUnstuck) {
        set_immediate(function () {
          sticky.options.onUnstuck.call(sticky, sticky.el);
        });
      }
    }
  }
}

;// ../design-primitives/design-icons/dist/index.module.js
/**
 * Do not edit directly
 * Generated on Wed, 18 Dec 2024 12:29:31 GMT
 */

const activity = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 12h-4l-3 9L9 3l-3 9H2\"/></svg>";
const add = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 19V5m-7 7h14\"/></svg>";
const adjust = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 3v9m0 9v-5M12 3v5m0 4v9m-8 0v-7m0-4V3M1 14h6m2-6h6m2 8h6\"/></svg>";
const alignCenter = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 6h18m-3 4H6m-3 4h18m-3 4H6\"/></svg>";
const alignJustify = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 6h18m0 4H3m0 4h18m0 4H3\"/></svg>";
const alignLeft = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 6H3m0 4h14m4 4H3m0 4h14\"/></svg>";
const alignRight = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 6h18m0 4H7m-4 4h18m0 4H7\"/></svg>";
const archive = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10 12h4m7-4v13H3V8H1h22V3H1m2 5v13h18V8h2H1V3h22\"/></svg>";
const index_module_area = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 7v10M2 3a1 1 0 1 0 1-1m1 1a1 1 0 1 1-1-1m4 1h10m4 4v10m-4 4H7m-4-1a1 1 0 1 1-1 1m1-1a1 1 0 1 0 1 1m16 0a1 1 0 1 0 1-1m1 1a1 1 0 1 1-1-1M20 3a1 1 0 1 0 1-1m1 1a1 1 0 1 1-1-1\"/></svg>";
const arrowDown = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 19V5m7 7-7 7-7-7\"/></svg>";
const arrowLeft = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 12h14m-7 7-7-7 7-7\"/></svg>";
const arrowRight = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M19 12H5m7-7 7 7-7 7\"/></svg>";
const arrowUp = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 5v14m-7-7 7-7 7 7\"/></svg>";
const attachment = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m21.44 11.05-9.19 9.19a6.003 6.003 0 1 1-8.49-8.49l9.19-9.19a4.002 4.002 0 0 1 5.66 5.66l-9.2 9.19a2.001 2.001 0 0 1-2.83-2.83l8.49-8.48\"/></svg>";
const barChart1 = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 10v10m-6 0V4M6 14v6\"/></svg>";
const barChart2 = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 20v-4m6-6v10m6 0V4\"/></svg>";
const bell = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 8c0 7 3 9 3 9H3s3-2 3-9a6 6 0 1 1 12 0m-4.27 13a2 2 0 0 1-3.46 0\"/></svg>";
const block = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12m10 10C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10M4.93 4.93l14.14 14.14\"/></svg>";
const bold = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 4h8a4 4 0 1 1 0 8H6h9a4 4 0 1 1 0 8H6z\"/></svg>";
const book = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 19.5A2.5 2.5 0 0 1 6.5 17H20\"/><path d=\"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2\"/></svg>";
const bookmark = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z\"/></svg>";
const box = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 14V6a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 0 6v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 18 14\" transform=\"translate(3.000000, 2.000000)\"/><path d=\"M.27 4.96 9 10.01l8.73-5.05M9 20.08V10\" transform=\"translate(3.000000, 2.000000)\"/></svg>";
const building = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m8 9 5 5v7H8v-4m0 4H3v-7l5-5m1 1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17h-8m0-14v.01M17 7v.01M17 11v.01M17 15v.01\"/></svg>";
const bundle = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"feather feather-package\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16\"/><path d=\"M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12\"/></svg>";
const calendar = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5m16 16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14m-3-2v4M8 6V2m-5 8h18\"/></svg>";
const camera = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M23 8a2 2 0 0 0-2-2h-4l-2-3H9L7 6H3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2M1 8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2m11-2a4 4 0 1 0-4-4m4 4a4 4 0 1 1 4-4\"/></svg>";
const cases = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z\"/></svg>";
const chat = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v4l-4-4H9a2 2 0 0 1-1.414-.586m0 0L11 13h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2v4z\"/></svg>";
const check = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 6 9 17l-5-5\"/></svg>";
const index_module_checkbox = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2M8 12l2.5 2.5L16 9\"/></svg>";
const chevronDoubleDown = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 13.333 12 20l-6-6.667M6 4l6 6.667L18 4\"/></svg>";
const chevronDoubleLeft = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10.667 6 4 12l6.667 6M20 18l-6.667-6L20 6\"/></svg>";
const chevronDoubleRight = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M13.333 6 20 12l-6.667 6M4 18l6.667-6L4 6\"/></svg>";
const chevronDoubleUp = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 10.667 12 4l6 6.667M18 20l-6-6.667L6 20\"/></svg>";
const chevronDown = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m4 8 8 8 8-8\"/></svg>";
const chevronLeft = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m16 20-8-8 8-8\"/></svg>";
const chevronRight = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m8 20 8-8-8-8\"/></svg>";
const chevronUp = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m20 16-8-8-8 8\"/></svg>";
const circle = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"feather feather-circle\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"/></svg>";
const index_module_close = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 18 18 6M6 6l12 12\"/></svg>";
const cloud = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18.001 10.001h-1.26A7.998 7.998 0 0 0 1.03 12.678a8 8 0 0 0 7.975 7.323h8.997a5 5 0 0 0 4.999-5 5 5 0 0 0-4.999-5\"/></svg>";
const code = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m16 18 6-6-6-6M8 6l-6 6 6 6\"/></svg>";
const comment = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"/></svg>";
const compas = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10M2 12c0 5.523 4.477 10 10 10m4.24-14.24-2.12 6.36-6.36 2.12 2.12-6.36z\"/></svg>";
const coordinates3d = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m22 22-3.636-3.636m3.636 0L18.364 22m-1.819-5.455L12 12.91V8.364v4.545l-4.545 3.636M2 18.364h3.636L2 22h3.636M12 5.636V3.818L10.182 2 12 3.818 13.818 2\"/></svg>";
const copy = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1m-4 4h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2\"/></svg>";
const cornerDownRight = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 4v7a4 4 0 0 0 4 4h12l-5-5 5 5-5 5\"/></svg>";
const creditCard = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M1 18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H3m20 14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h18M1 10h22\"/></svg>";
const cursor = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m3 3 7.486 17.968 2.658-7.824 7.824-2.658zm10.59 10.59 6.35 6.35\"/></svg>";
const database = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 5v14c0 1.66-4 3-9 3s-9-1.34-9-3V5c0-1.657 4.03-3 9-3s9 1.343 9 3-4.03 3-9 3-9-1.343-9-3 4.03-3 9-3 9 1.343 9 3v7c0 1.66-4 3-9 3s-9-1.34-9-3\"/></svg>";
const description = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10v8m-3.5 0a3.5 3.5 0 1 0-3.5-3.5m3.5 3.5a3.5 3.5 0 0 1-3.5-3.5M13 18 7.5 7 2 18l2.063-4.125h6.875\"/></svg>";
const distance = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17.951 16 22 12l-4.049-4L22 12H2l4.049-4L2 12l4.049 4\"/></svg>";
const dollar = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 23V1m5 4H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\"/></svg>";
const downloadCloud = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12.01 12.012v9l-4-4 4 4 4-4m4.88 1.09a5 5 0 0 0-2.88-9.09h-1.26a8 8 0 1 0-13.74 7.29\"/></svg>";
const download = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3\"/></svg>";
const dragAndDrop = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 15.5h14m0-6H5\"/></svg>";
const dropdown = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m8 10 4 4 4-4z\"/><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/></svg>";
const edit = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z\"/></svg>";
const equipment = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M13.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.121 2.121 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"/></svg>";
const error = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10m3-13-6 6m0-6 6 6\"/></svg>";
const expand2 = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3\"/></svg>";
const expand = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 15v6h6M21 9V3h-6 6l-7 7m-4 4-7 7\"/></svg>";
const externalLink = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6-6L10 14\"/></svg>";
const fastBack = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m11 5-9 7 9 7zm11 0-9 7 9 7z\"/></svg>";
const fastForward = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m13 5 9 7-9 7zM2 5l9 7-9 7z\"/></svg>";
const file = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7v7zl-7-7\"/></svg>";
const film = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 17H2V7h5m10-5v20H7V2H4.18h15.64A2.18 2.18 0 0 1 22 4.18v15.64A2.18 2.18 0 0 1 19.82 22H4.18A2.18 2.18 0 0 1 2 19.82M7 2v20h10V2h2.82H4.18A2.18 2.18 0 0 0 2 4.18v15.64A2.18 2.18 0 0 0 4.18 22h15.64A2.18 2.18 0 0 0 22 19.82M2 12h20v5h-5V7h5\"/></svg>";
const filter = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 3H2l8 9.46V19l4 2v-8.54z\"/></svg>";
const flag = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 22v-7s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1v12\"/></svg>";
const folder = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"feather feather-folder\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z\"/></svg>";
const globe2 = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2.061 10.889h2.161c1.228 0 2.222.995 2.222 2.222v1.111c0 1.228.995 2.222 2.223 2.222s2.222.995 2.222 2.223v3.272m-3.333-18.9v1.739a2.78 2.78 0 0 0 2.777 2.778h.556c1.227 0 2.222.994 2.222 2.222a2.222 2.222 0 1 0 4.445 0 2.22 2.22 0 0 1 2.222-2.222h1.183M15.333 21.43v-2.764c0-1.228.995-2.223 2.223-2.223h3.405M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10\"/></svg>";
const globe = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12h20M12 22C6.477 22 2 17.523 2 12M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10\"/></svg>";
const grid = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14 21h7v-7h-7m7 7h-7v-7h7m-7-4h7V3h-7m7 7h-7V3h7M3 3h7v7H3m7-7H3v7h7m-7 4h7v7H3m7-7H3v7h7\"/></svg>";
const group = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M1 19.583v-.916c0-1.013 1.026-1.834 2.292-1.834h2.291M4.667 9.5A1.833 1.833 0 1 0 6.5 11.333M4.667 9.5a1.833 1.833 0 1 1-1.834 1.833M12 4a3.667 3.667 0 1 0 3.667 3.667M12 4a3.667 3.667 0 1 1-3.667 3.667m11 1.833a1.833 1.833 0 1 0 1.834 1.833M19.333 9.5a1.833 1.833 0 1 1-1.833 1.833m.917 8.25V17.14c0-1.688-1.437-3.056-3.209-3.056H8.792c-1.772 0-3.209 1.368-3.209 3.056v2.444m12.834-2.75h2.291c1.266 0 2.292.821 2.292 1.834v.916\"/></svg>";
const heart = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4.318 5.318a4.5 4.5 0 0 0 0 6.364L12 19.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 6.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0\"/></svg>";
const help = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01\"/></svg>";
const hide = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14.12 14.12a3 3 0 1 1-4.24-4.24M6.06 6.06A18.45 18.45 0 0 0 1 12s4 8 11 8a10.07 10.07 0 0 0 5.94-2.06c1.59-1.211 1.613-1.221 2.9-2.75A18.5 18.5 0 0 0 23 12s-4-8-11-8a9 9 0 0 0-2.1.24M1 1l22 22\"/></svg>";
const index_module_history = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4.543 15.08A9 9 0 1 0 9.922 3.546M21.49 9.002a9 9 0 0 0-14.85-3.36L2 10.002v-6 6h6M12 7v6l4 2\"/></svg>";
const home = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2M21 9l-9-7-9 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2M9 22V12h6v10\"/></svg>";
const index_module_image = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8.5 10A1.5 1.5 0 1 0 7 8.5M8.5 10A1.5 1.5 0 0 1 7 8.5M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2m0 0 11-11 5 5\"/></svg>";
const inbox = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 12h-6l-2 3h-4l-2-3H2m0 0v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24M22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6l3.45-6.89A2 2 0 0 1 7.24 4h9.52\"/></svg>";
const info = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10m0-6v-4m0-4h.01\"/></svg>";
const italic = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 20h9M10 4h9-4L9 20\"/></svg>";
const index_module_layers = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m12 2 10 5-10 5L2 7zM2 17l10 5 10-5m0-5-10 5-10-5\"/></svg>";
const layout = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 9H3m2-6h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2m4 0V9\"/></svg>";
const legend = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21.414 6.414h-13m0 6h13m0 6h-13m-5-10.586 1.414-1.414L3.414 5 2 6.414m1.414 1.414L2 6.414m.414 7v-2h2v2m-2 0h2m-2 5a1 1 0 1 1 1 1m-1-1a1 1 0 0 0 1 1\"/></svg>";
const index_module_link = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m11.75 5.18 1.72-1.71a5 5 0 0 1 7.07 7.07l-3 3A5 5 0 0 1 10 13m4-2a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"/></svg>";
const list = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 6H9m0 6h13m0 6H9M4.01 6H4m0 6h.01zm.01 6H4\"/></svg>";
const loading = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m4.93 19.07 2.83-2.83M2 12h4M4.93 4.93l2.83 2.83M12 2v4m0 12v4m4.24-5.76 2.83 2.83M18 12h4m-5.76-4.24 2.83-2.83\"/></svg>";
const locate = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 22v-4m10-6h-4m-6 10c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12h4m6 10C6.477 22 2 17.523 2 12m10-6V2\"/></svg>";
const index_module_location = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m3 11 19-9-9 19-2-8z\"/></svg>";
const lock = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2m2 9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h14M5 11h2V7a5 5 0 1 1 10 0v4\"/></svg>";
const longParagraph = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 18.5h12m4-4H4m16-4H4m16-4H4\"/></svg>";
const mail = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2M2 6l10 7 10-7\"/></svg>";
const measure = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M1 16h22V8H1h3.5v2.867M1 16V8m0 8h22V8H1h3.5v2.867m3.7 0V8h3.7v2.867m3.7 0V8h3.7v2.867\"/></svg>";
const menu = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 18h18m0-6H3m0-6h18\"/></svg>";
const messageAlert = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 21V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H8zm8-13v3m0 3v.01\"/></svg>";
const minimize = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m3 21 7-7H4h6v6m10-10h-6V4v6l7-7\"/></svg>";
const minus = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 12h14\"/></svg>";
const mobile = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7.5 2h8.763a1.5 1.5 0 0 1 1.5 1.5v17a1.5 1.5 0 0 1-1.5 1.5H7.5A1.5 1.5 0 0 1 6 20.5M16.263 2H7.5A1.5 1.5 0 0 0 6 3.5v17A1.5 1.5 0 0 0 7.5 22h8.763a1.5 1.5 0 0 0 1.5-1.5M12 19h.01z\"/></svg>";
const more = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M19 13a1 1 0 1 0-1-1m1 1a1 1 0 1 1 1-1m-8 1a1 1 0 1 0-1-1m1 1a1 1 0 1 1 1-1m-8 1a1 1 0 1 0-1-1m1 1a1 1 0 1 1 1-1\"/></svg>";
const move = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 2v20l3-3-3 3-3-3m-4-4-3-3 3-3m4-4 3-3 3 3m4 4 3 3-3 3 3-3H2\"/></svg>";
const next = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10m10-10c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10m0-6 4-4-4-4m-4 4h8\"/></svg>";
const objects = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m18 4 5 9.5H13zm0 0-5 9.5h10zM7 20h10V10H7zm10 0H7V10h10zM6 14a5 5 0 1 0-5-5m8.536-3.536a5 5 0 1 0 0 7.072\"/></svg>";
const pause = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 20h4V4H6m4 16H6V4h4m4 0h4v16h-4m4-16h-4v16h4\"/></svg>";
const pc = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2M4 3a2 2 0 0 0-2 2v10m6 6h8-4v-4\"/></svg>";
const phone = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92\"/></svg>";
const pieChart = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20.488 9H15V3.512zM11 3.055A9.001 9.001 0 1 0 20.945 13H11z\"/></svg>";
const pinBookmark = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12.273 15.182H5q0-3.651 3.182-5.91l.454-3.181H6.818V3a1 1 0 0 1 1-1h8.909a1 1 0 0 1 1 1v3.09h-1.818l.455 3.183q3.18 2.258 3.181 5.909zV22\"/></svg>";
const pin = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 10a9 9 0 0 0-18 0c0 7 9 13 9 13s9-6 9-13m-9 3a3 3 0 1 0-3-3m3 3a3 3 0 1 1 3-3\"/></svg>";
const play = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m5 3 14 9-14 9z\"/></svg>";
const previous = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10m2.588-19.66c5.335 1.43 8.5 6.914 7.071 12.248-1.43 5.335-6.913 8.5-12.247 7.071-5.335-1.43-8.5-6.913-7.071-12.247M12 16l-4-4 4-4m4 4H8\"/></svg>";
const print = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 14h12v8H6z\"/><path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 9V2h12v7\"/></svg>";
const qrcode = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 20h-1m3.992 0c-.11.009.119 0 .01 0zM16 14h-2m3 3h3m-6 0v1m5-4h1m-6-4h6V4h-6m6 6h-6V4h6M4 4h6v6H4m6-6H4v6h6m-6 4h6v6H4m6-6H4v6h6\"/></svg>";
const index_module_radio = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"7\"/><circle cx=\"12\" cy=\"12\" r=\"9\"/></svg>";
const redo = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15 14h6V8\"/><path d=\"M3 17.2c0-5 4-9 9-9 2.4 0 4.7.9 6.4 2.6L21 14\"/></svg>";
const reload = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M23 20v-6h-6M7 10H1V4v6l4.64-4.36A9 9 0 0 1 20.49 9M23 14l-4.64 4.36A9 9 0 0 1 3.51 15\"/></svg>";
const repeat = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m17 1 4 4-4 4\"/><path d=\"M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4\"/><path d=\"M21 13v2a4 4 0 0 1-4 4H3\"/></svg>";
const roles = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M1 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2M9 11a4 4 0 1 0-4-4m4 4a4 4 0 1 1 4-4m7 8.13A4 4 0 0 1 23 19v2m-7-10.12a4 4 0 0 0 0-7.75\"/></svg>";
const rotate = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4.51 14.99a9 9 0 1 0 2.13-9.36L2 9.99v-6 6h6\"/></svg>";
const route = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 23h13c2 0 5 0 5-3s-2-3-4-3-6.5.5-6.5-3 4.5-3 6.5-3m4-5.91C23 8.274 19 11 19 11s-4-2.727-4-5.91C15 2.833 16.79 1 19 1s4 1.832 4 4.09m-14 12C9 14.833 7.21 13 5 13s-4 1.832-4 4.09C1 20.274 5 23 5 23s4-2.727 4-5.91M5 18a1 1 0 1 0-1-1m1 1a1 1 0 1 1 1-1M18 5a1 1 0 1 1 1 1m1-1a1 1 0 1 0-1 1\"/></svg>";
const save = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 3v5h8m6 11V8l-5-5H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14-2v-8H7v8M21 9v10a2 2 0 0 1-2 2H8\"/></svg>";
const scanCode = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7.556 2H4.222A2.22 2.22 0 0 0 2 4.222v3.334m20 0V4.222A2.22 2.22 0 0 0 19.778 2h-3.334m0 20h3.334A2.22 2.22 0 0 0 22 19.778v-3.334m-20 0v3.334C2 21.005 2.995 22 4.222 22h3.334M2 12h20\"/></svg>";
const scanQrCode = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7.556 2H4.222A2.22 2.22 0 0 0 2 4.222v3.334m20 0V4.222A2.22 2.22 0 0 0 19.778 2h-3.334m0 20h3.334A2.22 2.22 0 0 0 22 19.778v-3.334m-20 0v3.334C2 21.005 2.995 22 4.222 22h3.334M6 18h4v-4H6m4 4H6v-4h4m-4-4h4V6H6m4 4H6V6h4m4 0h4v4h-4m4-4h-4v4h4m-4.08 8c-.11.009.119 0 .01 0zm0-4c-.11.009.119 0 .01 0zm4 0c-.11.009.119 0 .01 0zm0 4c-.11.009.119 0 .01 0zm-2-2c-.11.009.119 0 .01 0z\"/></svg>";
const search = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m21 21-4.35-4.35M11 19a8 8 0 1 0-8-8m8 8a8 8 0 1 1 8-8\"/></svg>";
const send = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M11 13 22 2l-7 20zL2 9l20-7\"/></svg>";
const settings = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 12a3 3 0 1 1 3 3m3-3a3 3 0 1 0-3 3M4.541 8.92c.207-.732.2-1.258-.271-1.74l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82c.26.604.852.997 1.51 1H21a2 2 0 1 1 0 4h-.09A1.65 1.65 0 0 0 19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33H15a1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82V15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09q1.244-.348 1.451-1.08\"/></svg>";
const share = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m15.41 6.51-6.82 3.98m0 3.02 6.83 3.98M18 22a3 3 0 1 0-3-3m3 3a3 3 0 1 1 3-3M18 8a3 3 0 1 0-3-3m3 3a3 3 0 1 1 3-3M6 15a3 3 0 1 0-3-3m3 3a3 3 0 1 1 3-3\"/></svg>";
const shield = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10\"/></svg>";
const shortParagraph = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 14.5h12m4-4H4\"/></svg>";
const show = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8m11-8s-4-8-11-8-11 8-11 8 4 8 11 8m0-5a3 3 0 1 0-3-3m3 3a3 3 0 1 1 3-3\"/></svg>";
const signIn = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4m-5-4 5-5-5-5m5 5H3\"/></svg>";
const signOut = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4m7-4 5-5-5-5 5 5H9\"/></svg>";
const skills = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 8a7 7 0 1 1 7 7m7-7a7 7 0 1 0-7 7m-3.79-1.11L7 23l5-3 5 3-1.21-9.12\"/></svg>";
const skipBack = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M19 4v16L9 12zM5 5v14\"/></svg>";
const skipForward = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 4v16l10-8zm14 1v14\"/></svg>";
const sortAlphaAsc = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5.5 2v19.5M10 17l-4.5 5L1 17m15-2h6l-6 7h6m1-12-4-8-4 8 1.5-3h5\"/></svg>";
const sortAlphaDesc = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5.5 2v19.5M10 17l-4.5 5L1 17M16 2h6l-6 7h6m1 13-4-8-4 8 1.5-3h5\"/></svg>";
const sortAsc = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M11 5h4m-4 4h7m-7 4h10M3 17l3 3 3-3m-3 1V4\"/></svg>";
const sortDesc = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M11 5h10M11 9h7m-7 4h4M3 17l3 3 3-3m-3 1V4\"/></svg>";
const sortHorizontal = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 7h12m0 0-4-4m4 4-4 4m0 6H4m0 0 4 4m-4-4 4-4\"/></svg>";
const sortVertical = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 16V4m0 0L3 8m4-4 4 4m6 0v12m0 0 4-4m-4 4-4-4\"/></svg>";
const star = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z\"/></svg>";
const streetview = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4.222 15.208C2.232 15.955 1 16.986 1 18.125c0 2.278 4.925 4.125 11 4.125s11-1.847 11-4.125c0-1.14-1.231-2.17-3.222-2.917M12 19.5h2.333a1 1 0 0 0 1-1V14H16a1 1 0 0 0 1-1v-3a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h.667v4.5a1 1 0 0 0 1 1zM12 7a3 3 0 1 0-3-3m3 3a3 3 0 0 1-3-3\"/></svg>";
const tablet = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2M6 2a2 2 0 0 0-2 2v16m8-2h.01z\"/></svg>";
const tasks = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m2 0H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M8 5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H9m7 3a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h6\"/></svg>";
const themeMap = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M1 6v14l7-2.5 8 2.5 7-2V4l-7 2.5L8 4zl7-2v13.5l8 2.5V6.5\"/></svg>";
const timeAlarm = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 14a8 8 0 1 1 8 8m8-8a8 8 0 1 0-8 8m6-13.793 1.06-1.06M12 10v5m0-9V2h-2 4\"/></svg>";
const timeHistory = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 2h16m-1 .952C18.333 9.62 15 12 12 12S5.667 9.619 5 2.952m0 18.572c.667-6.667 4-9.048 7-9.048s6.333 2.381 7 9.048M20 22H4\"/></svg>";
const time = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 6v6l4 2m-4 8c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12m10 10C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10\"/></svg>";
const timeseries = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 21a2 2 0 1 0-2-2m2 2a2 2 0 1 1 2-2m-1.125-1.798 4.254-6.401m1.827-.045 3.57 4.886M7 9a2 2 0 1 1 2 2m2-2a2 2 0 1 0-2 2m6 8a2 2 0 1 0-2-2m2 2a2 2 0 1 1 2-2m-1-1.735 4-7.534M21 8a2 2 0 1 0-2-2m2 2a2 2 0 1 1 2-2m-2 2a2 2 0 1 0-2-2m2 2a2 2 0 1 1 2-2\"/></svg>";
const trash = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 6h18-2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h3V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-6 5v6m4 0v-6\"/></svg>";
const trendingDown = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m1 6 7.5 7.5 5-5L23 18h-6 6v-6\"/></svg>";
const trendingUp = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m1 18 7.5-7.5 5 5L23 6h-6 6v6\"/></svg>";
const turbine = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"feather feather-aperture\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m14.31 8 5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16 3.95 6.06M14.31 16H2.83m13.79-4-5.74 9.94\"/></svg>";
const type = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 7V4H4v3m5 13h6-3V4\"/></svg>";
const underline = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 3v7a6 6 0 1 1-12 0V3M4 21h16\"/></svg>";
const undo = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 14H3V8\"/><path d=\"M21 17.2c0-5-4-9-9-9-2.4 0-4.7.9-6.4 2.6L3 14\"/></svg>";
const unlink = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m11.75 5.18 1.72-1.71a5 5 0 0 1 7.07 7.07l-1.5 1.5M6.46 10.46l-3 3a5 5 0 0 0 7.07 7.07M21 22l-6-6m0 5.933L21 16\"/></svg>";
const unlock = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6.998a2 2 0 0 0-2-2m2 8.999A2 2 0 0 1 19 22H5a2 2 0 0 1-2-2v-6.998a2 2 0 0 1 2-2h14m-14 0h2V7.005a5 5 0 0 1 9.9-1\"/></svg>";
const uploadCloud = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12.004 20.996v-9l-4 4 4-4m8.39 6.39a5 5 0 0 0-2.39-9.389h-1.26a7.999 7.999 0 1 0-13.739 7.3m5-.3 4-4 3.999 4\"/></svg>";
const upload = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3v12m5-7-5-5-5 5m14 7v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/></svg>";
const user = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2m-8-10a4 4 0 1 0-4-4m4 4a4 4 0 1 1 4-4\"/></svg>";
const validation = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3\"/></svg>";
const videoCamera = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M23 7v10l-7-5zM3 5h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2\"/></svg>";
const warning = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0M12 9v4m0 4h.01\"/></svg>";
const watch = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m16.51 17.35-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83M5 12a7 7 0 1 1 7 7m-7-7a7 7 0 0 0 7 7m1.5-5.5L12 12V9M7.49 6.65l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83\"/></svg>";
const wifiOff = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M23 23 1 1m10.992 19c-.11.009.119 0 .01 0zM5 12.55a10.94 10.94 0 0 1 5.17-2.39M6.12 6.12A15.9 15.9 0 0 0 1.42 9m7.11 7.11a6 6 0 0 1 6.95 0M19 12.55a11 11 0 0 0-2.28-1.49M22.58 9a16 16 0 0 0-11.87-3.95\"/></svg>";
const wifi = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M1.42 8c6-5.33 15-5.33 21 0m-3.474 3.55a10.85 10.85 0 0 0-13.973 0m3.503 3.56a5.92 5.92 0 0 1 6.898 0M11.92 19c-.11.009.119 0 .01 0z\"/></svg>";
const zoomIn = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m21 21-4.35-4.35M11 19a8 8 0 1 0-8-8m8 8a8 8 0 1 1 8-8m-8-3v6m-3-3h6\"/></svg>";
const zoomOut = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m21 21-4.35-4.35M11 19a8 8 0 1 0-8-8m8 8a8 8 0 1 1 8-8M8 11h6\"/></svg>";

;// ./src/utils/uuid.js
function uuid() {
  var id = '';
  var random;
  var i;

  for (i = 0; i < 32; i++) {
    random = (Math.random() * 16) | 0;

    if (i === 8 || i === 12 || i === 16 || i === 20) {
      id += '-';
    }

    id += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
  }

  return id;
}

;// ./src/modules/toaster.js












var toaster_document = window.document;

var toaster_DEFAULTS = {
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
  emitter_component_default().call(this);

  options = this.options = extend_default()(true, {}, toaster_DEFAULTS, options);

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

inheritPrototype(Toaster, (emitter_component_default()));

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
  options = extend_default()(true, {}, this.options, options || {});

  var self = this;

  var template;
  if (options.type) {
    template = getToastTemplate(options);
  } else {
    template = options.template;
  }

  var itemId = options.id || uuid();
  var item = domify_default()(template);
  var itemClasses = component_classes_default()(item);

  if (typeof content === 'string') {
    if (options.closable || options.type) {
      var contentEl = toaster_document.createElement('div');
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
  delay(15)(function () {
    self.show(item);
  });

  if (options.duration) {
    delay(parseInt(options.duration, 10) + 15)(function () {
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

  component_classes_default()(element).remove('is-shown').add('is-hidden');

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

  transitEnd(
    element,
    function () {
      var idx = this._items.indexOf(element);

      element.parentNode.removeChild(element);

      if (idx !== -1) {
        this._items.splice(idx, 1);
        this._ids.splice(idx, 1);
        this._actionHandlers.splice(idx, 1);
      }

      this.emit('hide');
    }.bind(this)
  );
};

/**
 * Reveals the toast item after it has been placed in the container
 */
Toaster.prototype.show = function (element) {
  this.emit('showing', element);

  set_immediate(function () {
    component_classes_default()(element).remove('is-hidden').add('is-shown');
  });

  transitEnd(
    element,
    function () {
      this.emit('show', element);
    }.bind(this)
  );
};

function createWrapper() {
  return toaster_document.body.appendChild(toaster_document.createElement('div'));
}

function getToastTemplate(options) {
  var template;
  var closeButtonMarkup = '';
  var itemClasses =
    'toaster-item toaster-item--elevated fill-neutral--minimal notification notification--headless notification--' +
    String(options.type);

  if (options.closable) {
    closeButtonMarkup = [
      '<button type="button" class="notification-dismissBtn btn btn--ghost btn--icon js-dismissWaveToast" aria-label="' +
        options.dismissLabel +
        '">',
      '<i class="pf pf-close" aria-hidden="true"></i>',
      '</button>'
    ].join('');
  }

  var actionMarkup = '';
  if (options.action) {
    actionMarkup = [
      '<div class="notification-actions">',
      '<button type="button" class="btn btn--outline js-waveToastAction">',
      options.action.label,
      '</button>',
      '</div>'
    ].join('');
  }

  var iconWrapperMarkup = '';
  if (options.type) {
    var notificationIcon = getNotificationIcon(options.type);

    iconWrapperMarkup = notificationIcon
      ? [
          '<div class="notification-icon">',
          '<div class="svgIcon svgIcon--stroked">',
          notificationIcon,
          '</div>',
          '</div>'
        ].join('')
      : '';
  }

  switch (options.type) {
    case TOAST_TYPES.INFO:
      template =
        '<div class="' +
        itemClasses +
        '" aria-live="polite">' +
        iconWrapperMarkup +
        actionMarkup +
        closeButtonMarkup +
        '</div>';
      break;
    case TOAST_TYPES.WARNING:
      template =
        '<div class="' +
        itemClasses +
        '" role="alert">' +
        iconWrapperMarkup +
        actionMarkup +
        closeButtonMarkup +
        '</div>';
      break;
    case TOAST_TYPES.ERROR:
      template =
        '<div class="' +
        itemClasses +
        '" role="alert">' +
        iconWrapperMarkup +
        actionMarkup +
        closeButtonMarkup +
        '</div>';
      break;
    case TOAST_TYPES.SUCCESS:
      template =
        '<div class="' +
        itemClasses +
        '" aria-live="polite">' +
        iconWrapperMarkup +
        actionMarkup +
        closeButtonMarkup +
        '</div>';
      break;
  }

  return template || options.template;
}

function getNotificationIcon(type) {
  switch (type) {
    case TOAST_TYPES.INFO:
      return info;
    case TOAST_TYPES.WARNING:
      return warning;
    case TOAST_TYPES.ERROR:
      return error;
    case TOAST_TYPES.SUCCESS:
      return validation;
  }
}

;// ./src/modules/toggle-switch.js






var CHECKBOX_ROLE = 'checkbox';
var SWITCH_BUTTON_CLASS = 'toggleSwitch-button';
var SWITCH_CHECKED_CLASS = 'toggleSwitch--is-checked';
var SWITCH_ENABLED_CLASS = 'toggleSwitch--is-enabled';
var SWITCH_DISABLED_CLASS = 'toggleSwitch--is-disabled';

function createToggleSwitch(el, options) {
  return new ToggleSwitch(el, options);
}

function ToggleSwitch(el, options) {
  if (!el) {
    throw new Error('Wave.ToggleSwitch() requires a DOM element to initialize');
  }

  emitter_component_default().call(this);

  options = options || {};

  this.el = el;
  this._toggleButton = this.el.querySelector('.' + SWITCH_BUTTON_CLASS);
  this._value = Boolean(options.value);
  this._isDisabled = Boolean(options.isDisabled);

  if (!this._toggleButton.hasAttribute('role')) {
    this._toggleButton.setAttribute('role', CHECKBOX_ROLE);
  }

  this._setCheckedState();
  this._setDisabledState();

  this._handleToggleButtonClick = this._handleToggleButtonClick.bind(this);
  component_event.bind(
    this._toggleButton,
    'click',
    this._handleToggleButtonClick
  );

  return this;
}

inheritPrototype(ToggleSwitch, (emitter_component_default()));

ToggleSwitch.prototype._handleToggleButtonClick = function (e) {
  e.preventDefault();

  if (this._isDisabled) {
    return;
  }

  this._toggle();
};

ToggleSwitch.prototype._setCheckedState = function () {
  component_classes_default()(this.el)[this._value ? 'add' : 'remove'](SWITCH_CHECKED_CLASS);
  this._toggleButton.setAttribute('aria-checked', this._value);
};

ToggleSwitch.prototype._setDisabledState = function () {
  var addClass = this._isDisabled
    ? SWITCH_DISABLED_CLASS
    : SWITCH_ENABLED_CLASS;
  var removeClass = this._isDisabled
    ? SWITCH_ENABLED_CLASS
    : SWITCH_DISABLED_CLASS;

  component_classes_default()(this.el).add(addClass).remove(removeClass);

  if (this._isDisabled) {
    this._toggleButton.setAttribute('disabled', 'disabled');
  } else {
    this._toggleButton.removeAttribute('disabled');
  }
};

ToggleSwitch.prototype._toggle = function (checked) {
  this._value = checked === undefined ? !this._value : checked;

  this._setCheckedState();

  this.emit('change', this._value);
};

ToggleSwitch.prototype.getValue = function () {
  return this._value;
};

ToggleSwitch.prototype.activate = function () {
  this._toggle(true);
  return this;
};

ToggleSwitch.prototype.deactivate = function () {
  this._toggle(false);
  return this;
};

ToggleSwitch.prototype.toggle = function () {
  this._toggle();
  return this;
};

ToggleSwitch.prototype.enable = function () {
  this._isDisabled = false;
  this._setDisabledState();
  return this;
};

ToggleSwitch.prototype.disable = function () {
  this._isDisabled = true;
  this._setDisabledState();
  return this;
};

ToggleSwitch.prototype.destroy = function () {
  component_event.unbind(
    this._toggleButton,
    'click',
    this._handleToggleButtonClick
  );
};

;// ./src/modules/drill-down-nav/group.js


var group_DEFAULTS = {
  state: 'active',
  afterStateChange: undefined
};

function Group(options) {
  this.options = extend_default()(true, {}, group_DEFAULTS, options);
  this.panels = [];
  this.activePanel = undefined;
}

Group.prototype.addPanel = function addPanel(panel) {
  if (
    !this.panels.some(function (p) {
      return p === panel;
    })
  ) {
    this.panels.push(panel);
  }

  return this;
};

Group.prototype.setActivePanel = function setActivePanel(activePanel) {
  if (activePanel === this.activePanel) {
    return this;
  }

  this.activePanel = activePanel;

  this.panels.forEach(function (p) {
    if (p === activePanel) {
      return;
    }

    p.setState(false, true);
  });
  this.afterStateChange();

  return this;
};

Group.prototype.removeActivePanel = function removeActivePanel() {
  this.activePanel = false;
  this.panels.forEach(function (p) {
    p.setState(false, true);
  });
  this.afterStateChange();

  return this;
};

Group.prototype.afterStateChange = function afterStateChange() {
  var hasActivePanel = Boolean(this.activePanel);

  if (this.options.parent && this.options.parent.activePanel) {
    this.options.parent.activePanel.setIsVisible(!hasActivePanel);
  }

  if (typeof this.options.afterStateChange === 'function') {
    this.options.afterStateChange(this, hasActivePanel, this.activePanel);
  }
};

;// ./src/utils/state.js
/**
 * Conditional state classes
 */



function state(elem, className, active) {
  if (typeof active === 'undefined') {
    return component_classes_default()(elem).has('is-' + className);
  }

  var service = active === 'toggle' ? 'toggle' : active ? 'add' : 'remove';

  component_classes_default()(elem)[service]('is-' + className);

  return Boolean(active);
}

;// ./src/modules/drill-down-nav/panel.js




var panel_DEFAULTS = {
  canTurnSelfOff: true
};

function Panel(el, options) {
  this.options = extend_default()(true, {}, panel_DEFAULTS, options);
  this.el = el;
  this.triggers = [];
  this.state = false;
  this.group = options.group.addPanel(this);
}

Panel.prototype.addTrigger = function addTrigger(trigger) {
  if (
    !this.triggers.some(function (t) {
      return t === trigger;
    })
  ) {
    trigger.index = this.triggers.length;
    this.triggers.push(trigger);
  }

  return this;
};

Panel.prototype.removeTrigger = function removeTrigger(trigger) {
  this.triggers.splice(trigger.index, 1);

  return this;
};

Panel.prototype.setIsVisible = function setIsVisible(isVisible) {
  state(this.el, 'visible', isVisible);
};

Panel.prototype.setState = function setState(active, calledByGroup) {
  active = active === 'toggle' ? !this.state : active;

  if (active !== this.state) {
    state(this.el, this.group.options.state, (this.state = active));
    this.setIsVisible(active);

    if (active) {
      this.group.setActivePanel(this);
    } else if (!calledByGroup) {
      this.group.removeActivePanel();
    }
  }

  this.triggers.forEach(function (t) {
    return t.setState();
  });

  return this;
};

;// ./src/utils/kebab-case.js


var WORD_SEPARATORS =
  /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]+/;
var CAPITAL_PLUS_LOWER = /[A-ZÀ-Ý\u00C0-\u00D6\u00D9-\u00DD][a-zà-ÿ]/g;
var CAPITALS = /[A-ZÀ-Ý\u00C0-\u00D6\u00D9-\u00DD]+/g;

function kebabCase(str) {
  str = str.replace(CAPITAL_PLUS_LOWER, function (match) {
    return ' ' + (match[0].toLowerCase() || match[0]) + match[1];
  });
  str = str.replace(CAPITALS, function (match) {
    return ' ' + match.toLowerCase();
  });

  return trim(str)
    .split(WORD_SEPARATORS)
    .join('-')
    .replace(/^-/, '')
    .replace(/-\s*$/, '');
}

;// ./src/utils/data.js


/**
 * Helper for storing arbitrary data associated with an element.
 * The data is stored directly on the DOM elements using a Symbol and
 * garbage collection is handled by the browser
 */

var DATA_KEY = (window.Symbol && Symbol('data')) || '__PUI__DATA_KEY';

function data(elem, key, value) {
  if (!elem || typeof key === 'undefined') {
    return;
  }

  var data = (elem[DATA_KEY] = elem[DATA_KEY] || {});

  if (typeof value !== 'undefined') {
    return (data[key] = value);
  }

  if (typeof data[key] === 'undefined') {
    return (data[key] = elem.dataset
      ? elem.dataset[key]
      : elem.getAttribute('data-' + kebabCase(key)));
  }

  return data[key];
}

;// ./src/modules/drill-down-nav/trigger.js





var trigger_DEFAULTS = {
  activeEvent: 'click',
  inactiveEvent: 'click'
};

function Trigger(el, options) {
  var trigger = data(el, '_trigger');
  if (trigger instanceof Trigger) return trigger;

  this.options = extend_default()(true, {}, trigger_DEFAULTS, options);
  this.el = el;
  this.panel = options.panel.addTrigger(this);
  this.setState();

  if (
    el.tagName.toLowerCase() !== 'a' &&
    el.tagName.toLowerCase() !== 'button'
  ) {
    el.setAttribute('tabindex', '0');
  }

  el.addEventListener(this.options.activeEvent, this, false);
  if (this.options.activeEvent !== this.options.inactiveEvent) {
    el.addEventListener(this.options.inactiveEvent, this, false);
  }

  data(el, '_trigger', trigger);
}

Trigger.prototype.setState = function setState() {
  state(this.el, this.panel.group.options.state, this.panel.state);

  return this;
};

Trigger.prototype.handleEvent = function handleEvent(e) {
  if (e.type === this.options.activeEvent && !this.panel.state) {
    if (e.type === 'click' && (e.metaKey || e.ctrlKey)) return;
    e.preventDefault();
    this.panel.setState(true);
  } else if (e.type === this.options.inactiveEvent && this.panel.state) {
    e.preventDefault();
    this.panel.setState(!this.panel.options.canTurnSelfOff);
  }
};

Trigger.prototype.detach = function detach() {
  this.panel.removeTrigger(this);
  this.el.removeEventListener(this.options.activeEvent, this);
  if (this.options.activeEvent !== this.options.inactiveEvent) {
    this.el.removeEventListener(this.options.inactiveEvent, this);
  }

  return this;
};

Trigger.prototype.destroy = function destroy() {
  this.detach();
  this.el.parentNode.removeChild(this.el);

  return this;
};

;// ./src/modules/drill-down-nav/drill-down-nav.js







var reduce = function reduce(arr, fnc, initial) {
  return Array.prototype.reduce.call(arr, fnc, initial);
};

var drill_down_nav_DEFAULTS = {
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
  this.options = extend_default()(true, {}, drill_down_nav_DEFAULTS, options);

  var parentNode = this.options.rootSelector
    ? this.el.querySelector(this.options.rootSelector)
    : this.el;

  var sectionsWrapperNode = this.el.querySelector(
    '.' + this.options.sectionsWrapperClass
  );

  var group = (this.rootGroup = new Group({
    state: 'open',
    afterStateChange: function afterStateChange(_group, hasActivePanel) {
      if (sectionsWrapperNode != null) {
        component_classes_default()(sectionsWrapperNode).toggle('no-scroll', hasActivePanel);
      }
    }
  }));

  this.panels = getSectionNodes(parentNode, this.options.sectionClass).reduce(
    function (flattenedPanels, sectionNode) {
      var section = new Section(sectionNode, group, null, _this.options);
      flattenedPanels.push(section.panel);

      if (section.subPanels.length > 0) {
        flattenedPanels.push.apply(flattenedPanels, section.subPanels);
      }

      return flattenedPanels;
    },
    []
  );
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

  this.headerTrigger =
    options.subNavToggleSelector === 'header'
      ? this.header
      : this.header.querySelector(options.subNavToggleSelector);
  this.navHeaderTrigger =
    options.subNavToggleSelector === 'header'
      ? this.navHeader
      : this.navHeader.querySelector(options.subNavToggleSelector);

  var panel = (this.panel = new Panel(node, {
    group,
    parent: parentPanel
  }));

  new Trigger(this.headerTrigger, { panel }); // eslint-disable-line no-new
  new Trigger(this.navHeaderTrigger, { panel }); // eslint-disable-line no-new

  var subSections = getSectionNodes(navContent, options.sectionClass);

  if (subSections.length) {
    var subGroup = (panel.options.subGroup = new Group({
      state: 'open',
      parent: group
    }));

    subSections.forEach(function (node) {
      return new Section(node, subGroup, panel, options);
    });

    this.subPanels = subGroup.panels;
  } else {
    this.subPanels = [];
  }
}

function getSectionNodes(node, sectionClass) {
  return reduce(
    node.children,
    function sectionNodesReducer(sectionNodes, node) {
      if (node.tagName.toLowerCase() === 'section') {
        if (component_classes_default()(node).has(sectionClass)) {
          sectionNodes.push(node);
          return sectionNodes;
        }

        sectionNodes = reduce(node.children, sectionNodesReducer, sectionNodes);
      }

      return sectionNodes;
    },
    []
  );
}

function getChildHeaderOf(node) {
  var children = node.children;
  var child;
  var foundHeader;
  var i;

  if (children) {
    for (i = 0; i < children.length; i++) {
      child = children[i];

      if (component_classes_default()(child).has('drillDownNav-header')) {
        foundHeader = child;
        break;
      }
    }
  }

  return foundHeader;
}

;// ./src/utils/CustomEvent.js
var CustomEvent;

if (typeof window !== 'undefined' && typeof window.CustomEvent !== 'function') {
  CustomEvent = function (event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };

    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );
    return evt;
  };

  CustomEvent.prototype = window.Event.prototype;
} else {
  CustomEvent = window.CustomEvent;
}

/* harmony default export */ var utils_CustomEvent = (CustomEvent);

;// ./src/utils/focus-manager.js
function FocusManager(element) {
  if (!element) {
    throw new Error('FocusManager needs an element reference');
  }

  this.element = element;
  this.firstVisible = null;
  this.lastVisible = null;
  this._focusableElements = [];
}

FocusManager.prototype.setFocusableElements = function getFocusableElements() {
  // get all focusable elements inside element
  this._focusableElements = this.element.querySelectorAll(
    '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  this._setFirstVisible();
  this._setLastVisible();
};

FocusManager.prototype.clearFocusableElements =
  function clearFocusableElements() {
    this.firstVisible = null;
    this.lastVisible = null;
    this._focusableElements = [];
  };

FocusManager.prototype.trapFocus = function trapFocus(event) {
  // mobile layout only
  if (this.firstVisible === document.activeElement && event.shiftKey) {
    // on Shift+Tab -> focus last focusable element when focus moves out of sidebar
    event.preventDefault();
    this.lastVisible.focus();
  }
  if (this.lastVisible === document.activeElement && !event.shiftKey) {
    // on Tab -> focus first focusable element when focus moves out of sidebar
    event.preventDefault();
    this.firstVisible.focus();
  }
};

FocusManager.prototype._setFirstVisible = function _setFirstVisible() {
  // get first visible focusable element inside the sidebar
  for (var i = 0; i < this._focusableElements.length; i++) {
    if (
      this._focusableElements[i].offsetWidth ||
      this._focusableElements[i].offsetHeight ||
      this._focusableElements[i].getClientRects().length
    ) {
      this.firstVisible = this._focusableElements[i];
      return true;
    }
  }
};

FocusManager.prototype._setLastVisible = function _setLastVisible() {
  // get last visible focusable element inside the sidebar
  for (var i = this._focusableElements.length - 1; i >= 0; i--) {
    if (
      this._focusableElements[i].offsetWidth ||
      this._focusableElements[i].offsetHeight ||
      this._focusableElements[i].getClientRects().length
    ) {
      this.lastVisible = this._focusableElements[i];
      return true;
    }
  }
};

FocusManager.moveFocus = function moveFocus(element) {
  if (!element) {
    element = document.getElementsByTagName('body')[0];
  }

  element.focus();

  if (document.activeElement !== element) {
    element.setAttribute('tabindex', '-1');
    element.focus();
  }
};

;// ./src/modules/sidebar.js








// track all active instances
var activeInstances = [];
var customEvent = new utils_CustomEvent('updateSidebar');
var resizeListener;

function resetLayout() {
  activeInstances.forEach(function each(instance) {
    instance.element.dispatchEvent(customEvent);
  });
}

function createSidebar(element, options) {
  var instance = new Sidebar(element, options);
  activeInstances.push(instance);

  return instance;
}

function Sidebar(element, options) {
  options = options || {};

  this.element = element;
  this.sidebarPanelElement = this.element.querySelector('.js-sidebar-panel');
  this.triggers = document.querySelectorAll(
    '[aria-controls="' + this.element.getAttribute('id') + '"]'
  );
  this.selectedTrigger = null;
  this.showClass = 'sidebar--is-visible';
  this.animatableClass = 'sidebar--is-animatable';
  this.staticClass =
    'sidebar--static' + (options.staticClass ? ' ' + options.staticClass : '');
  this.tokenizedStaticClass = tokenize(this.staticClass);
  this.readyClass = 'sidebar--loaded';
  this.layout = false; // this will be static or mobile
  this.focusManager = new FocusManager(this.element);

  this.startX = 0;
  this.currentX = 0;
  this.touchingSidebar = false;
  this.supportsPassive = undefined;

  this.transitionEndProperty = null;
  this.transitionEndTime = 0;

  this._update = this._update.bind(this);

  this._handleClick = this._handleClick.bind(this);
  this._handleSidebarPanelClick = this._handleSidebarPanelClick.bind(this);
  this._handleKeyDown = this._handleKeyDown.bind(this);
  this._handleTriggerClick = this._handleTriggerClick.bind(this);
  this._handleUpdateSidebar = this._handleUpdateSidebar.bind(this);
  this._handleTouchStart = this._handleTouchStart.bind(this);
  this._handleTouchMove = this._handleTouchMove.bind(this);
  this._handleTouchEnd = this._handleTouchEnd.bind(this);
  this._handleTransitionEnd = this._handleTransitionEnd.bind(this);

  this._init();
}

Sidebar.prototype._applyPassive = function _applyPassive() {
  if (this.supportsPassive !== undefined) {
    return this.supportsPassive ? { passive: true } : false;
  }

  // feature detect
  var isSupported = false;

  try {
    document.addEventListener('test', null, {
      get passive() {
        isSupported = true;
      }
    });
  } catch (e) {}

  this.supportsPassive = isSupported;

  return this._applyPassive();
};

Sidebar.prototype._handleTouchStart = function _handleTouchStart(event) {
  if (!component_classes_default()(this.element).has(this.showClass)) {
    return;
  }

  this.startX = event.touches[0].pageX;
  this.currentX = this.startX;

  this.touchingSidebar = true;

  raf(this._update);
};

Sidebar.prototype._handleTouchMove = function _handleTouchMove(event) {
  if (!this.touchingSidebar) {
    return;
  }

  this.currentX = event.touches[0].pageX;
};

Sidebar.prototype._handleTouchEnd = function _handleTouchEnd(event) {
  if (!this.touchingSidebar) {
    return;
  }

  this.touchingSidebar = false;

  var translateX = Math.min(0, this.currentX - this.startX);
  this.sidebarPanelElement.style.transform = '';

  if (translateX < 0) {
    this.close();
  }
};

Sidebar.prototype._update = function _update() {
  if (!this.touchingSidebar) {
    return;
  }

  raf(this._update);

  var translateX = Math.min(0, this.currentX - this.startX);
  this.sidebarPanelElement.style.transform = 'translateX(' + translateX + 'px)';
};

Sidebar.prototype._handleTransitionEnd = function _handleTransitionEnd(event) {
  if (
    event.propertyName !== this.transitionEndProperty &&
    event.elapsedTime !== this.transitionEndTime
  ) {
    return;
  }

  this.transitionEndProperty = null;
  this.transitionEndTime = 0;

  component_classes_default()(this.element).remove(this.animatableClass);

  this.element.removeEventListener('transitionend', this._handleTransitionEnd);
};

Sidebar.prototype._handleKeyDown = function _handleKeyDown(event) {
  // mobile layout only
  if (
    (event.keyCode && event.keyCode === 27) ||
    (event.key && event.key === 'Escape')
  ) {
    // close sidebar window on esc
    this.close();
  } else if (
    (event.keyCode && event.keyCode === 9) ||
    (event.key && event.key === 'Tab')
  ) {
    // trap focus inside sidebar
    this.focusManager.trapFocus(event);
  }
};

Sidebar.prototype._handleClick = function _handleClick(event) {
  // mobile layout only
  // close sidebar when clicking on close button or sidebar bg layer
  if (
    closest(event.target, '.js-sidebar-closeBtn', true) ||
    component_classes_default()(event.target).has('js-sidebar-overlay')
  ) {
    event.preventDefault();
    this.close();
  }
};

Sidebar.prototype._handleTriggerClick = function _handleTriggerClick(event) {
  event.preventDefault();
  if (component_classes_default()(this.element).has(this.showClass)) {
    this.selectedTrigger = event.target;
    this.close();
    return;
  }

  this.selectedTrigger = event.target;

  this.show();
  this._initEvents();
};

Sidebar.prototype._handleSidebarPanelClick = function _handleSidebarPanelClick(
  event
) {
  var sublistControl = closest(
    event.target,
    '.js-sidebar-sublistControl',
    true
  );

  if (sublistControl != null) {
    var listItem = sublistControl.parentElement;
    var listItemClasses = component_classes_default()(listItem);
    var isExpanded = listItemClasses.has('sidebar-navItem--expanded');

    sublistControl.setAttribute('aria-expanded', !isExpanded);
    listItemClasses.toggle('sidebar-navItem--expanded', !isExpanded);
  }
};

Sidebar.prototype._handleUpdateSidebar =
  function _handleUpdateSidebar(/* event */) {
    this.checkLayout();
  };

Sidebar.prototype._init = function _init() {
  // handle changes in layout -> mobile to static and viceversa
  this._initResize();

  if (this.triggers) {
    // open sidebar when clicking on trigger buttons - mobile layout only
    for (var i = 0; i < this.triggers.length; i++) {
      this.triggers[i].addEventListener('click', this._handleTriggerClick);
    }
  }

  this.sidebarPanelElement.addEventListener(
    'click',
    this._handleSidebarPanelClick
  );
};

Sidebar.prototype._initEvents = function _initEvents() {
  // mobile layout only
  // add event listeners
  this.element.addEventListener('keydown', this._handleKeyDown);
  this.element.addEventListener('click', this._handleClick);
  this.element.addEventListener(
    'touchstart',
    this._handleTouchStart,
    this._applyPassive()
  );
  this.element.addEventListener(
    'touchmove',
    this._handleTouchMove,
    this._applyPassive()
  );
  this.element.addEventListener('touchend', this._handleTouchEnd);
};

Sidebar.prototype._cancelEvents = function _cancelEvents() {
  // mobile layout only
  // remove event listeners
  this.element.removeEventListener('keydown', this._handleKeyDown);
  this.element.removeEventListener('click', this._handleClick);
  this.element.removeEventListener('touchstart', this._handleTouchStart);
  this.element.removeEventListener('touchmove', this._handleTouchMove);
  this.element.removeEventListener('touchend', this._handleTouchEnd);
};

Sidebar.prototype._initResize = function _initResize() {
  if (!resizeListener) {
    window.addEventListener(
      'resize',
      (resizeListener = function resizeListener(/* event */) {
        raf(resetLayout);
      })
    );
  }

  // custom event emitted when window is resized - detect only if the sidebar--static@{breakpoint} class was added
  var beforeContent = getComputedStyle(
    this.element,
    ':before'
  ).getPropertyValue('content');

  if (beforeContent && beforeContent !== '' && beforeContent !== 'none') {
    this.checkLayout();

    this.element.addEventListener('updateSidebar', this._handleUpdateSidebar);
  }

  component_classes_default()(this.element).add(this.readyClass);
};

Sidebar.prototype.checkLayout = function checkLayout() {
  var layout = getComputedStyle(this.element, ':before')
    .getPropertyValue('content')
    .replace(/'|"/g, '');
  var elementClasses = component_classes_default()(this.element);

  if (layout === this.layout) {
    return;
  }

  this.layout = layout;

  if (layout !== 'static') {
    elementClasses.add('is-hidden');
  }

  this.tokenizedStaticClass.forEach(function (className) {
    elementClasses.toggle(className, layout === 'static');
  });

  if (layout !== 'static') {
    setTimeout(function () {
      elementClasses.remove('is-hidden');
    });
  }

  // reset element role
  if (layout === 'static') {
    this.element.removeAttribute('role', 'alertdialog');
  } else {
    this.element.setAttribute('role', 'alertdialog');
  }

  // reset mobile behaviour
  if (layout === 'static' && elementClasses.has(this.showClass)) {
    this.close();
  }
};

Sidebar.prototype.show = function show() {
  component_classes_default()(this.element).add(this.animatableClass).add(this.showClass);

  this.focusManager.setFocusableElements();

  this.transitionEndProperty = 'transform';
  this.transitionEndTime = 0.33;

  this.element.addEventListener('transitionend', this._handleTransitionEnd);

  FocusManager.moveFocus(this.element);
};

Sidebar.prototype.close = function close() {
  component_classes_default()(this.element).add(this.animatableClass).remove(this.showClass);

  this.focusManager.clearFocusableElements();

  this.transitionEndProperty = 'transform';
  this.transitionEndTime = 0.13;

  this.element.addEventListener('transitionend', this._handleTransitionEnd);

  if (this.selectedTrigger) {
    this.selectedTrigger.focus();
  }

  this.element.removeAttribute('tabindex');

  this._cancelEvents();
};

Sidebar.prototype.destroy = function destroy() {
  this._cancelEvents();
  this.element.removeEventListener('transitionend', this._handleTransitionEnd);
  this.element.removeEventListener('updateSidebar', this._handleUpdateSidebar);
  this.sidebarPanelElement.removeEventListener(
    'click',
    this._handleSidebarPanelClick
  );

  if (this.triggers.length > 0) {
    for (var i = 0; i < this.triggers.length; i++) {
      this.triggers[i].removeEventListener('click', this._handleTriggerClick);
    }
  }

  this.focusManager.clearFocusableElements();

  component_classes_default()(this.element)
    .remove(this.animatableClass)
    .remove(this.showClass)
    .remove('is-hidden');

  this.element.removeAttribute('tabindex');
  this.element.removeAttribute('role', 'alertdialog');

  activeInstances.splice(activeInstances.indexOf(this), 1);

  if (activeInstances.length === 0) {
    window.removeEventListener('resize', resizeListener);
    resizeListener = undefined;
  }
};

// EXTERNAL MODULE: ../.yarn/cache/mark.js-npm-8.11.1-04e3941033-3b01b9ea47.zip/node_modules/mark.js/dist/mark.js
var mark = __webpack_require__(141);
var mark_default = /*#__PURE__*/__webpack_require__.n(mark);
;// ./src/modules/multi-select/template.js
/* eslint-disable prettier/prettier */
/* harmony default export */ var multi_select_template = ([
  '<div class="multiSelect" role="combobox">',
    '<div class="multiSelect-labelList fg-accent--moderate">',
      '<input class="multiSelect-element" type="text" role="searchbox" aria-multiline="false" aria-autocomplete="list" aria-label="search">',
      '<div class="multiSelect-elementAutosize"></div>',
      '<div class="multiSelect-unselectAllButton">',
        '<button type="button" class="btn mAn btn--small btn--fullRounded btn--ghost btn--icon">',
          '<span class="svgIcon svgIcon--stroked"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 18L18 6M6 6l12 12" /></svg></span>',
        '</button>',
      '</div>',
      '<div class="multiSelect-arrowButton">',
        '<button type="button" aria-expanded="false" class="btn mAn btn--small btn--fullRounded btn--ghost btn--icon">',
          '<span class="svgIcon svgIcon--stroked"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 8l8 8 8-8" /></svg></span>',
        '</button>',
      '</div>',
    '</div>',
    '<div tabindex="-1" class="multiSelect-dropdownList fg-neutral themedScrollbar scrollable-y elevationM">',
      '<div class="multiSelect-emptyState"></div>',
      '<div class="multiSelect-filteredState"></div>',
    '</div>',
  '</div>'
].join(''));

;// ./src/modules/multi-select/template-checklist-item.js
/* eslint-disable prettier/prettier */
/* harmony default export */ var template_checklist_item = ([
  '<span class="multiSelect-item" role="listitem">',
    '<label class="formControl">',
      '<input tabindex="-1" class="formControl-state multiSelect-itemCheckbox" type="checkbox" />',
      '<span class="formControl-indicator"></span>',
      '<span class="formControl-label multiSelect-itemLabel mLs"></span>',
    '</label>',
  '</span>'
].join(''));

;// ./src/modules/multi-select/template-group.js
/* eslint-disable prettier/prettier */
/* harmony default export */ var template_group = ([
  '<div class="multiSelect-group">',
    '<div class="multiSelect-groupHeader posR">',
      '<label class="formControl pAs dF">',
        '<input tabindex="-1" class="formControl-state multiSelect-groupCheckbox" type="checkbox" />',
        '<span class="formControl-indicator"></span>',
        '<span class="formControl-label multiSelect-groupLabel fwB"></span>',
      '</label>',
      '<div class="multiSelect-arrowButton multiSelect-groupButton">',
        '<button tabindex="-1" type="button" class="btn mAn btn--small btn--fullRounded btn--ghost btn--icon">',
          '<span class="svgIcon svgIcon--stroked"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 8l8 8 8-8" /></svg></span>',
        '</button>',
      '</div>',
    '</div>',
    '<div class="multiSelect-groupContent" role="group" aria-multiselectable="true">',
    '</div>',
  '</div>'
].join(''));

;// ./src/modules/multi-select/template-list-item.js
/* eslint-disable prettier/prettier */
/* harmony default export */ var template_list_item = ([
  '<span class="multiSelect-item">',
    '<span class="multiSelect-itemLabel"></span>',
    '<button type="button" title="Remove" class="multiSelect-closeButton svgIcon svgIcon--stroked">',
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">',
        '<path d="M6 18L18 6M6 6l12 12" />',
      '</svg>',
    '</button>',
  '</span>'
].join(''));

;// ./src/modules/multi-select/multi-select.js
















function createMultiSelect(el, options) {
  return new MultiSelect(el, options);
}

var multi_select_defaults = {
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
  var el =
    typeof selector === 'object'
      ? selector.get
        ? selector.get(0)
        : selector
      : document.querySelector(selector);
  if (!el) {
    throw new Error('Wave.MultiSelect() requires a DOM element to initialize');
  }

  emitter_component_default().call(this);

  this.options = extend_default()(true, {}, multi_select_defaults, options);
  this._appended = false;

  var multiSelectElement = domify_default()(multi_select_template);

  this.labelList = multiSelectElement.firstChild;
  this.dropdownList = multiSelectElement.lastChild;

  // https://www.w3.org/TR/wai-aria/#combobox
  multiSelectElement.setAttribute('role', 'combobox');
  // multiSelectElement.setAttribute('aria-owns', this.dropdownList.id); // Not needed because dropdownList is descendant of element.
  multiSelectElement.setAttribute('aria-expanded', false);

  if (
    this.options.groups ||
    this.options.groupBy ||
    this.options.useCheckboxes
  ) {
    this.dropdownList.setAttribute('role', 'tree');
    multiSelectElement.setAttribute('aria-haspopup', 'tree');
  } else {
    this.dropdownList.setAttribute('role', 'listbox');
    multiSelectElement.setAttribute('aria-haspopup', 'listbox');
  }

  if (el.tagName === 'INPUT') {
    component_classes_default()(el).add('multiSelect-element');
    this.options.inputId = el.id;
    el.after(multiSelectElement);
    el.setAttribute('role', 'searchbox');
    el.setAttribute('aria-multiline', false);
    el.setAttribute('aria-autocomplete', 'list');
    this.labelList.firstChild.replaceWith(el);
  } else {
    // Merge original element classes and properties into multiSelectElement
    el.classList.forEach(function (className) {
      if (!component_classes_default()(multiSelectElement).contains(className)) {
        component_classes_default()(multiSelectElement).add(className);
      }
    });
    var i;
    for (i = 0; i < el.attributes.length; i++) {
      if (el.attributes[i].name !== 'class') {
        multiSelectElement.setAttribute(
          el.attributes[i].name,
          el.attributes[i].value
        );
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
  this.classes = component_classes_default()(this.el);

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
  this.arrowButton.firstChild.setAttribute(
    'aria-controls',
    this.dropdownList.id
  );

  this.unselectAllButton.firstChild.setAttribute(
    'title',
    this.options.removeAllText
  );

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
    externalLabel = document.querySelector(
      'label[for="' + this.inputElement.id + '"]'
    );
  }
  if (externalLabel) {
    if (!externalLabel.id) {
      externalLabel.id = this.id + '_externalLabel';
    }
    this.el.setAttribute('aria-labelledby', externalLabel.id);
  }

  var self = this;
  self.itemsDictionary = {};

  if (
    self.options.itemsList.length > 0 &&
    typeof self.options.itemsList[0] === 'object'
  ) {
    self.options.itemIsObject = true;
  }
  if (
    self.options.itemsList.length === 0 &&
    self.options.selectedList.length > 0 &&
    typeof self.options.selectedList[0] === 'object'
  ) {
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
  if (
    self.options.groups ||
    self.options.groupBy ||
    self.options.useCheckboxes
  ) {
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
    if (
      self.options.groupDefaultCollapsed &&
      self.options.hideGroupCollapseButton
    ) {
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
      var groupElement = domify_default()(template_group);
      groupElement.id = self.id + '_group_' + groupName;
      if (
        !self.options.groupDefaultCollapsed ||
        group.defaultCollapsed === false
      ) {
        toggleGroup.call(self, groupElement);
      }
      if (
        (self.options.hideGroupCheckbox && group.hideCheckbox !== false) ||
        group.hideCheckbox
      ) {
        component_classes_default()(groupElement).add('hideCheckbox');
        var groupCheckbox = groupElement.querySelector(
          '.multiSelect-groupCheckbox'
        );
        if (groupCheckbox) {
          groupCheckbox.disabled = true;
        }
      }
      if (
        (self.options.hideGroupCollapseButton &&
          group.hideCollapseButton !== false) ||
        group.hideCollapseButton
      ) {
        component_classes_default()(groupElement).add('hideCollapseButton');
      } else {
        self.inputElement.setAttribute('aria-haspopup', 'tree');
      }
      var groupLabelElement = groupElement.querySelector(
        '.multiSelect-groupLabel'
      );
      groupLabelElement.id = groupElement.id + '_groupLabel';
      groupLabelElement.innerText = label;

      var groupContent = groupElement.querySelector(
        '.multiSelect-groupContent'
      );
      groupContent.id = groupElement.id + '_groupContent';
      groupContent.setAttribute('aria-labeledby', groupLabelElement.id);
      groupElement.setAttribute('aria-labeledby', groupLabelElement.id);

      self.dropdownList.insertBefore(groupElement, self.filteredStateElement);

      group.items.forEach(function (item) {
        createListItemHTML.call(self, groupContent, item, groupName);
      });
      groupElement.setAttribute(
        'aria-expanded',
        component_classes_default()(groupElement).contains('is-open')
      );
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
    var groupElements =
      self.dropdownList.querySelectorAll('.multiSelect-group');
    if (groupElements) {
      groupElements.forEach(function (groupElement) {
        var groupCheckbox = groupElement.querySelector(
          '.multiSelect-groupHeader > .formControl > input.multiSelect-groupCheckbox'
        );
        var itemCheckboxesInGroup = groupElement.querySelectorAll(
          '.multiSelect-groupContent > .multiSelect-item > .formControl > input.multiSelect-itemCheckbox'
        );
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
    component_classes_default()(list).add('wsNW');
    component_classes_default()(list).add('scrollable-x');
  }

  initializeEvents.call(self);
}

inheritPrototype(MultiSelect, (emitter_component_default()));

MultiSelect.prototype.getSelected = function () {
  var self = this;
  var selectedList = [];

  var selectedElements =
    self.labelList.getElementsByClassName('multiSelect-item');

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
  self.labelList
    .querySelectorAll('.multiSelect-item')
    .forEach(function (itemElement) {
      if (itemElement.dataset._key === key) {
        var closeButton = itemElement.querySelector('.multiSelect-closeButton');
        swapItemDOM.call(self, closeButton, self.dropdownList);
      }
    });
};

MultiSelect.prototype.unselectAll = function () {
  var self = this;
  self.labelList
    .querySelectorAll('.multiSelect-closeButton')
    .forEach(function (closeButton) {
      swapItemDOM.call(self, closeButton, self.dropdownList, null, true);
    });
  updateGroupCheckboxState.call(self);
};

MultiSelect.prototype.setUnselected = function (newUnselectedList) {
  var self = this;

  newUnselectedList = newUnselectedList.filter(
    item =>
      item !== self.emptyStateElement.innerText &&
      item !== self.filteredStateElement.innerText
  );

  self.dropdownList.innerHTML = '';

  self.dropdownList.appendChild(self.emptyStateElement);
  self.dropdownList.appendChild(self.filteredStateElement);

  newUnselectedList.forEach(function (item) {
    createListItemHTML.call(self, self.dropdownList, item);
  });
};

MultiSelect.prototype.setSelected = function (newSelectedList) {
  var self = this;
  var selectedElements =
    self.labelList.getElementsByClassName('multiSelect-item');

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
    if (
      itemElement.dataset._key &&
      Object.prototype.hasOwnProperty.call(
        self.itemsDictionary,
        itemElement.dataset._key
      )
    )
      return self.itemsDictionary[itemElement.dataset._key];
  } else {
    return itemElement.textContent;
  }
  return null;
}

function getItemKey(item) {
  if (typeof item === 'string') return item;
  var self = this;
  var itemKey = item._key || '';
  if (
    self.options.uniqueIdProperty &&
    Object.prototype.hasOwnProperty.call(item, self.options.uniqueIdProperty) &&
    String(item[self.options.uniqueIdProperty]) !== ''
  ) {
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
  var listItem =
    self.options.useCheckboxes &&
    !component_classes_default()(list).contains('multiSelect-labelList')
      ? domify_default()(template_checklist_item)
      : domify_default()(template_list_item);
  var labelText = '';
  var labelElement;
  if (typeof item === 'object') {
    self.options.itemIsObject = true;
    var o = {
      labelProperty:
        (item._multiSelect && item._multiSelect.labelProperty) ||
        self.options.labelProperty,
      labelTemplate:
        (item._multiSelect && item._multiSelect.labelTemplate) ||
        self.options.labelTemplate,
      labelPropertySeparator:
        (item._multiSelect && item._multiSelect.labelPropertySeparator) ||
        self.options.labelPropertySeparator,
      ignoreUnsupportedTypes:
        (item._multiSelect && item._multiSelect.ignoreUnsupportedTypes) ||
        self.options.ignoreUnsupportedTypes
    };
    var hasLabelField =
      o.labelProperty &&
      Object.prototype.hasOwnProperty.call(item, o.labelProperty);
    if (o.labelTemplate) {
      labelText = o.labelTemplate;
      hasLabelField = false; // Use template instead
    } else if (hasLabelField) {
      labelText = item[o.labelProperty];
    }
    for (var prop in item) {
      if (
        prop.indexOf('_') !== 0 &&
        Object.prototype.hasOwnProperty.call(item, prop)
      ) {
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
                console.warn(
                  'Attribute [' +
                    prop +
                    '] on this item has unsupported type ' +
                    typeOfField +
                    ' as display text for label. Convert value to string if needed. If you want to suppress this warning, you can set option ignoreUnsupportedTypes: true'
                );
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
    labelElement = domify_default()(labelText);
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
    var closeTooltip = this.options.removeSelectedItemText.replace(
      '{label}',
      listItem.innerText
    );
    closeButton.setAttribute('title', closeTooltip);
  }
  listItem.id = self.id + '_item_' + listItem.dataset._key;
  if (component_classes_default()(list).contains('multiSelect-labelList')) {
    if (
      list.querySelector(
        '.multiSelect-item[data-_key="' + listItem.dataset._key + '"]'
      )
    ) {
      // Already added - don't add duplicate
      return;
    }
    list.insertBefore(listItem, self.inputElement);
    if (self.groupsDictionary) {
      var originItemCheckbox = self.dropdownList.querySelector(
        '.multiSelect-item[data-_key="' +
          listItem.dataset._key +
          '"] > .formControl > input.multiSelect-itemCheckbox'
      );
      if (originItemCheckbox && !originItemCheckbox.checked) {
        originItemCheckbox.checked = true;
      }
    }
    updateLabelStyle.call(self, listItem);
  } else {
    if (self.groupsDictionary) {
      listItem.setAttribute('role', 'listitem');
      var listItemCheckbox = listItem.querySelector(
        'input.multiSelect-itemCheckbox'
      );
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
  if (
    self.itemGroupMapping &&
    self.groupsDictionary &&
    (itemElement.dataset._group || itemElement.dataset._key)
  ) {
    var groupKey =
      itemElement.dataset._group ||
      self.itemGroupMapping[itemElement.dataset._key];
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
  var labelColor =
    itemElement.dataset._labelColor ||
    groupOptions.labelColor ||
    'accent--strong';
  var labelOutline = groupOptions.labelOutline;
  labelColor = labelColor.trim().replace('fill-', ''); // Remove fill-prefix, as this is added later if not labelOutline
  if (
    Object.prototype.hasOwnProperty.call(itemElement.dataset, '_labelOutline')
  ) {
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
  if (component_classes_default()(itemElement.parentNode).contains('multiSelect-labelList')) {
    component_classes_default()(itemElement).add('label');
    component_classes_default()(itemElement).add(labelColor);
    if (labelOutline) {
      component_classes_default()(itemElement).add('label--outline');
    }
  } else {
    component_classes_default()(itemElement).remove('label');
    component_classes_default()(itemElement).remove(labelColor);
    component_classes_default()(itemElement).remove('label--outline');
  }
}

function htmlEnc(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&#34;');
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
        if (closest(document.activeElement, '.multiSelect') !== self.el) {
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

    component_event.bind(self.el, 'focusout', onBlur, false);
    component_event.bind(self.el, 'mousedown', cancelBlur, false);
    component_event.bind(self.el, 'focusin', cancelBlur, false);

    component_event.bind(
      self.dropdownList,
      'transitionend',
      function (event) {
        if (event.target === self.dropdownList) {
          var targetContainer = closest(event.target, '.is-transitioning');
          if (targetContainer) {
            component_classes_default()(targetContainer).remove('is-transitioning');
          }
        }
      },
      false
    );
    component_event.bind(
      self.dropdownList,
      'click',
      function (event) {
        if (
          component_classes_default()(event.target).contains('multiSelect-item') ||
          component_classes_default()(event.target).contains('formControl-state')
        ) {
          swapItemDOM.call(self, event.target, self.labelList, event);
          event.stopPropagation();
        } else if (
          component_classes_default()(event.target.parentNode).contains('multiSelect-groupButton')
        ) {
          var groupElement = closest(event.target, '.multiSelect-group');
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
      },
      false
    );

    component_event.bind(
      self.labelList,
      'click',
      function (event) {
        if (component_classes_default()(event.target).contains('multiSelect-closeButton')) {
          swapItemDOM.call(self, event.target, self.dropdownList, event);
          event.stopPropagation();
          cancelBlur(event); // Make sure list is not closed
        } else if (event.target !== self.arrowButton.firstChild) {
          openOriginList.call(self, event);
          self.inputElement.focus();
          event.stopPropagation();
        }
      },
      false
    );

    component_event.bind(
      self.arrowButton.firstChild, // clickable <button> element is firstChild of arrowButton wrapper
      'click',
      function (event) {
        toggleOriginList.call(self, event);
        event.stopPropagation();
      },
      false
    );

    component_event.bind(
      self.unselectAllButton.firstChild, // clickable <button> element is firstChild of unselectAllButton wrapper
      'click',
      function (event) {
        cancelBlur(event); // Make sure list is not closed
        self.unselectAll();
        event.stopPropagation();
        event.target.focus(); // Make sure keyup event is not triggered on input textbox, which would cause last removed element to be reselected
        raf(function () {
          self.inputElement.focus();
        });
      },
      false
    );

    var backspaceTimeout = null;
    function backspaceTimeoutReset() {
      backspaceTimeout = null;
    }

    component_event.bind(
      self.inputElement,
      'keyup',
      function (event) {
        var key = event.keyCode || event.charCode;
        if (event.target !== self.inputElement) {
          return;
        }
        switch (key) {
          case 13: // Enter
            event.preventDefault();
            var selectedItem = getActive.call(
              self,
              !self.options.hideGroupCheckbox
            );
            if (selectedItem) {
              if (self.options.useCheckboxes) {
                var checkboxElement = selectedItem.querySelector(
                  'input[type=checkbox]'
                );
                swapItemDOM.call(self, checkboxElement, self.labelList);
              } else {
                swapItemDOM.call(self, selectedItem, self.labelList);
              }
              filterOriginList.call(self, true);
              self.inputElement.focus();
            }
            break;
          case 27: // Esc
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
      },
      false
    );
    component_event.bind(self.inputElement, 'input', function (event) {
      filterOriginList.call(self);
      resizeInputElement.call(self, '');
    });

    component_event.bind(
      self.inputElement,
      'keydown',
      function (event) {
        var key = event.keyCode || event.charCode;
        var string = event.target.value;
        var activeElement, elementClasses, navigateTextContent;

        switch (key) {
          case 33: // Page up
            event.preventDefault();
            if (event.ctrlKey) {
              self.dropdownList.scrollTop -= 320;
            } else if (self.dropdownList.childNodes.length > 0) {
              for (
                var index = 0;
                index < (self.options.useCheckboxes ? 8 : 5);
                index++
              ) {
                selectionUp.call(self);
              }
              scrollItemUp.call(self); // Scroll up to selected element
            }
            break;
          case 34: // Page down
            event.preventDefault();
            if (event.ctrlKey) {
              self.dropdownList.scrollTop += 200;
            } else if (self.dropdownList.childNodes.length > 0) {
              var selectors = [
                '.multiSelect-dropdownList > .multiSelect-item:not([aria-hidden=true])',
                '.multiSelect-dropdownList > .multiSelect-group',
                '.multiSelect-dropdownList > .multiSelect-group[aria-expanded=true] > .multiSelect-groupContent > .multiSelect-item:not([aria-hidden=true])'
              ];
              var visibleElements = self.el.querySelectorAll(
                selectors.join(',')
              );
              var skipCount = self.options.useCheckboxes ? 8 : 5;
              if (visibleElements.length > skipCount) {
                getDropdownListVisibleItem(visibleElements[skipCount], 'up'); // If not last element
              } else {
                selectionDown.call(
                  self,
                  visibleElements[visibleElements.length - 1]
                );
              }
              scrollItemDown.call(self);
            }
            break;
          case 40: // Arrow down
            event.preventDefault();
            if (event.ctrlKey) {
              self.dropdownList.scrollTop += 40;
            } else if (self.dropdownList.childNodes.length > 0) {
              selectionDown.call(self);
              scrollItemDown.call(self);
            }
            break;

          case 38: // Arrow up
            event.preventDefault();
            if (event.ctrlKey) {
              self.dropdownList.scrollTop -= 40;
            } else if (self.dropdownList.childNodes.length > 0) {
              var selectedItem = selectionUp.call(self);
              scrollItemUp.call(self, selectedItem);
            }
            break;
          case 37: // Arrow left
            navigateTextContent =
              !event.altKey &&
              self.inputElement.value.length > 0 &&
              self.inputElement.selectionStart > 0;
            if (
              !event.altKey &&
              self.inputElement.value.length > 0 &&
              self.inputElement.selectionStart > 0
            ) {
              navigateTextContent = true;
            }
            if (!navigateTextContent) {
              event.preventDefault();
              activeElement = getActive.call(
                self,
                !self.options.hideGroupCollapseButton
              );
              if (activeElement) {
                elementClasses = component_classes_default()(activeElement);
                if (elementClasses.contains('multiSelect-group')) {
                  if (activeElement.getAttribute('aria-expanded') === 'true') {
                    toggleGroup.call(self, activeElement);
                  }
                } else if (elementClasses.contains('multiSelect-item')) {
                  // Set group as active element
                  var parentGroupElement = closest(
                    activeElement,
                    '.multiSelect-group'
                  );
                  if (parentGroupElement) {
                    setActive.call(self, parentGroupElement);
                    scrollItemUp.call(self, parentGroupElement);
                  }
                }
              }
            }
            break;
          case 39: // Arrow right
            event.preventDefault();
            activeElement = getActive.call(
              self,
              !self.options.hideGroupCollapseButton
            );
            if (activeElement) {
              elementClasses = component_classes_default()(activeElement);
              if (elementClasses.contains('multiSelect-group')) {
                if (activeElement.getAttribute('aria-expanded') === 'false') {
                  toggleGroup.call(self, activeElement);
                } else {
                  // Set first visible item in group as active element
                  var firstItemInGroup = activeElement.querySelector(
                    '.multiSelect-item:not([aria-hidden="true"])'
                  );
                  if (firstItemInGroup) {
                    setActive.call(self, firstItemInGroup);
                  }
                }
              }
            }
            break;
          case 13: // Enter
            activeElement = getActive.call(
              self,
              !self.options.hideGroupCheckbox
            );
            if (activeElement) {
              if (self.options.useCheckboxes) {
                var checkboxElement = activeElement.querySelector(
                  'input[type=checkbox]'
                );
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

          case 8: // Backspace
            if (backspaceTimeout) {
              clearTimeout(backspaceTimeout);
            } else if (string === '' && self.labelList.childNodes.length > 0) {
              var lastItem = self.labelList.querySelector(
                '.multiSelect-item:last-of-type'
              );
              if (lastItem) {
                var closeButton = lastItem.querySelector(
                  '.multiSelect-closeButton'
                );
                swapItemDOM.call(self, closeButton, self.dropdownList);
              }
            }
            backspaceTimeout = setTimeout(backspaceTimeoutReset, 1000);
            resizeInputElement.call(self, '');
            break;
          case 46: // Delete
            resizeInputElement.call(self, '');
            break;
          default:
            if (event.key.length === 1) {
              resizeInputElement.call(self, event.key);
            }
            break;
        }
      },
      false
    );
  }
}

function resizeInputElement(inputChar) {
  var self = this;
  self.inputElementLabel.innerText =
    self.inputElement.value + (inputChar || '');

  // Make sure individual spaces take up place in size calculation. This can be spaces that are trimmed, or multiple spaces that are normally squished to one in HTML.
  self.inputElementLabel.innerHTML = self.inputElementLabel.innerHTML.replace(
    /\s/g,
    '&nbsp;'
  );

  raf(function () {
    self.inputElement.style.width =
      self.inputElementLabel.clientWidth + 2 + 'px';
  });
}

function swapItemDOM(trigger, list, evt, dontUpdateGroupState) {
  var self = this;
  var itemElement;
  var groupElement;

  if (!trigger) return;
  var isOpen = component_classes_default()(self.el).contains('is-open');
  if (component_classes_default()(trigger).contains('multiSelect-labelList')) {
    // This is the empty area around the labels. Set focus to the search box.
    if (isOpen) self.inputElement.focus();
    return;
  }
  itemElement = component_classes_default()(trigger).contains('multiSelect-item')
    ? trigger
    : closest(trigger, '.multiSelect-item');
  if (!itemElement) {
    // Trigger is neither label nor close button
    if (component_classes_default()(trigger).contains('multiSelect-groupCheckbox')) {
      groupElement = closest(trigger, '.multiSelect-group');
      if (groupElement) {
        var itemElementsInGroup = groupElement.querySelectorAll(
          '.multiSelect-itemCheckbox'
        );
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

  var remove = component_classes_default()(itemElement.parentNode).contains(
    'multiSelect-labelList'
  );
  if (remove && !component_classes_default()(trigger).contains('multiSelect-closeButton')) {
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
      var itemCheckboxToUncheck = self.dropdownList.querySelector(
        '[data-_key="' +
          itemElement.dataset._key +
          '"] > .formControl > input.multiSelect-itemCheckbox'
      );
      itemCheckboxToUncheck.checked = false;

      // Remove label from labelList
      itemElement.remove();

      // Get current element in dropdownList
      itemElement = closest(itemCheckboxToUncheck, '.multiSelect-item');
      groupElement = closest(itemElement, '.multiSelect-group');
    } else {
      // Checkbox element is clicked
      groupElement = closest(trigger, '.multiSelect-group');
      if (trigger.checked === false) {
        remove = true;
        // Remove label
        var labelElementToRemove = self.labelList.querySelector(
          '.multiSelect-item[data-_key="' + itemElement.dataset._key + '"]'
        );
        if (labelElementToRemove) {
          labelElementToRemove.remove();
        }
      } else {
        // Create label element in destination list
        var item = getItemFromElement.call(self, itemElement);
        createListItemHTML.call(
          self,
          self.labelList,
          item,
          itemElement.dataset._group
        );
      }
    }
    itemElement.setAttribute('aria-selected', !remove);

    if (
      !dontUpdateGroupState &&
      !component_classes_default()(groupElement).contains('hideCheckbox')
    ) {
      updateGroupCheckboxState.call(self, groupElement);
    }
    if (isOpen) {
      // Only do this if list is open
      self.inputElement.value = '';
      filterOriginList.call(self, true);
      resizeInputElement.call(self);
      if (!dontUpdateGroupState) {
        if (!component_classes_default()(groupElement).contains('is-open')) {
          component_classes_default()(groupElement).add('is-open');
        }
        setActive.call(self, itemElement);
        scrollItemVisible.call(self, itemElement);
      }

      self.inputElement.focus();
    }
  } else {
    if (!remove) {
      var indexedItem =
        itemElement.nextElementSibling || itemElement.previousElementSibling;
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
      component_classes_default()(selectedItem).remove('is-active');
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
  var itemObject = self.options.itemIsObject
    ? self.itemsDictionary[itemElement.dataset._key]
    : itemElement.firstChild.innerText;

  if (remove) {
    this.emit('unselect', itemObject);
  } else {
    this.emit('select', itemObject);
  }
}

function updateGroupCheckboxState(groupElement) {
  if (!groupElement) {
    var groupElements =
      this.dropdownList.querySelectorAll('.multiSelect-group');
    groupElements.forEach(updateGroupCheckboxState);
    return;
  }

  // Update group selected state
  var anySelected = false;
  var allSelected = true;
  var itemCheckboxesInGroup = groupElement.querySelectorAll(
    '.multiSelect-item > .formControl > input.multiSelect-itemCheckbox'
  );
  itemCheckboxesInGroup.forEach(function (itemCheckbox) {
    if (itemCheckbox.checked) {
      anySelected = true;
    } else {
      allSelected = false;
    }
  });
  var groupCheckbox = groupElement.querySelector(
    '.multiSelect-groupHeader > .formControl > input.multiSelect-groupCheckbox'
  );
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
  var marker = new (mark_default())(htmlElement);
  var markOptions = {
    element: 'mark',
    separateWordSearch: false,
    diacritics: false, // Turned off to make sure norwegian characters are treated as uniqe letters (i.e. make sure 'å' is not same as as 'a' etc.)
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
      component_classes_default()(groupEl).remove('has-match');
      component_classes_default()(groupEl).remove('has-hidden');
    });
  }

  items.forEach(function (itemElement) {
    var isMatch = false;
    var isExactMatch = false;
    var itemClasses = component_classes_default()(itemElement);
    if (!itemClasses.contains('multiSelect-item')) {
      return;
    }
    var labelElement = itemElement.querySelector('.multiSelect-itemLabel');
    var labelText = labelElement.innerText;
    if (
      labelText &&
      labelText.toLowerCase().indexOf(string.toLowerCase()) !== -1
    ) {
      isMatch = true;
      isExactMatch = labelText.toLowerCase() === string.toLowerCase();
    }
    if (isMatch) {
      if (self.options.useCheckboxes) {
        // Tag group where this is contained (if search string is not empty)
        groupElement = closest(itemElement, '.multiSelect-group');
        if (string && groupElement) {
          component_classes_default()(groupElement).add('has-match');
        }
      }

      if (itemClasses.contains('is-unique-match')) {
        itemClasses.remove('is-active');
        itemClasses.remove('is-unique-match');
        if (self.groupsDictionary) {
          groupElement = closest(itemElement, '.multiSelect-group');
          if (groupElement && !component_classes_default()(groupElement).contains('is-open')) {
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
        groupElement = closest(itemElement, '.multiSelect-group');
        if (groupElement) {
          component_classes_default()(groupElement).add('has-hidden');
          if (!component_classes_default()(groupElement).contains('is-open')) {
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
        component_classes_default()(setThisActive).add('is-unique-match');
        isActive = setThisActive;
        if (self.groupsDictionary) {
          groupElement = closest(isActive, '.multiSelect-group');
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
      groupElement = closest(isActive, '.multiSelect-group');
      if (
        groupElement &&
        groupElement.getAttribute('aria-expanded') === 'false'
      ) {
        setActive.call(self, groupElement); // If active is inside collapsed group, set active to group instead
        isActive = groupElement;
      }
    }
    if (!dontScroll) {
      scrollItemVisible.call(self, isActive);
    }
  } else if (isIndexed) {
    if (self.groupsDictionary) {
      groupElement = closest(isIndexed, '.multiSelect-group');
      if (
        groupElement &&
        groupElement.getAttribute('aria-expanded') === 'false'
      ) {
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
  var includeGroup = !(
    self.options.hideGroupCheckbox && self.options.hideGroupCollapseButton
  );
  var selectedItem = getActive.call(self, includeGroup);
  var indexedItem = getIndexed.call(self);
  var prevItem;
  openOriginList.call(self);
  if (!selectedItem) {
    prevItem =
      indexedItem ||
      self.el.querySelector(
        '.multiSelect-dropdownList > span:last-of-type, .multiSelect-dropdownList > div.multiSelect-group[aria-expanded="true"]:last-of-type > .multiSelect-groupContent > span:last-of-type'
      );
    if (!prevItem && includeGroup) {
      prevItem = self.el.querySelector(
        '.multiSelect-dropdownList > div.multiSelect-group:last-of-type'
      );
    }
    if (prevItem && component_classes_default()(prevItem).contains('is-hidden')) {
      prevItem = getNextVisibleItem(prevItem, 'up', includeGroup);
    }
    if (prevItem) {
      component_classes_default()(prevItem).add('is-active');
      component_classes_default()(prevItem).remove('is-indexed');
      if (indexedItem) {
        component_classes_default()(indexedItem).remove('is-indexed');
      }
    }

    return prevItem;
  }

  prevItem = getNextVisibleItem(selectedItem, 'up', includeGroup);

  if (prevItem) {
    component_classes_default()(prevItem).remove('is-indexed');
    if (indexedItem) {
      component_classes_default()(indexedItem).remove('is-indexed');
    }
    if (selectedItem) {
      component_classes_default()(selectedItem).remove('is-active');
    }
    component_classes_default()(prevItem).add('is-active');
  }
}

function selectionDown() {
  var self = this;
  var includeGroup = !(
    self.options.hideGroupCheckbox && self.options.hideGroupCollapseButton
  );
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
    nextItem = indexedItem
      ? getDropdownListVisibleItem(indexedItem, 'down', includeGroup)
      : self.dropdownList.querySelector(selector);

    if (nextItem) {
      component_classes_default()(nextItem).add('is-active');
      component_classes_default()(nextItem).remove('is-indexed');
      if (indexedItem) {
        component_classes_default()(indexedItem).remove('is-indexed');
      }

      this.inputElement.setAttribute('aria-activedescendant', nextItem.id);

      if (self.options.groupsDictionary) {
        group = closest(nextItem, '.multiSelect-group');
        if (
          group &&
          (!group.hasAttribute('aria-expanded') ||
            group.getAttribute('aria-expanded') === 'false')
        ) {
          toggleGroup.call(self, group);
        }
      }
    }

    return;
  }

  nextItem = getNextVisibleItem(selectedItem, 'down', includeGroup);

  if (nextItem) {
    component_classes_default()(nextItem).remove('is-indexed');
    if (indexedItem) {
      component_classes_default()(indexedItem).remove('is-indexed');
    }
    if (selectedItem) {
      component_classes_default()(selectedItem).remove('is-active');
    }
    component_classes_default()(nextItem).add('is-active');
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
      component_classes_default()(elem).remove('is-active');
    }
  });
  if (element) {
    component_classes_default()(element).add('is-active');
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
  var indexedItems = self.dropdownList.querySelectorAll(
    '.multiSelect-item.is-indexed'
  );
  for (var ii = 0; ii < indexedItems.length; ii++) {
    component_classes_default()(indexedItems[ii]).remove('is-indexed');
  }
  if (indexedItem) {
    component_classes_default()(indexedItem).add('is-indexed');
  }
}

function scrollItemVisible(element, delayedStart) {
  var self = this;
  var selectedItem =
    element || getActive.call(self, true) || getIndexed.call(self);
  if (!selectedItem) return;
  if (component_classes_default()(selectedItem).contains('multiSelect-group')) {
    selectedItem = selectedItem.querySelector('.multiSelect-groupHeader');
  }
  if (
    !delayedStart &&
    self.dropdownList.clientHeight < selectedItem.clientHeight + 10
  ) {
    transitEnd(self.dropdownList, function () {
      scrollItemVisible.call(self, element, true);
    });
    return;
  }

  var itemPositionTop = selectedItem.offsetTop;
  var selectedItemHeight = selectedItem.clientHeight + 5;
  if (itemPositionTop < self.dropdownList.scrollTop) {
    self.dropdownList.scrollTop = itemPositionTop - 5;
    return true;
  } else if (
    itemPositionTop + selectedItemHeight >
    self.dropdownList.scrollTop + self.dropdownList.clientHeight
  ) {
    self.dropdownList.scrollTop =
      itemPositionTop + selectedItemHeight - self.dropdownList.clientHeight;
    return true;
  }
}
function scrollItemDown(element, delayedStart) {
  var self = this;
  var selectedItem =
    element || getActive.call(self, true) || getIndexed.call(self);
  if (!selectedItem) return;
  if (component_classes_default()(selectedItem).contains('multiSelect-group')) {
    selectedItem = selectedItem.querySelector('.multiSelect-groupHeader');
  }

  if (
    !delayedStart &&
    self.dropdownList.clientHeight < selectedItem.clientHeight + 10
  ) {
    transitEnd(self.dropdownList, function () {
      scrollItemDown.call(self, element, true);
    });
    return;
  }

  var itemPositionTop = selectedItem.offsetTop;
  var selectedItemHeight = selectedItem.clientHeight + 5;
  if (itemPositionTop < self.dropdownList.scrollTop) {
    self.dropdownList.scrollTop = itemPositionTop - 5;
    return true;
  } else if (
    itemPositionTop + selectedItemHeight >
    self.dropdownList.scrollTop + self.dropdownList.clientHeight
  ) {
    self.dropdownList.scrollTop =
      itemPositionTop + selectedItemHeight - self.dropdownList.clientHeight;
    return true;
  } else if (
    itemPositionTop >=
    self.dropdownList.scrollTop +
      self.dropdownList.clientHeight -
      2 * selectedItemHeight
  ) {
    self.dropdownList.scrollTop =
      self.dropdownList.scrollTop + selectedItemHeight;
    return true;
  }
}

function scrollItemUp(element, delayedStart) {
  var self = this;
  var selectedItem =
    element || getActive.call(self, true) || getIndexed.call(self);
  if (!selectedItem) return;
  if (component_classes_default()(selectedItem).contains('multiSelect-group')) {
    selectedItem = selectedItem.querySelector('.multiSelect-groupHeader');
  }

  if (
    !delayedStart &&
    self.dropdownList.clientHeight < selectedItem.clientHeight + 10
  ) {
    transitEnd(self.dropdownList, function () {
      scrollItemUp.call(self, element, true);
    });
    return;
  }

  var itemPositionTop = selectedItem.offsetTop;
  var selectedItemHeight = selectedItem.clientHeight + 5;
  if (
    itemPositionTop >
    self.dropdownList.scrollTop +
      self.dropdownList.clientHeight -
      selectedItemHeight
  ) {
    self.dropdownList.scrollTop =
      itemPositionTop + self.dropdownList.clientHeight - selectedItemHeight;
    return true;
  } else if (itemPositionTop < self.dropdownList.scrollTop) {
    self.dropdownList.scrollTop = itemPositionTop - selectedItemHeight;
    return true;
  } else if (
    itemPositionTop <
    self.dropdownList.scrollTop + selectedItemHeight
  ) {
    self.dropdownList.scrollTop =
      self.dropdownList.scrollTop - selectedItemHeight;
    return true;
  }
}

function getNextVisibleItem(startElement, direction, includeGroup) {
  var selectCandidate;
  var group = component_classes_default()(startElement).contains('multiSelect-group')
    ? startElement
    : null;
  if (direction === 'down') {
    if (group) {
      if (
        component_classes_default()(group).contains('is-open') ||
        component_classes_default()(group).contains('has-match')
      ) {
        selectCandidate = group.querySelector(
          '.multiSelect-groupContent > .multiSelect-item:not([aria-hidden="true"])'
        );
      }
    } else {
      // startElement.id can contain space, so we cannot use # as selector for id.
      selectCandidate = startElement.parentNode.querySelector(
        '[id="' +
          startElement.id +
          '"] ~ .multiSelect-item:not([aria-hidden="true"])'
      );
    }
    if (!selectCandidate) {
      if (!group) {
        group = closest(startElement, '.multiSelect-group');
      }
      while (!selectCandidate && group && group.nextElementSibling) {
        if (includeGroup) {
          selectCandidate = group.nextElementSibling;
        } else {
          selectCandidate = group.nextElementSibling.querySelector(
            '.multiSelect-groupContent > .multiSelect-item:not([aria-hidden="true"])'
          );
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
      while (
        component_classes_default()(selectCandidate).contains('is-hidden') &&
        selectCandidate.previousElementSibling
      ) {
        selectCandidate = selectCandidate.previousElementSibling;
      }
    }
    if (selectCandidate && component_classes_default()(selectCandidate).contains('is-hidden')) {
      selectCandidate = null;
    }

    if (!selectCandidate) {
      if (!group) {
        group = closest(startElement, '.multiSelect-group');
        if (includeGroup) {
          // startElement is first in group (no previousElementSibling). This means that next up is the containing group.
          return group;
        }
      }
      while (!selectCandidate && group && group.previousElementSibling) {
        if (
          component_classes_default()(group.previousElementSibling).contains('is-open') ||
          component_classes_default()(group).contains('has-match')
        ) {
          selectCandidate = group.previousElementSibling.querySelector(
            '.multiSelect-groupContent > span:last-of-type'
          );
        }
        if (includeGroup && !selectCandidate) {
          selectCandidate = group.previousElementSibling;
        }
        if (selectCandidate && component_classes_default()(selectCandidate).contains('is-hidden')) {
          return getNextVisibleItem(selectCandidate, direction, includeGroup);
        }
      }
    }
    if (selectCandidate && component_classes_default()(selectCandidate).contains('is-hidden')) {
      selectCandidate = null;
    }
  }
  return selectCandidate;
}

function getDropdownListVisibleItem(selectCandidate, direction, includeGroup) {
  if (component_classes_default()(selectCandidate).contains('is-hidden')) {
    selectCandidate = getNextVisibleItem(
      selectCandidate,
      direction,
      includeGroup
    );
  }
  return selectCandidate;
}

function toggleGroup(groupElement) {
  var self = this;
  if (component_classes_default()(groupElement).contains('is-open')) {
    component_classes_default()(groupElement).remove('is-open');
    groupElement.setAttribute('aria-expanded', 'false');
  } else {
    component_classes_default()(groupElement).add('is-open');
    groupElement.setAttribute('aria-expanded', 'true');
    if (self.el.getAttribute('aria-expanded') === 'true') {
      raf(function () {
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
  var isOpen = component_classes_default()(self.el).contains('is-open');
  var newOpen = !isOpen;
  if (typeof force === 'boolean') {
    newOpen = force;
  }
  if (event) {
    event.stopPropagation();
  }

  self._isTogglingListOpen = true;
  if (newOpen) {
    if (!component_classes_default()(self.el).contains('is-open') && 'ontransitionend' in self.el) {
      component_classes_default()(self.el).add('is-transitioning');
    }
    raf(function () {
      component_classes_default()(self.el).add('is-open');
    });
    self.el.setAttribute('aria-expanded', 'true');
    self.arrowButton.firstChild.setAttribute('aria-expanded', 'true');
    self.inputElement.focus();
  } else {
    if (component_classes_default()(self.el).contains('is-open') && 'ontransitionend' in self.el) {
      component_classes_default()(self.el).add('is-transitioning');
    }

    component_classes_default()(self.el).remove('is-open');
    var selectedItem = getActive.call(self);
    if (selectedItem) {
      component_classes_default()(selectedItem).remove('is-active');
    }
    setIndexedItem.call(self, null);
    self.el.setAttribute('aria-expanded', 'false');
    self.arrowButton.firstChild.setAttribute('aria-expanded', 'false');
    self.dropdownList.scrollTop = 0;
  }

  raf(function () {
    self._isTogglingListOpen = false;
  });
}

;// ../design-primitives/design-media-queries/dist/index.module.js
/**
 * Do not edit directly
 * Generated on Wed, 18 Dec 2024 12:29:26 GMT
 */

const mqSmallOnly = "screen and ( max-width: 31.1875em )";
const mqMediumAndUp = "screen and ( min-width: 31.25em )";
const mqMediumOnly = "screen and ( min-width: 31.25em ) and ( max-width: 48.75em )";
const mqMediumAndBelow = "screen and ( max-width: 48.6875em )";
const mqZeroToLarge = "screen and ( min-width: 0 ) and ( max-width: 48.6875em )";
const mqLargeAndUp = "screen and ( min-width: 48.75em )";
const mqLargeAndBelow = "screen and ( max-width: 87.4375em )";
const mqXlargeAndUp = "screen and ( min-width: 87.5em )";

;// ./src/modules/sidebar-nav.js








inheritPrototype(SidebarNav, (emitter_component_default()));

function createSidebarMenu(element, options) {
  return new SidebarNav(element, options);
}

function SidebarNav(element, options) {
  this.element = element;
  this.currentView = mqLargeAndUp;
  this.rememberCollapsedState = options
    ? !!options.rememberCollapsedState
    : false;
  this.closeAfterItemPick = options ? !!options.closeAfterItemPick : true;
  this.rememberCollapsedStateValue = this.rememberCollapsedState
    ? window.localStorage.getItem('waveSidebarNavCollapsedState')
    : null;
  this.viewportMonitor = new viewport_monitor();
  this.listeners = [];

  this.header = this.element.querySelector('.sidebarNav-header');
  this.headerMenu = this.element.querySelector('.sidebarNav-headerMenu');
  this.headerMenuToggle = this.element.querySelector(
    '.js-sidebarNav-headerMenuToggle'
  );
  this.headerMenuContent = this.element.querySelector(
    '.sidebarNav-headerMenuContent'
  );
  this.menuContent = this.element.querySelector('.sidebarNav-menuContent');
  this.collapseButton = this.element.querySelector('.js-sidebarNav-collapse');
  this.headerOpenButton = this.element.querySelector(
    '.js-sidebarNav-headerOpen'
  );
  this.headerCloseButton = this.element.querySelector(
    '.js-sidebarNav-headerClose'
  );

  this._handleHeaderMenuToggleClick =
    this._handleHeaderMenuToggleClick.bind(this);
  this._handleCollapseButtonClick = this._handleCollapseButtonClick.bind(this);
  this._handleHeaderOpenButtonClick =
    this._handleHeaderOpenButtonClick.bind(this);
  this._handleHeaderCloseButtonClick =
    this._handleHeaderCloseButtonClick.bind(this);
  this._handleMenuClick = this._handleMenuClick.bind(this);
  this._handleMenuItemMouseEnter = this._handleMenuItemMouseEnter.bind(this);
  this._handleMenuItemMouseLeave = this._handleMenuItemMouseLeave.bind(this);
  this._handleBodyClick = this._handleBodyClick.bind(this);
  this._handleWindowResize = this._handleWindowResize.bind(this);

  this._init();
}

SidebarNav.prototype._init = function _init() {
  this._handleWindowResize(true);
  this._initListeners();
  this._initTransition();
};

SidebarNav.prototype._isHeaderMenuOpened = function _isHeaderMenuOpened() {
  if (!this.headerMenu) {
    return false;
  }
  return component_classes_default()(this.headerMenu).contains('sidebarNav-headerMenu--opened');
};

SidebarNav.prototype._getCurrentMenuContent =
  function _getCurrentMenuContent() {
    return this._isHeaderMenuOpened()
      ? this.headerMenuContent
      : this.menuContent;
  };

SidebarNav.prototype._restoreCollapsedState =
  function _restoreCollapsedState() {
    if (this.rememberCollapsedStateValue === 'collapsed') {
      this.collapse();
    } else if (this.rememberCollapsedStateValue === 'uncollapsed') {
      this.uncollapse();
    }
  };

SidebarNav.prototype._initTransition = function _initTransition() {
  // eslint-disable-next-line no-unused-expressions
  this.element.offsetHeight;
  component_classes_default()(this.element).add('sidebarNav--withTransition');
};

SidebarNav.prototype._initListeners = function _initListeners() {
  if (this.headerMenuToggle) {
    this._addListener(
      this.headerMenuToggle,
      'click',
      this._handleHeaderMenuToggleClick
    );
  }

  if (this.headerOpenButton) {
    this._addListener(
      this.headerOpenButton,
      'click',
      this._handleHeaderOpenButtonClick
    );
  }

  if (this.headerCloseButton) {
    this._addListener(
      this.headerCloseButton,
      'click',
      this._handleHeaderCloseButtonClick
    );
  }

  if (this.collapseButton) {
    this._addListener(
      this.collapseButton,
      'click',
      this._handleCollapseButtonClick
    );
  }

  this._addListener(this.element, 'click', this._handleMenuClick);

  var items = this.element.querySelectorAll('.sidebarNav-item');
  for (var item of items) {
    this._addListener(item, 'mouseenter', this._handleMenuItemMouseEnter);
    this._addListener(item, 'mouseleave', this._handleMenuItemMouseLeave);
  }

  this._addListener(window.document, 'click', this._handleBodyClick);
  this._addListener(window.document, 'touchstart', this._handleBodyClick);
  this.viewportMonitor.on('resize', this._handleWindowResize);
};

SidebarNav.prototype._resetFocus = function _resetFocus() {
  document.activeElement.blur();
  this.element.focus();
};

SidebarNav.prototype._addListener = function _addListener(element, event, fn) {
  element.addEventListener(event, fn);
  this.listeners.push(element, event, fn);
};

SidebarNav.prototype._handleHeaderMenuToggleClick =
  function _handleHeaderMenuToggleClick(event) {
    if (!this.headerMenu) {
      return;
    }
    if (component_classes_default()(this.headerMenu).contains('sidebarNav-headerMenu--opened')) {
      component_classes_default()(this.headerMenu).remove('sidebarNav-headerMenu--opened');
      event.preventDefault();
      this._resetFocus();
    } else {
      component_classes_default()(this.headerMenu).add('sidebarNav-headerMenu--opened');
      this._closeAllSubmenus();
    }
  };

SidebarNav.prototype._handleMenuClick = function _handleMenuClick(e) {
  var submenuContainer = closest(e.target, '.sidebarNav-withSubmenu', true);
  if (submenuContainer) {
    if (component_classes_default()(submenuContainer).contains('sidebarNav-withSubmenu--opened')) {
      component_classes_default()(submenuContainer).remove('sidebarNav-withSubmenu--opened');
      e.preventDefault();
      this._resetFocus();
    } else {
      component_classes_default()(submenuContainer).add('sidebarNav-withSubmenu--opened');
    }
  }

  if (this.closeAfterItemPick && closest(e.target, 'a', true)) {
    this._closeAllSubmenus();

    if (this.currentView === mqSmallOnly) {
      this._clearBodyClasses();
    } else if (this._isHeaderMenuOpened()) {
      if (this.headerMenu) {
        component_classes_default()(this.headerMenu).remove('sidebarNav-headerMenu--opened');
      }
      this._resetFocus();
    }
  }
};

SidebarNav.prototype._removeTooltips = function _removeTooltips() {
  var tooltips = window.document.querySelectorAll('.sidebarNav-itemTooltip');
  tooltips.forEach(function (tooltip) {
    tooltip.classList.remove('sidebarNav-itemTooltip--visible');
    setTimeout(function () {
      tooltip.remove();
    }, 150);
  });
};

SidebarNav.prototype._handleMenuItemMouseEnter =
  function _handleMenuItemMouseEnter(e) {
    var item = e.target;
    if (!item) {
      return;
    }

    var itemName = item.querySelector('.sidebarNav-itemName');
    if (!itemName) {
      return;
    }

    if (this._isCollapsed() || itemName.scrollWidth > itemName.offsetWidth) {
      var tooltip = window.document.createElement('div');
      tooltip.classList.add('sidebarNav-itemTooltip');
      tooltip.innerText = itemName.textContent;
      window.document.body.append(tooltip);

      setTimeout(function () {
        tooltip.classList.add('sidebarNav-itemTooltip--visible');
      }, 0);

      var centerFactor = Math.round(
        (item.offsetHeight - tooltip.offsetHeight) / 2
      );
      tooltip.style.top =
        item.getBoundingClientRect().top + centerFactor + 'px';

      var sidebarNav = window.document.querySelector('.sidebarNav');
      if (sidebarNav) {
        tooltip.style.left = sidebarNav.offsetWidth + 'px';
      }
    }
  };

SidebarNav.prototype._handleMenuItemMouseLeave =
  function _handleMenuItemMouseLeave() {
    this._removeTooltips();
  };

SidebarNav.prototype._handleBodyClick = function _handleBodyClick(event) {
  if (!closest(event.target, '.sidebarNav-headerMenu', true)) {
    var headerMenu = this.element.querySelector('.sidebarNav-headerMenu');
    if (headerMenu) {
      component_classes_default()(headerMenu).remove('sidebarNav-headerMenu--opened');
    }
  }

  if (!closest(event.target, '.sidebarNav', true)) {
    this._closeAllSubmenus();
  }

  if (
    this.currentView === mqSmallOnly &&
    !closest(event.target, '.sidebarNav', true)
  ) {
    component_classes_default()(window.document.body).remove('sidebarNav-uncollapsed');
    this._emitCollapseState();
  }
};

SidebarNav.prototype._clearBodyClasses = function _clearBodyClasses() {
  component_classes_default()(window.document.body).remove('sidebarNav-uncollapsed');
  component_classes_default()(window.document.body).remove('sidebarNav-collapsed');
};

SidebarNav.prototype._initLargeView = function _initLargeView() {
  this.currentView = mqLargeAndUp;
  this._clearBodyClasses();
  if (this.rememberCollapsedState) {
    this._restoreCollapsedState();
  }
  this._emitCollapseState();
};

SidebarNav.prototype._initMediumView = function _initMediumView() {
  this.currentView = mqMediumOnly;
  this._clearBodyClasses();
  if (this.rememberCollapsedState) {
    this._restoreCollapsedState();
  } else {
    this.collapse();
  }
  this._emitCollapseState();
};

SidebarNav.prototype._initSmallView = function _initSmallView() {
  this.currentView = mqSmallOnly;
  this._clearBodyClasses();
  this._emitCollapseState();
};

SidebarNav.prototype._emitCollapseState = function _emitCollapseState() {
  if (this._isCollapsed()) {
    this.emit('collapse', this.currentView);
  } else {
    this.emit('uncollapse', this.currentView);
  }
};

SidebarNav.prototype._handleWindowResize = function _handleWindowResize(force) {
  if (
    this.viewportMonitor.mq(mqLargeAndUp) &&
    (force || this.currentView !== mqLargeAndUp)
  ) {
    this._initLargeView();
  } else if (
    this.viewportMonitor.mq(mqMediumOnly) &&
    (force || this.currentView !== mqMediumOnly)
  ) {
    this._initMediumView();
  } else if (
    this.viewportMonitor.mq(mqSmallOnly) &&
    (force || this.currentView !== mqSmallOnly)
  ) {
    this._initSmallView();
  }
};

SidebarNav.prototype._handleCollapseButtonClick =
  function _handleCollapseButtonClick(event) {
    event.preventDefault();

    if (this._isCollapsed()) {
      this.uncollapse();
    } else {
      this.collapse();
    }

    if (this.rememberCollapsedState) {
      this.rememberCollapsedStateValue = this._isCollapsed()
        ? 'collapsed'
        : 'uncollapsed';
      window.localStorage.setItem(
        'waveSidebarNavCollapsedState',
        this.rememberCollapsedStateValue
      );
    }

    this._emitCollapseState();
  };

SidebarNav.prototype._handleHeaderOpenButtonClick =
  function _handleHeaderOpenButtonClick(event) {
    event.preventDefault();
    component_classes_default()(window.document.body).add('sidebarNav-uncollapsed');
    this._emitCollapseState();
  };

SidebarNav.prototype._handleHeaderCloseButtonClick =
  function _handleHeaderCloseButtonClick(event) {
    event.preventDefault();
    component_classes_default()(window.document.body).remove('sidebarNav-uncollapsed');
    this._resetFocus();
    this._emitCollapseState();
  };

SidebarNav.prototype._closeAllSubmenus = function _closeAllSubmenus() {
  var submenuContainers = this.element.querySelectorAll(
    '.sidebarNav-withSubmenu'
  );
  if (submenuContainers && submenuContainers.length > 0) {
    Array.prototype.forEach.call(
      submenuContainers,
      function (submenuContainer) {
        component_classes_default()(submenuContainer).remove('sidebarNav-withSubmenu--opened');
      }
    );
  }

  if (
    document.activeElement &&
    closest(document.activeElement, '.sidebarNav-withSubmenu', true)
  ) {
    this._resetFocus();
  }
};

SidebarNav.prototype._isCollapsed = function _isCollapsed() {
  if (component_classes_default()(window.document.body).contains('sidebarNav-collapsed')) {
    return true;
  }

  if (component_classes_default()(window.document.body).contains('sidebarNav-uncollapsed')) {
    return false;
  }

  return this.currentView === mqSmallOnly;
};

SidebarNav.prototype.collapse = function collapse() {
  component_classes_default()(window.document.body).remove('sidebarNav-uncollapsed');
  component_classes_default()(window.document.body).add('sidebarNav-collapsed');
};

SidebarNav.prototype.uncollapse = function uncollapse() {
  component_classes_default()(window.document.body).remove('sidebarNav-collapsed');
  component_classes_default()(window.document.body).add('sidebarNav-uncollapsed');
};

SidebarNav.prototype._removeListeners = function _removeListeners() {
  this.listeners.forEach(function (listener) {
    listener[0].removeEventListener(listener[1], listener[2]);
  });
};

SidebarNav.prototype.destroy = function destroy() {
  this._removeListeners();
};

;// ./src/main.js



























;// ./src/main.umd.js






}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=wave.js.map