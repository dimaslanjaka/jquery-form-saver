/// <reference path='./lStorage.ts' />

class formSaver2 {
    /**
     * Save values form
     * @param el
     * @returns
     */
    static save(el: HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement) {
        var key = this.get_identifier(el);
        var item = el.value;
        var allowed = !el.hasAttribute("no-save") && el.hasAttribute("aria-formsaver");
        if (key && item !== "" && allowed) {
            if (el.getAttribute("type") == "checkbox") {
                localStorage.setItem(key, (el.checked == true).toString());
                console.log("save checkbox button ", formSaver2.offset(el));
                return;
            } else if (el.getAttribute("type") == "radio" && el.hasAttribute("id")) {
                $('[name="' + el.getAttribute("name") + '"]').each(function (i, e) {
                    localStorage.setItem(key, "off");
                });
                setTimeout(() => {
                    localStorage.setItem(key, item.toString());
                    console.log("save radio button ", formSaver2.offset(el));
                }, 500);
                return;
            } else {
                localStorage.setItem(key, item.toString());
            }
            //console.log('save', key, localStorage.getItem(key));
        }
    }

    /**
     * Get Offsets Element
     * @param el
     * @returns
     */
    static offset(el: HTMLElement) {
        return el.getBoundingClientRect();
    }

    static hasAttribute(el: HTMLElement, name: string) {
        return el.nodeType === 1 && el.hasAttribute(name);
    }

    /**
     * Restore form value
     * @param el
     * @returns
     */
    static restore(el: HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement) {
        if (el instanceof jQuery) {
            el = el.get(0);
        }

        let nodeValid = el.nodeType === 1;

        Count++;
        // skip no save
        if (el.hasAttribute("no-save")) return;
        el.setAttribute("aria-formsaver", uniqueid);
        let item: any;
        let key = this.get_identifier(el);
        var type = el.getAttribute("type");
        // begin restoration
        if (key) {
            // checkbox input button
            if (type === "checkbox") {
                item = JSON.parse(localStorage.getItem(key));
                if (item === null) {
                    return;
                }
                console.log(`value checkbox ${item}`);
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

    static get_identifier(el: HTMLElement) {
        console.log(el.getAttribute("id"));
        if (!el.hasAttribute("id")) {
            if (!(Count in formField)) {
                let ID = makeid(5);
                el.setAttribute("id", ID);
                (<any>formField)[Count] = ID;
                localStorage.setItem(storageKey.toString(), JSON.stringify(formField));
            } else {
                el.setAttribute("id", (<any>formField)[Count]);
            }
            /**
             * Increase index offset
             */
            Count++;
        } else if (el.getAttribute("id") == "null") {
            let ID = makeid(5);
            el.setAttribute("id", ID);
            (<any>formField)[Count] = ID;
            localStorage.setItem(storageKey.toString(), JSON.stringify(formField));
        }

        return location.pathname + el.getAttribute("id");
    }
}
