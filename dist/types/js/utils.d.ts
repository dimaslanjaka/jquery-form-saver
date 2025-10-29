/**
 * isEmpty - minimal implementation similar to lodash.isEmpty
 *
 * - null/undefined => true
 * - string => true when length === 0
 * - array => true when length === 0
 * - Map/Set => true when size === 0
 * - object => true when it has no own enumerable properties
 * - otherwise returns false
 *
 * @param value Value to test
 * @returns boolean
 */
export declare function isEmpty(value: any): boolean;
