if (typeof makeid == "undefined") {
    var makeid = function (length) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };
}
var storageKey = location.pathname.replace(/\/$/s, "") + "/formField";
var formFieldBuild;
var formSaved = localStorage.getItem(storageKey.toString());
if (!formSaved) {
    formFieldBuild = [];
}
else {
    formFieldBuild = JSON.parse(formSaved);
}
var formField = formFieldBuild;
var uniqueid = makeid(5);
var isBrowser = new Function("try {return this===window;}catch(e){ return false;}");
var Count = -1;
