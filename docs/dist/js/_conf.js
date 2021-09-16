function makeid(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
const storageKey = location.pathname.replace(/\/$/s, "") + "/formField";
let formFieldBuild;
const formSaved = localStorage.getItem(storageKey.toString());
if (!formSaved) {
    formFieldBuild = [];
}
else {
    formFieldBuild = JSON.parse(formSaved);
}
const formField = formFieldBuild;
const uniqueid = makeid(5);
const isBrowser = new Function("try {return this===window;}catch(e){ return false;}");
let Count = -1;
