/// <reference path="./Object.d.ts"/>
/// <reference path="./globals.d.ts"/>
/// <reference path="./index.d.ts"/>
/// <reference path="./_conf.ts" />
/// <reference path="./formSaver2.ts" />

/**
 * SMARTFORM
 * @todo save form user input
 */

//console.log(`is browser : ${isBrowser()}`);
if (isBrowser) {
    (function () {
        const isJqueryLoaded = typeof jQuery != "undefined";
        //console.log(`is jQuery loaded : ${isJqueryLoaded}`);
        if (isJqueryLoaded) {
            //console.log("Apply plugin smartform jQuery");

            (function ($) {
                $.fn.getIDName = function () {
                    if ($(this).attr("aria-autovalue")) {
                        $(this).val(uniqueid).trigger("change");
                    }
                    return formSaver2.get_identifier(this);
                };
                $.fn.has_attr = function (name: string) {
                    var attr = $(this).attr(name);
                    // For some browsers, `attr` is undefined; for others,
                    // `attr` is false.  Check for both.
                    return typeof attr !== "undefined" && attr !== false;
                };
                $.fn.smartForm = function () {
                    Count++;
                    formSaver2.restore(<any>$(this).get(0));
                };

                $.arrive = function (target, callback) {
                    if (target) {
                        $(target).bind("DOMNodeInserted", callback);
                    } else {
                        if (typeof callback == "function") {
                            $(document).bind("DOMNodeInserted", callback);
                        } else if (typeof target == "function") {
                            $(document).bind("DOMNodeInserted", target);
                        }
                    }
                };

                // bind to new elements
                $(document).bind("DOMNodeInserted", function () {
                    switch ($(this).prop("tagName")) {
                        case "SELECT":
                        case "INPUT":
                        case "TEXTAREA":
                            formSaver2.restore(<any>$(this).get(0));
                            break;
                    }
                });

                // detach from removed elements
                $(document).bind("DOMNodeRemoved", function () {
                    var t = $(this);
                    var allowed = !t.attr("no-save") && t.attr("aria-formsaver");
                    if (allowed) {
                        switch (t.prop("tagName")) {
                            case "SELECT":
                            case "INPUT":
                            case "TEXTAREA":
                                t.off("change");
                                break;
                        }
                    }
                });

                //save value to localstorage
                $(document).on("change", "select, input, textarea", function (e) {
                    formSaver2.save(this);
                });

                $(document).on("focus", "input,textarea,select", function () {
                    var t = $(this);
                    t.getIDName();
                    var aria = t.attr("aria-formsaver");
                    if (aria && aria != uniqueid) {
                        t.smartForm();
                        t.attr("aria-formsaver", uniqueid);
                    }
                });
            })(jQuery);
        }
    })();
}

/**
 * Set all forms to be smart
 * @todo save input fields into browser for reusable form
 */
function formsaver() {
    if (typeof jQuery != "undefined") {
        console.log("Starting smartform jQuery");

        if (typeof jQuery != "undefined") {
            jQuery("input,textarea,select").each(function (i, el) {
                $(this).smartForm();
            });
        }
    }
}
