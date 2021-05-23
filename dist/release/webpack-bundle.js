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

/// <reference path='./lStorage.ts' />
var formSaver2 = /** @class */ (function () {
    function formSaver2() {
    }
    /**
     * Save values form
     * @param el
     * @returns
     */
    formSaver2.save = function (el) {
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
    /**
     * Restore form value
     * @param el
     * @returns
     */
    formSaver2.restore = function (el) {
        if (el instanceof jQuery) {
            el = el.get(0);
        }
        var nodeValid = el.nodeType === 1;
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
        console.log(el.getAttribute("id"));
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

/// <reference path="./Object.d.ts"/>
/// <reference path="./globals.d.ts"/>
/// <reference path="./index.d.ts"/>
/// <reference path="./_conf.ts" />
/// <reference path="./formSaver2.ts" />
/**
 * SMARTFORM
 * @todo save form user input
 */
//console.log(`is browser : ${isBrowser()}`);
if (isBrowser) {
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

exports.__esModule = true;
__webpack_require__(/*! ./_conf */ "./src/js/_conf.ts");
__webpack_require__(/*! ./formSaver2 */ "./src/js/formSaver2.ts");
__webpack_require__(/*! ./jquery-saver */ "./src/js/jquery-saver.ts");

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qcXVlcnktZm9ybS1zYXZlci8uL3NyYy9qcy9fY29uZi50cyIsIndlYnBhY2s6Ly9qcXVlcnktZm9ybS1zYXZlci8uL3NyYy9qcy9mb3JtU2F2ZXIyLnRzIiwid2VicGFjazovL2pxdWVyeS1mb3JtLXNhdmVyLy4vc3JjL2pzL2pxdWVyeS1zYXZlci50cyIsIndlYnBhY2s6Ly9qcXVlcnktZm9ybS1zYXZlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9qcXVlcnktZm9ybS1zYXZlci8uL3NyYy9qcy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsc0JBQXNCLFNBQVMsZUFBZTtBQUNqRjtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7O0FDMUlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixZQUFZO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxlQUFlO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4REFBOEQ7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7Ozs7Ozs7VUNwR0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7Ozs7QUN0QmE7QUFDYixrQkFBa0I7QUFDbEIsbUJBQU8sQ0FBQyxrQ0FBUztBQUNqQixtQkFBTyxDQUFDLDRDQUFjO0FBQ3RCLG1CQUFPLENBQUMsZ0RBQWdCIiwiZmlsZSI6IndlYnBhY2stYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaWYgKHR5cGVvZiBtYWtlaWQgPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgLyoqXHJcbiAgICAgKiB1bmlxdWUgaWQgZ2VuZXJhdG9yXHJcbiAgICAgKiBAcGFyYW0gbGVuZ3RoIGRpZ2l0IG51bWJlciBzdHJpbmdcclxuICAgICAqIEByZXR1cm5zIHJhbmRvbSBzdHJpbmdcclxuICAgICAqL1xyXG4gICAgdmFyIG1ha2VpZCA9IGZ1bmN0aW9uIChsZW5ndGgpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gXCJcIjtcclxuICAgICAgICB2YXIgY2hhcmFjdGVycyA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODlcIjtcclxuICAgICAgICB2YXIgY2hhcmFjdGVyc0xlbmd0aCA9IGNoYXJhY3RlcnMubGVuZ3RoO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0ICs9IGNoYXJhY3RlcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJhY3RlcnNMZW5ndGgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbn1cclxuLyoqXHJcbiAqIExvY2FsIFN0b3JhZ2Uga2V5XHJcbiAqL1xyXG52YXIgc3RvcmFnZUtleSA9IGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcLyQvcywgXCJcIikgKyBcIi9mb3JtRmllbGRcIjtcclxudmFyIGZvcm1GaWVsZEJ1aWxkO1xyXG52YXIgZm9ybVNhdmVkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oc3RvcmFnZUtleS50b1N0cmluZygpKTtcclxuaWYgKCFmb3JtU2F2ZWQpIHtcclxuICAgIGZvcm1GaWVsZEJ1aWxkID0gW107XHJcbn1cclxuZWxzZSB7XHJcbiAgICBmb3JtRmllbGRCdWlsZCA9IEpTT04ucGFyc2UoZm9ybVNhdmVkKTtcclxufVxyXG4vKipcclxuICogRWxlbWVudCBJbmRleGVyXHJcbiAqL1xyXG52YXIgZm9ybUZpZWxkID0gZm9ybUZpZWxkQnVpbGQ7XHJcbnZhciB1bmlxdWVpZCA9IG1ha2VpZCg1KTtcclxuLyoqXHJcbiAqIGNoZWNrIGlmIHJ1bm5pbmcgaW4gYnJvd3NlclxyXG4gKi9cclxudmFyIGlzQnJvd3NlciA9IG5ldyBGdW5jdGlvbihcInRyeSB7cmV0dXJuIHRoaXM9PT13aW5kb3c7fWNhdGNoKGUpeyByZXR1cm4gZmFsc2U7fVwiKTtcclxuLyoqXHJcbiAqIEVsZW1lbnQgQ291bnRlclxyXG4gKi9cclxudmFyIENvdW50ID0gLTE7XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9Jy4vbFN0b3JhZ2UudHMnIC8+XHJcbnZhciBmb3JtU2F2ZXIyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gZm9ybVNhdmVyMigpIHtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2F2ZSB2YWx1ZXMgZm9ybVxyXG4gICAgICogQHBhcmFtIGVsXHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBmb3JtU2F2ZXIyLnNhdmUgPSBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICB2YXIga2V5ID0gdGhpcy5nZXRfaWRlbnRpZmllcihlbCk7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSBlbC52YWx1ZTtcclxuICAgICAgICB2YXIgYWxsb3dlZCA9ICFlbC5oYXNBdHRyaWJ1dGUoXCJuby1zYXZlXCIpICYmIGVsLmhhc0F0dHJpYnV0ZShcImFyaWEtZm9ybXNhdmVyXCIpO1xyXG4gICAgICAgIGlmIChrZXkgJiYgaXRlbSAhPT0gXCJcIiAmJiBhbGxvd2VkKSB7XHJcbiAgICAgICAgICAgIGlmIChlbC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09IFwiY2hlY2tib3hcIikge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCAoZWwuY2hlY2tlZCA9PSB0cnVlKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZSBjaGVja2JveCBidXR0b24gXCIsIGZvcm1TYXZlcjIub2Zmc2V0KGVsKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZWwuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PSBcInJhZGlvXCIgJiYgZWwuaGFzQXR0cmlidXRlKFwiaWRcIikpIHtcclxuICAgICAgICAgICAgICAgICQoJ1tuYW1lPVwiJyArIGVsLmdldEF0dHJpYnV0ZShcIm5hbWVcIikgKyAnXCJdJykuZWFjaChmdW5jdGlvbiAoaSwgZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgXCJvZmZcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgaXRlbS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmUgcmFkaW8gYnV0dG9uIFwiLCBmb3JtU2F2ZXIyLm9mZnNldChlbCkpO1xyXG4gICAgICAgICAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgaXRlbS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzYXZlJywga2V5LCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgT2Zmc2V0cyBFbGVtZW50XHJcbiAgICAgKiBAcGFyYW0gZWxcclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIGZvcm1TYXZlcjIub2Zmc2V0ID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgfTtcclxuICAgIGZvcm1TYXZlcjIuaGFzQXR0cmlidXRlID0gZnVuY3Rpb24gKGVsLCBuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsLm5vZGVUeXBlID09PSAxICYmIGVsLmhhc0F0dHJpYnV0ZShuYW1lKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJlc3RvcmUgZm9ybSB2YWx1ZVxyXG4gICAgICogQHBhcmFtIGVsXHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBmb3JtU2F2ZXIyLnJlc3RvcmUgPSBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICBpZiAoZWwgaW5zdGFuY2VvZiBqUXVlcnkpIHtcclxuICAgICAgICAgICAgZWwgPSBlbC5nZXQoMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBub2RlVmFsaWQgPSBlbC5ub2RlVHlwZSA9PT0gMTtcclxuICAgICAgICBDb3VudCsrO1xyXG4gICAgICAgIC8vIHNraXAgbm8gc2F2ZVxyXG4gICAgICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoXCJuby1zYXZlXCIpKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwiYXJpYS1mb3Jtc2F2ZXJcIiwgdW5pcXVlaWQpO1xyXG4gICAgICAgIHZhciBpdGVtO1xyXG4gICAgICAgIHZhciBrZXkgPSB0aGlzLmdldF9pZGVudGlmaWVyKGVsKTtcclxuICAgICAgICB2YXIgdHlwZSA9IGVsLmdldEF0dHJpYnV0ZShcInR5cGVcIik7XHJcbiAgICAgICAgLy8gYmVnaW4gcmVzdG9yYXRpb25cclxuICAgICAgICBpZiAoa2V5KSB7XHJcbiAgICAgICAgICAgIC8vIGNoZWNrYm94IGlucHV0IGJ1dHRvblxyXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ2YWx1ZSBjaGVja2JveCBcIiArIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgZWwuY2hlY2tlZCA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gcmFkaW8gaW5wdXQgYnV0dG9uXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT09IFwicmFkaW9cIikge1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkgPT09IFwib25cIjtcclxuICAgICAgICAgICAgICAgIGVsLmNoZWNrZWQgPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGlucHV0IHRleHQgbnVtYmVyLCB0ZXh0YXJlYSwgb3Igc2VsZWN0XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSA9PT0gbnVsbCB8fCAhaXRlbS50b1N0cmluZygpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsLnZhbHVlID0gaXRlbTtcclxuICAgICAgICAgICAgICAgIC8vIHNlbGVjdDJcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzX3NlbGVjdDIoZWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChlbCkudmFsKGl0ZW0pLnRyaWdnZXIoXCJjaGFuZ2VcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnbG9hZCcsIHR5cGUsIGtleSwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogSXMgU2VsZWN0MiBJbml0aWFsaXplZCA/XHJcbiAgICAgKiBAcGFyYW0gZWxcclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIGZvcm1TYXZlcjIuaXNfc2VsZWN0MiA9IGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlzX2pxdWVyeSgpICYmICQoZWwpLmRhdGEoXCJzZWxlY3QyXCIpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogSXMgalF1ZXJ5IGxvYWRlZD9cclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIGZvcm1TYXZlcjIuaXNfanF1ZXJ5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgalF1ZXJ5ICE9IFwidW5kZWZpbmVkXCI7XHJcbiAgICB9O1xyXG4gICAgZm9ybVNhdmVyMi5nZXRfaWRlbnRpZmllciA9IGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVsLmdldEF0dHJpYnV0ZShcImlkXCIpKTtcclxuICAgICAgICBpZiAoIWVsLmhhc0F0dHJpYnV0ZShcImlkXCIpKSB7XHJcbiAgICAgICAgICAgIGlmICghKENvdW50IGluIGZvcm1GaWVsZCkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBJRCA9IG1ha2VpZCg1KTtcclxuICAgICAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShcImlkXCIsIElEKTtcclxuICAgICAgICAgICAgICAgIGZvcm1GaWVsZFtDb3VudF0gPSBJRDtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHN0b3JhZ2VLZXkudG9TdHJpbmcoKSwgSlNPTi5zdHJpbmdpZnkoZm9ybUZpZWxkKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBmb3JtRmllbGRbQ291bnRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSW5jcmVhc2UgaW5kZXggb2Zmc2V0XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBDb3VudCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChlbC5nZXRBdHRyaWJ1dGUoXCJpZFwiKSA9PSBcIm51bGxcIikge1xyXG4gICAgICAgICAgICB2YXIgSUQgPSBtYWtlaWQoNSk7XHJcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShcImlkXCIsIElEKTtcclxuICAgICAgICAgICAgZm9ybUZpZWxkW0NvdW50XSA9IElEO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShzdG9yYWdlS2V5LnRvU3RyaW5nKCksIEpTT04uc3RyaW5naWZ5KGZvcm1GaWVsZCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbG9jYXRpb24ucGF0aG5hbWUgKyBlbC5nZXRBdHRyaWJ1dGUoXCJpZFwiKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gZm9ybVNhdmVyMjtcclxufSgpKTtcclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vT2JqZWN0LmQudHNcIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2dsb2JhbHMuZC50c1wiLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vaW5kZXguZC50c1wiLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vX2NvbmYudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9mb3JtU2F2ZXIyLnRzXCIgLz5cclxuLyoqXHJcbiAqIFNNQVJURk9STVxyXG4gKiBAdG9kbyBzYXZlIGZvcm0gdXNlciBpbnB1dFxyXG4gKi9cclxuLy9jb25zb2xlLmxvZyhgaXMgYnJvd3NlciA6ICR7aXNCcm93c2VyKCl9YCk7XHJcbmlmIChpc0Jyb3dzZXIpIHtcclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGlzSnF1ZXJ5TG9hZGVkID0gdHlwZW9mIGpRdWVyeSAhPSBcInVuZGVmaW5lZFwiO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coYGlzIGpRdWVyeSBsb2FkZWQgOiAke2lzSnF1ZXJ5TG9hZGVkfWApO1xyXG4gICAgICAgIGlmIChpc0pxdWVyeUxvYWRlZCkge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiQXBwbHkgcGx1Z2luIHNtYXJ0Zm9ybSBqUXVlcnlcIik7XHJcbiAgICAgICAgICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAgICAgICAgICAgJC5mbi5nZXRJRE5hbWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImFyaWEtYXV0b3ZhbHVlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudmFsKHVuaXF1ZWlkKS50cmlnZ2VyKFwiY2hhbmdlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm9ybVNhdmVyMi5nZXRfaWRlbnRpZmllcih0aGlzKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAkLmZuLmhhc19hdHRyID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICQodGhpcykuYXR0cihuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBGb3Igc29tZSBicm93c2VycywgYGF0dHJgIGlzIHVuZGVmaW5lZDsgZm9yIG90aGVycyxcclxuICAgICAgICAgICAgICAgICAgICAvLyBgYXR0cmAgaXMgZmFsc2UuICBDaGVjayBmb3IgYm90aC5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIGF0dHIgIT09IFwidW5kZWZpbmVkXCIgJiYgYXR0ciAhPT0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgJC5mbi5zbWFydEZvcm0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICBmb3JtU2F2ZXIyLnJlc3RvcmUoJCh0aGlzKS5nZXQoMCkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICQuYXJyaXZlID0gZnVuY3Rpb24gKHRhcmdldCwgY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGFyZ2V0KS5iaW5kKFwiRE9NTm9kZUluc2VydGVkXCIsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50KS5iaW5kKFwiRE9NTm9kZUluc2VydGVkXCIsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudCkuYmluZChcIkRPTU5vZGVJbnNlcnRlZFwiLCB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIC8vIGJpbmQgdG8gbmV3IGVsZW1lbnRzXHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50KS5iaW5kKFwiRE9NTm9kZUluc2VydGVkXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKCQodGhpcykucHJvcChcInRhZ05hbWVcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlNFTEVDVFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiSU5QVVRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlRFWFRBUkVBXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtU2F2ZXIyLnJlc3RvcmUoJCh0aGlzKS5nZXQoMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvLyBkZXRhY2ggZnJvbSByZW1vdmVkIGVsZW1lbnRzXHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50KS5iaW5kKFwiRE9NTm9kZVJlbW92ZWRcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWxsb3dlZCA9ICF0LmF0dHIoXCJuby1zYXZlXCIpICYmIHQuYXR0cihcImFyaWEtZm9ybXNhdmVyXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbGxvd2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodC5wcm9wKFwidGFnTmFtZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlNFTEVDVFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIklOUFVUXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiVEVYVEFSRUFcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0Lm9mZihcImNoYW5nZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy9zYXZlIHZhbHVlIHRvIGxvY2Fsc3RvcmFnZVxyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudCkub24oXCJjaGFuZ2VcIiwgXCJzZWxlY3QsIGlucHV0LCB0ZXh0YXJlYVwiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcm1TYXZlcjIuc2F2ZSh0aGlzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudCkub24oXCJmb2N1c1wiLCBcImlucHV0LHRleHRhcmVhLHNlbGVjdFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHQuZ2V0SUROYW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyaWEgPSB0LmF0dHIoXCJhcmlhLWZvcm1zYXZlclwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJpYSAmJiBhcmlhICE9IHVuaXF1ZWlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHQuc21hcnRGb3JtKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHQuYXR0cihcImFyaWEtZm9ybXNhdmVyXCIsIHVuaXF1ZWlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSkoalF1ZXJ5KTtcclxuICAgICAgICB9XHJcbiAgICB9KSgpO1xyXG59XHJcbi8qKlxyXG4gKiBTZXQgYWxsIGZvcm1zIHRvIGJlIHNtYXJ0XHJcbiAqIEB0b2RvIHNhdmUgaW5wdXQgZmllbGRzIGludG8gYnJvd3NlciBmb3IgcmV1c2FibGUgZm9ybVxyXG4gKi9cclxuZnVuY3Rpb24gZm9ybXNhdmVyKCkge1xyXG4gICAgaWYgKHR5cGVvZiBqUXVlcnkgIT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU3RhcnRpbmcgc21hcnRmb3JtIGpRdWVyeVwiKTtcclxuICAgICAgICBpZiAodHlwZW9mIGpRdWVyeSAhPSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIGpRdWVyeShcImlucHV0LHRleHRhcmVhLHNlbGVjdFwiKS5lYWNoKGZ1bmN0aW9uIChpLCBlbCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5zbWFydEZvcm0oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxucmVxdWlyZShcIi4vX2NvbmZcIik7XHJcbnJlcXVpcmUoXCIuL2Zvcm1TYXZlcjJcIik7XHJcbnJlcXVpcmUoXCIuL2pxdWVyeS1zYXZlclwiKTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==