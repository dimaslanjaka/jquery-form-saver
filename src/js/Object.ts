/// <reference path="./Object.d.ts"/>
/**
 * Object management
 * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
 * @todo easy object processing
 */
type NotFunction<T> = T extends Function ? never : T;

Object.size = function (obj) {
    var size = 0,
        key: any;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
Object.child = function (str, callback) {
    var self: any = this;
    if (self.hasOwnProperty(str)) {
        if (typeof callback == "function") {
            return callback(self[str]);
        } else {
            return true;
        }
    } else {
        return undefined;
    }
};

Object.alt = function (str, alternative) {
    var self: any = this;
    if (self.hasOwnProperty(str)) {
        return self[str];
    } else {
        return alternative;
    }
};

Object.has = function (str: string | number) {
    return this.hasOwnProperty(str);
};
