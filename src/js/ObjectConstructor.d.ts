interface ObjectConstructor {
  [pair: any]: any;
  /**
   * check if has child and go for callback
   * @param str  match child property
   * @param callback function callback
   * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
   */
  child(str: string | number, callback: Function): any;

  /**
   * check object has child, if not exist return alternative value
   * @param str match child property
   * @param alternative default value callback
   * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
   */
  alt(str: any, alternative: string | number | boolean): any;
  /**
   * Count size length of object
   */
  size: (obj: any) => number;
  /**
   * Check object has child
   * @param str
   */
  has(str: string | number): any;
}