/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/_conf.ts":
/*!*************************!*\
  !*** ./src/js/_conf.ts ***!
  \*************************/
/***/ (() => {

if (typeof makeid == "undefined") {
    /**
     * unique id generator
     * @param length digit number string
     * @returns random string
     */
    var makeid = function (length) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };
}
/**
 * Local Storage key
 */
var storageKey = location.pathname.replace(/\/$/s, "") + "/formField";
var formFieldBuild;
var formSaved = localStorage.getItem(storageKey.toString());
if (!formSaved) {
    formFieldBuild = [];
}
else {
    formFieldBuild = JSON.parse(formSaved);
}
/**
 * Element Indexer
 */
var formField = formFieldBuild;
var uniqueid = makeid(5);
/**
 * check if running in browser
 */
var isBrowser = new Function("try {return this===window;}catch(e){ return false;}");
/**
 * Element Counter
 */
var Count = -1;


/***/ }),

/***/ "./src/js/formSaver2.ts":
/*!******************************!*\
  !*** ./src/js/formSaver2.ts ***!
  \******************************/
/***/ (() => {

/// <reference path='./_lStorage.ts' />
/// <reference path='./_conf.ts' />
var formSaver2 = /** @class */ (function () {
    function formSaver2() {
    }
    /**
     * Save values form
     * @param el
     * @returns
     */
    formSaver2.save = function (el) {
        el = this.convertElement(el);
        var key = this.get_identifier(el);
        var item = el.value;
        var allowed = !el.hasAttribute("no-save") && el.hasAttribute("aria-formsaver");
        if (key && item !== "" && allowed) {
            if (el.getAttribute("type") == "checkbox") {
                localStorage.setItem(key, (el.checked == true).toString());
                console.log("save checkbox button ", formSaver2.offset(el));
                return;
            }
            else if (el.getAttribute("type") == "radio" && el.hasAttribute("id")) {
                $('[name="' + el.getAttribute("name") + '"]').each(function (i, e) {
                    localStorage.setItem(key, "off");
                });
                setTimeout(function () {
                    localStorage.setItem(key, item.toString());
                    console.log("save radio button ", formSaver2.offset(el));
                }, 500);
                return;
            }
            else {
                localStorage.setItem(key, item.toString());
            }
            //console.log('save', key, localStorage.getItem(key));
        }
    };
    /**
     * Get Offsets Element
     * @param el
     * @returns
     */
    formSaver2.offset = function (el) {
        return el.getBoundingClientRect();
    };
    formSaver2.hasAttribute = function (el, name) {
        return el.nodeType === 1 && el.hasAttribute(name);
    };
    formSaver2.convertElement = function (el) {
        if (el instanceof jQuery) {
            el = el.get(0);
        }
        var nodeValid = el.nodeType === 1;
        return el;
    };
    /**
     * Restore form value
     * @param el
     * @returns
     */
    formSaver2.restore = function (el) {
        el = this.convertElement(el);
        Count++;
        // skip no save
        if (el.hasAttribute("no-save"))
            return;
        el.setAttribute("aria-formsaver", uniqueid);
        var item;
        var key = this.get_identifier(el);
        var type = el.getAttribute("type");
        // begin restoration
        if (key) {
            // checkbox input button
            if (type === "checkbox") {
                item = JSON.parse(localStorage.getItem(key));
                if (item === null) {
                    return;
                }
                console.log("value checkbox " + item);
                el.checked = item;
                return;
            }
            // radio input button
            else if (type === "radio") {
                item = localStorage.getItem(key) === "on";
                el.checked = item;
                return;
            }
            // input text number, textarea, or select
            else {
                item = localStorage.getItem(key);
                if (item === null || !item.toString().length) {
                    return;
                }
                el.value = item;
                // select2
                if (this.is_select2(el)) {
                    $(el).val(item).trigger("change");
                }
            }
            //console.log('load', type, key, item);
        }
    };
    /**
     * Is Select2 Initialized ?
     * @param el
     * @returns
     */
    formSaver2.is_select2 = function (el) {
        return this.is_jquery() && $(el).data("select2");
    };
    /**
     * Is jQuery loaded?
     * @returns
     */
    formSaver2.is_jquery = function () {
        return typeof jQuery != "undefined";
    };
    formSaver2.get_identifier = function (el) {
        el = this.convertElement(el);
        if (!el.hasAttribute("id")) {
            if (!(Count in formField)) {
                var ID = makeid(5);
                el.setAttribute("id", ID);
                formField[Count] = ID;
                localStorage.setItem(storageKey.toString(), JSON.stringify(formField));
            }
            else {
                el.setAttribute("id", formField[Count]);
            }
            /**
             * Increase index offset
             */
            Count++;
        }
        else if (el.getAttribute("id") == "null") {
            var ID = makeid(5);
            el.setAttribute("id", ID);
            formField[Count] = ID;
            localStorage.setItem(storageKey.toString(), JSON.stringify(formField));
        }
        return location.pathname + el.getAttribute("id");
    };
    return formSaver2;
}());


/***/ }),

/***/ "./src/js/jquery-saver.ts":
/*!********************************!*\
  !*** ./src/js/jquery-saver.ts ***!
  \********************************/
/***/ (() => {

/// <reference path="./_conf.ts" />
/// <reference path="./_a_Object.d.ts"/>
/// <reference path="./globals.d.ts"/>
/// <reference path="./index.d.ts"/>
/// <reference path="./formSaver2.ts" />
/**
 * SMARTFORM
 * @todo save form user input
 */
//console.log(`is browser : ${isBrowser()}`);
if (isBrowser()) {
    (function () {
        var isJqueryLoaded = typeof jQuery != "undefined";
        //console.log(`is jQuery loaded : ${isJqueryLoaded}`);
        if (isJqueryLoaded) {
            //console.log("Apply plugin smartform jQuery");
            (function ($) {
                $.fn.getIDName = function () {
                    if ($(this).attr("aria-autovalue")) {
                        $(this).val(uniqueid).trigger("change");
                    }
                    return formSaver2.get_identifier(this);
                };
                $.fn.has_attr = function (name) {
                    var attr = $(this).attr(name);
                    // For some browsers, `attr` is undefined; for others,
                    // `attr` is false.  Check for both.
                    return typeof attr !== "undefined" && attr !== false;
                };
                $.fn.smartForm = function () {
                    Count++;
                    formSaver2.restore($(this).get(0));
                };
                $.arrive = function (target, callback) {
                    if (target) {
                        $(target).bind("DOMNodeInserted", callback);
                    }
                    else {
                        if (typeof callback == "function") {
                            $(document).bind("DOMNodeInserted", callback);
                        }
                        else if (typeof target == "function") {
                            $(document).bind("DOMNodeInserted", target);
                        }
                    }
                };
                // bind to new elements
                $(document).bind("DOMNodeInserted", function () {
                    switch ($(this).prop("tagName")) {
                        case "SELECT":
                        case "INPUT":
                        case "TEXTAREA":
                            formSaver2.restore($(this).get(0));
                            break;
                    }
                });
                // detach from removed elements
                $(document).bind("DOMNodeRemoved", function () {
                    var t = $(this);
                    var allowed = !t.attr("no-save") && t.attr("aria-formsaver");
                    if (allowed) {
                        switch (t.prop("tagName")) {
                            case "SELECT":
                            case "INPUT":
                            case "TEXTAREA":
                                t.off("change");
                                break;
                        }
                    }
                });
                //save value to localstorage
                $(document).on("change", "select, input, textarea", function (e) {
                    formSaver2.save(this);
                });
                $(document).on("focus", "input,textarea,select", function () {
                    var t = $(this);
                    t.getIDName();
                    var aria = t.attr("aria-formsaver");
                    if (aria && aria != uniqueid) {
                        t.smartForm();
                        t.attr("aria-formsaver", uniqueid);
                    }
                });
            })(jQuery);
        }
    })();
}
/**
 * Set all forms to be smart
 * @todo save input fields into browser for reusable form
 */
function formsaver() {
    if (typeof jQuery != "undefined") {
        console.log("Starting smartform jQuery");
        if (typeof jQuery != "undefined") {
            jQuery("input,textarea,select").each(function (i, el) {
                $(this).smartForm();
            });
        }
    }
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!************************!*\
  !*** ./src/js/main.ts ***!
  \************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./_conf */ "./src/js/_conf.ts");
__webpack_require__(/*! ./formSaver2 */ "./src/js/formSaver2.ts");
__webpack_require__(/*! ./jquery-saver */ "./src/js/jquery-saver.ts");

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qcXVlcnktZm9ybS1zYXZlci8uL3NyYy9qcy9fY29uZi50cyIsIndlYnBhY2s6Ly9qcXVlcnktZm9ybS1zYXZlci8uL3NyYy9qcy9mb3JtU2F2ZXIyLnRzIiwid2VicGFjazovL2pxdWVyeS1mb3JtLXNhdmVyLy4vc3JjL2pzL2pxdWVyeS1zYXZlci50cyIsIndlYnBhY2s6Ly9qcXVlcnktZm9ybS1zYXZlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9qcXVlcnktZm9ybS1zYXZlci8uL3NyYy9qcy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsc0JBQXNCLFNBQVMsZUFBZTtBQUNqRjtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7O0FDaEpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixZQUFZO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxlQUFlO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4REFBOEQ7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7Ozs7Ozs7VUNwR0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QsbUJBQU8sQ0FBQyxrQ0FBUztBQUNqQixtQkFBTyxDQUFDLDRDQUFjO0FBQ3RCLG1CQUFPLENBQUMsZ0RBQWdCIiwiZmlsZSI6IndlYnBhY2stYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaWYgKHR5cGVvZiBtYWtlaWQgPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgLyoqXHJcbiAgICAgKiB1bmlxdWUgaWQgZ2VuZXJhdG9yXHJcbiAgICAgKiBAcGFyYW0gbGVuZ3RoIGRpZ2l0IG51bWJlciBzdHJpbmdcclxuICAgICAqIEByZXR1cm5zIHJhbmRvbSBzdHJpbmdcclxuICAgICAqL1xyXG4gICAgdmFyIG1ha2VpZCA9IGZ1bmN0aW9uIChsZW5ndGgpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gXCJcIjtcclxuICAgICAgICB2YXIgY2hhcmFjdGVycyA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODlcIjtcclxuICAgICAgICB2YXIgY2hhcmFjdGVyc0xlbmd0aCA9IGNoYXJhY3RlcnMubGVuZ3RoO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0ICs9IGNoYXJhY3RlcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJhY3RlcnNMZW5ndGgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbn1cclxuLyoqXHJcbiAqIExvY2FsIFN0b3JhZ2Uga2V5XHJcbiAqL1xyXG52YXIgc3RvcmFnZUtleSA9IGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcLyQvcywgXCJcIikgKyBcIi9mb3JtRmllbGRcIjtcclxudmFyIGZvcm1GaWVsZEJ1aWxkO1xyXG52YXIgZm9ybVNhdmVkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oc3RvcmFnZUtleS50b1N0cmluZygpKTtcclxuaWYgKCFmb3JtU2F2ZWQpIHtcclxuICAgIGZvcm1GaWVsZEJ1aWxkID0gW107XHJcbn1cclxuZWxzZSB7XHJcbiAgICBmb3JtRmllbGRCdWlsZCA9IEpTT04ucGFyc2UoZm9ybVNhdmVkKTtcclxufVxyXG4vKipcclxuICogRWxlbWVudCBJbmRleGVyXHJcbiAqL1xyXG52YXIgZm9ybUZpZWxkID0gZm9ybUZpZWxkQnVpbGQ7XHJcbnZhciB1bmlxdWVpZCA9IG1ha2VpZCg1KTtcclxuLyoqXHJcbiAqIGNoZWNrIGlmIHJ1bm5pbmcgaW4gYnJvd3NlclxyXG4gKi9cclxudmFyIGlzQnJvd3NlciA9IG5ldyBGdW5jdGlvbihcInRyeSB7cmV0dXJuIHRoaXM9PT13aW5kb3c7fWNhdGNoKGUpeyByZXR1cm4gZmFsc2U7fVwiKTtcclxuLyoqXHJcbiAqIEVsZW1lbnQgQ291bnRlclxyXG4gKi9cclxudmFyIENvdW50ID0gLTE7XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9Jy4vX2xTdG9yYWdlLnRzJyAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPScuL19jb25mLnRzJyAvPlxyXG52YXIgZm9ybVNhdmVyMiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIGZvcm1TYXZlcjIoKSB7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNhdmUgdmFsdWVzIGZvcm1cclxuICAgICAqIEBwYXJhbSBlbFxyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgZm9ybVNhdmVyMi5zYXZlID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgZWwgPSB0aGlzLmNvbnZlcnRFbGVtZW50KGVsKTtcclxuICAgICAgICB2YXIga2V5ID0gdGhpcy5nZXRfaWRlbnRpZmllcihlbCk7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSBlbC52YWx1ZTtcclxuICAgICAgICB2YXIgYWxsb3dlZCA9ICFlbC5oYXNBdHRyaWJ1dGUoXCJuby1zYXZlXCIpICYmIGVsLmhhc0F0dHJpYnV0ZShcImFyaWEtZm9ybXNhdmVyXCIpO1xyXG4gICAgICAgIGlmIChrZXkgJiYgaXRlbSAhPT0gXCJcIiAmJiBhbGxvd2VkKSB7XHJcbiAgICAgICAgICAgIGlmIChlbC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09IFwiY2hlY2tib3hcIikge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCAoZWwuY2hlY2tlZCA9PSB0cnVlKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZSBjaGVja2JveCBidXR0b24gXCIsIGZvcm1TYXZlcjIub2Zmc2V0KGVsKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZWwuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PSBcInJhZGlvXCIgJiYgZWwuaGFzQXR0cmlidXRlKFwiaWRcIikpIHtcclxuICAgICAgICAgICAgICAgICQoJ1tuYW1lPVwiJyArIGVsLmdldEF0dHJpYnV0ZShcIm5hbWVcIikgKyAnXCJdJykuZWFjaChmdW5jdGlvbiAoaSwgZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgXCJvZmZcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgaXRlbS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmUgcmFkaW8gYnV0dG9uIFwiLCBmb3JtU2F2ZXIyLm9mZnNldChlbCkpO1xyXG4gICAgICAgICAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgaXRlbS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzYXZlJywga2V5LCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgT2Zmc2V0cyBFbGVtZW50XHJcbiAgICAgKiBAcGFyYW0gZWxcclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIGZvcm1TYXZlcjIub2Zmc2V0ID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgfTtcclxuICAgIGZvcm1TYXZlcjIuaGFzQXR0cmlidXRlID0gZnVuY3Rpb24gKGVsLCBuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsLm5vZGVUeXBlID09PSAxICYmIGVsLmhhc0F0dHJpYnV0ZShuYW1lKTtcclxuICAgIH07XHJcbiAgICBmb3JtU2F2ZXIyLmNvbnZlcnRFbGVtZW50ID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgaWYgKGVsIGluc3RhbmNlb2YgalF1ZXJ5KSB7XHJcbiAgICAgICAgICAgIGVsID0gZWwuZ2V0KDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbm9kZVZhbGlkID0gZWwubm9kZVR5cGUgPT09IDE7XHJcbiAgICAgICAgcmV0dXJuIGVsO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmVzdG9yZSBmb3JtIHZhbHVlXHJcbiAgICAgKiBAcGFyYW0gZWxcclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIGZvcm1TYXZlcjIucmVzdG9yZSA9IGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIGVsID0gdGhpcy5jb252ZXJ0RWxlbWVudChlbCk7XHJcbiAgICAgICAgQ291bnQrKztcclxuICAgICAgICAvLyBza2lwIG5vIHNhdmVcclxuICAgICAgICBpZiAoZWwuaGFzQXR0cmlidXRlKFwibm8tc2F2ZVwiKSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShcImFyaWEtZm9ybXNhdmVyXCIsIHVuaXF1ZWlkKTtcclxuICAgICAgICB2YXIgaXRlbTtcclxuICAgICAgICB2YXIga2V5ID0gdGhpcy5nZXRfaWRlbnRpZmllcihlbCk7XHJcbiAgICAgICAgdmFyIHR5cGUgPSBlbC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpO1xyXG4gICAgICAgIC8vIGJlZ2luIHJlc3RvcmF0aW9uXHJcbiAgICAgICAgaWYgKGtleSkge1xyXG4gICAgICAgICAgICAvLyBjaGVja2JveCBpbnB1dCBidXR0b25cclxuICAgICAgICAgICAgaWYgKHR5cGUgPT09IFwiY2hlY2tib3hcIikge1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidmFsdWUgY2hlY2tib3ggXCIgKyBpdGVtKTtcclxuICAgICAgICAgICAgICAgIGVsLmNoZWNrZWQgPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHJhZGlvIGlucHV0IGJ1dHRvblxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSBcInJhZGlvXCIpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpID09PSBcIm9uXCI7XHJcbiAgICAgICAgICAgICAgICBlbC5jaGVja2VkID0gaXRlbTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBpbnB1dCB0ZXh0IG51bWJlciwgdGV4dGFyZWEsIG9yIHNlbGVjdFxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gPT09IG51bGwgfHwgIWl0ZW0udG9TdHJpbmcoKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbC52YWx1ZSA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICAvLyBzZWxlY3QyXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc19zZWxlY3QyKGVsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZWwpLnZhbChpdGVtKS50cmlnZ2VyKFwiY2hhbmdlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2xvYWQnLCB0eXBlLCBrZXksIGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIElzIFNlbGVjdDIgSW5pdGlhbGl6ZWQgP1xyXG4gICAgICogQHBhcmFtIGVsXHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBmb3JtU2F2ZXIyLmlzX3NlbGVjdDIgPSBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pc19qcXVlcnkoKSAmJiAkKGVsKS5kYXRhKFwic2VsZWN0MlwiKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIElzIGpRdWVyeSBsb2FkZWQ/XHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBmb3JtU2F2ZXIyLmlzX2pxdWVyeSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGpRdWVyeSAhPSBcInVuZGVmaW5lZFwiO1xyXG4gICAgfTtcclxuICAgIGZvcm1TYXZlcjIuZ2V0X2lkZW50aWZpZXIgPSBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICBlbCA9IHRoaXMuY29udmVydEVsZW1lbnQoZWwpO1xyXG4gICAgICAgIGlmICghZWwuaGFzQXR0cmlidXRlKFwiaWRcIikpIHtcclxuICAgICAgICAgICAgaWYgKCEoQ291bnQgaW4gZm9ybUZpZWxkKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIElEID0gbWFrZWlkKDUpO1xyXG4gICAgICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwiaWRcIiwgSUQpO1xyXG4gICAgICAgICAgICAgICAgZm9ybUZpZWxkW0NvdW50XSA9IElEO1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oc3RvcmFnZUtleS50b1N0cmluZygpLCBKU09OLnN0cmluZ2lmeShmb3JtRmllbGQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShcImlkXCIsIGZvcm1GaWVsZFtDb3VudF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJbmNyZWFzZSBpbmRleCBvZmZzZXRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIENvdW50Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGVsLmdldEF0dHJpYnV0ZShcImlkXCIpID09IFwibnVsbFwiKSB7XHJcbiAgICAgICAgICAgIHZhciBJRCA9IG1ha2VpZCg1KTtcclxuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwiaWRcIiwgSUQpO1xyXG4gICAgICAgICAgICBmb3JtRmllbGRbQ291bnRdID0gSUQ7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHN0b3JhZ2VLZXkudG9TdHJpbmcoKSwgSlNPTi5zdHJpbmdpZnkoZm9ybUZpZWxkKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsb2NhdGlvbi5wYXRobmFtZSArIGVsLmdldEF0dHJpYnV0ZShcImlkXCIpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBmb3JtU2F2ZXIyO1xyXG59KCkpO1xyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9fY29uZi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL19hX09iamVjdC5kLnRzXCIvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9nbG9iYWxzLmQudHNcIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2luZGV4LmQudHNcIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2Zvcm1TYXZlcjIudHNcIiAvPlxyXG4vKipcclxuICogU01BUlRGT1JNXHJcbiAqIEB0b2RvIHNhdmUgZm9ybSB1c2VyIGlucHV0XHJcbiAqL1xyXG4vL2NvbnNvbGUubG9nKGBpcyBicm93c2VyIDogJHtpc0Jyb3dzZXIoKX1gKTtcclxuaWYgKGlzQnJvd3NlcigpKSB7XHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpc0pxdWVyeUxvYWRlZCA9IHR5cGVvZiBqUXVlcnkgIT0gXCJ1bmRlZmluZWRcIjtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGBpcyBqUXVlcnkgbG9hZGVkIDogJHtpc0pxdWVyeUxvYWRlZH1gKTtcclxuICAgICAgICBpZiAoaXNKcXVlcnlMb2FkZWQpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkFwcGx5IHBsdWdpbiBzbWFydGZvcm0galF1ZXJ5XCIpO1xyXG4gICAgICAgICAgICAoZnVuY3Rpb24gKCQpIHtcclxuICAgICAgICAgICAgICAgICQuZm4uZ2V0SUROYW1lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJhcmlhLWF1dG92YWx1ZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnZhbCh1bmlxdWVpZCkudHJpZ2dlcihcImNoYW5nZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1TYXZlcjIuZ2V0X2lkZW50aWZpZXIodGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgJC5mbi5oYXNfYXR0ciA9IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAkKHRoaXMpLmF0dHIobmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9yIHNvbWUgYnJvd3NlcnMsIGBhdHRyYCBpcyB1bmRlZmluZWQ7IGZvciBvdGhlcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYGF0dHJgIGlzIGZhbHNlLiAgQ2hlY2sgZm9yIGJvdGguXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBhdHRyICE9PSBcInVuZGVmaW5lZFwiICYmIGF0dHIgIT09IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICQuZm4uc21hcnRGb3JtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9ybVNhdmVyMi5yZXN0b3JlKCQodGhpcykuZ2V0KDApKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAkLmFycml2ZSA9IGZ1bmN0aW9uICh0YXJnZXQsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRhcmdldCkuYmluZChcIkRPTU5vZGVJbnNlcnRlZFwiLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudCkuYmluZChcIkRPTU5vZGVJbnNlcnRlZFwiLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQpLmJpbmQoXCJET01Ob2RlSW5zZXJ0ZWRcIiwgdGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAvLyBiaW5kIHRvIG5ldyBlbGVtZW50c1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudCkuYmluZChcIkRPTU5vZGVJbnNlcnRlZFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICgkKHRoaXMpLnByb3AoXCJ0YWdOYW1lXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJTRUxFQ1RcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIklOUFVUXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJURVhUQVJFQVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybVNhdmVyMi5yZXN0b3JlKCQodGhpcykuZ2V0KDApKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8gZGV0YWNoIGZyb20gcmVtb3ZlZCBlbGVtZW50c1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudCkuYmluZChcIkRPTU5vZGVSZW1vdmVkXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFsbG93ZWQgPSAhdC5hdHRyKFwibm8tc2F2ZVwiKSAmJiB0LmF0dHIoXCJhcmlhLWZvcm1zYXZlclwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWxsb3dlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHQucHJvcChcInRhZ05hbWVcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJTRUxFQ1RcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJJTlBVVFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlRFWFRBUkVBXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5vZmYoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vc2F2ZSB2YWx1ZSB0byBsb2NhbHN0b3JhZ2VcclxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKFwiY2hhbmdlXCIsIFwic2VsZWN0LCBpbnB1dCwgdGV4dGFyZWFcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3JtU2F2ZXIyLnNhdmUodGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKFwiZm9jdXNcIiwgXCJpbnB1dCx0ZXh0YXJlYSxzZWxlY3RcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB0LmdldElETmFtZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmlhID0gdC5hdHRyKFwiYXJpYS1mb3Jtc2F2ZXJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyaWEgJiYgYXJpYSAhPSB1bmlxdWVpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0LnNtYXJ0Rm9ybSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0LmF0dHIoXCJhcmlhLWZvcm1zYXZlclwiLCB1bmlxdWVpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pKGpRdWVyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSkoKTtcclxufVxyXG4vKipcclxuICogU2V0IGFsbCBmb3JtcyB0byBiZSBzbWFydFxyXG4gKiBAdG9kbyBzYXZlIGlucHV0IGZpZWxkcyBpbnRvIGJyb3dzZXIgZm9yIHJldXNhYmxlIGZvcm1cclxuICovXHJcbmZ1bmN0aW9uIGZvcm1zYXZlcigpIHtcclxuICAgIGlmICh0eXBlb2YgalF1ZXJ5ICE9IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlN0YXJ0aW5nIHNtYXJ0Zm9ybSBqUXVlcnlcIik7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBqUXVlcnkgIT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICBqUXVlcnkoXCJpbnB1dCx0ZXh0YXJlYSxzZWxlY3RcIikuZWFjaChmdW5jdGlvbiAoaSwgZWwpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuc21hcnRGb3JtKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxucmVxdWlyZShcIi4vX2NvbmZcIik7XHJcbnJlcXVpcmUoXCIuL2Zvcm1TYXZlcjJcIik7XHJcbnJlcXVpcmUoXCIuL2pxdWVyeS1zYXZlclwiKTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==