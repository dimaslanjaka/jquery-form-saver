(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.formSaver = void 0;
/// <reference path="index.d.ts">
var func_1 = require("./func");
var settings, forms;
// Default settings
var defaults = {
    selectorStatus: "[data-form-status]",
    selectorSave: "[data-form-save]",
    selectorDelete: "[data-form-delete]",
    selectorIgnore: "[data-form-no-save]",
    deleteClear: true,
    saveMessage: "Saved!",
    deleteMessage: "Deleted!",
    saveClass: "",
    deleteClass: "",
    initClass: "js-form-saver",
    callbackSave: function () { },
    callbackDelete: function () { },
    callbackLoad: function () { }
};
var formSaver = /** @class */ (function () {
    function formSaver() {
    }
    /**
     * Save form data to localStorage
     * @public
     * @param  {Element} btn Button that triggers form save
     * @param  {Element} form The form to save
     * @param  {Object} options
     * @param  {Event} event
     */
    formSaver.prototype.saveForm = function (btn, formID, options, event) {
        // Defaults and settings
        var overrides = func_1.getDataOptions(btn ? btn.getAttribute("data-options") : null);
        var merged = func_1.extend(settings || defaults, options || {}, overrides); // Merge user options with defaults
        var settings = merged;
        // Selectors and variables
        var form = document.querySelector(formID);
        var formSaverID = "formSaver-" + form.id;
        var formSaverData = {};
        var formFields = form.elements;
        var formStatus = form.querySelectorAll(settings.selectorStatus);
        /**
         * Convert field data into an array
         * @private
         * @param  {Element} field Form field to convert
         */
        var prepareField = function (field) {
            if (!func_1.getClosest(field, settings.selectorIgnore)) {
                if (field.type.toLowerCase() === "radio" ||
                    field.type.toLowerCase() === "checkbox") {
                    if (field.checked === true) {
                        formSaverData[field.name + field.value] = "on";
                    }
                }
                else if (field.type.toLowerCase() !== "hidden" &&
                    field.type.toLowerCase() !== "submit") {
                    if (field.value && field.value !== "") {
                        formSaverData[field.name] = field.value;
                    }
                }
            }
        };
        /**
         * Display status message
         * @private
         * @param  {Element} status The element that displays the status message
         * @param  {String} saveMessage The message to display on save
         * @param  {String} saveClass The class to apply to the save message wrappers
         */
        var displayStatus = function (status, saveMessage, saveClass) {
            status.innerHTML =
                saveClass === ""
                    ? "<div>" + saveMessage + "</div>"
                    : '<div class="' + saveClass + '">' + saveMessage + "</div>";
        };
        // Add field data to array
        func_1.forEach(formFields, function (field) {
            prepareField(field);
        });
        // Display save success message
        func_1.forEach(formStatus, function (status) {
            displayStatus(status, settings.saveMessage, settings.saveClass);
        });
        // Save form data in localStorage
        localStorage.setItem(formSaverID, JSON.stringify(formSaverData));
        settings.callbackSave(btn, form); // Run callbacks after save
    };
    /**
     * Remove form data from localStorage
     * @public
     * @param  {Element} btn Button that triggers form delete
     * @param  {Element} form The form to remove from localStorage
     * @param  {Object} options
     * @param  {Event} event
     */
    formSaver.prototype.deleteForm = function (btn, formID, options, event) {
        // Defaults and settings
        var overrides = func_1.getDataOptions(btn ? btn.getAttribute("data-options") : {});
        var settings = func_1.extend(settings || defaults, options || {}, overrides); // Merge user options with defaults
        // Selectors and variables
        var form = document.querySelector(formID);
        var formSaverID = "formSaver-" + form.id;
        var formStatus = form.querySelectorAll(settings.selectorStatus);
        var formMessage = settings.deleteClass === ""
            ? "<div>" + settings.deleteMessage + "</div>"
            : '<div class="' +
                settings.deleteClass +
                '">' +
                settings.deleteMessage +
                "</div>";
        /**
         * Display succes message
         * @private
         */
        var displayStatus = function () {
            if (settings.deleteClear === true || settings.deleteClear === "true") {
                sessionStorage.setItem(formSaverID + "-formSaverMessage", formMessage);
                location.reload(false);
            }
            else {
                func_1.forEach(formStatus, function (status) {
                    status.innerHTML = formMessage;
                });
            }
        };
        localStorage.removeItem(formSaverID); // Remove form data
        displayStatus(); // Display delete success message
        settings.callbackDelete(btn, form); // Run callbacks after delete
    };
    /**
     * Load form data from localStorage
     * @public
     * @param  {Element} form The form to get data for
     * @param  {Object} options
     */
    formSaver.prototype.loadForm = function (form, options) {
        // Selectors and variables
        var settings = func_1.extend(settings || defaults, options || {}); // Merge user options with defaults
        var formSaverID = "formSaver-" + form.id;
        var formSaverData = JSON.parse(localStorage.getItem(formSaverID));
        var formFields = form.elements;
        var formStatus = form.querySelectorAll(settings.selectorStatus);
        /**
         * Populate a field with localStorage data
         * @private
         * @param  {Element} field The field to get data form
         */
        var populateField = function (field) {
            if (formSaverData) {
                if (field.type.toLowerCase() === "radio" ||
                    field.type.toLowerCase() === "checkbox") {
                    if (formSaverData[field.name + field.value] === "on") {
                        field.checked = true;
                    }
                }
                else if (field.type.toLowerCase() !== "hidden" &&
                    field.type.toLowerCase() !== "submit") {
                    if (formSaverData[field.name]) {
                        field.value = formSaverData[field.name];
                    }
                }
            }
        };
        /**
         * Display success message
         * @param  {Element} status The element that displays the status message
         */
        var displayStatus = function (status) {
            status.innerHTML = sessionStorage.getItem(formSaverID + "-formSaverMessage");
            sessionStorage.removeItem(formSaverID + "-formSaverMessage");
        };
        // Populate form with data from localStorage
        func_1.forEach(formFields, function (field) {
            populateField(field);
        });
        // If page was reloaded and delete success message exists, display it
        func_1.forEach(formStatus, function (status) {
            displayStatus(status);
        });
        settings.callbackLoad(form); // Run callbacks after load
    };
    /**
     * Destroy the current initialization.
     * @public
     */
    formSaver.prototype.destroy = function () {
        if (!settings)
            return;
        document.documentElement.classList.remove(settings.initClass);
        document.removeEventListener("click", func_1.eventHandler, false);
        settings = null;
        forms = null;
    };
    /**
     * Initialize Form Saver
     * @public
     * @param {Object} options User settings
     */
    formSaver.prototype.init = function (options) {
        // feature test
        if (!func_1.isBrowser())
            return;
        // Destroy any existing initializations
        this.destroy();
        // Selectors and variables
        settings = func_1.extend(defaults, options || {}); // Merge user options with defaults
        forms = document.forms;
        // Add class to HTML element to activate conditional CSS
        document.documentElement.className +=
            (document.documentElement.className ? " " : "") + settings.initClass;
        // Get saved form data on page load
        func_1.forEach(forms, function (form) {
            this.loadForm(form, settings);
        });
        // Listen for click events
        document.addEventListener("click", func_1.eventHandler, false);
    };
    /**
     * Auto form saver
     */
    formSaver.prototype.auto = function () {
        func_1.formsaver();
    };
    return formSaver;
}());
exports.formSaver = formSaver;

},{"./func":2}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.formsaver = exports.isNode = exports.isBrowser = exports.eventHandler = exports.getDataOptions = exports.getClosest = exports.forEach = exports.extend = void 0;
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
    }
    else {
        for (var i = 0, len = collection.length; i < len; i++) {
            callback.call(scope, collection[i], i, collection);
        }
    }
};
exports.forEach = forEach;
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
exports.extend = extend;
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
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s), i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) { }
                    return i > -1;
                };
    }
    // Get closest match
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector))
            return elem;
    }
    return null;
};
exports.getClosest = getClosest;
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
exports.getDataOptions = getDataOptions;
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
    }
    else if (del) {
        event.preventDefault();
        formSaver.deleteForm(del, del.getAttribute("data-form-delete"), settings);
    }
};
exports.eventHandler = eventHandler;
/**
 * Is Browser (not node)
 */
var isBrowser = new Function("try {return this===window;}catch(e){ return false;}");
exports.isBrowser = isBrowser;
/**
 * Is Node (not browser)
 */
var isNode = new Function("try {return this===global;}catch(e){return false;}");
exports.isNode = isNode;
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
    if (typeof jQuery != "undefined")
        setglobal();
    //setInterval(function () { }, 500);
}
exports.formsaver = formsaver;

},{}]},{},[1]);
