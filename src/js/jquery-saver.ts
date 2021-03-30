/// <reference path="./Object.d.ts"/>
/// <reference path="./globals.d.ts"/>

/**
 * SMARTFORM
 * @todo save form user input
 */
// declare unique id generator
if (typeof makeid == "undefined") {
  function makeid(length: number) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
}
//check if running in browser and jquery is loaded
var isBrowser = new Function(
  "try {return this===window;}catch(e){ return false;}"
);

console.log(`is browser : ${isBrowser()}`);
if (isBrowser()) {
  (function () {
    const isJqueryLoaded = typeof jQuery != "undefined";
    console.log(`is jQuery loaded : ${isJqueryLoaded}`);
    if (isJqueryLoaded) {
      console.log("Apply plugin smartform jQuery");
      /**
       * Element Counter
       */
      var Count = -1;
      /**
       * Local Storage key
       */
      var storageKey: String =
        location.pathname.replace(/\/$/s, "") + "/formField";
      /**
       * Element Indexer
       */
      var formField: object | Array<any>;
      var formSaved = localStorage.getItem(storageKey.toString());
      if (!formSaved) {
        formField = [];
      } else {
        formField = JSON.parse(formSaved);
      }
      var uniqueid = makeid(5);

      (function ($) {
        $.fn.getIDName = function () {
          //var native: HTMLElement = this;
          /**
           * @todo Adding attribute id if not have id
           */
          if (!$(this).attr("id") || $(this).attr("id") == "") {
            try {
              if (!(Count in formField)) {
                /**
                 * @todo ID generator 6 digit alphanumerics
                 */
                var id: string = Math.random().toString(20).substr(2, 6);
                $(this).attr("id", id);
                (<any>formField)[Count] = id;
                localStorage.setItem(
                  storageKey.toString(),
                  JSON.stringify(formField)
                );
              } else {
                $(this).attr("id", (<any>formField)[Count]);
              }
            } catch (error) {
              console.error(error);
              console.log(formField, typeof formField);
            }
            /**
             * Increase index offset
             */
            Count++;
          }
          if ($(this).attr("aria-autovalue")) {
            $(this).val(uniqueid);
          }
          return (
            "[" +
              location.pathname.replace(/\/$/, "") +
              "/" +
              $(this).prop("tagName") +
              "/" +
              $(this).attr("id") +
              "/" +
              $(this).attr("name") || "empty" + "]"
          );
        };
        $.fn.smartForm = function () {
          Count++;
          if ($(this).attr("no-save")) {
            return;
          }
          var t = $(this);
          //set indicator
          t.attr("aria-smartform", uniqueid);
          var item;
          var key = t.getIDName().toString();
          var type = $(this).attr("type");
          // begin restoration
          if (key) {
            // checkbox input button
            if (type === "checkbox") {
              item = JSON.parse(localStorage.getItem(key));
              if (item === null) {
                return;
              }
              $(this).prop("checked", item);
              return;
            }
            // radio input button
            else if (type === "radio") {
              item = localStorage.getItem(key) === "on";
              $(this).prop("checked", item);
              return;
            }
            // input text number, textarea, or select
            else {
              item = localStorage.getItem(key);

              if (item === null || !item.toString().length) {
                return;
              }
              $(this).val(item);
            }
            //console.log('load', type, key, item);
          }
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
          var t = $(this);
          var val = localStorage.getItem(t.getIDName().toString());
          var tag = t.prop("tagName");
          var allowed =
            !t.attr("no-save") &&
            t.attr("aria-smartform") &&
            typeof tag != "undefined";

          if (allowed && val) {
            console.log(tag, allowed && val);
            switch (t.prop("tagName")) {
              case "SELECT":
              case "INPUT":
              case "TEXTAREA":
                t.val(val);
                break;
            }
          }
        });

        // detach from removed elements
        $(document).bind("DOMNodeRemoved", function () {
          var t = $(this);
          var allowed = !t.attr("no-save") && t.attr("aria-smartform");
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
          var t = $(this);
          var key = t.getIDName().toString();
          var item = t.val();
          var allowed = !t.attr("no-save") && t.attr("aria-smartform");
          if (key && item !== "" && allowed) {
            if (t.attr("type") == "checkbox") {
              localStorage.setItem(key, t.is(":checked").toString());
              console.log("save checkbox button ", $(this).offset());
              return;
            }
            if (t.attr("type") == "radio" && t.attr("id")) {
              $('[name="' + t.attr("name") + '"]').each(function (i, e) {
                localStorage.setItem($(this).getIDName().toString(), "off");
              });
              setTimeout(() => {
                localStorage.setItem(key, item.toString());
                console.log("save radio button ", $(this).offset());
              }, 500);
              return;
            }
            localStorage.setItem(key, item.toString());
            //console.log('save', key, localStorage.getItem(key));
          }
        });

        $(document).on("focus", "input,textarea,select", function () {
          var t = $(this);
          t.getIDName();
          var aria = t.attr("aria-smartform");
          if (aria && aria != uniqueid) {
            t.smartForm();
            t.attr("aria-smartform", uniqueid);
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
  console.log("Starting smartform jQuery");
  //set value from localstorage
  var setglobal = function () {
    jQuery("input,textarea,select").each(function (i, el) {
      $(this).smartForm();
    });
  };
  setglobal();
  //setInterval(function () { }, 500);
}
