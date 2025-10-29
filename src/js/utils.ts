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
export function isEmpty(value: any): boolean {
	if (value == null) return true; // null or undefined

	if (typeof value === 'string') return value.length === 0;

	if (Array.isArray(value)) return value.length === 0;

	if (value instanceof Map || value instanceof Set) return value.size === 0;

	if (typeof value === 'object') {
		for (const key in value) {
			if (Object.prototype.hasOwnProperty.call(value, key)) return false;
		}
		return true;
	}

	return false;
}

