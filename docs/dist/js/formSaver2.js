class formSaver2Storage {
    static set(key, value) {
        if (typeof value == "object" || Array.isArray(value))
            value = JSON.stringify(value);
        if (typeof value != "string")
            value = new String(value);
        localStorage.setItem(key, value);
    }
    static get(key, fallback) {
        let value = localStorage.getItem(key);
        if (this.IsJsonString(value)) {
            value = JSON.parse(value);
        }
        if (value != null)
            return value;
        return fallback;
    }
    static IsJsonString(str) {
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
}
class formSaver2 {
    static offset(el) {
        return el.getBoundingClientRect();
    }
    static jquery_listener() {
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
            const t = $(this);
            const allowed = !t.attr("no-save") && t.attr("formsaver-integrity");
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
            const t = $(this);
            t.getIDName();
            const aria = t.attr("formsaver-integrity");
            if (aria && aria != uniqueid) {
                console.log("aria id invalid");
                t.smartForm();
                t.attr("formsaver-integrity", uniqueid);
            }
        });
    }
    static vanilla_listener(el, callback) {
        if (el.addEventListener) {
            el.addEventListener("change", callback);
        }
        else if (el.attachEvent) {
            el.attachEvent("onchange", callback);
        }
    }
    static hasAttribute(el, name) {
        return el.nodeType === 1 && el.hasAttribute(name);
    }
    static convertElement(el) {
        if (this.is_jquery() && el instanceof jQuery) {
            el = el.get(0);
        }
        const nodeValid = el.nodeType === 1;
        return el;
    }
    static restore(el, debug = false) {
        el = this.convertElement(el);
        Count++;
        if (el.hasAttribute("no-save"))
            return;
        el.setAttribute("formsaver-integrity", uniqueid);
        let item;
        const key = this.get_identifier(el);
        const type = el.getAttribute("type");
        if (key.length > 0) {
            if (type === "checkbox") {
                item = JSON.parse(localStorage.getItem(key));
                if (item === null) {
                    return;
                }
                if (debug)
                    console.log(`restore value checkbox[${key}] ${item}`);
                el.checked = item;
                return;
            }
            else if (type === "radio") {
                let value = localStorage.getItem(key);
                if (formSaver2Storage.IsJsonString(value)) {
                    value = JSON.parse(value);
                }
                const ele = document.getElementsByName(el.getAttribute("name"));
                for (let i = 0; i < ele.length; i++)
                    ele[i].checked = false;
                setTimeout(function () {
                    if (value && typeof value == "object" && value.hasOwnProperty("index")) {
                        ele[value.index].checked = true;
                        if (debug)
                            console.log("restoring checkbox", value);
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
                    console.log(`restoring ${el.getAttribute("id")} which Initialized select2`);
                    $(el).val(item).trigger("change");
                }
            }
        }
    }
    static save(el, debug = false) {
        el = this.convertElement(el);
        const key = this.get_identifier(el);
        const item = el.value;
        const allowed = !el.hasAttribute("no-save") && el.hasAttribute("formsaver-integrity") && el.hasAttribute("name");
        if (debug)
            console.log(`${el.tagName} ${key} ${allowed}`);
        if (key && item !== "" && allowed) {
            if (el.getAttribute("type") == "checkbox") {
                localStorage.setItem(key, (el.checked == true).toString());
                if (debug)
                    console.log("save checkbox button ", formSaver2.offset(el));
                return;
            }
            else if (el.getAttribute("type") == "radio") {
                const ele = document.getElementsByName(el.getAttribute("name"));
                const getVal = getCheckedValue(ele);
                const self = this;
                for (let checkboxIndex = 0; checkboxIndex < ele.length; checkboxIndex++) {
                    if (ele.hasOwnProperty(checkboxIndex)) {
                        const element = ele[checkboxIndex];
                        self.delete(element, debug);
                    }
                }
                setTimeout(function () {
                    localStorage.setItem(key, JSON.stringify(getVal));
                    if (debug)
                        console.log("save radio button ", getVal);
                }, 1000);
                return;
            }
            else {
                localStorage.setItem(key, item.toString());
            }
        }
    }
    static delete(el, debug = false) {
        el = this.convertElement(el);
        const key = this.get_identifier(el);
        if (debug)
            console.log(`deleting ${key}`);
        localStorage.removeItem(key);
    }
    static is_select2(el) {
        return this.is_jquery() && $(el).data("select2");
    }
    static is_jquery() {
        return typeof jQuery != "undefined";
    }
    static get_identifier(el) {
        el = this.convertElement(el);
        const attrNotExist = function (attrname) {
            let ID;
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
        const attrEmpty = function (attrname) {
            const ID = makeid(5);
            el.setAttribute(attrname, ID);
            formField[Count] = ID;
            localStorage.setItem(storageKey.toString(), JSON.stringify(formField));
            return ID;
        };
        let attrn = null, attre = null;
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
    }
    constructor(el, options) {
        const defaultOpt = {
            debug: false,
            method: "vanilla",
        };
        if (typeof options != "object")
            options = {};
        options = Object.assign(defaultOpt, options);
        if (typeof options.debug == "undefined") {
            options.debug = false;
            console.log(`change debug to false`);
        }
        formSaver2.restore(el, options.debug);
        if (!el.hasAttribute("formsaver-integrity")) {
            if (options.method == "jquery" && formSaver2.is_jquery()) {
                formSaver2.jquery_listener();
            }
            else {
                formSaver2.vanilla_listener(el, function () {
                    console.log(arguments);
                    formSaver2.save(el, options.debug);
                });
            }
        }
    }
}
function getCheckedValue(el) {
    let result = {};
    for (let i = 0, length = el.length; i < length; i++) {
        if (el[i].checked) {
            result = { value: el[i].value, index: i, id: formSaver2.get_identifier(el[i]) };
        }
    }
    return result;
}