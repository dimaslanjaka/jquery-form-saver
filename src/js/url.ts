export const isIframe = window.self !== window.top;
export const url = new URL(isIframe ? document.referrer : document.location.href);
export function getPathname() {
  return url.pathname;
}