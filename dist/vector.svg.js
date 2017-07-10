/*!
* Vector.svg pkg.version
* A Javascript library for creating vector graphics using SVG. It uses
* SVG 1.1 W3C Spec and written in ES5.

* @license Copyright (c) 2017 Ariyan Khan, MIT License

* Codebase: https://github.com/ariyankhan/vector.svg
* Homepage: https://github.com/ariyankhan/vector.svg#readme
* Date:  Mon Jul 10 2017 12:20:23 GMT+0530 (IST)
*/
(function(root, factory) {

    "use strict";

    if (typeof define === "function" && define.amd) {
        // For AMD module loader
        define(function() {
            return factory(root)
        })
    } else if (typeof exports === "object" && typeof module.exports === "object") {
        // For the environment like CommonJS etc where module or
        // module.exports objects are available
        module.exports = factory(global);
    } else {
        // For browser context, where global object is window
        root.Vector = factory(global);
    }
}(typeof window !== "undefined" ? window : this, function(root) {

    "use strict";

    var defineProperty = Object.defineProperty;

    var defineProperties = Object.defineProperties;

    var symbolHiddenCounter = 0;

    var globalSymbolRegistry = [];

    var slice = Array.prototype.slice;

    var stringSlice = String.prototype.slice;

    var stringIndexOf = String.prototype.indexOf;

    var isArray = Array.isArray;

    var objectToString = Object.prototype.toString;

    var push = Array.prototype.push;

    var match = String.prototype.match;

    var globalIsFinite = isFinite;

    var floor = Math.floor;

    var max = Math.max;

    var min = Math.min;

    var Vector = function(drawing, width, height) {
        return {};
    };

    var add = function(x, y) {
        return x + y;
    };

    var subs = function() {

    };

    var xx = function() {

    };

    return Vector;

}));