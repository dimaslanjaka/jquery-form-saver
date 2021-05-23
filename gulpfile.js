const { dest, parallel, series, watch } = require("gulp");

// Load plugins
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const process = require("process");
var browserify = require("browserify");
var gulp = require("gulp");
const fs = require("fs");
var del = require("del");
var ts = require("gulp-typescript");
var merge = require("merge2");
const { spawn, exec } = require("child_process");

const browserifying = function () {
    var browser = browserify({
        insertGlobals: true,
        debug: true,
        standalone: "formsaver",
    });
    for (let file of arguments) {
        //console.log(file);
        browser.add(file);
    }
    return browser.bundle().pipe(fs.createWriteStream("./dist/release/browserify-bundle.js"));
};

gulp.task("browserify", function () {
    return browserifying("dist/js/main.js");
});

// Watch files

function watchFiles() {
    watch("./src/js/*", build);
}

var buildRunning = false;
function build(done) {
    if (!buildRunning) {
        buildRunning = true;
        exec("npm run build", function (err, stdout, stderr) {
            console.log(stdout);
            console.error(stderr);
            if (err) console.error(err);
            buildRunning = false;
            done();
        });
    }
}

var tsProject = ts.createProject("tsconfig.build.json");
gulp.task("tsc", function () {
    var tsResult = gulp
        .src("src/**/*.ts") // or tsProject.src()
        .pipe(tsProject());

    //return tsResult.js.pipe(gulp.dest("dist"));

    return merge([tsResult.dts.pipe(gulp.dest("dist")), tsResult.js.pipe(gulp.dest("dist"))]);
});

function build_concat() {
    return gulp
        .src(["./dist/js/*.js", "!./dist/js/main.js"])
        .pipe(concat("bundle.js"))
        .pipe(gulp.dest("./dist/release/"));
}

function build_amd() {
    return gulp
        .src("src/**/main.ts")
        .pipe(
            ts({
                moduleResolution: "node",
                sourceMap: false,
                allowJs: true,
                emitDecoratorMetadata: true,
                experimentalDecorators: true,
                lib: ["es5", "es6", "dom"],
                sourceMap: true,
                removeComments: true,
                preserveConstEnums: true,
                target: "ES5",
                module: "amd",
                skipLibCheck: true,
                noImplicitAny: false,
                outFile: "amd-bundle.js",
            })
        )
        .pipe(gulp.dest("dist/release/"));
}

gulp.task("minjs", function (done) {
    const bundle = "./dist/release";
    if (fs.existsSync(bundle)) {
        return gulp
            .src("./dist/release/*.js", "!**.min.js")
            .pipe(terser())
            .pipe(
                rename({
                    extname: ".min.js",
                })
            )
            .pipe(dest("./dist/release/"));
    }
    done();
});

gulp.task("clean", function (cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del(["dist"], cb);
});

gulp.task("build", parallel(build_amd, build_concat));

// Tasks to define the execution of the functions simultaneously or in series

//exports.default = series(clear, parallel(js, css, img));
exports.default = series("clean", "tsc", "build", "minjs");
exports.watch = parallel(watchFiles);
exports.browser = parallel("build", "browserify");
