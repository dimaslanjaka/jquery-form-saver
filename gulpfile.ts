import { parallel, series, watch } from "gulp";

// Load plugins
import terser from "gulp-terser";
import rename from "gulp-rename";
import concat from "gulp-concat";
import gulp from "gulp";
import fs from "fs";
import del from "del";
import ts from "gulp-typescript";
import merge from "merge2";
import { exec } from "child_process";
import print from "./src/libs/gulp-print";
import order from "./src/libs/gulp-order";
import path from "path";
import browserify from "./src/libs/gulp-browserify";

// DOCS
import source from "vinyl-source-stream";

function browserifyrun() {
    return browserify(["dist/js/browserify.js"], "./dist/release/browserify-bundle.js", "formsaver");
}

gulp.task("browserify", browserifyrun);

// Watch files
function watchFiles() {
    watch(["./src/js/*", "./src/docs/**/*"], series(build, docs));
}

function build(done: () => void) {
    exec("webpack");
    tsc();
    browserifyrun();
    minjs();
    done();
}

const tsProject = ts.createProject("tsconfig.build.json");
function tsc() {
    const tsResult = gulp
        .src("src/**/*.ts") // or tsProject.src()
        .pipe(tsProject());

    //return tsResult.js.pipe(gulp.dest("dist"));

    return merge([tsResult.dts.pipe(gulp.dest("dist")), tsResult.js.pipe(gulp.dest("dist"))]);
}
gulp.task("tsc", tsc);

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
        .pipe(<any>print());
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

function minjs(done?: () => void) {
    const bundle = path.join(__dirname, "dist/release");
    if (fs.existsSync(bundle)) {
        let run = gulp
            .src(["./dist/release/*.js", "!./dist/release/*.min.js"])
            .pipe(terser())
            .pipe(rename({ suffix: ".min" }));
        return run.pipe(gulp.dest("./dist/release/"));
    }
    done();
}
gulp.task("minjs", minjs);

gulp.task("clean", function () {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del(["dist/release", "docs/dist"]);
});

gulp.task("build", series(build_amd, build_concat));

function guid() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

function docs(done) {
    // copy dist
    gulp.src(["dist/**/*"]).pipe(gulp.dest("docs/dist"));
    gulp.src(["src/docs/static/**/*"]).pipe(gulp.dest("docs"));
    gulp.src(["*.md"]).pipe(gulp.dest("docs"));
    // write docs/live.txt
    var stream = source("live.txt");
    stream.end(guid());
    stream.pipe(gulp.dest("docs"));
    done();
}

// Generate documentation
gulp.task("docs", docs);
gulp.task("docs:clean", function (done) {
    return del(["docs"]);
});

exports.default = series("tsc", "build", "minjs", "docs");
exports.watch = series(watchFiles);
exports.browser = parallel("build", "browserify");
