import browserify from "browserify";
import * as fs from "fs";

function browserifying(
    input: string[] | fs.PathLike[],
    output: string | fs.PathLike,
    standalone: string = "browserify"
) {
    var browser = browserify({
        insertGlobals: true,
        debug: true,
        standalone: standalone,
    });
    for (let file of input) {
        //console.log(file);
        browser.add(file);
    }
    return browser.bundle().pipe(fs.createWriteStream(output));
}

export default browserifying;
