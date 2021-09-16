function formsaver(show_debug = false) {
    console.log(`Formsaver ${show_debug}`);
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
