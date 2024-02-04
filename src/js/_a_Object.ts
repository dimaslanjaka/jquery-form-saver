/// <reference path="./_a_Object.d.ts"/>

// /**
//  * Object management
//  * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
//  * @todo easy object processing
//  */
// type NotFunction<T> = T extends Function ? never : T;

Object.size = function (obj) {
  let size = 0,
    key: any;
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) size++;
  }
  return size;
};
Object.child = function (str, callback) {
  const self: any = this;
  if (Object.prototype.hasOwnProperty.call(self, str)) {
    if (typeof callback == 'function') {
      return callback(self[str]);
    } else {
      return true;
    }
  } else {
    return undefined;
  }
};

Object.alt = function (str, alternative) {
  const self: any = this;
  if (Object.prototype.hasOwnProperty.call(self, str)) {
    return self[str];
  } else {
    return alternative;
  }
};

Object.has = function (str: string | number) {
  return Object.prototype.hasOwnProperty.call(this, str);
};
