/// <reference path="./Object.d.ts" />
const lStorage = (function () {
    var ls = {
        hasData: function (key: string | number) {
            return !!localStorage[key] && !!localStorage[key].length;
        },
        get: function (key: string | number) {
            if (!this.hasData(key)) {
                return false;
            }
            var data = localStorage[key];
            try {
                return JSON.parse(data);
            } catch (e) {
                return data;
            }
        },
        set: function (key: string, value: string) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                localStorage.setItem(key, value);
            }
        },
        extend: function (key: any, value: any) {
            if (this.hasData(key)) {
                var _value = this.get(key);
                $.extend(_value, JSON.parse(JSON.stringify(value)));
                this.set(key, _value);
            } else {
                this.set(key, value);
            }
        },
        remove: function (key: string) {
            localStorage.removeItem(key);
        },
    };

    return ls;
})();
