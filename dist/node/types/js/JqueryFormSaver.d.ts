/// <reference path="_lStorage.d.ts" />
/// <reference path="../../../src/js/globals.d.ts" />
declare class JqueryFormSaver {
    offset(el: IEHtml | Element | HTMLElement): DOMRect;
    jquery_listener(): void;
    vanilla_listener(el: IEHtml | Element | HTMLElement, callback: EventListenerOrEventListenerObject): void;
    hasAttribute(el: HTMLElement, name: string): boolean;
    private convertElement;
    isIgnored(el: IEHtml | Element | HTMLElement, debug?: boolean): boolean;
    restore(el: IEHtml | Element | HTMLElement, debug?: boolean): void;
    save(el: IEHtml | Element | HTMLElement, debug?: boolean): void;
    delete(el: IEHtml | Element | HTMLElement, debug?: boolean): void;
    is_select2(el: IEHtml | Element | HTMLElement): any;
    is_jquery(): boolean;
    get_identifier(el: IEHtml | Element | HTMLElement): string;
    constructor(el: IEHtml | Element | HTMLElement, options?: {
        debug?: boolean;
        method?: 'vanilla' | 'jquery';
    });
}
export default JqueryFormSaver;
