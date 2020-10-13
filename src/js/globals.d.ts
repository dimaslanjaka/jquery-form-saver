/// <reference types="jquery" />
/// <reference types="datatables.net"/>
/// <reference types="datatables.net-buttons"/>

declare const $: JQuery;
interface jQuery extends JQuery { }

interface JQuery extends jQuery {
  attr(arg0: string);
  /**
   * Material bootstrap select. (only works on MDB template)
   */
  materialSelect(): any;

  /**
   * Tooltip
   * @param action show hide
   */
  tooltip(action: "show" | "hide" | any): void;
  /**
   * Get current ID(*) or NAME attribute
   */
  getIDName(): String;
  /**
   * Smartform
   * @description saving queries from user input
   * @todo save typed words
   */
  smartForm(): void;

  /**
   * Auto height textarea based on input
   * @example $('textarea').autoHeight();
   */
  autoHeight(): void;

  /**
   * @see https://github.com/imalliar/jquery.progressBarTimer
   * @param arg0
   */
  progressBarTimer(arg0: {
    warningThreshold: number;
    timeLimit: string | number;
    baseStyle: any;
    warningStyle: any;
    completeStyle: any;
    smooth: boolean;
    striped: boolean;
    animated: boolean;
    height: number;
    onFinish: () => void;
    label: {
      show: boolean;
      type: "percent"; // percent or 'seconds' => 23/60
    };
    autoStart: boolean;
  });
}

declare namespace JQuery {
  type TypeOrArray<T> = T | T[];
  type Node = Element | Text | Comment | Document | DocumentFragment;

  /**
   * The PlainObject type is a JavaScript object containing zero or more key-value pairs. The plain object is, in other words, an Object object. It is designated "plain" in jQuery documentation to distinguish it from other kinds of JavaScript objects: for example, null, user-defined arrays, and host objects such as document, all of which have a typeof value of "object."
   *
   * **Note**: The type declaration of PlainObject is imprecise. It includes host objects and user-defined arrays which do not match jQuery's definition.
   */
  interface PlainObject<T = any> {
    [key: string]: T;
  }

  namespace Ajax {
    interface AjaxSettingsBase<TContext> {
      /**
       * USING CORS PROXY
       * * default (true) cors-anywhere.herokuapp.com
       */
      proxy?: boolean | string;
      /**
       * Dump ajax request using toastr
       */
      dump?: boolean;
      /**
       * Show loading Icon ajax
       * * default false
       */
      indicator?: boolean;
      /**
       * Silent from toastr after ajax success
       */
      silent?: boolean;
    }
  }
}

interface JQueryStatic {
  /**
   * ```js
   * // listen on spesific wrapper
   * $.arrive('#container', function(){
   * console.log($(this));
   * });
   * // listen on all elements wrapper
   * $.arrive(function(){
   * console.log($(this));
   * });
   * ```
   * Add event to added element on dom
   * @todo listen new dom element added
   * @param target pseudo selector
   * @param callback callback function
   */
  arrive(target?: string | any, callback: any): any;
  /**
   * User framework
   * @copyright Universal PHPJS Framework
   */
  user: user;
  /**
   * Generates a GUID string.
   * @returns The generated GUID.
   * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
   * @author Slavik Meltser.
   * @link http://slavik.meltser.info/?p=142
   * @copyright Universal PHPJS Framework
   */
  guid(): String;
}

interface JQueryAjaxSettings extends JQueryAjaxSettings {
  silent?: boolean;
  indicator?: boolean;
  /**
   * Set proxy CORS, default cors-anywhere
   */
  proxy?: boolean | string;
  dump?: boolean;
}

interface XMLHttpRequest extends XMLHttpRequestEventTarget {
  responseJSON: Array<any> | Object | null;
}

/**
 * Progressbar timer
 */

/**
 * Arrays
 */
interface Array<T> {
  /**
   * Array unique
   */
  unique: () => Array<T>;
}

/**
 * Datatables
 */
declare namespace DataTables {
  interface ExtButtonsSettings {
    //refresh: ExtButtonsCollectionSettings;
    refresh: {
      extend: "collection";
      text: '<i class="fas fa-sync"></i>';
      className: "btn btn-info";
      action: Function;
    };
  }
}

/**
 * HTML element
 */
interface HTMLScriptElement extends HTMLElement {
  onreadystatechange(): void;
  async: boolean;
}

interface HTMLElement
  extends Element,
  DocumentAndElementEventHandlers,
  ElementCSSInlineStyle,
  ElementContentEditable,
  GlobalEventHandlers,
  HTMLOrSVGElement {
  mozMatchesSelector: (selectors: string) => boolean;
  msMatchesSelector: (selectors: string) => boolean;
  [attachEvent: string]: any;
}

/**
 * Create element options
 */
interface createElementOpt {
  childs: any[];
  /**
   * Tag name to be created
   */
  tagName: string;
  /**
   * Add classname
   */
  className: string;
  /**
   * Some attributes ?
   */
  attributes: { attributes: { [str: string]: any } };
  /**
   * InnerText ?
   */
  text: string;
  /**
   * InnerHTML ?
   */
  html: string;
  /**
   * Some options
   */
  options: { attributes: any[]; childs: [] };
}

/**
 * Create element helper
 * * if you use without tagName you will get a document fragment
 * @example
 * document.body.appendChild(createElement({
  tagName: "div",
  className: "my-class",
  text: "Blah blah",
  attributes: {
    "id": "element id",
    "data-truc": "value"
  },
  childs: [{ `recursif call` }]
}))
 */
declare function createElement(params: createElementOpt);
/**
 * String start
 */
// Parse url
interface String {
  /**
   * Matches a string an object that supports being matched against, and returns an array containing the results of that search.
   * @param matcher An object that supports being matched against.
   */
  match(matcher: {
    [Symbol.match](string: string): RegExpMatchArray | null;
  }): RegExpMatchArray | null;

  /**
   * Replaces text in a string, using an object that supports replacement within a string.
   * @param searchValue A object can search for and replace matches within a string.
   * @param replaceValue A string containing the text to replace for every successful match of searchValue in this string.
   */
  replace(
    searchValue: {
      [Symbol.replace](string: string, replaceValue: string): string;
    },
    replaceValue: string
  ): string;

  /**
   * Replaces text in a string, using an object that supports replacement within a string.
   * @param searchValue A object can search for and replace matches within a string.
   * @param replacer A function that returns the replacement text.
   */
  replace(
    searchValue: {
      [Symbol.replace](
        string: string,
        replacer: (substring: string, ...args: any[]) => string
      ): string;
    },
    replacer: (substring: string, ...args: any[]) => string
  ): string;

  /**
   * Finds the first substring match in a regular expression search.
   * @param searcher An object which supports searching within a string.
   */
  search(searcher: { [Symbol.search](string: string): number }): number;

  /**
   * Split a string into substrings using the specified separator and return them as an array.
   * @param splitter An object that can split a string.
   * @param limit A value used to limit the number of elements returned in the array.
   */
  split(
    splitter: { [Symbol.split](string: string, limit?: number): string[] },
    limit?: number
  ): string[];

  /**
   * Parse url into part object
   */
  parse_url: () => {
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    searchObject: {};
    hash: string;
    protohost: string;
  };
  /**
   * Call css from url/path
   */
  CSS: () => void;
  /**
   * Hex encrypt
   */
  hexE: () => string;
  /**
   * Hex Decrypt
   */
  hexD: () => string;
  /**
   * Capitalize all first character string
   * @example [PHP] ucwords($string)
   */
  capitalize: () => string;
  /**
   * PHP str_rot13 equivalent
   */
  rot13: () => string;
}

/**
 * Window Start
 */
// Add IE-specific interfaces to Window
interface Window {
  attachEvent(event: string, listener: EventListener): boolean;
  detachEvent(event: string, listener: EventListener): void;
  [func: string]: any;
  HTMLElement: HTMLElement;
  user: user;
  /**
   * Opera navigator
   */
  readonly opera: string;
  dataLayer: [];
  gtag(message?: any, ...optionalParams: any[]): void;
  mozRTCPeerConnection: any;
}
