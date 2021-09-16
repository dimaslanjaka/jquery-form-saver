interface ObjectConstructorAjax {
  /**
   * Ajax container always empty
   */
  tid?: any;

  /**
   * Add ajax request
   * @param opt JQuery ajax settings
   */
  addReq(opt: JQueryAjaxSettings): void;

  /**
   * Remove request options
   */
  removeReq(opt: ObjectConstructor): void;

  /**
   * Run initializer ajax scheduler
   */
  run(): void;

  /**
   * Stop current scheduler
   */
  stop(): void;
}
