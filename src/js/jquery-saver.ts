/// <reference path="./_conf.ts" />
/// <reference path="./_a_Object.d.ts"/>
/// <reference path="./globals.d.ts"/>
/// <reference path="./index.d.ts"/>
/// <reference path="./formSaver2.ts" />

/**
 * SMARTFORM
 * @todo save form user input
 */

//console.log(`is browser : ${isBrowser()}`);
if (isBrowser()) {
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
                    new formSaver2(<any>$(this).get(0));
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
            })(jQuery);
        }
    })();
}
