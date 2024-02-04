/**
 * this will check the checked radio in a group, and return the value
 * @param el
 * @returns
 * @see https://stackoverflow.com/a/30389680
 * @example
 * var checkedbooking = getCheckedValue(document.getElementsByName('booking_type'));
 * console.log(checkedbooking); // {index: NumberIndexRadio, value: valueOfRadio}
 */
export default function getCheckedValue(
  el: HTMLCollectionOf<HTMLInputElement> | NodeListOf<HTMLElement> | NodeListOf<IEHtml>
) {
  let result: { value?: string; index?: number; id?: string } = {};
  for (let i = 0, length = el.length; i < length; i++) {
    if (el[i].checked) {
      result = { value: el[i].value, index: i, id: this.get_identifier(<any>el[i]) };
    }
  }
  return result;
}
