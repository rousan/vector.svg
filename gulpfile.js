
var gulp = require("gulp"),
    gulpWrap = require("gulp-wrap"),
    gulpUglify = require("gulp-uglify"),
    gulpRename = require("gulp-rename"),
    gulpHeader = require("gulp-header"),
    gulpConcat = require("gulp-concat"),
    gulpJsBeautifier = require("gulp-jsbeautifier"),
    del = require("del"),
    pkg = require("./package.json");

var header = [
    "/*!",
    "* <%= pkg.name %> v<%= pkg.version %>",
    "* A Javascript library for creating vector graphics using SVG.",
    "* It uses the SVG W3C Recommendation.",
    "* It provides SVG DOM manipulation, data binding and animation functionality.",
    "*",
    "* @license Copyright (c) 2017 Rousan Ali, <%= pkg.license %> License",
    "*",
    "* Codebase: <%= pkg.url %>",
    "* Homepage: <%= pkg.homepage %>",
    "* Date: <%= pkg.buildDate %>",
    "*/",
    ""
].join("\n");

var parts = [
    "./src/header.js",
    "./src/utility/utils.js",
    "./src/utility/regex.js",
    "./src/vector.js",
    "./src/container/container.js",
    "./src/container/shape-container.js",
    "./src/container/structural-container.js",
    "./src/container/generic-container.js",
    "./src/element/element.js",
    "./src/element/events.js",
    "./src/element/dom.js",
    "./src/element/graphics.js",
    "./src/element/geometry.js",
    "./src/element/rect.js",
    "./src/element/circle.js",
    "./src/element/polyline.js",
    "./src/element/polygon.js",
    "./src/element/line.js",
    "./src/element/ellipse.js",
    "./src/element/path.js",
    "./src/element/svg.js",
    "./src/element/svgdoc.js",
    "./src/element/g.js",
    "./src/element/defs.js",
    "./src/element/symbol.js",
    "./src/element/use.js",
    "./src/data/data-binding.js",
    "./src/data/data.js",
    "./src/utility/color.js",
    "./src/utility/matrix.js",
    "./src/animation/*.js"
];

pkg["buildDate"] = new Date();
pkg["name"] = pkg.name.replace(/^v/, function (found) {
    return found.toUpperCase();
});

gulp.task("clean", function () {
    return del(["./dist/*"]);
});

gulp.task("join", ["clean"], function() {
    return gulp.src(parts)
        .pipe(gulpConcat("vector.svg.js", { newLine: '\n' }))
        .pipe(gulpWrap({ src: "./src/umd.wrapper"}))
        .pipe(gulpHeader(header, { pkg: pkg }))
        .pipe(gulpJsBeautifier())
        .pipe(gulp.dest("./dist"));
});

gulp.task("uglify", ["join"], function () {
    return gulp.src("./dist/vector.svg.js")
        .pipe(gulpUglify())
        .pipe(gulpRename({suffix:".min"}))
        .pipe(gulp.dest("./dist"));
});

gulp.task("default", ["clean", "join", "uglify"]);