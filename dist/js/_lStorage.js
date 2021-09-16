if (typeof Storage == "undefined") {
    class Storage {
    }
}
class lStorage extends Storage {
    constructor(prefix = "") {
        super();
        this.prefix = "";
        this.prefix = prefix;
    }
    has(key) {
        return !!localStorage[this.prefix + key] && !!localStorage[this.prefix + key].length;
    }
    get(key) {
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
    }
    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
        }
        catch (e) {
            localStorage.setItem(this.prefix + key, value);
        }
    }
    extend(key, value) {
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
    }
    remove(key) {
        localStorage.removeItem(this.prefix + key);
    }
}
