/// <reference path="index.d.ts">
/// <reference path="../js/index.d.ts">

interface IEHtml extends HTMLSelectElement, HTMLTextAreaElement, HTMLInputElement {
  /**
   *
   * @param eventType
   * @param callback
   */
  attachEvent(eventType: 'onclick' | 'onchange' | 'onload', callback: any): any;
}

interface HTMLCollectionOfHTMLFormElement extends HTMLCollectionOf<HTMLFormElement> {
  getElementsByTagName(tag: string): HTMLCollection;
}
