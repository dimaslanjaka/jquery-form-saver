export default class JqueryFormSaverStorage {
    /**
     * See {@see localstorage.setItem}
     * @param key
     * @param value
     */
    static set(key: string, value: any): void;
    /**
     * Get localstorage value by key with fallback
     * @param key
     * @param fallback default return value if key value not exists
     * @returns
     */
    static get(key: string, fallback: any): any;
}
