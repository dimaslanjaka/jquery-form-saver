/// <reference path="./Object.d.ts" />
if (typeof Storage == "undefined") {
    class Storage {}
}

class lStorage extends Storage {
    constructor() {
        super();
    }

    has(key: string | number) {
        return !!localStorage[key] && !!localStorage[key].length;
    }

    /**
     * See {@link localStorage.getItem}
     * @param key
     * @returns
     */
    get(key: string | number) {
        if (!this.has(key)) {
            return false;
        }
        var data = localStorage[key];
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }

    set(key: string, value: string) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            localStorage.setItem(key, value);
        }
    }

    extend(key: any, value: any) {
        if (this.has(key)) {
            var _value = this.get(key);
            if (typeof jQuery != "undefined") {
                $.extend(_value, JSON.parse(JSON.stringify(value)));
            }
            this.set(key, _value);
        } else {
            this.set(key, value);
        }
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }
}
