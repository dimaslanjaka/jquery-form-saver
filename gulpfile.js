const { dest, parallel, series, watch } = require("gulp");

// Load plugins
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
var browserify = require("browserify");
var gulp = require("gulp");
const fs = require("fs");
var del = require("del");
var ts = require("gulp-typescript");
var merge = require("merge2");
const { exec } = require("child_process");
const print = require("gulp-print").default;
var { order } = require("./libs/gulp-order");

// DOCS
var header = require("gulp-header");
var footer = require("gulp-footer");
var plumber = require("gulp-plumber");
var markdown = require("gulp-markdown");
var fileinclude = require("gulp-file-include");
var tap = require("gulp-tap");

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
    return browserifying("dist/js/browserify.js");
});

// Watch files
function watchFiles() {
    watch("./src/js/*", buildDev);
}

var buildRunning = false;
function build(done, dev) {
    if (!buildRunning && !dev) {
        buildRunning = true;
        exec("npm run compile", function (err, stdout, stderr) {
            console.log(stdout);
            console.error(stderr);
            if (err) console.error(err);
            buildRunning = false;
            if (typeof done == "function") done();
        });
    } else {
        buildRunning = true;
        exec("gulp tsc && gulp build && webpack && gulp browserify && gulp minjs", function (err, stdout, stderr) {
            console.log(stdout);
            console.error(stderr);
            if (err) console.error(err);
            buildRunning = false;
            if (typeof done == "function") done();
        });
    }
}

function buildDev(done) {
    return build(done, true);
}

var tsProject = ts.createProject("tsconfig.build.json");
gulp.task("tsc", function () {
    var tsResult = gulp
        .src("src/**/*.ts") // or tsProject.src()
        .pipe(tsProject());

    //return tsResult.js.pipe(gulp.dest("dist"));

    return merge([tsResult.dts.pipe(gulp.dest("dist")), tsResult.js.pipe(gulp.dest("dist"))]);
});

/**
 * Build concat all js
 */
function build_concat() {
    let source = gulp
        .src(["./dist/js/*.js", "!./dist/js/browserify.js"])
        .pipe(order(["_*.js", "*.js"]))
        .pipe(concat("bundle.js"));
    return source.pipe(gulp.dest("./dist/release/"));
}

gulp.task("build:concat", build_concat);

gulp.task("order", function (done) {
    gulp.src("src/js/*.ts")
        .pipe(order(["_*.js", "*.js"]))
        .pipe(print());
    done();
});

function build_amd() {
    return gulp
        .src("src/**/browserify.ts")
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

gulp.task("build:amd", build_amd);

gulp.task("minjs", function (done) {
    const bundle = "./dist/release";
    if (fs.existsSync(bundle)) {
        let run = gulp
            .src(["!**.min.js", "./dist/release/*.js"])
            .pipe(terser())
            /*
    .pipe(
        rename({
            extname: ".min.js",
        })
    )
    */
            .pipe(rename({ suffix: ".min" }));
        return run.pipe(gulp.dest("./dist/release/"));
    }
    done();
});

gulp.task("clean", function (cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del(["dist"], cb);
});

gulp.task("build", parallel(build_amd, build_concat));
function docs(done) {
    let opt = {
        input: "src/docs/*.{html,md,markdown}",
        output: "docs/",
        templates: "src/docs/_templates/",
        assets: "src/docs/assets/**",
    };
    if (!fs.existsSync(opt.output)) {
        fs.mkdirSync(opt.output);
    }
    // copy dist
    gulp.src(["dist/**/*"]).pipe(gulp.dest("docs/dist"));
    gulp.src(["*.md"]).pipe(gulp.dest("docs"));

    return gulp
        .src(opt.input)
        .pipe(plumber())
        .pipe(
            fileinclude({
                prefix: "@@",
                basepath: "@file",
            })
        )
        .pipe(
            tap(function (file, t) {
                if (/\.md|\.markdown/.test(file.path)) {
                    return t.through(markdown);
                }
            })
        )
        .pipe(header(fs.readFileSync(opt.templates + "/_header.html", "utf8")))
        .pipe(footer(fs.readFileSync(opt.templates + "/_footer.html", "utf8")))
        .pipe(gulp.dest(opt.output));
}

// Generate documentation
gulp.task("docs", docs);
gulp.task("docs:clean", function (done) {
    return del(["docs"], done);
});

//exports.default = series(clear, parallel(js, css, img));
exports.default = series("clean", "tsc", "build", "minjs");
exports.watch = parallel(watchFiles);
exports.browser = parallel("build", "browserify");
