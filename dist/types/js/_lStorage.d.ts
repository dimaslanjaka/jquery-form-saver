declare class lStorage extends Storage {
    private prefix;
    constructor(prefix?: string);
    has(key: string | number): boolean;
    /**
     * See {@link localStorage.getItem}
     * @param key
     * @returns
     */
    get(key: string | number): any;
    set(key: string, value: string): void;
    extend(key: any, value: any): void;
    remove(key: string): void;
}
