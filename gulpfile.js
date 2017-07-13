
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
    "* A Javascript library for creating vector graphics using SVG. It uses",
    "* SVG 1.1 W3C Spec and written in pure ES5.",
    "* It provides SVG DOM manipulation, data visualization and animation.",
    "*",
    "* @license Copyright (c) 2017 Ariyan Khan, <%= pkg.license %> License",
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
    "./src/container/*.js",
    "./src/element/element.js",
    "./src/element/data-visual.js",
    "./src/element/events.js",
    "./src/element/graphics.js",
    "./src/element/geometry.js",
    "./src/element/rect.js",
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