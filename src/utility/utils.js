
var defineProperty = Object.defineProperty;

var defineProperties = Object.defineProperties;

var slice = Array.prototype.slice;

var map = Array.prototype.map;

var splice = Array.prototype.splice;

var floor = Math.floor;

var reduce = Array.prototype.reduce;

var svgNS = "http://www.w3.org/2000/svg";

var xlinkNS = "http://www.w3.org/1999/xlink";

var evNS = "http://www.w3.org/2001/xml-events";

var xhtmlNS = "http://www.w3.org/1999/xhtml";

var xmlNS = "http://www.w3.org/2000/xmlns/";

//var window = window || root.window;

//var document = document || root.document;

var isArray = Array.isArray;

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

var isPrimitive = function (value) {
    return !isObject(value);
};

var setPrototypeOf = function (obj, prototype) {
    if (obj === undefined || obj === null)
        throw new TypeError("setPrototypeOf called on null or undefined");
    if ( !(prototype === null || isObject(prototype)) )
        throw new TypeError("Object prototype may only be an Object or null: " + String(prototype));

    var protoDesc = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__");
    // If Object.prototype.__proto__ does not exist or it is
    // not an accessor property then just throw errors
    if (protoDesc === undefined || !isCallable(protoDesc.set))
        throw new TypeError("Object.prototype.__proto__ accessor property does not exist");

    protoDesc.set.call(obj, prototype);
    return obj;
};

var isIEOrEdgeBrowser = function () {
    var ua = window.navigator.userAgent;
    return (/MSIE/i.test(ua) || /rv:11\.0/i.test(ua) || /Edge/i.test(ua));
};

var isFirefox = function () {
    var ua = window.navigator.userAgent;
    return (/Firefox/i.test(ua) || /Mozilla/i.test(ua));
};

var isSVGSupported = function () {
    return isCallable(window.SVGElement)
        && isCallable(document.createElementNS)
        && document.createElementNS(svgNS, "svg") instanceof window.SVGElement
};