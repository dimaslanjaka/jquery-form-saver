var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function makeid(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
var storageKey = location.pathname.replace(/\/$/s, "") + "/formField";
var formFieldBuild;
var formSaved = localStorage.getItem(storageKey.toString());
if (!formSaved) {
    formFieldBuild = [];
}
else {
    formFieldBuild = JSON.parse(formSaved);
}
var formField = formFieldBuild;
var uniqueid = makeid(5);
var isBrowser = new Function("try {return this===window;}catch(e){ return false;}");
var Count = -1;
if (typeof Storage == "undefined") {
    var Storage_1 = (function () {
        function Storage() {
        }
        return Storage;
    }());
}
var lStorage = (function (_super) {
    __extends(lStorage, _super);
    function lStorage(prefix) {
        if (prefix === void 0) { prefix = ""; }
        var _this = _super.call(this) || this;
        _this.prefix = "";
        _this.prefix = prefix;
        return _this;
    }
    lStorage.prototype.has = function (key) {
        return !!localStorage[this.prefix + key] && !!localStorage[this.prefix + key].length;
    };
    lStorage.prototype.get = function (key) {
        if (!this.has(this.prefix + key)) {
            return false;
        }
        var data = localStorage[this.prefix + key];
        try {
            return JSON.parse(data);
        }
        catch (e) {
            return data;
        }
    };
    lStorage.prototype.set = function (key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
        }
        catch (e) {
            localStorage.setItem(this.prefix + key, value);
        }
    };
    lStorage.prototype.extend = function (key, value) {
        if (this.has(this.prefix + key)) {
            var _value = this.get(this.prefix + key);
            if (typeof jQuery != "undefined") {
                $.extend(_value, JSON.parse(JSON.stringify(value)));
            }
            this.set(this.prefix + key, _value);
        }
        else {
            this.set(this.prefix + key, value);
        }
    };
    lStorage.prototype.remove = function (key) {
        localStorage.removeItem(this.prefix + key);
    };
    return lStorage;
}(Storage));
var formSaver2Storage = (function () {
    function formSaver2Storage() {
    }
    formSaver2Storage.set = function (key, value) {
        if (typeof value == "object" || Array.isArray(value))
            value = JSON.stringify(value);
        if (typeof value != "string")
            value = new String(value);
        localStorage.setItem(key, value);
    };
    formSaver2Storage.get = function (key, fallback) {
        var value = localStorage.getItem(key);
        if (this.IsJsonString(value)) {
            value = JSON.parse(value);
        }
        if (value != null)
            return value;
        return fallback;
    };
    formSaver2Storage.IsJsonString = function (str) {
        if (str == null)
            return false;
        try {
            JSON.parse(str);
        }
        catch (e) {
            return false;
        }
        return true;
    };
    return formSaver2Storage;
}());
var formSaver2 = (function () {
    function formSaver2(el, options) {
        var defaultOpt = {
            debug: false,
            method: "vanilla",
        };
        if (typeof options != "object")
            options = {};
        options = Object.assign(defaultOpt, options);
        if (typeof options.debug == "undefined") {
            options.debug = false;
            console.log("change debug to false");
        }
        formSaver2.restore(el, options.debug);
        if (options.method == "jquery" && formSaver2.is_jquery()) {
            formSaver2.jquery_listener();
        }
        else {
            console.log("vanilla listener started");
            formSaver2.vanilla_listener(el, function () {
                console.log(arguments);
                formSaver2.save(el, options.debug);
            });
        }
    }
    formSaver2.offset = function (el) {
        return el.getBoundingClientRect();
    };
    formSaver2.jquery_listener = function () {
        $(document).bind("DOMNodeInserted", function () {
            switch ($(this).prop("tagName")) {
                case "SELECT":
                case "INPUT":
                case "TEXTAREA":
                    formSaver2.restore($(this).get(0));
                    break;
            }
        });
        $(document).bind("DOMNodeRemoved", function () {
            var t = $(this);
            var allowed = !t.attr("no-save") && t.attr("formsaver-integrity");
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
        $(document).on("change", "select, input, textarea", function (e) {
            formSaver2.save(this);
        });
        $(document).on("focus", "input,textarea,select", function () {
            var t = $(this);
            t.getIDName();
            var aria = t.attr("formsaver-integrity");
            if (aria && aria != uniqueid) {
                console.log("aria id invalid");
                t.smartForm();
                t.attr("formsaver-integrity", uniqueid);
            }
        });
    };
    formSaver2.vanilla_listener = function (el, callback) {
        if (el.addEventListener) {
            el.addEventListener("change", callback);
        }
        else if (el.attachEvent) {
            el.attachEvent("onchange", callback);
        }
    };
    formSaver2.hasAttribute = function (el, name) {
        return el.nodeType === 1 && el.hasAttribute(name);
    };
    formSaver2.convertElement = function (el) {
        if (this.is_jquery() && el instanceof jQuery) {
            el = el.get(0);
        }
        var nodeValid = el.nodeType === 1;
        return el;
    };
    formSaver2.restore = function (el, debug) {
        if (debug === void 0) { debug = false; }
        el = this.convertElement(el);
        Count++;
        if (el.hasAttribute("no-save"))
            return;
        el.setAttribute("formsaver-integrity", uniqueid);
        var item;
        var key = this.get_identifier(el);
        var type = el.getAttribute("type");
        if (key.length > 0) {
            if (type === "checkbox") {
                item = JSON.parse(localStorage.getItem(key));
                if (item === null) {
                    return;
                }
                if (debug)
                    console.log("restore value checkbox[" + key + "] " + item);
                el.checked = item;
                return;
            }
            else if (type === "radio") {
                var value_1 = localStorage.getItem(key);
                if (formSaver2Storage.IsJsonString(value_1)) {
                    value_1 = JSON.parse(value_1);
                }
                var ele_1 = document.getElementsByName(el.getAttribute("name"));
                for (var i = 0; i < ele_1.length; i++)
                    ele_1[i].checked = false;
                setTimeout(function () {
                    if (value_1 && typeof value_1 == "object" && value_1.hasOwnProperty("index")) {
                        ele_1[value_1.index].checked = true;
                        if (debug)
                            console.log("restoring checkbox", value_1);
                    }
                }, 1000);
                return;
            }
            else {
                item = localStorage.getItem(key);
                if (item === null || !item.toString().length) {
                    return;
                }
                el.value = item;
                if (this.is_select2(el)) {
                    console.log("restoring " + el.getAttribute("id") + " which Initialized select2");
                    $(el).val(item).trigger("change");
                }
            }
        }
    };
    formSaver2.save = function (el, debug) {
        if (debug === void 0) { debug = false; }
        el = this.convertElement(el);
        var key = this.get_identifier(el);
        var item = el.value;
        var allowed = !el.hasAttribute("no-save") && el.hasAttribute("formsaver-integrity") && el.hasAttribute("name");
        if (debug)
            console.log(el.tagName + " " + key + " " + allowed);
        if (key && item !== "" && allowed) {
            if (el.getAttribute("type") == "checkbox") {
                localStorage.setItem(key, (el.checked == true).toString());
                if (debug)
                    console.log("save checkbox button ", formSaver2.offset(el));
                return;
            }
            else if (el.getAttribute("type") == "radio") {
                var ele = document.getElementsByName(el.getAttribute("name"));
                var getVal_1 = getCheckedValue(ele);
                var self_1 = this;
                for (var checkboxIndex = 0; checkboxIndex < ele.length; checkboxIndex++) {
                    if (ele.hasOwnProperty(checkboxIndex)) {
                        var element = ele[checkboxIndex];
                        self_1.delete(element, debug);
                    }
                }
                setTimeout(function () {
                    localStorage.setItem(key, JSON.stringify(getVal_1));
                    if (debug)
                        console.log("save radio button ", getVal_1);
                }, 1000);
                return;
            }
            else {
                localStorage.setItem(key, item.toString());
            }
        }
    };
    formSaver2.delete = function (el, debug) {
        if (debug === void 0) { debug = false; }
        el = this.convertElement(el);
        var key = this.get_identifier(el);
        if (debug)
            console.log("deleting " + key);
        localStorage.removeItem(key);
    };
    formSaver2.is_select2 = function (el) {
        return this.is_jquery() && $(el).data("select2");
    };
    formSaver2.is_jquery = function () {
        return typeof jQuery != "undefined";
    };
    formSaver2.get_identifier = function (el) {
        el = this.convertElement(el);
        var attrNotExist = function (attrname) {
            var ID;
            if (!(Count in formField)) {
                ID = makeid(5);
                el.setAttribute(attrname, ID);
                formField[Count] = ID;
                localStorage.setItem(storageKey.toString(), JSON.stringify(formField));
            }
            else {
                ID = formField[Count];
                el.setAttribute(attrname, ID);
            }
            Count++;
            return ID;
        };
        var attrEmpty = function (attrname) {
            var ID = makeid(5);
            el.setAttribute(attrname, ID);
            formField[Count] = ID;
            localStorage.setItem(storageKey.toString(), JSON.stringify(formField));
            return ID;
        };
        var attrn = null, attre = null;
        if (!el.hasAttribute("id")) {
            attrn = attrNotExist("id");
        }
        else if (el.getAttribute("id") == "null") {
            attre = attrEmpty("id");
        }
        if (!el.hasAttribute("name")) {
            if (typeof attrn != "string") {
                attrNotExist("name");
            }
            else {
                el.setAttribute("name", attrn);
            }
        }
        else if (el.getAttribute("name") == "null") {
            if (typeof attre != "string") {
                attrEmpty("name");
            }
            else {
                el.setAttribute("name", attre);
            }
        }
        return location.pathname + el.getAttribute("id");
    };
    return formSaver2;
}());
function getCheckedValue(el) {
    var result = {};
    for (var i = 0, length_1 = el.length; i < length_1; i++) {
        if (el[i].checked) {
            result = { value: el[i].value, index: i, id: formSaver2.get_identifier(el[i]) };
        }
    }
    return result;
}
if (isBrowser()) {
    (function () {
        var isJqueryLoaded = typeof jQuery != "undefined";
        if (isJqueryLoaded) {
            (function ($) {
                $.fn.getIDName = function () {
                    if ($(this).attr("aria-autovalue")) {
                        $(this).val(uniqueid).trigger("change");
                    }
                    return formSaver2.get_identifier(this);
                };
                $.fn.has_attr = function (name) {
                    var attr = $(this).attr(name);
                    return typeof attr !== "undefined" && attr !== false;
                };
                $.fn.smartForm = function () {
                    Count++;
                    new formSaver2($(this).get(0));
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
            })(jQuery);
        }
    })();
}
function formsaver(show_debug) {
    if (show_debug === void 0) { show_debug = false; }
    if (typeof jQuery != "undefined") {
        if (show_debug)
            console.log("starting form saver with jQuery debug(" + show_debug + ")");
        if (typeof jQuery != "undefined") {
            jQuery("input,textarea,select").each(function (i, el) {
                new formSaver2(this, { debug: show_debug, method: "jquery" });
            });
        }
    }
    else {
        if (show_debug)
            console.log("starting form saver without jQuery debug(" + show_debug + ")");
        var elements = document.querySelectorAll("input,textarea,select");
        if (show_debug)
            console.log(elements);
        elements.forEach(function (el, key, parent) {
            new formSaver2(el, { debug: show_debug, method: "vanilla" });
        });
    }
}
define("browserify", ["require", "exports", "./_conf", "./formSaver2", "./jquery-saver", "./main"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
