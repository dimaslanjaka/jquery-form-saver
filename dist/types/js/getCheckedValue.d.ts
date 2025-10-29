/**
 * this will check the checked radio in a group, and return the value
 * @param el
 * @returns
 * @see https://stackoverflow.com/a/30389680
 * @example
 * var checkedbooking = getCheckedValue(document.getElementsByName('booking_type'));
 * console.log(checkedbooking); // {index: NumberIndexRadio, value: valueOfRadio}
 */
export default function getCheckedValue(el: HTMLCollectionOf<HTMLInputElement> | NodeListOf<HTMLElement> | NodeListOf<IEHtml>): {
    value?: string;
    index?: number;
    id?: string;
};
