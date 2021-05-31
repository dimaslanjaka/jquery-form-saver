/**
 * unique id generator
 * @param length digit number string
 * @returns random string
 */
function makeid(length: number) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

/**
 * Local Storage key
 */
const storageKey: String = location.pathname.replace(/\/$/s, "") + "/formField";

let formFieldBuild: object | Array<any>;
const formSaved = localStorage.getItem(storageKey.toString());
if (!formSaved) {
    formFieldBuild = [];
} else {
    formFieldBuild = JSON.parse(formSaved);
}

/**
 * Element Indexer
 */
const formField = formFieldBuild;

const uniqueid = makeid(5);

/**
 * check if running in browser
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isBrowser = new Function("try {return this===window;}catch(e){ return false;}");

/**
 * Element Counter
 */
const Count = -1;
