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
            //console.log(el);
            new formSaver2(el, { debug: show_debug, method: "vanilla" });
        });
    }
}

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VicGFjay1idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLHFDQUFxQztBQUM1RSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsc0NBQXNDO0FBQ3ZFLFNBQVM7QUFDVDtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vanF1ZXJ5LWZvcm0tc2F2ZXIvLi9zcmMvanMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLy8vIE1BSU4gU0NSSVBUXG4vKipcbiAqIFNldCBhbGwgZm9ybXMgdG8gYmUgc2F2ZWQgd2l0aCBtZXRob2QgdmFuaWxsYVxuICogQHRvZG8gc2F2ZSBpbnB1dCBmaWVsZHMgaW50byBicm93c2VyIGZvciByZXVzYWJsZSBmb3JtXG4gKiBAcGFyYW0gc2hvd19kZWJ1ZyBkZWJ1ZyBwcm9jZXNzIHNhdmluZyBhbmQgcmVzdG9yYXRpb25cbiAqL1xuZnVuY3Rpb24gZm9ybXNhdmVyKHNob3dfZGVidWcpIHtcbiAgICBpZiAoc2hvd19kZWJ1ZyA9PT0gdm9pZCAwKSB7IHNob3dfZGVidWcgPSBmYWxzZTsgfVxuICAgIGlmICh0eXBlb2YgalF1ZXJ5ICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHNob3dfZGVidWcpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN0YXJ0aW5nIGZvcm0gc2F2ZXIgd2l0aCBqUXVlcnkgZGVidWcoXCIgKyBzaG93X2RlYnVnICsgXCIpXCIpO1xuICAgICAgICBpZiAodHlwZW9mIGpRdWVyeSAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBqUXVlcnkoXCJpbnB1dCx0ZXh0YXJlYSxzZWxlY3RcIikuZWFjaChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgICAgICAgICAgICBuZXcgZm9ybVNhdmVyMih0aGlzLCB7IGRlYnVnOiBzaG93X2RlYnVnLCBtZXRob2Q6IFwianF1ZXJ5XCIgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKHNob3dfZGVidWcpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN0YXJ0aW5nIGZvcm0gc2F2ZXIgd2l0aG91dCBqUXVlcnkgZGVidWcoXCIgKyBzaG93X2RlYnVnICsgXCIpXCIpO1xuICAgICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXQsdGV4dGFyZWEsc2VsZWN0XCIpO1xuICAgICAgICBpZiAoc2hvd19kZWJ1ZylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVsZW1lbnRzKTtcbiAgICAgICAgZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWwsIGtleSwgcGFyZW50KSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGVsKTtcbiAgICAgICAgICAgIG5ldyBmb3JtU2F2ZXIyKGVsLCB7IGRlYnVnOiBzaG93X2RlYnVnLCBtZXRob2Q6IFwidmFuaWxsYVwiIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=