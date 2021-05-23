if (typeof makeid == "undefined") {
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
var lStorage = (function () {
    var ls = {
        hasData: function (key) {
            return !!localStorage[key] && !!localStorage[key].length;
        },
        get: function (key) {
            if (!this.hasData(key)) {
                return false;
            }
            var data = localStorage[key];
            try {
                return JSON.parse(data);
            }
            catch (e) {
                return data;
            }
        },
        set: function (key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            }
            catch (e) {
                localStorage.setItem(key, value);
            }
        },
        extend: function (key, value) {
            if (this.hasData(key)) {
                var _value = this.get(key);
                $.extend(_value, JSON.parse(JSON.stringify(value)));
                this.set(key, _value);
            }
            else {
                this.set(key, value);
            }
        },
        remove: function (key) {
            localStorage.removeItem(key);
        },
    };
    return ls;
})();
var formSaver2 = (function () {
    function formSaver2() {
    }
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
        }
    };
    formSaver2.offset = function (el) {
        return el.getBoundingClientRect();
    };
    formSaver2.hasAttribute = function (el, name) {
        return el.nodeType === 1 && el.hasAttribute(name);
    };
    formSaver2.restore = function (el) {
        if (el instanceof jQuery) {
            el = el.get(0);
        }
        var nodeValid = el.nodeType === 1;
        Count++;
        if (el.hasAttribute("no-save"))
            return;
        el.setAttribute("aria-formsaver", uniqueid);
        var item;
        var key = this.get_identifier(el);
        var type = el.getAttribute("type");
        if (key) {
            if (type === "checkbox") {
                item = JSON.parse(localStorage.getItem(key));
                if (item === null) {
                    return;
                }
                console.log("value checkbox " + item);
                el.checked = item;
                return;
            }
            else if (type === "radio") {
                item = localStorage.getItem(key) === "on";
                el.checked = item;
                return;
            }
            else {
                item = localStorage.getItem(key);
                if (item === null || !item.toString().length) {
                    return;
                }
                el.value = item;
                if (this.is_select2(el)) {
                    $(el).val(item).trigger("change");
                }
            }
        }
    };
    formSaver2.is_select2 = function (el) {
        return this.is_jquery() && $(el).data("select2");
    };
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
if (isBrowser) {
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
define("main", ["require", "exports", "./_conf", "./formSaver2", "./jquery-saver"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
