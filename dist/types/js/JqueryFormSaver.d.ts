declare class JqueryFormSaver {
    /**
     * Get Offsets Element
     * @param el
     * @returns
     */
    offset(el: IEHtml | Element | HTMLElement): DOMRect;
    /**
     * jQuery event listener
     */
    jquery_listener(): void;
    /**
     * Pure javascript event listener
     */
    vanilla_listener(el: IEHtml | Element | HTMLElement, callback: EventListenerOrEventListenerObject): void;
    /**
     * Is element has attribute ?
     * @param el
     * @param name
     * @returns
     */
    hasAttribute(el: HTMLElement, name: string): boolean;
    private convertElement;
    isIgnored(el: IEHtml | Element | HTMLElement, debug?: boolean): boolean;
    /**
     * Restore form value
     * @param el
     * @param debug
     * @returns
     */
    restore(el: IEHtml | Element | HTMLElement, debug?: boolean): void;
    /**
     * Save values form
     * @param el
     * @returns
     */
    save(el: IEHtml | Element | HTMLElement, debug?: boolean): void;
    delete(el: IEHtml | Element | HTMLElement, debug?: boolean): void;
    /**
     * Is Select2 Initialized ?
     * @param el
     * @returns
     */
    is_select2(el: IEHtml | Element | HTMLElement): any;
    /**
     * Is jQuery loaded?
     * @returns
     */
    is_jquery(): boolean;
    get_identifier(el: IEHtml | Element | HTMLElement): string;
    constructor(el: IEHtml | Element | HTMLElement, options?: {
        debug?: boolean;
        method?: 'vanilla' | 'jquery';
    });
}
export default JqueryFormSaver;
