//// MAIN SCRIPT

import formSaver2 from './formSaver2';

/**
 * Set all forms to be saved with method vanilla
 * @todo save input fields into browser for reusable form
 * @param show_debug debug process saving and restoration
 */
export default function formsaver(show_debug: boolean = false) {
  if (typeof jQuery != 'undefined') {
    if (show_debug) console.log(`starting form saver with jQuery debug(${show_debug})`);

    if (typeof jQuery != 'undefined') {
      jQuery('input,textarea,select').each(function (_i, _el) {
        new formSaver2(<any>this, { debug: show_debug, method: 'jquery' });
      });
    }
  } else {
    if (show_debug) console.log(`starting form saver without jQuery debug(${show_debug})`);
    const elements = document.querySelectorAll('input,textarea,select');
    if (show_debug) console.log(elements);
    elements.forEach(function (el, _key, _parent) {
      //console.log(el);
      new formSaver2(<any>el, { debug: show_debug, method: 'vanilla' });
    });
  }
}
