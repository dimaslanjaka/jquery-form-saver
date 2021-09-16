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
    console.log("Formsaver " + show_debug);
    if (typeof jQuery != "undefined") {
        if (show_debug)
            console.log("starting form saver with jQuery");
        if (typeof jQuery != "undefined") {
            jQuery("input,textarea,select").each(function (i, el) {
                new formSaver2(this, { debug: show_debug, method: "jquery" });
            });
        }
    }
    else {
        if (show_debug)
            console.log("starting form saver without jQuery");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VicGFjay1idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMscUNBQXFDO0FBQzVFLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsc0NBQXNDO0FBQ3ZFLFNBQVM7QUFDVDtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vanF1ZXJ5LWZvcm0tc2F2ZXIvLi9zcmMvanMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLy8vIE1BSU4gU0NSSVBUXG4vKipcbiAqIFNldCBhbGwgZm9ybXMgdG8gYmUgc2F2ZWQgd2l0aCBtZXRob2QgdmFuaWxsYVxuICogQHRvZG8gc2F2ZSBpbnB1dCBmaWVsZHMgaW50byBicm93c2VyIGZvciByZXVzYWJsZSBmb3JtXG4gKiBAcGFyYW0gc2hvd19kZWJ1ZyBkZWJ1ZyBwcm9jZXNzIHNhdmluZyBhbmQgcmVzdG9yYXRpb25cbiAqL1xuZnVuY3Rpb24gZm9ybXNhdmVyKHNob3dfZGVidWcpIHtcbiAgICBpZiAoc2hvd19kZWJ1ZyA9PT0gdm9pZCAwKSB7IHNob3dfZGVidWcgPSBmYWxzZTsgfVxuICAgIGNvbnNvbGUubG9nKFwiRm9ybXNhdmVyIFwiICsgc2hvd19kZWJ1Zyk7XG4gICAgaWYgKHR5cGVvZiBqUXVlcnkgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAoc2hvd19kZWJ1ZylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3RhcnRpbmcgZm9ybSBzYXZlciB3aXRoIGpRdWVyeVwiKTtcbiAgICAgICAgaWYgKHR5cGVvZiBqUXVlcnkgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgalF1ZXJ5KFwiaW5wdXQsdGV4dGFyZWEsc2VsZWN0XCIpLmVhY2goZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICAgICAgICAgICAgbmV3IGZvcm1TYXZlcjIodGhpcywgeyBkZWJ1Zzogc2hvd19kZWJ1ZywgbWV0aG9kOiBcImpxdWVyeVwiIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChzaG93X2RlYnVnKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdGFydGluZyBmb3JtIHNhdmVyIHdpdGhvdXQgalF1ZXJ5XCIpO1xuICAgICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXQsdGV4dGFyZWEsc2VsZWN0XCIpO1xuICAgICAgICBpZiAoc2hvd19kZWJ1ZylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVsZW1lbnRzKTtcbiAgICAgICAgZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWwsIGtleSwgcGFyZW50KSB7XG4gICAgICAgICAgICBuZXcgZm9ybVNhdmVyMihlbCwgeyBkZWJ1Zzogc2hvd19kZWJ1ZywgbWV0aG9kOiBcInZhbmlsbGFcIiB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9