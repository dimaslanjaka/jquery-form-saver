export const isIframe = window.self !== window.top;
export const currentUrl = new URL(isIframe ? document.referrer : document.location.href);
export const currentPathname = currentUrl.pathname;
