/// <reference path="./_a_Object.d.ts" />
if (typeof Storage == "undefined") {
    class Storage {}
}

class lStorage extends Storage {
    private prefix = "";
    constructor(prefix = "") {
        super();
        this.prefix = prefix;
    }

    has(key: string | number) {
        return !!localStorage[this.prefix + key] && !!localStorage[this.prefix + key].length;
    }

    /**
     * See {@link localStorage.getItem}
     * @param key
     * @returns
     */
    get(key: string | number) {
        if (!this.has(this.prefix + key)) {
            return false;
        }
        var data = localStorage[this.prefix + key];
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }

    set(key: string, value: string) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
        } catch (e) {
            localStorage.setItem(this.prefix + key, value);
        }
    }

    extend(key: any, value: any) {
        if (this.has(this.prefix + key)) {
            var _value = this.get(this.prefix + key);
            if (typeof jQuery != "undefined") {
                $.extend(_value, JSON.parse(JSON.stringify(value)));
            }
            this.set(this.prefix + key, _value);
        } else {
            this.set(this.prefix + key, value);
        }
    }

    remove(key: string) {
        localStorage.removeItem(this.prefix + key);
    }
}
