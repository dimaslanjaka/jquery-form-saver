// SmartForm v1.2.3 Copyright (c) 2025 Dimas Lanjaka and contributors
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.JqueryFormSaver = factory());
})(this, (function () { 'use strict';

    function getCheckedValue(el) {
        var result = {};
        for (var i = 0, length_1 = el.length; i < length_1; i++) {
            if (el[i].checked) {
                result = { value: el[i].value, index: i, id: this.get_identifier(el[i]) };
            }
        }
        return result;
    }

    function IsJsonString(str) {
        if (str == null)
            return false;
        try {
            JSON.parse(str);
        }
        catch (e) {
            return false;
        }
        return true;
    }

    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    var isIframe = window.self !== window.top;
    var currentUrl = new URL(isIframe ? document.referrer : document.location.href);
    var currentPathname = currentUrl.pathname;

    function isEmpty(value) {
        if (value == null)
            return true;
        if (typeof value === 'string')
            return value.length === 0;
        if (Array.isArray(value))
            return value.length === 0;
        if (value instanceof Map || value instanceof Set)
            return value.size === 0;
        if (typeof value === 'object') {
            for (var key in value) {
                if (Object.prototype.hasOwnProperty.call(value, key))
                    return false;
            }
            return true;
        }
        return false;
    }

    var storageKey = currentPathname.replace(/\/$/, '') + '/formField';
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
    var Count = -1;
    if (typeof jQuery != 'undefined') {
        (function ($) {
            $.fn.getIDName = function () {
                if ($(this).attr('aria-autovalue')) {
                    $(this).val(uniqueid).trigger('change');
                }
                return $(this).attr('name') || $(this).attr('id');
            };
            $.fn.has_attr = function (name) {
                var attr = $(this).attr(name);
                return typeof attr !== 'undefined' && attr !== false;
            };
            $.fn.smartForm = function () {
                Count++;
                new JqueryFormSaver($(this).get(0));
            };
            $.arrive = function (target, callback) {
                if (target) {
                    $(target).bind('DOMNodeInserted', callback);
                }
                else {
                    if (typeof callback == 'function') {
                        $(document).bind('DOMNodeInserted', callback);
                    }
                    else if (typeof target == 'function') {
                        $(document).bind('DOMNodeInserted', target);
                    }
                }
            };
        })(jQuery);
    }
    var JqueryFormSaver = (function () {
        function JqueryFormSaver(el, options) {
            var defaultOpt = {
                debug: false,
                method: 'vanilla'
            };
            var self = this;
            if (typeof options != 'object')
                options = {};
            options = Object.assign(defaultOpt, options);
            if (typeof options.debug == 'undefined') {
                options.debug = false;
                console.log("change debug to false");
            }
            this.restore(el, options.debug);
            if (options.method == 'jquery' && this.is_jquery()) {
                this.jquery_listener();
            }
            else {
                console.log('vanilla listener started');
                this.vanilla_listener(el, function () {
                    self.save(el, options.debug);
                });
            }
        }
        JqueryFormSaver.prototype.offset = function (el) {
            return el.getBoundingClientRect();
        };
        JqueryFormSaver.prototype.jquery_listener = function () {
            var self = this;
            $(document).bind('DOMNodeInserted', function () {
                switch ($(this).prop('tagName')) {
                    case 'SELECT':
                    case 'INPUT':
                    case 'TEXTAREA':
                        self.restore($(this).get(0));
                        break;
                }
            });
            $(document).bind('DOMNodeRemoved', function () {
                var t = $(this);
                var allowed = !t.attr('no-save') && t.attr('formsaver-integrity');
                if (allowed) {
                    switch (t.prop('tagName')) {
                        case 'SELECT':
                        case 'INPUT':
                        case 'TEXTAREA':
                            t.off('change');
                            break;
                    }
                }
            });
            $(document).on('change', 'select, input, textarea', function (_e) {
                self.save(this);
            });
            $(document).on('focus', 'input,textarea,select', function () {
                var t = $(this);
                t.getIDName();
                var aria = t.attr('formsaver-integrity');
                if (aria && aria != uniqueid) {
                    console.log('aria id invalid');
                    t.smartForm();
                    t.attr('formsaver-integrity', uniqueid);
                }
            });
        };
        JqueryFormSaver.prototype.vanilla_listener = function (el, callback) {
            if (el.addEventListener) {
                el.addEventListener('change', callback);
            }
            else if (el.attachEvent) {
                el.attachEvent('onchange', callback);
            }
        };
        JqueryFormSaver.prototype.hasAttribute = function (el, name) {
            return el.nodeType === 1 && el.hasAttribute(name);
        };
        JqueryFormSaver.prototype.convertElement = function (el) {
            if (this.is_jquery() && el instanceof jQuery) {
                el = el.get(0);
            }
            el.nodeType === 1;
            return el;
        };
        JqueryFormSaver.prototype.isIgnored = function (el, debug) {
            if (debug === void 0) { debug = false; }
            var ignored = el.hasAttribute('no-save');
            if (debug) {
                var id = el.id || el.getAttribute('name') || this.get_identifier(el) || 'unidentified element';
                console.log("id=\"".concat(id, "\" is ignored (").concat(ignored, ")"));
            }
            return ignored;
        };
        JqueryFormSaver.prototype.restore = function (el, debug) {
            if (debug === void 0) { debug = false; }
            el = this.convertElement(el);
            Count++;
            if (this.isIgnored(el, debug)) {
                if ('value' in el)
                    el.value = '';
                return;
            }
            el.setAttribute('formsaver-integrity', uniqueid);
            var item;
            var key = this.get_identifier(el);
            var type = el.getAttribute('type');
            if (key.length > 0) {
                if (type === 'checkbox') {
                    item = JSON.parse(localStorage.getItem(key));
                    if (item === null) {
                        return;
                    }
                    if (debug)
                        console.log("restore value checkbox[".concat(key, "] ").concat(item));
                    el.checked = item;
                    return;
                }
                else if (type === 'radio') {
                    var value_1 = localStorage.getItem(key);
                    if (IsJsonString(value_1)) {
                        value_1 = JSON.parse(value_1);
                    }
                    var ele_1 = document.getElementsByName(el.getAttribute('name'));
                    for (var i = 0; i < ele_1.length; i++)
                        ele_1[i].checked = false;
                    setTimeout(function () {
                        if (value_1 && typeof value_1 == 'object' && Object.prototype.hasOwnProperty.call(value_1, 'index')) {
                            ele_1[value_1.index].checked = true;
                            if (debug)
                                console.log('restoring checkbox', value_1);
                        }
                    }, 1000);
                    return;
                }
                else {
                    item = localStorage.getItem(key);
                    if (item === null || !item.toString().length) {
                        return;
                    }
                    if (!this.isIgnored(el, debug)) {
                        el.value = item;
                        if (this.is_select2(el)) {
                            console.log("restoring ".concat(el.getAttribute('id'), " which Initialized with select2"));
                            if (typeof jQuery !== 'undefined')
                                $(el).val(item).trigger('change');
                        }
                    }
                }
                if (debug)
                    console.log('load', type, key, item);
            }
        };
        JqueryFormSaver.prototype.save = function (el, debug) {
            if (debug === void 0) { debug = false; }
            el = this.convertElement(el);
            var key = this.get_identifier(el);
            var item = el.value;
            var allowed = !el.hasAttribute('no-save') && el.hasAttribute('formsaver-integrity') && el.hasAttribute('name');
            var type = el.getAttribute('type');
            if (debug)
                console.log("".concat(el.tagName, " ").concat(key, " ").concat(allowed));
            if (!key || !allowed)
                return;
            if (type == 'checkbox') {
                localStorage.setItem(key, (el.checked == true).toString());
                if (debug)
                    console.log('save checkbox button ', this.offset(el));
                return;
            }
            if (type == 'radio') {
                var ele = document.getElementsByName(el.getAttribute('name'));
                var getVal_1 = getCheckedValue(ele);
                var self_1 = this;
                for (var checkboxIndex = 0; checkboxIndex < ele.length; checkboxIndex++) {
                    if (Object.prototype.hasOwnProperty.call(ele, checkboxIndex)) {
                        var element = ele[checkboxIndex];
                        self_1.delete(element, debug);
                    }
                }
                setTimeout(function () {
                    localStorage.setItem(key, JSON.stringify(getVal_1));
                    if (debug)
                        console.log('save radio button ', getVal_1);
                }, 1000);
                return;
            }
            if (isEmpty(item)) {
                localStorage.removeItem(key);
                if (debug)
                    console.log('removed empty value', key);
                return;
            }
            localStorage.setItem(key, item.toString());
        };
        JqueryFormSaver.prototype.delete = function (el, debug) {
            if (debug === void 0) { debug = false; }
            el = this.convertElement(el);
            var key = this.get_identifier(el);
            if (debug)
                console.log("deleting ".concat(key));
            localStorage.removeItem(key);
        };
        JqueryFormSaver.prototype.is_select2 = function (el) {
            return this.is_jquery() && $(el).data('select2');
        };
        JqueryFormSaver.prototype.is_jquery = function () {
            return typeof jQuery != 'undefined';
        };
        JqueryFormSaver.prototype.get_identifier = function (el) {
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
            if (!el.hasAttribute('id')) {
                attrn = attrNotExist('id');
            }
            else if (el.getAttribute('id') == 'null') {
                attre = attrEmpty('id');
            }
            if (!el.hasAttribute('name')) {
                if (typeof attrn != 'string') {
                    attrNotExist('name');
                }
                else {
                    el.setAttribute('name', attrn);
                }
            }
            else if (el.getAttribute('name') == 'null') {
                if (typeof attre != 'string') {
                    attrEmpty('name');
                }
                else {
                    el.setAttribute('name', attre);
                }
            }
            return currentPathname + el.getAttribute('id');
        };
        return JqueryFormSaver;
    }());

    return JqueryFormSaver;

}));
//# sourceMappingURL=JqueryFormSaver.js.map
