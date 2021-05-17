const { src, dest, parallel, series, watch } = require("gulp");

// Load plugins
const terser = require("gulp-terser");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const concat = require("gulp-concat");
const clean = require("gulp-clean");
const imagemin = require("gulp-imagemin");
const changed = require("gulp-changed");
const browsersync = require("browser-sync").create();
const process = require("process");
const root = process.cwd();
var browserify = require("browserify");
var gulp = require("gulp");
var source = require("vinyl-source-stream");
const fs = require("fs");
var del = require("del");
var ts = require("gulp-typescript");

const browserifying = function (output, ...input) {
  var browser = browserify({
    insertGlobals: true,
    debug: true,
    standalone: true,
  });
  for (let file of arguments) {
    browser.add(file);
  }
  return browser
    .bundle()
    .pipe(fs.createWriteStream("./dist/release/bundle.js"));
};
gulp.task("browserify", function () {
  return browserifying(
    "./dist/release/bundle.js",
    "./dist/js/Object.js",
    "./dist/js/formSaver.js",
    "./dist/js/jquery-saver.js"
  );
});

// Watch files

function watchFiles() {
  watch("./src/js/*", build);
}

var tsProject = ts.createProject("tsconfig.build.json");
gulp.task("tsc", function () {
  var tsResult = gulp
    .src("src/**/*.ts") // or tsProject.src()
    .pipe(tsProject());

  return tsResult.js.pipe(gulp.dest("dist"));
});

function build() {
  //exec("tsc -p tsconfig.build.json");
  return gulp
    .src([
      "./dist/js/Object.js",
      "./dist/js/formSaver.js",
      "./dist/js/jquery-saver.js",
    ])
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest("./dist/release/"));
}

gulp.task("build", build);

gulp.task("clean", function (cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(["dist"], cb);
});

gulp.task("minjs", function () {
  return gulp
    .src("./dist/release/bundle.js")
    .pipe(terser())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(dest("./dist/release/"));
});

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function exec(cmd) {
  const exec = require("child_process").exec;
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

// Tasks to define the execution of the functions simultaneously or in series

//exports.default = series(clear, parallel(js, css, img));
exports.default = series(parallel("tsc", "build", "minjs"));
exports.watch = parallel(watchFiles);
exports.browser = parallel("build", "browserify");
