import through from "through";
import { Minimatch } from "minimatch";
import path from "path";
import sort from "stable";

function order(patterns = [], options: { base?: string } = {}) {
    var files, matchers, onEnd, onFile, rank, relative;
    files = [];
    matchers = patterns.map(function (pattern) {
        if (pattern.indexOf("./") === 0) {
            throw new Error("Don't start patterns with `./` - they will never match. Just leave out `./`");
        }
        return new Minimatch(pattern);
    });
    onFile = function (file) {
        return files.push(file);
    };
    relative = function (file) {
        if (options.base != null) {
            return path.relative(options.base, file.path);
        } else {
            return file.relative;
        }
    };
    rank = function (s) {
        var i, index, len, matcher;
        for (index = i = 0, len = matchers.length; i < len; index = ++i) {
            matcher = matchers[index];
            if (matcher.match(s)) {
                return index;
            }
        }
        return matchers.length;
    };
    onEnd = function () {
        sort.inplace(files, function (a, b) {
            var aIndex, bIndex;
            aIndex = rank(relative(a));
            bIndex = rank(relative(b));
            if (aIndex === bIndex) {
                return String(relative(a)).localeCompare(relative(b));
            } else {
                return aIndex - bIndex;
            }
        });
        files.forEach((file) => {
            return this.emit("data", file);
        });
        return this.emit("end");
    };
    return through(onFile, onEnd);
}
export default order;
