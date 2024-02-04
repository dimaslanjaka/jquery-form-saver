import through from 'through';
import { Minimatch } from 'minimatch';
import path from 'path';
import sort from 'stable';

function order(patterns: string[] = [], options: { base?: string } = {}) {
  const files: string[] = [];
  const matchers = patterns.map(function (pattern) {
    if (pattern.indexOf('./') === 0) {
      throw new Error("Don't start patterns with `./` - they will never match. Just leave out `./`");
    }
    return new Minimatch(pattern);
  });
  const onFile = function (file) {
    return files.push(file);
  };
  const relative = function (file) {
    if (options.base != null) {
      return path.relative(options.base, file.path);
    } else {
      return file.relative;
    }
  };
  const rank = function (s) {
    let i, index, len, matcher;
    for (index = i = 0, len = matchers.length; i < len; index = ++i) {
      matcher = matchers[index];
      if (matcher.match(s)) {
        return index;
      }
    }
    return matchers.length;
  };
  const onEnd = function () {
    sort.inplace(files, function (a, b) {
      const aIndex = rank(relative(a));
      const bIndex = rank(relative(b));
      if (aIndex === bIndex) {
        return String(relative(a)).localeCompare(relative(b));
      } else {
        return aIndex - bIndex;
      }
    });
    files.forEach(file => {
      return this.emit('data', file);
    });
    return this.emit('end');
  };
  return through(onFile, onEnd);
}
export default order;
