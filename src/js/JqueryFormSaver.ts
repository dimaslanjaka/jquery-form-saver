/// <reference path='./_lStorage.ts' />
/// <reference path='./globals.d.ts' />

import getCheckedValue from './getCheckedValue';
import IsJsonString from './isJsonString';
import makeid from './makeid';
import { currentPathname } from './url';

/**
 * Local Storage key
 */
const storageKey: string = currentPathname.replace(/\/$/, '') + '/formField';

let formFieldBuild: Record<string, any> | Array<any>;
const formSaved = localStorage.getItem(storageKey.toString());
if (!formSaved) {
  formFieldBuild = [];
} else {
  formFieldBuild = JSON.parse(formSaved);
}

/**
 * Element Indexer
 */
const formField = formFieldBuild;

const uniqueid = makeid(5);

/**
 * Element Counter
 */
let Count = -1;

// declare jquery plugin

if (typeof jQuery != 'undefined') {
  (function ($) {
    $.fn.getIDName = function () {
      // get attr id or name
      if ($(this).attr('aria-autovalue')) {
        // seeder auto value
        $(this).val(uniqueid).trigger('change');
      }
      // return JqueryFormSaver.get_identifier(this);
      return $(this).attr('name') || $(this).attr('id');
    };
    $.fn.has_attr = function (name: string) {
      const attr = $(this).attr(name);
      // For some browsers, `attr` is undefined; for others,
      // `attr` is false.  Check for both.
      return typeof attr !== 'undefined' && attr !== false;
    };

    $.fn.smartForm = function () {
      Count++;
      new JqueryFormSaver(<any>$(this).get(0));
    };

    $.arrive = function (target, callback) {
      if (target) {
        $(target).bind('DOMNodeInserted', callback);
      } else {
        if (typeof callback == 'function') {
          $(document).bind('DOMNodeInserted', callback);
        } else if (typeof target == 'function') {
          $(document).bind('DOMNodeInserted', target);
        }
      }
    };
  })(jQuery);
}

class JqueryFormSaver {
  /**
   * Get Offsets Element
   * @param el
   * @returns
   */
  offset(el: IEHtml | Element | HTMLElement) {
    return el.getBoundingClientRect();
  }

  /**
   * jQuery event listener
   */
  jquery_listener() {
    const self = this;
    // bind to new elements
    $(document).bind('DOMNodeInserted', function () {
      switch ($(this).prop('tagName')) {
        case 'SELECT':
        case 'INPUT':
        case 'TEXTAREA':
          self.restore(<any>$(this).get(0));
          break;
      }
    });

    // @todo detach from removed elements
    $(document).bind('DOMNodeRemoved', function () {
      const t = $(this);
      const allowed = !t.attr('no-save') && t.attr('formsaver-integrity');
      if (allowed) {
        switch (t.prop('tagName')) {
          case 'SELECT':
          case 'INPUT':
          case 'TEXTAREA':
            t.off('change');
            break;
        }
      }
    });

    // @todo save value to localstorage
    $(document).on('change', 'select, input, textarea', function (_e) {
      self.save(this);
    });

    // @todo validate formsaver
    $(document).on('focus', 'input,textarea,select', function () {
      const t = $(this);
      t.getIDName();
      const aria = t.attr('formsaver-integrity');
      if (aria && aria != uniqueid) {
        console.log('aria id invalid');
        t.smartForm();
        t.attr('formsaver-integrity', uniqueid);
      }
    });
  }

  /**
   * Pure javascript event listener
   */
  vanilla_listener(el: IEHtml | Element | HTMLElement, callback: EventListenerOrEventListenerObject) {
    if (el.addEventListener) {
      el.addEventListener('change', callback);
    } else if (el.attachEvent) {
      el.attachEvent('onchange', callback);
    }
  }

  /**
   * Is element has attribute ?
   * @param el
   * @param name
   * @returns
   */
  hasAttribute(el: HTMLElement, name: string) {
    return el.nodeType === 1 && el.hasAttribute(name);
  }

  private convertElement(el: IEHtml | Element | HTMLElement) {
    if (this.is_jquery() && el instanceof jQuery) {
      el = el.get(0);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const nodeValid = el.nodeType === 1;

    return el;
  }

  // is ignored?
  isIgnored(el: IEHtml | Element | HTMLElement, debug = false) {
    const ignored = el.hasAttribute('no-save'); // || el.classList.contains('no-save');
    if (debug) {
      const id = el.id || el.getAttribute('name') || this.get_identifier(el) || 'unidentified element';
      console.log(`id="${id}" is ignored (${ignored})`);
    }
    return ignored;
  }

  /**
   * Restore form value
   * @param el
   * @param debug
   * @returns
   */
  restore(el: IEHtml | Element | HTMLElement, debug = false) {
    el = this.convertElement(el);
    Count++;
    // skip no save (ignore)
    if (this.isIgnored(el, debug)) {
      if ('value' in el) el.value = '';
      return;
    }
    el.setAttribute('formsaver-integrity', uniqueid);
    let item: any;
    const key = this.get_identifier(el);
    const type = el.getAttribute('type');
    //console.log(`restoring ${key} ${type}`);
    // begin restoration
    if (key.length > 0) {
      // checkbox input button
      if (type === 'checkbox') {
        item = JSON.parse(localStorage.getItem(key));
        if (item === null) {
          return;
        }
        if (debug) console.log(`restore value checkbox[${key}] ${item}`);
        el.checked = item;
        return;
      }
      // radio input button
      else if (type === 'radio') {
        let value: any = localStorage.getItem(key);
        if (IsJsonString(value)) {
          value = JSON.parse(value);
        }
        const ele = document.getElementsByName(el.getAttribute('name'));
        for (let i = 0; i < ele.length; i++) ele[i].checked = false;

        setTimeout(function () {
          if (value && typeof value == 'object' && Object.prototype.hasOwnProperty.call(value, 'index')) {
            //ele.item(value.index).checked = true;
            ele[value.index].checked = true;
            if (debug) console.log('restoring checkbox', value);
          }
        }, 1000);
        //item = value === "on";
        //el.checked = item;
        return;
      }
      // input text number, textarea, or select
      else {
        item = localStorage.getItem(key);

        if (item === null || !item.toString().length) {
          return;
        }

        // @todo check if element isn't ignored
        if (!this.isIgnored(el, debug)) {
          el.value = item;

          // select2
          if (this.is_select2(el)) {
            console.log(`restoring ${el.getAttribute('id')} which Initialized with select2`);
            if (typeof jQuery !== 'undefined') $(el).val(item).trigger('change');
          }
        }
      }
      if (debug) console.log('load', type, key, item);
    }
  }

  /**
   * Save values form
   * @param el
   * @returns
   */
  save(el: IEHtml | Element | HTMLElement, debug = false) {
    el = this.convertElement(el);
    const key = this.get_identifier(el);
    const item = el.value;
    const allowed = !el.hasAttribute('no-save') && el.hasAttribute('formsaver-integrity') && el.hasAttribute('name');
    if (debug) console.log(`${el.tagName} ${key} ${allowed}`);
    if (key && item !== '' && allowed) {
      if (el.getAttribute('type') == 'checkbox') {
        localStorage.setItem(key, (el.checked == true).toString());
        if (debug) console.log('save checkbox button ', this.offset(el));
        return;
      } else if (el.getAttribute('type') == 'radio') {
        const ele = document.getElementsByName(el.getAttribute('name'));
        const getVal = getCheckedValue(ele);
        const self = this;
        for (let checkboxIndex = 0; checkboxIndex < ele.length; checkboxIndex++) {
          if (Object.prototype.hasOwnProperty.call(ele, checkboxIndex)) {
            const element = ele[checkboxIndex];
            self.delete(<any>element, debug);
          }
        }
        setTimeout(function () {
          localStorage.setItem(key, JSON.stringify(getVal));
          if (debug) console.log('save radio button ', getVal);
        }, 1000);
        return;
      } else {
        localStorage.setItem(key, item.toString());
      }
      //if (debug) console.log("save", key, localStorage.getItem(key));
    }
  }

  delete(el: IEHtml | Element | HTMLElement, debug = false) {
    el = this.convertElement(el);
    const key = this.get_identifier(el);
    if (debug) console.log(`deleting ${key}`);
    localStorage.removeItem(key);
  }

  /**
   * Is Select2 Initialized ?
   * @param el
   * @returns
   */
  is_select2(el: IEHtml | Element | HTMLElement) {
    return this.is_jquery() && $(el).data('select2');
  }

  /**
   * Is jQuery loaded?
   * @returns
   */
  is_jquery() {
    return typeof jQuery != 'undefined';
  }

  get_identifier(el: IEHtml | Element | HTMLElement) {
    el = this.convertElement(el);

    const attrNotExist = function (attrname: string) {
      let ID: string;
      if (!(Count in formField)) {
        // @todo if id line not exists in list, create new one
        ID = makeid(5);
        el.setAttribute(attrname, ID);
        (<any>formField)[Count] = ID;
        localStorage.setItem(storageKey.toString(), JSON.stringify(formField));
      } else {
        // @todo if id line exists in list, restore it
        ID = (<any>formField)[Count];
        el.setAttribute(attrname, ID);
      }
      /**
       * Increase index offset
       */
      Count++;

      return ID;
    };

    const attrEmpty = function (attrname: string) {
      const ID = makeid(5);
      el.setAttribute(attrname, ID);
      (<any>formField)[Count] = ID;
      localStorage.setItem(storageKey.toString(), JSON.stringify(formField));
      return ID;
    };

    let attrn: string = null,
      attre: string = null;
    // @todo auto create id on field if not exists
    if (!el.hasAttribute('id')) {
      attrn = attrNotExist('id');
    } else if (el.getAttribute('id') == 'null') {
      attre = attrEmpty('id');
    }

    // @todo auto create name attribute on field if not exists
    if (!el.hasAttribute('name')) {
      if (typeof attrn != 'string') {
        attrNotExist('name');
      } else {
        el.setAttribute('name', attrn);
      }
    } else if (el.getAttribute('name') == 'null') {
      if (typeof attre != 'string') {
        attrEmpty('name');
      } else {
        el.setAttribute('name', attre);
      }
    }

    return currentPathname + el.getAttribute('id');
  }

  constructor(el: IEHtml | Element | HTMLElement, options?: { debug?: boolean; method?: 'vanilla' | 'jquery' }) {
    const defaultOpt = {
      debug: false,
      method: 'vanilla'
    };
    const self = this;
    if (typeof options != 'object') options = {};
    options = Object.assign(defaultOpt, options);
    //console.log(`init debug ${options.debug}`, el);
    if (typeof options.debug == 'undefined') {
      options.debug = false;
      console.log(`change debug to false`);
    }
    this.restore(el, options.debug);

    if (options.method == 'jquery' && this.is_jquery()) {
      this.jquery_listener();
    } else {
      console.log('vanilla listener started');
      this.vanilla_listener(el, function () {
        // console.log(arguments);
        self.save(el, options.debug);
      });
    }
  }
}

/// modify this to tell typescript compiler
export default JqueryFormSaver;
