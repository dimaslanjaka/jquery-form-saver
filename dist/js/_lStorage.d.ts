declare class lStorage extends Storage {
    private prefix;
    constructor(prefix?: string);
    has(key: string | number): boolean;
    get(key: string | number): any;
    set(key: string, value: string): void;
    extend(key: any, value: any): void;
    remove(key: string): void;
}
