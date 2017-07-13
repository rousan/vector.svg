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
 * Date: Fri Jul 14 2017 00:48:57 GMT+0530 (IST)
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

    var splice = Array.prototype.splice;

    var svgNS = "http://www.w3.org/2000/svg";

    var xlinkNS = "http://www.w3.org/1999/xlink";

    var evNS = "http://www.w3.org/2001/xml-events";

    var xhtmlNS = "http://www.w3.org/1999/xhtml";

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

    var isIEOrEdgeBrowser = function() {
        var ua = window.navigator.userAgent;
        return (/MSIE/i.test(ua) || /rv:11\.0/i.test(ua) || /Edge/i.test(ua));
    };

    var regex = {

        tokenSeparator: /\s+/,

        referenceAttrVal: /^url\(#(.+)\)$/,

        hrefAttrVal: /^#(.+)$/

    };

    /**
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
     * @return target object
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
            defineProperties(target, descriptors);
        }

        return target;
    };

    Vector.merge(Vector, {

        ns: {

            svg: svgNS,

            xlink: xlinkNS,

            ev: evNS,

            xhtml: xhtmlNS
        },

        /**
         * Creates a SVGElement and returns actual DOM Node, not the wrapper one.
         * @param tagName
         * @returns {SVGElement}
         */
        createElement: function(tagName) {
            return document.createElementNS(Vector.ns.svg, tagName);
        },

        /**
         * Set attribute to SVG DOM Element
         * @param svgDomNode
         * @param name
         * @param value
         * @param namespace
         * @return Vector
         */
        setAttribute: function(svgDomNode, name, value, namespace) {
            if (value === undefined)
                return this;
            namespace = isNullOrUndefined(namespace) ? null : namespace;
            svgDomNode.setAttributeNS(namespace, name, value);
            return this;
        },

        /**
         * Set attributes to SVG DOM Element
         * @param svgDomNode
         * @param attrs
         * @param namespace
         * @return Vector
         */
        setAttributes: function(svgDomNode, attrs, namespace) {
            Object.keys(attrs).forEach(function(attr) {
                Vector.setAttribute(svgDomNode, attr, attrs[attr], namespace);
            });
            return this;
        },

        /**
         * Generates RFC4122 version 4 compliant UUID.
         * @returns {string}
         */
        uuid: (function() {
            var table = [],
                i = 0;

            for (; i < 256; i++) {
                table[i] = (i < 16 ? '0' : '') + (i).toString(16);
            }

            return function() {
                var d0 = Math.random() * 0xffffffff | 0,
                    d1 = Math.random() * 0xffffffff | 0,
                    d2 = Math.random() * 0xffffffff | 0,
                    d3 = Math.random() * 0xffffffff | 0;

                return table[d0 & 0xff] + table[d0 >> 8 & 0xff] + table[d0 >> 16 & 0xff] + table[d0 >> 24 & 0xff] + '-' +
                    table[d1 & 0xff] + table[d1 >> 8 & 0xff] + '-' + table[d1 >> 16 & 0x0f | 0x40] + table[d1 >> 24 & 0xff] + '-' +
                    table[d2 & 0x3f | 0x80] + table[d2 >> 8 & 0xff] + '-' + table[d2 >> 16 & 0xff] + table[d2 >> 24 & 0xff] +
                    table[d3 & 0xff] + table[d3 >> 8 & 0xff] + table[d3 >> 16 & 0xff] + table[d3 >> 24 & 0xff];
            };
        })(),

        /**
         * Returns an array of unique values,
         * does not alter main array
         *
         * Time Complexity: O(n)
         *
         * @param arr Array or Array like object
         * @returns {Array}
         */
        unique: function(arr) {
            if (isNullOrUndefined(arr))
                return [];

            arr = Object(arr);

            var cArr = slice.call(arr),
                out = [],
                primHashSet = {},
                objSet = [],
                extIndex = [],
                randomProp = Vector.uuid(),
                anyValue = true, //any value without 'undefined'
                ln = cArr.length,
                val,
                prop,
                i = 0;

            for (; i < ln; ++i) {
                val = cArr[i];

                if (isObject(val)) {
                    // Check val is extensible or not
                    if (Object.isExtensible(val)) {
                        // Make a link in val to get maximum running speed
                        if (val[randomProp] === undefined) {
                            out.push(val);
                            val[randomProp] = anyValue;
                            extIndex.push(out.length - 1);
                        }

                    } else {
                        // Otherwise use linear search,
                        // it is very very rare case
                        if (objSet.indexOf(val) === -1) {
                            out.push(val);
                            objSet.push(val);
                        }
                    }

                } else {
                    if (val === undefined)
                        prop = "U";
                    else if (val === null)
                        prop = "I";
                    else if (typeof val === "string")
                        prop = "S_" + val;
                    else if (typeof val === "number")
                        prop = "N_" + val;
                    else if (typeof val === "boolean")
                        prop = "B_" + val;
                    else
                        prop = val; // Support for 'symbol' type in ES6

                    if (primHashSet[prop] === undefined) {
                        out.push(val);
                        primHashSet[prop] = anyValue;
                    }
                }
            }

            // Delete the randomProp from extensible objects
            extIndex.forEach(function(index) {
                delete out[index][randomProp];
            });

            return out;
        },


        /**
         * If svgDOMNode is not SVGElement then it returns null,
         * and if svgDOMNode is already wrapped then previous wrapper will be return
         * otherwise a new wrapper object will be returned.
         *
         * @param svgDOMNode
         * @returns {Vector.Element}
         */
        wrap: function(svgDOMNode) {
            if (!(svgDOMNode instanceof window.SVGElement))
                return null;

            if (Vector.isWrapped(svgDOMNode))
                return svgDOMNode["_wrappingElement"];

            switch (svgDOMNode.constructor) {
                case window.SVGRectElement:
                    return new Rect(undefined, undefined, undefined, undefined, undefined, undefined, svgDOMNode);
                default:
                    return new Element(svgDOMNode);
            }
        },

        /**
         * Check if a DOM element object is wrapped or not
         * @param svgDOMNode
         * @returns {boolean}
         */
        isWrapped: function(svgDOMNode) {
            if (!isObject(svgDOMNode))
                return false;
            var wrapper = svgDOMNode["_wrappingElement"];
            return wrapper instanceof Element && svgDOMNode instanceof wrapper.constructor.domInterface && wrapper["_domElement"] === svgDOMNode;
        }

    });



    /**
     * Base class for all the SVG DOM wrapper elements.
     *
     * Wrapper for SVGElement native interface
     *
     * It can wrap SVGElement elements.
     */
    var Element = Vector.Element = function Element(svgDOMNode) {

        if (svgDOMNode instanceof this.constructor.domInterface) {
            if (Vector.isWrapped(svgDOMNode) && svgDOMNode["_wrappingElement"] instanceof this.constructor)
                return svgDOMNode["_wrappingElement"];
        } else {
            svgDOMNode = this.tag !== null ? Vector.createElement(this.tag) : null;
        }

        this._domElement = svgDOMNode;
        this._events = {};
        if (svgDOMNode !== null)
            svgDOMNode._wrappingElement = this;
    };

    Vector.merge(Element, {

        domInterface: window.SVGElement

    });

    Vector.merge(Element.prototype, {

        tag: null,

        /**
         * If params in form of:
         *      # (attrName, value, namespace) then sets attr and returns element, [3 args]
         *      # (attrName, value) then namespace = null and sets attr and returns element, [2 args]
         *      # (attrName, null, namespace) then deletes attr and returns element, [3 args]
         *      # (attrName, null) then namespace = null and deletes attr and returns element, [2 args]
         *      # (attrObject, namespace) then sets attrs and returns element, [2 args]
         *      # (attrObject) then namespace = null and sets attrs and returns element, [1 args]
         *      # (attrName, namespace) then returns attrValue, [2 args]
         *      # (attrName) then namespace = null and returns attrValue, [1 args]
         *      # (attrNamesArr) namespace = null and then returns attrValue as Array in order, [1 args]
         *      # (attrNamesArr, null) namespace = null and then deletes attrs and return element, [2 args]
         *      # () then returns all attributes as key/value pairs. [0 args]
         *
         * @param params
         */
        attr: function(params) {
            if (arguments.length === 0) {
                var node = this._domElement,
                    attrs,
                    i = 0,
                    length,
                    attr,
                    outs = {};

                attrs = node.attributes;
                if (window.NamedNodeMap && attrs instanceof window.NamedNodeMap) {
                    length = attrs.length;
                    for (; i < length; ++i) {
                        attr = attrs.item(i);
                        if (attr === null)
                            continue;
                        outs[attr.localName] = simplifyRawAttrValue(attr.localName, attr.value, attr.namespaceURI);
                    }

                    // IE 5.5 returns a key-value pair instead of NamedNodeMap
                } else {
                    Object.keys(attrs).forEach(function(attr) {
                        outs[attr] = simplifyRawAttrValue(attr, attrs[attr], null);
                    });
                }

                return outs;
            }
        },

        byId: function() {

        },

        query: function() {

        },

        queryAll: function() {

        }
    });


    // It simplifies the raw value of attribute to a simplified form.
    // and returns the formatted version.
    var simplifyRawAttrValue = function(attrName, value, namespaceURI) {

        var match,
            temp,
            elem;

        switch (attrName) {

            case "class":
                return Vector.unique(value.trim().split(regex.tokenSeparator));

            case "mask":
            case "clip-path":
            case "fill":
            case "stroke":
                match = regex.referenceAttrVal.exec(value);
                if (match) {
                    elem = document.getElementById(match[1]);
                    if (Vector.isWrapped(elem))
                        return elem._wrappingElement;
                    else
                        return value;
                } else
                    return value;

            case "href":
                if (namespaceURI === Vector.ns.xlink) {
                    match = regex.referenceAttrVal.exec(value);
                } else
                    match = regex.hrefAttrVal.exec(value);
                if (match) {
                    elem = document.getElementById(match[1]);
                    if (Vector.isWrapped(elem))
                        return elem._wrappingElement;
                    else
                        return value;
                } else
                    return value;

            case "cx":
            case "cy":
            case "font-size":
            case "font-weight":
            case "height":
            case "r":
            case "rx":
            case "ry":
            case "stroke-dasharray":
            case "stroke-dashoffset":
            case "stroke-width":
            case "width":
            case "x":
            case "x1":
            case "x2":
            case "y":
            case "y1":
            case "y2":
                temp = +value;
                if (isFinite(temp))
                    return temp;
                else
                    return value;

            default:
                return value;
        }
    };

    // Add data-visualization functionality
    Vector.merge(Element.prototype, {

        binder: function() {

        },

        bind: function() {

        }

    });

    // Add DOM Event wrappers to Element
    Vector.merge(Element.prototype, {

        /**
         * Attach event listener to element.
         * Old IE browsers does not support useCapture parameter and 'this' value
         * in the listener, so to overcome this a wrapper listener is used instead of
         * actual listener.
         *
         * @param eventName
         * @param listener
         * @param context
         * @param useCapture
         * @returns {Element}
         */
        on: function(eventName, listener, context, useCapture) {
            if (this._domElement === null)
                return this;
            if (!isCallable(listener))
                throw new TypeError("EventListener is not callable");

            eventName = String(eventName);
            useCapture = Boolean(useCapture);
            context = arguments.length >= 3 ? context : this;

            var eventArr,
                self = this,
                wrapper,
                i = 0;

            eventArr = this._events[eventName];
            wrapper = function() {
                listener.apply(context, slice.call(arguments));
            };

            if (eventArr) {
                for (; i < eventArr.length; ++i) {
                    if (eventArr[i].listener === listener && eventArr[i].useCapture === useCapture)
                        return this;
                }

            } else {
                eventArr = this._events[eventName] = [];
            }
            eventArr.push({
                listener: listener,
                wrapperListener: wrapper,
                useCapture: useCapture
            });

            if (this._domElement.addEventListener)
                this._domElement.addEventListener(eventName, wrapper, useCapture);
            else
                this._domElement.attachEvent("on" + eventName, wrapper);

            return self;
        },

        /**
         * Remove the listeners which was previously added via 'on' method
         *
         * @param eventName
         * @param listener
         * @param useCapture
         * @returns {Element}
         */
        off: function(eventName, listener, useCapture) {
            if (this._domElement === null)
                return this;

            var _events = this._events,
                self = this;

            if (arguments.length === 0) {
                Object.keys(_events).forEach(function(key) {
                    _events[key].forEach(function(event) {
                        if (self._domElement.removeEventListener)
                            self._domElement.removeEventListener(key, event.wrapperListener, event.useCapture);
                        else
                            self._domElement.detachEvent("on" + key, event.wrapperListener);
                    });
                });
                this._events = {};

            } else if (arguments.length === 1) {
                eventName = String(eventName);
                if (!_events[eventName])
                    return self;
                _events[eventName].forEach(function(event) {
                    if (self._domElement.removeEventListener)
                        self._domElement.removeEventListener(eventName, event.wrapperListener, event.useCapture);
                    else
                        self._domElement.detachEvent("on" + eventName, event.wrapperListener);
                });
                delete _events[eventName];

            } else {
                if (!isCallable(listener))
                    throw new TypeError("EventListener is not callable");

                eventName = String(eventName);
                useCapture = Boolean(useCapture);

                var eventArr,
                    wrapper,
                    i = 0;
                eventArr = this._events[eventName];
                if (!eventArr)
                    return self;

                for (; i < eventArr.length; ++i) {
                    if (eventArr[i].listener === listener && eventArr[i].useCapture === useCapture) {
                        if (self._domElement.removeEventListener)
                            self._domElement.removeEventListener(eventName, eventArr[i].wrapperListener, eventArr[i].useCapture);
                        else
                            self._domElement.detachEvent("on" + eventName, eventArr[i].wrapperListener);
                        eventArr.splice(i, 1);
                        break;
                    }
                }

                if (eventArr.length === 0)
                    delete _events[eventName];
            }

            return self;
        },

        once: function(eventName, listener, context, useCapture) {
            if (this._domElement === null)
                return this;
            if (!isCallable(listener))
                throw new TypeError("EventListener is not callable");

            eventName = String(eventName);
            useCapture = Boolean(useCapture);
            context = arguments.length >= 3 ? context : this;

            var eventArr,
                self = this,
                wrapper,
                i = 0;

            eventArr = this._events[eventName];
            wrapper = function() {
                listener.apply(context, slice.call(arguments));
                self.off(eventName, listener, useCapture);
            };
            if (eventArr) {
                for (; i < eventArr.length; ++i) {
                    if (eventArr[i].listener === listener && eventArr[i].useCapture === useCapture)
                        return this;
                }

            } else {
                eventArr = this._events[eventName] = [];
            }
            eventArr.push({
                listener: listener,
                wrapperListener: wrapper,
                useCapture: useCapture
            });

            if (this._domElement.addEventListener)
                this._domElement.addEventListener(eventName, wrapper, useCapture);
            else
                this._domElement.attachEvent("on" + eventName, wrapper);

            return self;
        },

        // If this method is called to emit event then
        // listener will receive a CustomEvent object.
        // If it is need to emit 'click' or 'dblclick' event, then
        // call click or dblclick method instead of this.
        emit: function(eventName, data, bubbles) {
            if (this._domElement === null)
                return this;
            eventName = String(eventName);
            bubbles = Boolean(bubbles);
            var event;

            if (isCallable(window.CustomEvent)) {
                event = new window.CustomEvent(eventName, {
                    detail: data,
                    bubbles: bubbles,
                    cancelable: true
                });

            } else if (isCallable(document.createEvent)) {
                event = document.createEvent("CustomEvent");
                event.initCustomEvent(eventName, bubbles, true, data);

            } else {
                event = document.createEventObject();
                event.detail = data;
            }

            if (isCallable(this._domElement.dispatchEvent))
                this._domElement.dispatchEvent(event);
            else
                this._domElement.fireEvent("on" + eventName, event);

            return this;
        },

        focus: function() {
            if (this._domElement === null)
                return this;
            this._domElement.focus();
        },

        blur: function() {
            if (this._domElement === null)
                return this;
            this._domElement.blur();
        },

        focusin: function() {
            if (this._domElement === null)
                return this;
            this._domElement.focus();
        },

        focuseout: function() {
            if (this._domElement === null)
                return this;
            this._domElement.blur();
        },

        click: function() {
            if (this._domElement === null)
                return this;
            triggerMouseEvent(this, "click");
            return this;
        },

        dblclick: function() {
            if (this._domElement === null)
                return this;
            triggerMouseEvent(this, "dblclick");
            return this;
        },

        mousedown: function() {
            if (this._domElement === null)
                return this;
            triggerMouseEvent(this, "mousedown");
            return this;
        },

        mouseup: function() {
            if (this._domElement === null)
                return this;
            triggerMouseEvent(this, "mouseup");
            return this;
        },

        mousemove: function() {
            if (this._domElement === null)
                return this;
            triggerMouseEvent(this, "mousemove");
            return this;
        },

        mouseout: function() {
            if (this._domElement === null)
                return this;
            triggerMouseEvent(this, "mouseout");
            return this;
        },

        mouseover: function() {
            if (this._domElement === null)
                return this;
            triggerMouseEvent(this, "mouseover");
            return this;
        },

        mouseenter: function() {
            if (this._domElement === null)
                return this;
            triggerMouseEvent(this, "mouseenter");
            return this;
        },

        mouseleave: function() {
            if (this._domElement === null)
                return this;
            triggerMouseEvent(this, "mouseleave");
            return this;
        },

        keydown: function() {
            if (this._domElement === null)
                return this;
            triggerKeyboardEvent(this, "keydown");
            return this;
        },

        keypress: function() {
            if (this._domElement === null)
                return this;
            triggerKeyboardEvent(this, "keypress");
            return this;
        },

        keyup: function() {
            if (this._domElement === null)
                return this;
            triggerKeyboardEvent(this, "keyup");
            return this;
        },

        // Listener should be null or callable,
        // If no argument is passed then previously attached listener
        // will be returned.
        onclick: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "onclick", listener, context);
        },

        ondblclick: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "ondblclick", listener, context);
        },

        onmousedown: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "onmousedown", listener, context);
        },

        onmousemove: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "onmousemove", listener, context);
        },

        onmouseout: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "onmouseout", listener, context);
        },

        onmouseover: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "onmouseover", listener, context);
        },

        onmouseup: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "onmouseup", listener, context);
        },

        onmouseenter: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "onmouseenter", listener, context);
        },

        onmouseleave: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "onmouseleave", listener, context);
        },

        ontouchstart: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "ontouchstart", listener, context);
        },

        ontouchend: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "ontouchend", listener, context);
        },

        ontouchmove: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "ontouchmove", listener, context);
        },

        ontouchcancel: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "ontouchcancel", listener, context);
        },

        ondrag: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "ondrag", listener, context);
        },

        ondragend: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "ondragend", listener, context);
        },

        ondragenter: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "ondragenter", listener, context);
        },

        ondragleave: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "ondragleave", listener, context);
        },

        ondragover: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "ondragover", listener, context);
        },

        ondragstart: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "oondragstart", listener, context);
        },

        ondrop: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "ondrop", listener, context);
        },

        onblur: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "onblur", listener, context);
        },

        onfocus: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "onfocus", listener, context);
        },

        oncontextmenu: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "oncontextmenu", listener, context);
        },

        onkeydown: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "onkeydown", listener, context);
        },

        onkeypress: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "onkeypress", listener, context);
        },

        onkeyup: function(listener, context) {
            if (arguments.length >= 1 && listener !== null && !isCallable(listener))
                throw new TypeError("Listener is not null or callable");
            context = arguments.length >= 2 ? context : this;
            return setEventAttribute(this, "onkeyup", listener, context);
        }

    });

    var constructMouseEventObject = function(eventName) {
        var event;
        if (isCallable(window.MouseEvent)) {
            event = new window.MouseEvent(eventName, {
                bubbles: true,
                cancelable: true,
                view: window,
                detail: 0,
                screenX: 0,
                screenY: 0,
                clientX: 0,
                clientY: 0,
                ctrlKey: false,
                altKey: false,
                shiftKey: false,
                metaKey: false,
                button: 0,
                buttons: 0,
                relatedTarget: null,
                region: null
            });
        } else if (isCallable(document.createEvent)) {
            event = document.createEvent("MouseEvent");
            event.initMouseEvent(eventName, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        } else {
            event = document.createEventObject();
        }
        return event;
    };

    var triggerMouseEvent = function(elem, eventName) {
        var eventObj = constructMouseEventObject(eventName);
        if (isCallable(elem._domElement.dispatchEvent))
            elem._domElement.dispatchEvent(eventObj);
        else
            elem._domElement.fireEvent("on" + eventName, eventObj);
    };

    var constructKeyboardEvent = function(eventName) {
        var event;
        if (isCallable(window.KeyboardEvent)) {
            event = new window.KeyboardEvent(eventName, {
                bubbles: true,
                cancelable: true,
                view: window,
                detail: 0,
                key: "",
                code: "",
                location: 0,
                ctrlKey: false,
                shiftKey: false,
                altKey: false,
                metaKey: false,
                repeat: false,
                isComposing: false,
                charCode: 0,
                keyCode: 0,
                which: 0
            });
        } else if (document.createEvent) {
            event = document.createEvent("KeyboardEvent");
            if (isCallable(event.initKeyboardEvent)) {
                if (isIEOrEdgeBrowser())
                    event.initKeyboardEvent(eventName, true, true, window, "", 0, "", false, ""); //for IE and Edge
                else
                    event.initKeyboardEvent(eventName, true, true, window); //For webkit, blink and DOM Level 3 Draft Spec
            } else
                event.initKeyEvent(eventName, true, true, window, false, false, false, false, 0, 0); //For Gecko

        } else {
            event = document.createEventObject();
        }
        return event;
    };

    var triggerKeyboardEvent = function(elem, eventName) {
        var eventObj = constructKeyboardEvent(eventName);
        if (isCallable(elem._domElement.dispatchEvent))
            elem._domElement.dispatchEvent(eventObj);
        else
            elem._domElement.fireEvent("on" + eventName, eventObj);
    };

    var setEventAttribute = function(elem, eventAttr, listener, context) {
        var wrapper;
        if (listener === null) {
            elem._domElement[eventAttr] = null;
            return elem;

        } else if (isCallable(listener)) {
            wrapper = listener.bind(context);
            wrapper._listener = listener;
            elem._domElement[eventAttr] = wrapper;
            return elem;

        } else {
            wrapper = elem._domElement[eventAttr];
            if (isCallable(wrapper) && isCallable(wrapper._listener))
                return wrapper._listener;
            else
                return null;
        }
    };

    /**
     * Wrapper for SVGGraphicsElement native interface
     *
     * It can wrap SVGElement elements
     *
     * If svgDOMNode is wrapped by Vector.Graphics's super class then
     * it removes that wrapper and returns a new Vector.Graphics wrapper.
     * To get a appropriate wrapper please use Vector.wrap() method.
     *
     * @type {Vector.Graphics}
     */
    var Graphics = Vector.Graphics = function Graphics(svgDOMNode) {
        var wrappedInstance = Element.call(this, svgDOMNode);
        if (wrappedInstance)
            return wrappedInstance;
    };

    setPrototypeOf(Graphics, Element);

    Graphics.prototype = create(Element.prototype);

    Graphics.prototype.constructor = Graphics;


    Vector.merge(Graphics, {

        /**
         * Some browsers does not support SVGGraphicsElement interface at all
         */
        domInterface: window.SVGElement

    });

    Vector.merge(Graphics.prototype, {

        tag: null

    });

    /**
     * Wrapper for SVGGeometryElement interface
     *
     * It can wrap SVGElement elements
     *
     * If svgDOMNode is wrapped by Vector.Geometry's super class then
     * it removes that wrapper and returns a new Vector.Geometry wrapper.
     * To get a appropriate wrapper please use Vector.wrap() method.
     *
     * @type {Vector.Geometry}
     */
    var Geometry = Vector.Geometry = function Geometry(svgDOMNode) {
        var wrappedInstance = Graphics.call(this, svgDOMNode);
        if (wrappedInstance)
            return wrappedInstance;
    };

    setPrototypeOf(Geometry, Graphics);

    Geometry.prototype = create(Graphics.prototype);

    Geometry.prototype.constructor = Geometry;

    Vector.merge(Graphics, {

        /**
         * Some browsers does not support SVGGeometryElement interface at all
         */
        domInterface: window.SVGElement

    });

    Vector.merge(Graphics.prototype, {

        tag: null

    });

    /**
     * Wrapper for SVGRectElement native interface
     *
     * It can wrap SVGRectElement elements
     *
     * If svgDOMNode is wrapped by Vector.Rect's super class then
     * it removes that wrapper and returns a new Vector.Rect wrapper.
     * To get a appropriate wrapper please use Vector.wrap() method.
     *
     * @type {Vector.Rect}
     */
    var Rect = Vector.Rect = function Rect(width, height, x, y, rx, ry, svgDOMNode) {
        var wrappedInstance = Geometry.call(this, svgDOMNode),
            attrs = {
                width: width,
                height: height,
                x: x,
                y: y,
                rx: rx,
                ry: ry
            };
        if (wrappedInstance) {
            wrappedInstance.attr(attrs, null);
            return wrappedInstance;
        }
        this.attr(attrs, null);
    };

    setPrototypeOf(Rect, Geometry);

    Rect.prototype = Object.create(Geometry.prototype);

    Rect.prototype.constructor = Rect;

    Vector.merge(Rect, {

        domInterface: window.SVGRectElement

    });

    Vector.merge(Rect.prototype, {

        tag: "rect"

    });

    return Vector;
}));