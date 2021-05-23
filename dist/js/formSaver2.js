class formSaver2 {
    static save(el) {
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
                setTimeout(() => {
                    localStorage.setItem(key, item.toString());
                    console.log("save radio button ", formSaver2.offset(el));
                }, 500);
                return;
            }
            else {
                localStorage.setItem(key, item.toString());
            }
        }
    }
    static offset(el) {
        return el.getBoundingClientRect();
    }
    static hasAttribute(el, name) {
        return el.nodeType === 1 && el.hasAttribute(name);
    }
    static restore(el) {
        if (el instanceof jQuery) {
            el = el.get(0);
        }
        let nodeValid = el.nodeType === 1;
        Count++;
        if (el.hasAttribute("no-save"))
            return;
        el.setAttribute("aria-formsaver", uniqueid);
        let item;
        let key = this.get_identifier(el);
        var type = el.getAttribute("type");
        if (key) {
            if (type === "checkbox") {
                item = JSON.parse(localStorage.getItem(key));
                if (item === null) {
                    return;
                }
                console.log(`value checkbox ${item}`);
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
    }
    static is_select2(el) {
        return this.is_jquery() && $(el).data("select2");
    }
    static is_jquery() {
        return typeof jQuery != "undefined";
    }
    static get_identifier(el) {
        console.log(el.getAttribute("id"));
        if (!el.hasAttribute("id")) {
            if (!(Count in formField)) {
                let ID = makeid(5);
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
            let ID = makeid(5);
            el.setAttribute("id", ID);
            formField[Count] = ID;
            localStorage.setItem(storageKey.toString(), JSON.stringify(formField));
        }
        return location.pathname + el.getAttribute("id");
    }
}
