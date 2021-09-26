/// <reference path='./_lStorage.ts' />
/// <reference path='./globals.d.ts' />
/// <reference path='./_conf.ts' />

class formSaver2Storage {
    /**
     * See {@see localstorage.setItem}
     * @param key
     * @param value
     */
    static set(key: string, value: any) {
        if (typeof value == "object" || Array.isArray(value)) value = JSON.stringify(value);
        if (typeof value != "string") value = new String(value);
        localStorage.setItem(key, value);
    }

    /**
     * Get localstorage value by key with fallback
     * @param key
     * @param fallback default return value if key value not exists
     * @returns
     */
    static get(key: string, fallback: any) {
        let value = localStorage.getItem(key);
        if (this.IsJsonString(value)) {
            value = JSON.parse(value);
        }
        if (value != null) return value;
        return fallback;
    }

    static IsJsonString(str: string) {
        if (str == null) return false;
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
}

class formSaver2 {
    /**
     * Get Offsets Element
     * @param el
     * @returns
     */
    static offset(el: HTMLElement) {
        return el.getBoundingClientRect();
    }

    /**
     * jQuery event listener
     */
    static jquery_listener() {
        // bind to new elements
        $(document).bind("DOMNodeInserted", function () {
            switch ($(this).prop("tagName")) {
                case "SELECT":
                case "INPUT":
                case "TEXTAREA":
                    formSaver2.restore(<any>$(this).get(0));
                    break;
            }
        });

        // @todo detach from removed elements
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

        // @todo save value to localstorage
        $(document).on("change", "select, input, textarea", function (e) {
            formSaver2.save(this);
        });

        // @todo validate formsaver
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

    /**
     * Pure javascript event listener
     */
    static vanilla_listener(el: IEHtml, callback: EventListenerOrEventListenerObject) {
        if (el.addEventListener) {
            el.addEventListener("change", callback);
        } else if (el.attachEvent) {
            el.attachEvent("onchange", callback);
        }
    }

    /**
     * Is element has attribute ?
     * @param el
     * @param name
     * @returns
     */
    static hasAttribute(el: HTMLElement, name: string) {
        return el.nodeType === 1 && el.hasAttribute(name);
    }

    private static convertElement(el: IEHtml) {
        if (this.is_jquery() && el instanceof jQuery) {
            el = el.get(0);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const nodeValid = el.nodeType === 1;

        return el;
    }

    /**
     * Restore form value
     * @param el
     * @param debug
     * @returns
     */
    static restore(el: IEHtml, debug = false) {
        el = this.convertElement(el);
        Count++;
        // skip no save
        if (el.hasAttribute("no-save")) return;
        el.setAttribute("formsaver-integrity", uniqueid);
        let item: any;
        const key = this.get_identifier(el);
        const type = el.getAttribute("type");
        //console.log(`restoring ${key} ${type}`);
        // begin restoration
        if (key.length > 0) {
            // checkbox input button
            if (type === "checkbox") {
                item = JSON.parse(localStorage.getItem(key));
                if (item === null) {
                    return;
                }
                if (debug) console.log(`restore value checkbox[${key}] ${item}`);
                el.checked = item;
                return;
            }
            // radio input button
            else if (type === "radio") {
                let value: any = localStorage.getItem(key);
                if (formSaver2Storage.IsJsonString(value)) {
                    value = JSON.parse(value);
                }
                const ele = document.getElementsByName(el.getAttribute("name"));
                for (let i = 0; i < ele.length; i++) ele[i].checked = false;

                setTimeout(function () {
                    if (value && typeof value == "object" && value.hasOwnProperty("index")) {
                        //ele.item(value.index).checked = true;
                        ele[value.index].checked = true;
                        if (debug) console.log("restoring checkbox", value);
                    }
                }, 1000);
                //item = value === "on";
                //el.checked = item;
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
                    console.log(`restoring ${el.getAttribute("id")} which Initialized select2`);
                    $(el).val(item).trigger("change");
                }
            }
            //if (debug) console.log("load", type, key, item);
        }
    }

    /**
     * Save values form
     * @param el
     * @returns
     */
    static save(el: IEHtml, debug = false) {
        el = this.convertElement(el);
        const key = this.get_identifier(el);
        const item = el.value;
        const allowed =
            !el.hasAttribute("no-save") && el.hasAttribute("formsaver-integrity") && el.hasAttribute("name");
        if (debug) console.log(`${el.tagName} ${key} ${allowed}`);
        if (key && item !== "" && allowed) {
            if (el.getAttribute("type") == "checkbox") {
                localStorage.setItem(key, (el.checked == true).toString());
                if (debug) console.log("save checkbox button ", formSaver2.offset(el));
                return;
            } else if (el.getAttribute("type") == "radio") {
                const ele = document.getElementsByName(el.getAttribute("name"));
                const getVal = getCheckedValue(ele);
                const self = this;
                for (let checkboxIndex = 0; checkboxIndex < ele.length; checkboxIndex++) {
                    if (ele.hasOwnProperty(checkboxIndex)) {
                        const element = ele[checkboxIndex];
                        self.delete(<any>element, debug);
                    }
                }
                setTimeout(function () {
                    localStorage.setItem(key, JSON.stringify(getVal));
                    if (debug) console.log("save radio button ", getVal);
                }, 1000);
                return;
            } else {
                localStorage.setItem(key, item.toString());
            }
            //if (debug) console.log("save", key, localStorage.getItem(key));
        }
    }

    static delete(el: IEHtml, debug = false) {
        el = this.convertElement(el);
        const key = this.get_identifier(el);
        if (debug) console.log(`deleting ${key}`);
        localStorage.removeItem(key);
    }

    /**
     * Is Select2 Initialized ?
     * @param el
     * @returns
     */
    static is_select2(el: HTMLElement) {
        return this.is_jquery() && $(el).data("select2");
    }

    /**
     * Is jQuery loaded?
     * @returns
     */
    static is_jquery() {
        return typeof jQuery != "undefined";
    }

    static get_identifier(el: IEHtml) {
        el = this.convertElement(el);

        const attrNotExist = function (attrname: string) {
            let ID: string;
            if (!(Count in formField)) {
                // @todo if id line not exists in list, create new one
                ID = makeid(5);
                el.setAttribute(attrname, ID);
                (<any>formField)[Count] = ID;
                localStorage.setItem(storageKey.toString(), JSON.stringify(formField));
            } else {
                // @todo if id line exists in list, restore it
                ID = (<any>formField)[Count];
                el.setAttribute(attrname, ID);
            }
            /**
             * Increase index offset
             */
            Count++;

            return ID;
        };

        const attrEmpty = function (attrname: string) {
            const ID = makeid(5);
            el.setAttribute(attrname, ID);
            (<any>formField)[Count] = ID;
            localStorage.setItem(storageKey.toString(), JSON.stringify(formField));
            return ID;
        };

        let attrn: string = null,
            attre: string = null;
        // @todo auto create id on field if not exists
        if (!el.hasAttribute("id")) {
            attrn = attrNotExist("id");
        } else if (el.getAttribute("id") == "null") {
            attre = attrEmpty("id");
        }

        // @todo auto create name attribute on field if not exists
        if (!el.hasAttribute("name")) {
            if (typeof attrn != "string") {
                attrNotExist("name");
            } else {
                el.setAttribute("name", attrn);
            }
        } else if (el.getAttribute("name") == "null") {
            if (typeof attre != "string") {
                attrEmpty("name");
            } else {
                el.setAttribute("name", attre);
            }
        }

        return location.pathname + el.getAttribute("id");
    }

    constructor(el: IEHtml, options?: { debug?: boolean; method?: "vanilla" | "jquery" }) {
        const defaultOpt = {
            debug: false,
            method: "vanilla",
        };
        if (typeof options != "object") options = {};
        options = Object.assign(defaultOpt, options);
        //console.log(`init debug ${options.debug}`, el);
        if (typeof options.debug == "undefined") {
            options.debug = false;
            console.log(`change debug to false`);
        }
        formSaver2.restore(el, options.debug);

        if (options.method == "jquery" && formSaver2.is_jquery()) {
            formSaver2.jquery_listener();
        } else {
            console.log("vanilla listener started");
            formSaver2.vanilla_listener(el, function () {
                console.log(arguments);
                formSaver2.save(el, options.debug);
            });
        }
    }
}

/**
 * this will check the checked radio in a group, and return the value
 * @param el
 * @returns
 * @see https://stackoverflow.com/a/30389680
 * @example
 * var checkedbooking = getCheckedValue(document.getElementsByName('booking_type'));
 * console.log(checkedbooking); // {index: NumberIndexRadio, value: valueOfRadio}
 */
function getCheckedValue(el: HTMLCollectionOf<HTMLInputElement> | NodeListOf<HTMLElement> | NodeListOf<IEHtml>) {
    let result: { value?: string; index?: number; id?: string } = {};
    for (let i = 0, length = el.length; i < length; i++) {
        if (el[i].checked) {
            result = { value: el[i].value, index: i, id: formSaver2.get_identifier(<any>el[i]) };
        }
    }
    return result;
}

/// modify this to tell typescript compiler
