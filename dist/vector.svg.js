/*!
 * Vector.svg v1.1.0
 * A Javascript library for creating vector graphics using SVG. It uses
 * SVG 1.1 W3C Spec and written in pure ES5.
 * It provides SVG DOM manipulation, data visualization and animation.
 *
 * @license Copyright (c) 2017 Ariyan Khan, MIT License
 *
 * Codebase: https://github.com/ariyankhan/vector.svg
 * Homepage: https://github.com/ariyankhan/vector.svg#readme
 * Date: Mon Jul 10 2017 21:36:37 GMT+0530 (IST)
 */

(function(root, factory) {

    "use strict";

    if (typeof define === "function" && define.amd) {
        // For AMD module loader
        define(function() {
            return factory(root)
        })
    } else if (typeof module === "object" && typeof module.exports === "object") {
        // For the environment like CommonJS etc where module or
        // module.exports objects are available
        module.exports = factory(root);
    } else {
        // When module is loaded by <script> tag in browser
        root.Vector = factory(root);
    }
}(typeof window !== "undefined" ? window : this, function(root) {

    "use strict";

    var defineProperty = Object.defineProperty;

    var defineProperties = Object.defineProperties;

    var slice = Array.prototype.slice;

    //var window = window || root.window;

    //var document = document || root.document;

    var max = Math.max;

    var min = Math.min;

    var create = Object.create;

    var isNullOrUndefined = function(value) {
        return value === undefined || value === null;
    };

    var isObject = function(value) {
        return value !== null && (typeof value === "object" || typeof value === "function");
    };

    var isCallable = function(value) {
        return typeof value === "function";
    };

    var isPrimitive = function(value) {
        return !isObject(value);
    };

    var setPrototypeOf = function(obj, prototype) {
        if (obj === undefined || obj === null)
            throw new TypeError("setPrototypeOf called on null or undefined");
        if (!(prototype === null || isObject(prototype)))
            throw new TypeError("Object prototype may only be an Object or null: " + String(prototype));

        var protoDesc = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__");
        // If Object.prototype.__proto__ does not exist or it is
        // not an accessor property then just throw errors
        if (protoDesc === undefined || !isCallable(protoDesc.set))
            throw new TypeError("Object.prototype.__proto__ accessor property does not exist");

        protoDesc.set.call(obj, prototype);
        return obj;
    };









    /**
     *
     * @param container
     * @constructor
     */
    var Vector = function(container) {

    };


    /**
     * This method copies all own properties(enumerable and non-enumerable)
     * carefully with descriptors from source objects to target and merges them.
     * It does not make deep copy of properties.
     *
     * @param target object which will be merged by sources
     * @returns target object
     */
    Vector.merge = function(target) {
        if (isNullOrUndefined(target))
            throw new TypeError("Target object can't be null or undefined");
        target = Object(target);
        var i,
            source,
            descriptors;

        for (i = 1; i < arguments.length; ++i) {
            source = arguments[i];
            if (isNullOrUndefined(source))
                continue;
            source = Object(source);
            descriptors = Object.getOwnPropertyNames(source).reduce(function(descriptors, nextKey) {
                descriptors[nextKey] = Object.getOwnPropertyDescriptor(source, nextKey);
                return descriptors;
            }, {});
            Object.defineProperties(target, descriptors);
        }

        return target;
    };

    /**
     * Base class for all the SVG DOM wrapper elements.
     */
    var Element = Vector.Element = function Element() {
        this._domElement = null;
    };


    Vector.merge(Element.prototype, {

        addListener: function(eventName, listener, options) {
            if (this._domElement === null)
                return this;
            this._domElement.addEventListener(eventName, listener, options);
            return this;
        },

        removeListener: function(eventName, listener, options) {
            if (this._domElement === null)
                return this;
            this._domElement.removeEventListener(eventName, listener, options);
            return this;
        },

        on: function(eventName, listener, options) {
            return this.addListener(eventName, listener, options);
        },

        once: function(eventName, listener, options) {
            if (this._domElement === null)
                return this;
            if (isObject(options))
                options.once = true;
            else {
                options = {
                    once: true,
                    capture: options
                };
            }
            return this.addListener(eventName, listener, options);
        }

    });

    var Graphics = Vector.Graphics = function Graphics() {
        Element.apply(this, slice.call(arguments));
    };

    setPrototypeOf(Graphics, Element);

    Graphics.prototype = create(Element.prototype);

    Graphics.prototype.constructor = Graphics;



    var Geometry = Vector.Geometry = function Geometry() {
        Graphics.apply(this, slice.call(arguments));
    };

    setPrototypeOf(Geometry, Graphics);

    Geometry.prototype = create(Graphics.prototype);

    Geometry.prototype.constructor = Geometry;

    return Vector;
}));