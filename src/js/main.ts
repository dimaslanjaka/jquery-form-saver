//// MAIN SCRIPT

/**
 * Set all forms to be saved with method vanilla
 * @todo save input fields into browser for reusable form
 * @param show_debug debug process saving and restoration
 */
function formsaver(show_debug: boolean = false) {
    console.log(`Formsaver ${show_debug}`);
    if (typeof jQuery != "undefined") {
        if (show_debug) console.log("starting form saver with jQuery");

        if (typeof jQuery != "undefined") {
            jQuery("input,textarea,select").each(function (i, el) {
                new formSaver2(<any>this, { debug: show_debug, method: "jquery" });
            });
        }
    } else {
        if (show_debug) console.log("starting form saver without jQuery");
        var elements = document.querySelectorAll("input,textarea,select");
        if (show_debug) console.log(elements);
        elements.forEach(function (el, key, parent) {
            new formSaver2(<any>el, { debug: show_debug, method: "vanilla" });
        });
    }
}