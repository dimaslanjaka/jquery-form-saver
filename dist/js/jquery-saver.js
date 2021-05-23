if (isBrowser) {
    (function () {
        const isJqueryLoaded = typeof jQuery != "undefined";
        if (isJqueryLoaded) {
            (function ($) {
                $.fn.getIDName = function () {
                    if ($(this).attr("aria-autovalue")) {
                        $(this).val(uniqueid).trigger("change");
                    }
                    return formSaver2.get_identifier(this);
                };
                $.fn.has_attr = function (name) {
                    var attr = $(this).attr(name);
                    return typeof attr !== "undefined" && attr !== false;
                };
                $.fn.smartForm = function () {
                    Count++;
                    formSaver2.restore($(this).get(0));
                };
                $.arrive = function (target, callback) {
                    if (target) {
                        $(target).bind("DOMNodeInserted", callback);
                    }
                    else {
                        if (typeof callback == "function") {
                            $(document).bind("DOMNodeInserted", callback);
                        }
                        else if (typeof target == "function") {
                            $(document).bind("DOMNodeInserted", target);
                        }
                    }
                };
                $(document).bind("DOMNodeInserted", function () {
                    switch ($(this).prop("tagName")) {
                        case "SELECT":
                        case "INPUT":
                        case "TEXTAREA":
                            formSaver2.restore($(this).get(0));
                            break;
                    }
                });
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
