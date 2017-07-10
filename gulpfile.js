
var
    gulp = require("gulp"),
    gulpWrap = require("gulp-wrap"),
    gulpUglify = require("gulp-uglify"),
    gulpTrim = require("gulp-trimlines"),
    gulpRename = require("gulp-rename"),
    gulpHeader = require("gulp-header"),
    gulpConcat = require("gulp-concat"),
    prettify = require('gulp-jsbeautifier'),

    del = require("del"),
    pkg = require("./package.json"),
    fs = require("fs"),
    buildDate = new Date(),
    projectName = "Vector.svg";

    header = [
        "/*!",
        "* <%= pkg.projectName %> pkg.version",
        "* A Javascript library for creating vector graphics using SVG. It uses",
        "* SVG 1.1 W3C Spec and written in ES5.",
        "",
        "* @license Copyright (c) 2017 Ariyan Khan, <%= pkg.license %> License",
        "",
        "* Codebase: <%= pkg.url %>",
        "* Homepage: <%= pkg.homepage %>",
        "* Date: pkg.buildDate",
        "*/",
        ""
    ].join("\n"),

    parts = [
        "./src/header.js",
        "./src/vector.js",
        "./src/utils.js"
    ];


pkg["buildDate"] = buildDate;
pkg["projectName"] = projectName;


gulp.task("clean", function () {
    return del([ "dist/*" ]);
});


gulp.task("join", ["clean"], function() {
    return gulp.src(parts)
        .pipe(gulpConcat("vector.svg.js", { newLine: '\n' }))
        .pipe(gulpWrap({ src: "./src/umd.wrapper"}))
        .pipe(gulpHeader(header, { pkg: pkg }))
        .pipe(prettify())
        .pipe(gulp.dest("./dist"));
});

gulp.task("uglify", ["join"], function () {
    return gulp.src("./dist/vector.svg.js")
        .pipe(gulpUglify())
        .pipe(gulpRename({suffix:".min"}))
        .pipe(gulp.dest("./dist"));
});




gulp.task("default", ["clean", "join", "uglify"]);


