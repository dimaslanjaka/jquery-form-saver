export default function getCheckedValue(el: HTMLCollectionOf<HTMLInputElement> | NodeListOf<HTMLElement> | NodeListOf<IEHtml>): {
    value?: string;
    index?: number;
    id?: string;
};
