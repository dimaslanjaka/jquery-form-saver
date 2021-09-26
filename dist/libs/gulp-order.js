"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const through_1 = __importDefault(require("through"));
const minimatch_1 = require("minimatch");
const path_1 = __importDefault(require("path"));
const stable_1 = __importDefault(require("stable"));
function order(patterns = [], options = {}) {
    var files, matchers, onEnd, onFile, rank, relative;
    files = [];
    matchers = patterns.map(function (pattern) {
        if (pattern.indexOf("./") === 0) {
            throw new Error("Don't start patterns with `./` - they will never match. Just leave out `./`");
        }
        return new minimatch_1.Minimatch(pattern);
    });
    onFile = function (file) {
        return files.push(file);
    };
    relative = function (file) {
        if (options.base != null) {
            return path_1.default.relative(options.base, file.path);
        }
        else {
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
        stable_1.default.inplace(files, function (a, b) {
            var aIndex, bIndex;
            aIndex = rank(relative(a));
            bIndex = rank(relative(b));
            if (aIndex === bIndex) {
                return String(relative(a)).localeCompare(relative(b));
            }
            else {
                return aIndex - bIndex;
            }
        });
        files.forEach((file) => {
            return this.emit("data", file);
        });
        return this.emit("end");
    };
    return (0, through_1.default)(onFile, onEnd);
}
exports.default = order;
