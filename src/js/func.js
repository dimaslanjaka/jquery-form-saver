/**
 * A simple forEach() implementation for Arrays, Objects and NodeLists.
 * @private
 * @author Todd Motto
 * @link   https://github.com/toddmotto/foreach
 * @param {Array|Object|NodeList} collection Collection of items to iterate
 * @param {Function}              callback   Callback function for each iteration
 * @param {Array|Object|NodeList} [scope=null]      Object/NodeList/Array that forEach is iterating over (aka `this`)
 */
var forEach = function (collection, callback, scope) {
  if (Object.prototype.toString.call(collection) === "[object Object]") {
    for (var prop in collection) {
      if (Object.prototype.hasOwnProperty.call(collection, prop)) {
        callback.call(scope, collection[prop], prop, collection);
      }
    }
  } else {
    for (var i = 0, len = collection.length; i < len; i++) {
      callback.call(scope, collection[i], i, collection);
    }
  }
};

/**
 * Merge two or more objects. Returns a new object.
 * @private
 * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
 * @param {Object}   objects  The objects to merge together
 * @returns {Object}          Merged values of defaults and options
 */
var extend = function () {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
    deep = arguments[0];
    i++;
  }

  // Loop through each object and conduct a merge
  for (; i < length; i++) {
    var obj = arguments[i];
    merge_object(obj);
  }

  return extended;
};

/**
 * Get the closest matching element up the DOM tree.
 * @private
 * @param  {Element} elem     Starting element
 * @param  {String}  selector Selector to match against
 * @return {Boolean|Element}  Returns null if not match found
 */
var getClosest = function (elem, selector) {
  // Element.matches() polyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function (s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
      };
  }

  // Get closest match
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.matches(selector)) return elem;
  }

  return null;
};

/**
 * Convert data-options attribute into an object of key/value pairs
 * @private
 * @param {String} options Link-specific options as a data attribute string
 * @returns {Object}
 */
var getDataOptions = function (options) {
  return !options ||
    !(typeof JSON === "object" && typeof JSON.parse === "function")
    ? {}
    : JSON.parse(options);
};

/**
 * Handle events
 * @private
 */
var eventHandler = function (event) {
  var toggle = event.target;
  var save = getClosest(toggle, settings.selectorSave);
  var del = getClosest(toggle, settings.selectorDelete);
  if (save) {
    event.preventDefault();
    formSaver.saveForm(save, save.getAttribute("data-form-save"), settings);
  } else if (del) {
    event.preventDefault();
    formSaver.deleteForm(del, del.getAttribute("data-form-delete"), settings);
  }
};
/**
 * Is Browser (not node)
 */
var isBrowser = new Function(
  "try {return this===window;}catch(e){ return false;}"
);
/**
 * Is Node (not browser)
 */
var isNode = new Function("try {return this===global;}catch(e){return false;}");

/**
 * Set all forms to be smart
 * @todo save input fields into browser for reusable form
 */
function formsaver() {
  //set value from localstorage
  var setglobal = function () {
    jQuery("input,textarea,select").each(function (i, el) {
      $(this).smartForm();
    });
  };
  if (typeof jQuery != "undefined") setglobal();
  //setInterval(function () { }, 500);
}
export {
  extend,
  forEach,
  getClosest,
  getDataOptions,
  eventHandler,
  isBrowser,
  isNode,
  formsaver,
};
