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

// Clean dist

function clear() {
  return src("./dist/*", {
    read: false,
  }).pipe(clean());
}

// JS function

function js() {
  const source = "./src/js/*.{js,ts}";

  return src(source)
    .pipe(changed(source))
    .pipe(concat("bundle.js"))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(dest("./dist/js/"))
    .pipe(browsersync.stream());
}

// CSS function

function css() {
  const source = "./src/scss/main.scss";

  return src(source)
    .pipe(changed(source))
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(cssnano())
    .pipe(dest("./dist/css/"))
    .pipe(browsersync.stream());
}

// Optimize images

function img() {
  return src("./src/img/*").pipe(imagemin()).pipe(dest("./dist/img"));
}

// Watch files

function watchFiles() {
  watch("./src/scss/*", css);
  watch("./src/js/*", js);
  watch("./src/img/*", img);
}

// BrowserSync

function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./",
    },
    port: 3000,
  });
}

async function build() {
  const compile = await exec("tsc -p tsconfig.json");
  const source = "./dist/js/form-saver.js";
  return (
    src(source)
      .pipe(changed(source))
      //.pipe(concat('form-saver.js'))
      //.pipe(uglify())
      .pipe(terser())
      .pipe(
        rename({
          extname: ".min.js",
        })
      )
      .pipe(dest("./dist/js/"))
      .pipe(browsersync.stream())
  );
}

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

//exports.watch = parallel(watchFiles, browserSync);
//exports.default = series(clear, parallel(js, css, img));
exports.default = series(parallel(build));
