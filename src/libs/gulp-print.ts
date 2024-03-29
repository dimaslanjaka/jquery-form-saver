/// <reference path="map-stream.d.ts"/>
import map from 'map-stream';
import path from 'path';
import fancyLog from 'fancy-log';
import colors from 'ansi-colors';
import * as stream from 'stream';
import * as vinyl from 'vinyl';

export interface FormatFunction {
  (filepath: string): string;
}

export interface LogFunction {
  (message: string): void;
}

let log: LogFunction = fancyLog;

export function setLogFunction(fn: LogFunction): void {
  log = fn;
}

export default function gulpPrint(format?: FormatFunction): stream.Stream {
  if (!format) {
    format = (filepath: string): string => filepath;
  }

  function mapFile(file: vinyl, cb: map.INewDataCallback): void {
    const filepath = colors.magenta(path.relative(process.cwd(), file.path));
    const formatted = format(filepath);

    if (formatted) {
      log(formatted);
    }

    cb(null, file);
  }

  return map(<any>mapFile);
}
