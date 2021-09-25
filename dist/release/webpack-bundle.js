/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!************************!*\
  !*** ./src/js/main.ts ***!
  \************************/
//// MAIN SCRIPT
/**
 * Set all forms to be saved with method vanilla
 * @todo save input fields into browser for reusable form
 * @param show_debug debug process saving and restoration
 */
function formsaver(show_debug) {
    if (show_debug === void 0) { show_debug = false; }
    if (typeof jQuery != "undefined") {
        if (show_debug)
            console.log("starting form saver with jQuery debug(" + show_debug + ")");
        if (typeof jQuery != "undefined") {
            jQuery("input,textarea,select").each(function (i, el) {
                new formSaver2(this, { debug: show_debug, method: "jquery" });
            });
        }
    }
    else {
        if (show_debug)
            console.log("starting form saver without jQuery debug(" + show_debug + ")");
        var elements = document.querySelectorAll("input,textarea,select");
        if (show_debug)
            console.log(elements);
        elements.forEach(function (el, key, parent) {
            new formSaver2(el, { debug: show_debug, method: "vanilla" });
        });
    }
}

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VicGFjay1idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLHFDQUFxQztBQUM1RSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLHNDQUFzQztBQUN2RSxTQUFTO0FBQ1Q7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2pxdWVyeS1mb3JtLXNhdmVyLy4vc3JjL2pzL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8vLyBNQUlOIFNDUklQVFxuLyoqXG4gKiBTZXQgYWxsIGZvcm1zIHRvIGJlIHNhdmVkIHdpdGggbWV0aG9kIHZhbmlsbGFcbiAqIEB0b2RvIHNhdmUgaW5wdXQgZmllbGRzIGludG8gYnJvd3NlciBmb3IgcmV1c2FibGUgZm9ybVxuICogQHBhcmFtIHNob3dfZGVidWcgZGVidWcgcHJvY2VzcyBzYXZpbmcgYW5kIHJlc3RvcmF0aW9uXG4gKi9cbmZ1bmN0aW9uIGZvcm1zYXZlcihzaG93X2RlYnVnKSB7XG4gICAgaWYgKHNob3dfZGVidWcgPT09IHZvaWQgMCkgeyBzaG93X2RlYnVnID0gZmFsc2U7IH1cbiAgICBpZiAodHlwZW9mIGpRdWVyeSAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmIChzaG93X2RlYnVnKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdGFydGluZyBmb3JtIHNhdmVyIHdpdGggalF1ZXJ5IGRlYnVnKFwiICsgc2hvd19kZWJ1ZyArIFwiKVwiKTtcbiAgICAgICAgaWYgKHR5cGVvZiBqUXVlcnkgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgalF1ZXJ5KFwiaW5wdXQsdGV4dGFyZWEsc2VsZWN0XCIpLmVhY2goZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICAgICAgICAgICAgbmV3IGZvcm1TYXZlcjIodGhpcywgeyBkZWJ1Zzogc2hvd19kZWJ1ZywgbWV0aG9kOiBcImpxdWVyeVwiIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChzaG93X2RlYnVnKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdGFydGluZyBmb3JtIHNhdmVyIHdpdGhvdXQgalF1ZXJ5IGRlYnVnKFwiICsgc2hvd19kZWJ1ZyArIFwiKVwiKTtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0LHRleHRhcmVhLHNlbGVjdFwiKTtcbiAgICAgICAgaWYgKHNob3dfZGVidWcpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlbGVtZW50cyk7XG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsLCBrZXksIHBhcmVudCkge1xuICAgICAgICAgICAgbmV3IGZvcm1TYXZlcjIoZWwsIHsgZGVidWc6IHNob3dfZGVidWcsIG1ldGhvZDogXCJ2YW5pbGxhXCIgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==