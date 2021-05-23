if (typeof makeid == "undefined") {
    /**
     * unique id generator
     * @param length digit number string
     * @returns random string
     */
    var makeid = function (length: number) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    };
}

/**
 * Local Storage key
 */
var storageKey: String = location.pathname.replace(/\/$/s, "") + "/formField";

var formFieldBuild: object | Array<any>;
var formSaved = localStorage.getItem(storageKey.toString());
if (!formSaved) {
    formFieldBuild = [];
} else {
    formFieldBuild = JSON.parse(formSaved);
}

/**
 * Element Indexer
 */
var formField = formFieldBuild;

var uniqueid = makeid(5);

/**
 * check if running in browser
 */
var isBrowser = new Function("try {return this===window;}catch(e){ return false;}");

/**
 * Element Counter
 */
var Count = -1;
