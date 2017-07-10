
var defineProperty = Object.defineProperty;

var defineProperties = Object.defineProperties;

var slice = Array.prototype.slice;

var window = window || root.window;

var document = document || root.document;

var max = Math.max;

var min = Math.min;

var create = Object.create;

var isNullOrUndefined = function (value) {
    return value === undefined || value === null;
};

var isObject = function (value) {
    return value !== null && (typeof value === "object" || typeof value === "function");
};

var isCallable = function (value) {
    return typeof value === "function";
};

// There is a 'symbol' primitive type in ES6, but
// this module is written in ES5.
var isPrimitive = function (value) {
    return value === null
        || value === undefined
        || typeof value === "string"
        || typeof value === "number"
        || typeof value === "boolean";
};

