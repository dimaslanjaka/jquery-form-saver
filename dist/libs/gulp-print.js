"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLogFunction = void 0;
const map_stream_1 = __importDefault(require("map-stream"));
const path_1 = __importDefault(require("path"));
const fancy_log_1 = __importDefault(require("fancy-log"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
let log = fancy_log_1.default;
function setLogFunction(fn) {
    log = fn;
}
exports.setLogFunction = setLogFunction;
function gulpPrint(format) {
    if (!format) {
        format = (filepath) => filepath;
    }
    function mapFile(file, cb) {
        const filepath = ansi_colors_1.default.magenta(path_1.default.relative(process.cwd(), file.path));
        const formatted = format(filepath);
        if (formatted) {
            log(formatted);
        }
        cb(null, file);
    }
    return (0, map_stream_1.default)(mapFile);
}
exports.default = gulpPrint;
