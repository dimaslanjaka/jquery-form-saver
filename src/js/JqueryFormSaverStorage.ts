import IsJsonString from './isJsonString';

export default class JqueryFormSaverStorage {
  /**
   * See {@see localstorage.setItem}
   * @param key
   * @param value
   */
  public static set(key: string, value: any) {
    if (typeof value == 'object' || Array.isArray(value)) value = JSON.stringify(value);
    if (typeof value != 'string') value = new String(value);
    localStorage.setItem(key, value);
  }

  /**
   * Get localstorage value by key with fallback
   * @param key
   * @param fallback default return value if key value not exists
   * @returns
   */
  static get(key: string, fallback: any) {
    let value = localStorage.getItem(key);
    if (IsJsonString(value)) {
      value = JSON.parse(value);
    }
    if (value != null) return value;
    return fallback;
  }
}
