/*!
 * Vector.svg v1.2.0
 * A Javascript library for creating vector graphics using SVG.
 * It uses the SVG W3C Recommendation.
 * It provides SVG DOM manipulation, data binding and animation functionality.
 *
 * @license Copyright (c) 2017 Ariyan Khan, MIT License
 *
 * Codebase: https://github.com/ariyankhan/vector.svg
 * Homepage: https://github.com/ariyankhan/vector.svg#readme
 * Date: Mon Jul 24 2017 01:15:11 GMT+0530 (IST)
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
})(typeof window !== "undefined" ? window : this, function(root) {

    "use strict";

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

    var window = root;

    var document = root.document;

    var isArray = Array.isArray;

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

    var isFirefox = function() {
        var ua = window.navigator.userAgent;
        return (/Firefox/i.test(ua) && /Mozilla/i.test(ua));
    };

    var isSVGSupported = function() {
        return isCallable(window.SVGElement) &&
            isCallable(document.createElementNS) &&
            document.createElementNS(svgNS, "svg") instanceof window.SVGElement;
    };

    var regex = {

        tokenSeparator: /\s+/,

        pointSeparator: /[,\s]+/,

        trimStartPointString: /^[,\s]+/,

        trimEndPointString: /[,\s]+$/,

        referenceAttrVal: /^url\(#(.+)\)$/,

        hrefAttrVal: /^#(.+)$/

    };
    /**
     * It returns a SVGDoc instance and provides a
     * drawing paper to draw on it.
     *
     * @param container its value can be SVGDoc, window.SVGSVGElement, window.HTMLElement or string id.
     * @param width
     * @param height
     * @returns {Vector.SVGDoc}
     */
    var Vector = function Vector(container, width, height) {
        width = isNullOrUndefined(width) ? "100%" : width;
        height = isNullOrUndefined(height) ? "100%" : height;
        var temp;

        if (container instanceof SVGDoc)
            return container.size(width, height);
        else if (container instanceof window.SVGSVGElement)
            return new SVGDoc(width, height, container);
        else if (container instanceof window.HTMLElement) {
            temp = new SVGDoc(width, height); // Automatically creates a new svg element
            container.appendChild(temp._domElement);
            return temp;
        } else if (typeof container === "string") {
            return Vector(document.getElementById(container), width, height);
        } else {
            // Otherwise returns a SVGDoc
            // which is not attached to the document DOM tree initially.
            // And it can be attached by calling SVGDoc.container() method
            return new SVGDoc(width, height);
        }
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

            xhtml: xhtmlNS,

            xml: xmlNS
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
         * @returns {Vector}
         */
        setAttribute: function(svgDomNode, name, value, namespace) {
            namespace = isNullOrUndefined(namespace) ? null : namespace;
            svgDomNode.setAttributeNS(namespace, name, value);
            return this;
        },

        /**
         * Set attributes to SVG DOM Element
         * @param svgDomNode
         * @param attrs
         * @param namespace
         * @return {Vector}
         */
        setAttributes: function(svgDomNode, attrs, namespace) {
            Object.keys(attrs).forEach(function(attr) {
                Vector.setAttribute(svgDomNode, attr, attrs[attr], namespace);
            });
            return this;
        },

        /**
         * Check if the attribute exists in SVG DOM Element
         * @param svgDomNode
         * @param name
         * @param namespace
         * @returns {boolean}
         */
        hasAttribute: function(svgDomNode, name, namespace) {
            namespace = isNullOrUndefined(namespace) ? null : namespace;
            return svgDomNode.hasAttributeNS(namespace, name);
        },

        /**
         * Returns attribute value from SVG DOM element
         * @param svgDomNode
         * @param name
         * @param namespace
         * @returns {string}
         */
        getAttribute: function(svgDomNode, name, namespace) {
            namespace = isNullOrUndefined(namespace) ? null : namespace;
            return svgDomNode.getAttributeNS(namespace, name);
        },

        /**
         * Deletes a attribute from SVG DOM Element
         * @param svgDomNode
         * @param name
         * @param namespace
         * @returns {Vector}
         */
        removeAttribute: function(svgDomNode, name, namespace) {
            namespace = isNullOrUndefined(namespace) ? null : namespace;
            svgDomNode.removeAttributeNS(namespace, name);
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

            var cArr = Object(arr),
                out = [],
                primHashSet = {},
                objSet = [],
                extIndex = [],
                randomProp = Vector.uuid(),
                anyValue = true, //any value without 'undefined'
                ln = Vector.toIntLength(cArr.length),
                val,
                prop,
                i = 0;

            for (; i < ln; ++i) {
                // If i property does not exist in cArr then it will be treated as undefined
                // if we check every tme then running speed will be less.
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
                case window.SVGCircleElement:
                    return new Circle(undefined, undefined, undefined, svgDOMNode);
                case window.SVGPolylineElement:
                    return new Polyline(undefined, svgDOMNode);
                case window.SVGPolygonElement:
                    return new Polygon(undefined, svgDOMNode);
                case window.SVGLineElement:
                    return new Line(undefined, undefined, undefined, undefined, svgDOMNode);
                case window.SVGEllipseElement:
                    return new Ellipse(undefined, undefined, undefined, undefined, svgDOMNode);
                case window.SVGPathElement:
                    return new Path(undefined, svgDOMNode);
                case window.SVGSVGElement:
                    return new SVG(undefined, undefined, undefined, undefined, svgDOMNode);
                case window.SVGGElement:
                    return new G(svgDOMNode);
                case window.SVGDefsElement:
                    return new Defs(svgDOMNode);
                case window.SVGSymbolElement:
                    return new Symbol(svgDOMNode);
                case window.SVGUseElement:
                    return new Use(undefined, undefined, undefined, undefined, undefined, svgDOMNode);
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
        },

        /**
         * It converts any value to Integer length [Positive Integer value]
         * @param value
         * @returns {number}
         */
        toIntLength: function(value) {
            value = Number(value);
            value = isNaN(value) ? 0 : value;
            value = max(0, value);
            value = floor(value);
            return value;
        },

        /**
         * It returns values without holes in array and array-like objects
         * @param arr
         */
        unHoles: function(arr) {
            if (isNullOrUndefined(arr))
                return [];

            arr = Object(arr);
            return reduce.call(arr, function(acc, next) {
                acc.push(next);
                return acc;
            }, []);
        },

        /**
         * It formats pointString as a array of points.
         * every point is a object containing two x and y properties.
         *
         * @param pointsString
         * @returns {Array}
         */
        points: function(pointsString) {
            if (isNullOrUndefined(pointsString))
                return [];
            pointsString = String(pointsString);
            var nums,
                pointsCount,
                coords,
                x,
                y,
                outs = [],
                i = 0;

            pointsString = pointsString.replace(regex.trimStartPointString, "").replace(regex.trimEndPointString, "");
            nums = pointsString.split(regex.pointSeparator);
            pointsCount = floor(nums.length / 2);
            coords = pointsCount * 2;

            for (; i < coords; i += 2) {
                x = nums[i];
                y = nums[i + 1];
                x = +x;
                y = +y;
                if (isFinite(x) && isFinite(y)) {
                    outs.push({
                        x: x,
                        y: y
                    });
                }
            }

            return outs;
        },


        /**
         * If pointList is formatted like: pointList = [{x: 12, y: 11}, {x: 11, y: 33}, {x: 111, y: 999}]
         * then it will be converted to point string like "12,11 11,33 111,999",
         * otherwise if pointList is primitive(i.e. string) then it is passed to
         * @method Vector.points() and then its output value is interpreted.
         *
         * @param pointList string or array or array-like object
         * @returns {string}
         */
        pointString: function(pointList) {
            if (!isObject(pointList))
                pointList = Vector.points(pointList);
            return reduce.call(pointList, function(outs, point) {
                if (!isObject(point))
                    return outs;

                var x = point["x"],
                    y = point["y"];

                x = +String(x);
                y = +String(y);

                if (isFinite(x) && isFinite(y)) {
                    outs.push(x + "," + y);
                    return outs;
                } else
                    return outs;

            }, []).join(" ");
        },

        isIEOrEdgeBrowser: isIEOrEdgeBrowser,

        isFirefox: isFirefox,

        distance: function(x1, y1, x2, y2) {
            x1 = +x1;
            y1 = +y1;
            x2 = +x2;
            y2 = +y2;

            if (!isFinite(x1))
                x1 = 0;
            if (!isFinite(y1))
                y1 = 0;
            if (!isFinite(x2))
                x2 = 0;
            if (!isFinite(y2))
                y2 = 0;

            return Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5);
        },

        svgSupported: isSVGSupported()

    });


    /**
     * This class is the super class of all the containers
     *
     * These containers provide container based methods to add elements
     * and these methods are copied to actual svg wrapper class, so
     * remember these containers are not in the prototype chain of actual svg wrapper classes.
     *
     * @constructor
     */
    var Container = function() {};

    Container.prototype.exports = {};

    Vector.merge(Container, {

        makeInheritance: function(wrapperClass) {
            Vector.merge(wrapperClass.prototype, this.prototype.exports);
        }

    });

    Vector.merge(Container.prototype.exports, {});

    /**
     *
     * This type of container contains shape elements
     * i.e Path, Rect, Circle etc.
     *
     * @constructor
     */
    var ShapeContainer = function() {};

    setPrototypeOf(ShapeContainer, Container);

    ShapeContainer.prototype = Object.create(Container.prototype);

    ShapeContainer.prototype.constructor = ShapeContainer;

    ShapeContainer.prototype.exports = {};

    Vector.merge(ShapeContainer.prototype.exports, {

        rect: function(width, height, x, y, rx, ry) {
            var wrapper = new Rect(width, height, x, y, rx, ry);
            this.node().appendChild(wrapper.node());
            return wrapper;
        },

        circle: function(r, cx, cy) {
            var wrapper = new Circle(r, cx, cy);
            this.node().appendChild(wrapper.node());
            return wrapper;
        },

        ellipse: function(rx, ry, cx, cy) {
            var wrapper = new Ellipse(rx, ry, cx, cy);
            this.node().appendChild(wrapper.node());
            return wrapper;
        },

        line: function(x1, y1, x2, y2) {
            var wrapper = new Line(x1, y1, x2, y2);
            this.node().appendChild(wrapper.node());
            return wrapper;
        },

        path: function(d) {
            var wrapper = new Path(d);
            this.node().appendChild(wrapper.node());
            return wrapper;
        },

        polygon: function(points) {
            var wrapper = new Polygon(points);
            this.node().appendChild(wrapper.node());
            return wrapper;
        },

        polyline: function(points) {
            var wrapper = new Polyline(points);
            this.node().appendChild(wrapper.node());
            return wrapper;
        }

    });

    /**
     *
     * This type of container contains structural elements
     * i.e <defs>, <g>, <svg>, <symbol>, <use>
     *
     * Note: Only SVGDoc wrapper can contain <defs> element.
     *
     * @constructor
     */
    var StructuralContainer = function() {};

    setPrototypeOf(StructuralContainer, Container);

    StructuralContainer.prototype = Object.create(Container.prototype);

    StructuralContainer.prototype.constructor = StructuralContainer;

    StructuralContainer.prototype.exports = {};

    Vector.merge(StructuralContainer.prototype.exports, {

        g: function() {
            var wrapper = new G();
            this.node().appendChild(wrapper.node());
            return wrapper;
        },

        svg: function(width, height, x, y) {
            var wrapper = new SVG(width, height, x, y);
            this.node().appendChild(wrapper.node());
            return wrapper;
        },

        symbol: function() {
            var wrapper = new Symbol();
            this.node().appendChild(wrapper.node());
            return wrapper;
        },

        use: function(elem, width, height, x, y) {
            var wrapper = new Use(elem, width, height, x, y);
            this.node().appendChild(wrapper.node());
            return wrapper;
        }

    });

    /**
     * This type of container provides capability of
     * adding any svg element as Element wrapper class.
     * This Interface is useful when some svg element has no wrapper class implemented
     * in Vector.svg.
     *
     * In this case Element wrapper class is used as wrapper.
     *
     * @constructor
     */
    var GenericContainer = function() {};

    setPrototypeOf(GenericContainer, Container);

    GenericContainer.prototype = Object.create(Container.prototype);

    GenericContainer.prototype.constructor = GenericContainer;

    GenericContainer.prototype.exports = {};

    Vector.merge(GenericContainer.prototype.exports, {

        element: function(tagName) {
            var wrapper = new Element(Vector.createElement(tagName));
            this.node().appendChild(wrapper.node());
            return wrapper;
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
        this._binder = null;
        if (svgDOMNode !== null)
            svgDOMNode._wrappingElement = this;
    };

    Vector.merge(Element, {

        domInterface: window.SVGElement

    });

    Vector.merge(Element.prototype, {

        tag: null,

        // Namespace of all the attributes is null
        _defaultAttrValues: {

            "fill": "#000",

            "fill-opacity": "1",

            "stroke": "#000",

            "stroke-width": "0",

            "stroke-opacity": "1",

            "stroke-linecap": "butt",

            "stroke-linejoin": "miter",

            "opacity": "1",

            "font-size": "16",

            "font-family": "sans-serif",

            "text-anchor": "start",

            "stop-color": "#000",

            "stop-opacity": "1",

            "offset": "0"
        },

        // It sets attribute in null namespace
        _setAttrGetterSetter: function(attrName, newValue) {
            if (newValue === undefined)
                return this.attr(attrName); //Acts as a getter
            else
                return this.attr(attrName, newValue); //acts as a setter
        },

        /**
         * If params in form of:
         *      # (attrName, value, namespace) then sets attr and returns element, [3 args]
         *      # (attrName, value) then namespace = null and sets attr and returns element, [2 args]
         *      # (attrName, null, namespace) then deletes attr and returns element, [3 args]
         *      # (attrName, null) then namespace = null and deletes attr and returns element, [2 args]
         *      # (attrObject, namespace) then sets attrs and returns element, [2 args]
         *      # (attrObject) then namespace = null and sets attrs and returns element, [1 args]
         *      # (attrName) then namespace = null and returns attrValue, [1 args]
         *      # (attrNamesArr) namespace = null and then returns attrValue as map object, [1 args]
         *      # (attrNamesArr, namespace) then returns attrValue as map object, [2 args]
         *      # () then returns all attributes as key/value pairs. [0 args]
         *
         * When setting attribute value:
         *      # If attr value is null then this attr will be deleted,
         *      # if attr value is undefined then this attr will be ignored,
         *      # for others value it will be processed by
         *      @method convertToRawAttrValue
         *
         * @param params
         */
        attr: function(params) {
            var arg0,
                arg1,
                arg2,
                self = this,
                node = this._domElement,
                attrs,
                i = 0,
                length,
                attr,
                temp,
                outs;

            if (arguments.length === 0) {
                outs = {};

                attrs = node.attributes;
                if (window.NamedNodeMap && attrs instanceof window.NamedNodeMap) {
                    length = attrs.length;
                    for (i = 0; i < length; ++i) {
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

            } else if (arguments.length === 1) {
                arg0 = arguments[0];

                if (isArray(arg0)) {
                    return self.attr(arg0, null);

                } else if (isObject(arg0)) {
                    return self.attr(arg0, null);

                } else {
                    attr = String(arg0);
                    if (Vector.hasAttribute(node, attr, null))
                        return simplifyRawAttrValue(attr, Vector.getAttribute(node, attr, null), null);
                    else {
                        temp = self["_defaultAttrValues"][attr];
                        if (temp !== undefined)
                            return simplifyRawAttrValue(attr, temp, null);
                        else
                            return null;
                    }
                }

            } else if (arguments.length === 2) {
                arg0 = arguments[0];
                arg1 = arguments[1];

                if (isArray(arg0)) {
                    arg1 = isNullOrUndefined(arg1) ? null : arg1;
                    return arg0.reduce(function(outs, attr) {
                        attr = String(attr);
                        var val;
                        if (Vector.hasAttribute(node, attr, arg1))
                            val = simplifyRawAttrValue(attr, Vector.getAttribute(node, attr, arg1), arg1);
                        else {
                            if (arg1 === null) {
                                temp = self["_defaultAttrValues"][attr];
                                if (temp !== undefined)
                                    val = simplifyRawAttrValue(attr, temp, null);
                                else
                                    val = null;
                            } else
                                val = null;
                        }
                        outs[attr] = val;
                        return outs;

                    }, {});

                } else if (isObject(arg0)) {
                    arg1 = isNullOrUndefined(arg1) ? null : arg1;
                    // If attr value is undefined then it will be ignored,
                    // and for attr value null it will be deleted
                    Object.keys(arg0).forEach(function(attr) {
                        var val = arg0[attr];
                        if (val === undefined) {
                            // Nothing, just ignore
                        } else if (val === null)
                            Vector.removeAttribute(node, attr, arg1);
                        else
                            Vector.setAttribute(node, attr, convertToRawAttrValue(attr, val, arg1), arg1);
                    });
                    return self;

                } else {
                    return self.attr(String(arg0), arg1, null);
                }

            } else if (arguments.length >= 3) {
                arg0 = arguments[0];
                arg1 = arguments[1];
                arg2 = arguments[2];

                if (isArray(arg0)) {
                    return self.attr(arg0, arg1);
                } else if (isObject(arg0)) {
                    return self.attr(arg0, arg1);
                } else {
                    arg2 = isNullOrUndefined(arg2) ? null : arg2;
                    temp = String(arg0);
                    if (arg1 === null)
                        Vector.removeAttribute(node, temp, arg2);
                    else if (arg1 === undefined) {
                        //just ignore
                    } else {
                        Vector.setAttribute(node, temp, convertToRawAttrValue(temp, arg1, arg2), arg2);
                    }
                    return self;
                }
            }
        },

        /**
         * This method returns css properties computed value and sets css property,
         * It works on css files also, not only inline css
         * @returns {*}
         */
        css: function() {

        },

        /**
         * If options is null then all the font attributes will be reset i.e. will be deleted.
         * if options is object then retrieve the attribute names and set them.
         * and for any others value of options, it returns a object containing the current values of font configs.
         *
         * @param options
         * @returns {*}
         */
        font: function(options) {
            var fontAttrs = ["font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight"],
                aliases = ["family", "size", "adjust", "stretch", "style", "variant", "weight"],
                i = 0,
                length = fontAttrs.length,
                values;

            if (options === null) {
                return this.attr(fontAttrs.reduce(function(attrs, attr) {
                    attrs[attr] = null;
                    return attrs;
                }, {}));

            } else if (isObject(options)) {
                i = 0;
                return this.attr(fontAttrs.reduce(function(attrs, attr) {
                    var val = options[aliases[i]];
                    i++;
                    if (val !== undefined)
                        attrs[attr] = val;
                    return attrs;
                }, {}));

            } else {
                values = this.attr(fontAttrs);
                i = 0;
                return aliases.reduce(function(outs, alias) {
                    outs[alias] = values[fontAttrs[i]];
                    i++;
                    return outs;
                }, {});
            }
        },

        /**
         * Returns underlying DOM element.
         * Remember after creating a wrapper,
         * you should not change the underlying element,
         * if necessary then create a new wrapper.
         * @returns {*}
         */
        node: function() {
            return this._domElement;
        },

        /**
         * Returns SVG Doc to which current element belongs
         * @returns {*}
         */
        doc: function() {
            var node = this.node();
            while (node !== null) {
                // SVG DOC's parent node will be a HTML node.
                if (node instanceof window.SVGSVGElement && node.parentNode instanceof window.HTMLElement)
                    return new SVGDoc(undefined, undefined, node);
                node = node.parentNode;
            }
            return null;
        },

        /**
         * If id attribute does not exist then a new id
         * attribute will be created.
         * @param newId
         * @returns {*}
         */
        id: function(newId) {
            var node = this.node();

            if (arguments.length === 0) {
                if (node.id === "") {
                    node.id = this._generateElemId();
                }
                return node.id;
            }
            node.id = newId;
            return this;
        },

        _generateElemId: function() {
            return Vector.uuid();
        }

    });

    // Every wrapper class is a container and also a
    // Generic container
    Container.makeInheritance(Element);
    GenericContainer.makeInheritance(Element);

    // It simplifies the raw value of attribute to a simplified form.
    // and returns the formatted version.
    var simplifyRawAttrValue = function(attrName, value, namespaceURI) {

        var match,
            temp,
            elem;

        attrName = String(attrName);
        value = String(value);
        namespaceURI = isNullOrUndefined(namespaceURI) ? null : namespaceURI;

        switch (attrName) {

            case "class":
                if (namespaceURI !== null)
                    return value;
                return Vector.unique(value.trim().split(regex.tokenSeparator));

            case "mask":
            case "clip-path":
            case "fill":
            case "stroke":
                if (namespaceURI !== null)
                    return value;
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
                match = regex.hrefAttrVal.exec(value); //xlink:href and href value is like: #id etc or full URL

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
            case "pathLength":
                if (namespaceURI !== null)
                    return value;
                temp = +value;
                if (isFinite(temp))
                    return temp;
                else
                    return value;

            default:
                return value;
        }
    };

    // It converts the given value to raw attribute value as string in appropriate way.
    var convertToRawAttrValue = function(attrName, value, namespaceURI) {

        attrName = String(attrName);
        namespaceURI = isNullOrUndefined(namespaceURI) ? null : namespaceURI;

        // For number, string, boolean and symbol(in ES6).
        // value can't be null or undefined due to it is handled previously
        if (!isObject(value))
            return String(value);

        switch (attrName) {

            // value can be array or array like object
            case "class":
                if (namespaceURI !== null)
                    return value.toString();
                return Vector.unHoles(value).join(" ").trim();

            case "mask":
                if (namespaceURI !== null)
                    return value.toString();
                //To do...
                return value.toString();

            default:
                return value.toString();
        }

    };

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
            return setEventAttribute(this, "ondragstart", listener, context);
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

    // Addition of the Document Tree manipulation functionality
    Vector.merge(Element.prototype, {

        /**
         * Returns all child SVGElement as Array of wrappers
         * @returns {Array}
         */
        children: function() {
            var dom = this._domElement,
                outs = [],
                i = 0,
                length,
                node,
                nodes;
            nodes = dom.childNodes;
            length = nodes.length;
            for (; i < length; ++i) {
                node = nodes.item(i);
                if (node instanceof window.SVGElement)
                    outs.push(Vector.wrap(node));
            }
            return outs;
        },

        insert: function(elem, index) {
            if (!(elem instanceof Element))
                return this;
            if (isNullOrUndefined(index)) {
                return this.append(elem);
            }

            var children = this.children();
            if (children.length === 0) {
                return this.append(elem);
            }

            index = +index;
            index = isNaN(index) ? 0 : index;
            index = max(0, index);
            index = floor(index);

            if (index >= children.length) {
                return this.append(elem);
            }

            this.node().insertBefore(elem.node(), children[index].node());
            return this;
        },

        append: function(elem) {
            if (!(elem instanceof Element))
                return this;
            this.node().appendChild(elem.node());
            return this;
        },

        /**
         * Here if index is out of bounds then nothing will happen
         *
         * @param elem can be any wrapper element or index of element
         * @returns {*}
         */
        remove: function(elem) {
            if (elem instanceof Element) {
                this.node().removeChild(elem.node());
            } else if (typeof elem === "number") {
                return this.remove(this.children()[elem]);
            }
            return this;
        },

        has: function(elem) {
            if (!(elem instanceof Element))
                return false;
            var children = this.children(),
                length = children.length,
                i = 0;
            for (; i < length; ++i) {
                if (children[i].node() === elem.node())
                    return true;
            }
            return false;
        },

        replace: function(newElem, oldElem) {
            if (!(newElem instanceof Element) || !(oldElem instanceof Element))
                return this;

            this.node().replaceChild(newElem.node(), oldElem.node());
            return this;
        },

        /**
         * This method sets text content of any node.
         * It is useful for <title> or <desc> elements
         * @param text
         * @returns {*}
         */
        textContent: function(text) {
            if (text === undefined)
                return this.node().textContent;
            else {
                this.node().textContent = text;
                return this;
            }
        },

        byId: function() {

        },

        query: function() {

        },

        queryAll: function() {

        }
    });

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

        tag: null,

        // Namespace of all the attributes is null
        _defaultAttrValues: Vector.merge(Vector.merge({}, Graphics.prototype._defaultAttrValues), {

            // Add here SVGGraphicsElement interface specific attribute's default values

        })

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

    Vector.merge(Geometry, {

        /**
         * Some browsers does not support SVGGeometryElement interface at all
         */
        domInterface: window.SVGElement

    });

    Vector.merge(Geometry.prototype, {

        tag: null,

        // Namespace of all the attributes is null
        _defaultAttrValues: Vector.merge(Vector.merge({}, Geometry.prototype._defaultAttrValues), {

            pathLength: "0"

        }),

        pathLength: function(pathLength) {
            return this._setAttrGetterSetter("pathLength", pathLength);
        },

        length: function() {
            var node = this._domElement,
                defaultLength = 0;

            switch (node.constructor) {
                case Path.domInterface:
                    return getTotalLengthOfPath(node);
                case Rect.domInterface:
                    return getTotalLengthOfRect(node);
                case Circle.domInterface:
                    return getTotalLengthOfCircle(node);
                case Ellipse.domInterface:
                    return getTotalLengthOfEllipse(node);
                case Line.domInterface:
                    return getTotalLengthOfLine(node);
                case Polyline.domInterface:
                    return getTotalLengthOfPolyline(node);
                case Polygon.domInterface:
                    return getTotalLengthOfPolygon(node);
                default:
                    return defaultLength;
            }
        }

    });

    var getTotalLengthOfPath = function(pathDOMNode) {

        // getTotalLength() method was added to SVGPathElement interface in SVG 1.1,
        // but in SVG 2, this method was moved to SVGGeometryElement interface (In SVG 1.1
        // there was no SVGGeometryElement interface).
        // So ultimately SVGPathElement instance can access getTotalLength() method directly or by prototype chain
        // in both environment SVG 1.1 and SVG 2.
        return pathDOMNode.getTotalLength();
    };

    var getTotalLengthOfRect = function(rectDOMNode) {
        var bbox,
            defValueWidth = 0,
            width,
            height,
            defValueHeight = 0;

        // SVG2: Approach 1
        //
        // In SVG 2, getTotalLength() method was added to SVGGeometryElement new interface.
        // and Some browsers implement all shape interfaces(i.e. SVGPathElement,
        // SVGRectElement, SVGCircleElement etc) extends SVGGeometryElement,
        // but some browsers did not implement this i.e. in firefox.
        // So use getTotalLength() if it is available for better result.
        if (isCallable(rectDOMNode["getTotalLength"])) {
            return rectDOMNode.getTotalLength();
        }

        // SVG2: Approach 2
        //
        // SVGGraphicsElement interface was added to SVG 2,
        // So getBBox() method is available in SVG 2,
        //
        // In firefox getBBox() method returns an empty SVGRect when
        // value of 'width' or 'height' attribute is zero or invalid or does not exist,
        // see bug https://bugzilla.mozilla.org/show_bug.cgi?id=1019326
        if (isFirefox()) {
            if (Vector.hasAttribute(rectDOMNode, "width", null) && Vector.hasAttribute(rectDOMNode, "height", null)) {
                width = parseFloat(Vector.getAttribute(rectDOMNode, "width", null));
                height = parseFloat(Vector.getAttribute(rectDOMNode, "height", null));

                if (isFinite(width) && width > 0 && isFinite(height) && height > 0) {
                    if (isCallable(rectDOMNode["getBBox"])) {
                        bbox = rectDOMNode.getBBox();
                        return 2 * (bbox.width + bbox.height);
                    }
                }
            }

        } else {
            if (isCallable(rectDOMNode["getBBox"])) {
                bbox = rectDOMNode.getBBox();
                return 2 * (bbox.width + bbox.height);
            }
        }

        // Otherwise for SVG 1.1 and for Firefox fallback
        //
        // It extracts the number from attribute value.
        // If the attribute value is like "50%", or "50px", or "50xyz",
        // then it will assume its value is 50, so here percent is ignored.
        // But it is not recommended, later it will be corrected.
        if (Vector.hasAttribute(rectDOMNode, "width", null))
            width = Vector.getAttribute(rectDOMNode, "width", null);
        else
            width = defValueWidth;

        if (Vector.hasAttribute(rectDOMNode, "height", null))
            height = Vector.getAttribute(rectDOMNode, "height", null);
        else
            height = defValueHeight;

        width = parseFloat(width);
        height = parseFloat(height);
        if (!(isFinite(width) && width >= 0))
            width = defValueWidth;
        if (!(isFinite(height) && height >= 0))
            height = defValueHeight;

        return 2 * (width + height);
    };

    var getTotalLengthOfCircle = function(circleDOMNode) {
        var bbox,
            defValueRadius = 0,
            r;

        // SVG2: Approach 1
        //
        // In SVG 2, getTotalLength() method was added to SVGGeometryElement new interface.
        // and Some browsers implement all shape interfaces(i.e. SVGPathElement,
        // SVGRectElement, SVGCircleElement etc) extends SVGGeometryElement,
        // but some browsers did not implement this i.e. in firefox.
        // So use getTotalLength() if it is available for better result.
        if (isCallable(circleDOMNode["getTotalLength"])) {
            return circleDOMNode.getTotalLength();
        }

        // SVG2: Approach 2
        //
        // SVGGraphicsElement interface was added to SVG 2,
        // So getBBox() method is available in SVG 2,
        if (isCallable(circleDOMNode["getBBox"])) {
            bbox = circleDOMNode.getBBox();
            r = bbox.width / 2;
            return 2 * Math.PI * r;
        }

        // Otherwise for SVG 1.1
        //
        // It extracts the number from attribute value.
        // If the attribute value is like "50%", or "50px", or "50xyz",
        // then it will assume its value is 50, so here percent is ignored.
        // But it is not recommended, later it will be corrected.
        if (Vector.hasAttribute(circleDOMNode, "r", null))
            r = Vector.getAttribute(circleDOMNode, "r", null);
        else
            r = defValueRadius;

        r = parseFloat(r);
        if (!(isFinite(r) && r >= 0))
            r = defValueRadius;

        return 2 * Math.PI * r;
    };

    var getTotalLengthOfEllipse = function(ellipseDOMNode) {
        var bbox,
            defValueXRadius = 0,
            rx,
            ry,
            defValueYRadius = 0;

        // SVG2: Approach 1
        //
        // In SVG 2, getTotalLength() method was added to SVGGeometryElement new interface.
        // and Some browsers implement all shape interfaces(i.e. SVGPathElement,
        // SVGRectElement, SVGCircleElement etc) extends SVGGeometryElement,
        // but some browsers did not implement this i.e. in firefox.
        // So use getTotalLength() if it is available for better result.
        if (isCallable(ellipseDOMNode["getTotalLength"])) {
            return ellipseDOMNode.getTotalLength();
        }

        // SVG2: Approach 2
        //
        // SVGGraphicsElement interface was added to SVG 2,
        // So getBBox() method is available in SVG 2,
        //
        // In firefox getBBox() method returns an empty SVGRect when
        // value of 'rx' or 'ry' attribute is zero or invalid or does not exist,
        // see bug https://bugzilla.mozilla.org/show_bug.cgi?id=1019326
        if (isFirefox()) {
            if (Vector.hasAttribute(ellipseDOMNode, "rx", null) && Vector.hasAttribute(ellipseDOMNode, "ry", null)) {
                rx = parseFloat(Vector.getAttribute(ellipseDOMNode, "rx", null));
                ry = parseFloat(Vector.getAttribute(ellipseDOMNode, "ry", null));

                if (isFinite(rx) && rx > 0 && isFinite(ry) && ry > 0) {
                    if (isCallable(ellipseDOMNode["getBBox"])) {
                        bbox = ellipseDOMNode.getBBox();
                        return calculateEllipsePerimeter(bbox.width / 2, bbox.height / 2);
                    }
                }
            }

        } else {
            if (isCallable(ellipseDOMNode["getBBox"])) {
                bbox = ellipseDOMNode.getBBox();
                return calculateEllipsePerimeter(bbox.width / 2, bbox.height / 2);
            }
        }

        // Otherwise for SVG 1.1 and for Firefox fallback
        //
        // It extracts the number from attribute value.
        // If the attribute value is like "50%", or "50px", or "50xyz",
        // then it will assume its value is 50, so here percent is ignored.
        // But it is not recommended, later it will be corrected.
        if (Vector.hasAttribute(ellipseDOMNode, "rx", null))
            rx = Vector.getAttribute(ellipseDOMNode, "rx", null);
        else
            rx = defValueXRadius;

        if (Vector.hasAttribute(ellipseDOMNode, "ry", null))
            ry = Vector.getAttribute(ellipseDOMNode, "ry", null);
        else
            ry = defValueYRadius;

        rx = parseFloat(rx);
        ry = parseFloat(ry);
        if (!(isFinite(rx) && rx >= 0))
            rx = defValueXRadius;
        if (!(isFinite(ry) && ry >= 0))
            ry = defValueYRadius;

        return calculateEllipsePerimeter(rx, ry);
    };

    var calculateEllipsePerimeter = function(rx, ry) {
        if (rx === 0 && ry === 0)
            return 0;
        var h = Math.pow(rx - ry, 2) / Math.pow(rx + ry, 2);
        return Math.PI * (rx + ry) * (1 + ((3 * h) / (10 + Math.pow(4 - 3 * h, 0.5))));
    };

    var getTotalLengthOfLine = function(lineDOMNode) {
        var bbox,
            defValueX1 = 0,
            defValueY1 = 0,
            defValueX2 = 0,
            defValueY2 = 0,
            x1,
            y1,
            x2,
            y2;

        // SVG2: Approach 1
        //
        // In SVG 2, getTotalLength() method was added to SVGGeometryElement new interface.
        // and Some browsers implement all shape interfaces(i.e. SVGPathElement,
        // SVGRectElement, SVGCircleElement etc) extends SVGGeometryElement,
        // but some browsers did not implement this i.e. in firefox.
        // So use getTotalLength() if it is available for better result.
        if (isCallable(lineDOMNode["getTotalLength"])) {
            return lineDOMNode.getTotalLength();
        }

        // SVG2: Approach 2
        //
        // SVGGraphicsElement interface was added to SVG 2,
        // So getBBox() method is available in SVG 2
        if (isCallable(lineDOMNode["getBBox"])) {
            bbox = lineDOMNode.getBBox();
            return calculateDiagonal(bbox.width, bbox.height);
        }

        // Otherwise for SVG 1.1
        //
        // It extracts the number from attribute value.
        // If the attribute value is like "50%", or "50px", or "50xyz",
        // then it will assume its value is 50, so here percent is ignored.
        // But it is not recommended, later it will be corrected.
        if (Vector.hasAttribute(lineDOMNode, "x1", null))
            x1 = Vector.getAttribute(lineDOMNode, "x1", null);
        else
            x1 = defValueX1;

        if (Vector.hasAttribute(lineDOMNode, "y1", null))
            y1 = Vector.getAttribute(lineDOMNode, "y1", null);
        else
            y1 = defValueY1;

        if (Vector.hasAttribute(lineDOMNode, "x2", null))
            x2 = Vector.getAttribute(lineDOMNode, "x2", null);
        else
            x2 = defValueX2;

        if (Vector.hasAttribute(lineDOMNode, "y2", null))
            y2 = Vector.getAttribute(lineDOMNode, "y2", null);
        else
            y2 = defValueY2;


        x1 = parseFloat(x1);
        y1 = parseFloat(y1);
        x2 = parseFloat(x2);
        y2 = parseFloat(y2);

        if (!isFinite(x1))
            x1 = defValueX1;
        if (!isFinite(y1))
            y1 = defValueY1;
        if (!isFinite(x2))
            x2 = defValueX2;
        if (!(isFinite(y2)))
            y2 = defValueY2;

        return Vector.distance(x1, y1, x2, y2);
    };

    var calculateDiagonal = function(width, height) {
        return Math.pow((width * width) + (height * height), 0.5);
    };

    var getTotalLengthOfPolyline = function(polylineDOMNode) {
        var defValuePoints = "",
            points,
            calcLength = 0;


        // In SVG 2, getTotalLength() method was added to SVGGeometryElement new interface.
        // and Some browsers implement all shape interfaces(i.e. SVGPathElement,
        // SVGRectElement, SVGCircleElement etc) extends SVGGeometryElement,
        // but some browsers did not implement this i.e. in firefox.
        // So use getTotalLength() if it is available for better result.
        if (isCallable(polylineDOMNode["getTotalLength"])) {
            return polylineDOMNode.getTotalLength();
        }

        // For SVG 1.1 and if getTotalLength() is not available
        if (Vector.hasAttribute(polylineDOMNode, "points", null))
            points = Vector.getAttribute(polylineDOMNode, "points", null);
        else
            points = defValuePoints;

        points = Vector.points(points);

        if (points.length === 0)
            return 0;

        points.reduce(function(point1, point2) {
            calcLength += Vector.distance(point1.x, point1.y, point2.x, point2.y);
            return point2;
        });

        return calcLength;
    };

    var getTotalLengthOfPolygon = function(polygonDOMNode) {
        var defValuePoints = "",
            points,
            calcLength = 0;


        // In SVG 2, getTotalLength() method was added to SVGGeometryElement new interface.
        // and Some browsers implement all shape interfaces(i.e. SVGPathElement,
        // SVGRectElement, SVGCircleElement etc) extends SVGGeometryElement,
        // but some browsers did not implement this i.e. in firefox.
        // So use getTotalLength() if it is available for better result.
        if (isCallable(polygonDOMNode["getTotalLength"])) {
            return polygonDOMNode.getTotalLength();
        }

        // For SVG 1.1 and if getTotalLength() is not available
        if (Vector.hasAttribute(polygonDOMNode, "points", null))
            points = Vector.getAttribute(polygonDOMNode, "points", null);
        else
            points = defValuePoints;

        points = Vector.points(points);

        if (points.length === 0)
            return 0;

        points.push(points[0]);

        points.reduce(function(point1, point2) {
            calcLength += Vector.distance(point1.x, point1.y, point2.x, point2.y);
            return point2;
        });

        return calcLength;
    };

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

        tag: "rect",

        // Namespace of all the attributes is null
        _defaultAttrValues: Vector.merge(Vector.merge({}, Rect.prototype._defaultAttrValues), {

            width: "0",

            height: "0",

            x: "0",

            y: "0",

            rx: "0",

            ry: "0"

        }),

        width: function(width) {
            return this._setAttrGetterSetter("width", width);
        },

        height: function(height) {
            return this._setAttrGetterSetter("height", height);
        },

        x: function(x) {
            return this._setAttrGetterSetter("x", x);
        },

        y: function(y) {
            return this._setAttrGetterSetter("y", y);
        },

        rx: function(rx) {
            return this._setAttrGetterSetter("rx", rx);
        },

        ry: function(ry) {
            return this._setAttrGetterSetter("ry", ry);
        },

        size: function(width, height) {
            if (width === undefined && height === undefined) {
                return {
                    width: this.width(),
                    height: this.height()
                };
            }
            if (width !== undefined)
                this.width(width);
            if (height !== undefined)
                this.height(height);

            return this;
        }

    });

    /**
     * Wrapper for SVGCircleElement native interface
     *
     * It can wrap SVGCircleElement elements
     *
     * If svgDOMNode is wrapped by Vector.Circle's super class then
     * it removes that wrapper and returns a new Vector.Circle wrapper.
     * To get a appropriate wrapper please use Vector.wrap() method.
     *
     * @type {Vector.Circle}
     */
    var Circle = Vector.Circle = function Circle(r, cx, cy, svgDOMNode) {
        var wrappedInstance = Geometry.call(this, svgDOMNode),
            attrs = {
                r: r,
                cx: cx,
                cy: cy
            };
        if (wrappedInstance) {
            wrappedInstance.attr(attrs, null);
            return wrappedInstance;
        }
        this.attr(attrs, null);
    };

    setPrototypeOf(Circle, Geometry);

    Circle.prototype = Object.create(Geometry.prototype);

    Circle.prototype.constructor = Circle;

    Vector.merge(Circle, {

        domInterface: window.SVGCircleElement

    });

    Vector.merge(Circle.prototype, {

        tag: "circle",

        // Namespace of all the attributes is null
        _defaultAttrValues: Vector.merge(Vector.merge({}, Circle.prototype._defaultAttrValues), {

            r: "0",

            cx: "0",

            cy: "0"

        }),

        r: function(r) {
            return this._setAttrGetterSetter("r", r);
        },

        cx: function(cx) {
            return this._setAttrGetterSetter("cx", cx);
        },

        cy: function(cy) {
            return this._setAttrGetterSetter("cy", cy);
        }

    });

    /**
     * Wrapper for SVGPolylineElement native interface
     *
     * It can wrap SVGPolylineElement elements
     *
     * If svgDOMNode is wrapped by Vector.Polyline's super class then
     * it removes that wrapper and returns a new Vector.Polyline wrapper.
     * To get a appropriate wrapper please use Vector.wrap() method.
     *
     * @type {Vector.Polyline}
     */
    var Polyline = Vector.Polyline = function Polyline(points, svgDOMNode) {
        var wrappedInstance = Geometry.call(this, svgDOMNode),
            attrs = {
                points: points
            };
        if (wrappedInstance) {
            wrappedInstance.attr(attrs, null);
            return wrappedInstance;
        }
        this.attr(attrs, null);
    };

    setPrototypeOf(Polyline, Geometry);

    Polyline.prototype = Object.create(Geometry.prototype);

    Polyline.prototype.constructor = Polyline;

    Vector.merge(Polyline, {

        domInterface: window.SVGPolylineElement

    });

    Vector.merge(Polyline.prototype, {

        tag: "polyline",

        // Namespace of all the attributes is null
        _defaultAttrValues: Vector.merge(Vector.merge({}, Polyline.prototype._defaultAttrValues), {

            points: ""

        }),

        points: function(points) {
            return this._setAttrGetterSetter("points", points);
        }

    });

    /**
     * Wrapper for SVGPolygonElement native interface
     *
     * It can wrap SVGPolygonElement elements
     *
     * If svgDOMNode is wrapped by Vector.Polygon's super class then
     * it removes that wrapper and returns a new Vector.Polygon wrapper.
     * To get a appropriate wrapper please use Vector.wrap() method.
     *
     * @type {Vector.Polygon}
     */
    var Polygon = Vector.Polygon = function Polygon(points, svgDOMNode) {
        var wrappedInstance = Geometry.call(this, svgDOMNode),
            attrs = {
                points: points
            };
        if (wrappedInstance) {
            wrappedInstance.attr(attrs, null);
            return wrappedInstance;
        }
        this.attr(attrs, null);
    };

    setPrototypeOf(Polygon, Geometry);

    Polygon.prototype = Object.create(Geometry.prototype);

    Polygon.prototype.constructor = Polygon;

    Vector.merge(Polygon, {

        domInterface: window.SVGPolygonElement

    });

    Vector.merge(Polygon.prototype, {

        tag: "polygon",

        // Namespace of all the attributes is null
        _defaultAttrValues: Vector.merge(Vector.merge({}, Polygon.prototype._defaultAttrValues), {

            points: ""

        }),

        points: function(points) {
            return this._setAttrGetterSetter("points", points);
        }

    });

    /**
     * Wrapper for SVGLineElement native interface
     *
     * It can wrap SVGLineElement elements
     *
     * If svgDOMNode is wrapped by Vector.Line's super class then
     * it removes that wrapper and returns a new Vector.Line wrapper.
     * To get a appropriate wrapper please use Vector.wrap() method.
     *
     * @type {Vector.Line}
     */
    var Line = Vector.Line = function Line(x1, y1, x2, y2, svgDOMNode) {
        var wrappedInstance = Geometry.call(this, svgDOMNode),
            attrs = {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
            };
        if (wrappedInstance) {
            wrappedInstance.attr(attrs, null);
            return wrappedInstance;
        }
        this.attr(attrs, null);
    };

    setPrototypeOf(Line, Geometry);

    Line.prototype = Object.create(Geometry.prototype);

    Line.prototype.constructor = Line;

    Vector.merge(Line, {

        domInterface: window.SVGLineElement

    });

    Vector.merge(Line.prototype, {

        tag: "line",

        // Namespace of all the attributes is null
        _defaultAttrValues: Vector.merge(Vector.merge({}, Line.prototype._defaultAttrValues), {

            x1: "0",

            y1: "0",

            x2: "0",

            y2: "0"

        }),

        x1: function(x1) {
            return this._setAttrGetterSetter("x1", x1);
        },

        y1: function(y1) {
            return this._setAttrGetterSetter("y1", y1);
        },

        x2: function(x2) {
            return this._setAttrGetterSetter("x2", x2);
        },

        y2: function(y2) {
            return this._setAttrGetterSetter("y2", y2);
        },

        from: function(x1, y1) {
            if (x1 === undefined && y1 === undefined) {
                return {
                    x: this.x1(),
                    y: this.y1()
                };
            }

            if (x1 !== undefined)
                this.x1(x1);
            if (y1 !== undefined)
                this.y1(y1);

            return this;
        },

        to: function(x2, y2) {
            if (x2 === undefined && y2 === undefined) {
                return {
                    x: this.x2(),
                    y: this.y2()
                };
            }

            if (x2 !== undefined)
                this.x2(x2);
            if (y2 !== undefined)
                this.y2(y2);

            return this;
        }

    });

    /**
     * Wrapper for SVGEllipseElement native interface
     *
     * It can wrap SVGEllipseElement elements
     *
     * If svgDOMNode is wrapped by Vector.Ellipse's super class then
     * it removes that wrapper and returns a new Vector.Ellipse wrapper.
     * To get a appropriate wrapper please use Vector.wrap() method.
     *
     * @type {Vector.Ellipse}
     */
    var Ellipse = Vector.Ellipse = function Ellipse(rx, ry, cx, cy, svgDOMNode) {
        var wrappedInstance = Geometry.call(this, svgDOMNode),
            attrs = {
                rx: rx,
                ry: ry,
                cx: cx,
                cy: cy
            };
        if (wrappedInstance) {
            wrappedInstance.attr(attrs, null);
            return wrappedInstance;
        }
        this.attr(attrs, null);
    };

    setPrototypeOf(Ellipse, Geometry);

    Ellipse.prototype = Object.create(Geometry.prototype);

    Ellipse.prototype.constructor = Ellipse;

    Vector.merge(Ellipse, {

        domInterface: window.SVGEllipseElement

    });

    Vector.merge(Ellipse.prototype, {

        tag: "ellipse",

        // Namespace of all the attributes is null
        _defaultAttrValues: Vector.merge(Vector.merge({}, Ellipse.prototype._defaultAttrValues), {

            rx: "0",

            ry: "0",

            cx: "0",

            cy: "0"

        }),

        rx: function(rx) {
            return this._setAttrGetterSetter("rx", rx);
        },

        ry: function(ry) {
            return this._setAttrGetterSetter("ry", ry);
        },

        cx: function(cx) {
            return this._setAttrGetterSetter("cx", cx);
        },

        cy: function(cy) {
            return this._setAttrGetterSetter("cy", cy);
        }

    });

    /**
     * Wrapper for SVGPathElement native interface
     *
     * It can wrap SVGPathElement elements
     *
     * If svgDOMNode is wrapped by Vector.Path's super class then
     * it removes that wrapper and returns a new Vector.Path wrapper.
     * To get a appropriate wrapper please use Vector.wrap() method.
     *
     * @type {Vector.Path}
     */
    var Path = Vector.Path = function Path(d, svgDOMNode) {
        var wrappedInstance = Geometry.call(this, svgDOMNode),
            attrs = {
                d: d
            };
        if (wrappedInstance) {
            wrappedInstance.attr(attrs, null);
            return wrappedInstance;
        }
        this.attr(attrs, null);
    };

    setPrototypeOf(Path, Geometry);

    Path.prototype = Object.create(Geometry.prototype);

    Path.prototype.constructor = Path;

    Vector.merge(Path, {

        domInterface: window.SVGPathElement

    });

    Vector.merge(Path.prototype, {

        tag: "path",

        // Namespace of all the attributes is null
        _defaultAttrValues: Vector.merge(Vector.merge({}, Path.prototype._defaultAttrValues), {

            d: ""

        }),

        d: function(d) {
            return this._setAttrGetterSetter("d", d);
        }

    });

    /**
     * Wrapper for SVGSVGElement native interface
     *
     * It can wrap SVGSVGElement elements
     *
     * If svgDOMNode is wrapped by Vector.SVG's super class then
     * it removes that wrapper and returns a new Vector.SVG wrapper.
     * To get a appropriate wrapper please use Vector.wrap() method.
     *
     * This class wraps normally inner <svg> element, but also can wrap outer most <svg> element.
     *
     * @type {Vector.SVG}
     */
    var SVG = Vector.SVG = function SVG(width, height, x, y, svgDOMNode) {
        var wrappedInstance = Graphics.call(this, svgDOMNode),
            attrs = {
                width: width,
                height: height,
                x: x,
                y: y
            };
        if (wrappedInstance) {
            wrappedInstance.attr(attrs, null);
            return wrappedInstance;
        }
        this.attr(attrs, null);
    };

    setPrototypeOf(SVG, Graphics);

    SVG.prototype = Object.create(Graphics.prototype);

    SVG.prototype.constructor = SVG;

    Vector.merge(SVG, {

        domInterface: window.SVGSVGElement

    });

    Vector.merge(SVG.prototype, {

        tag: "svg",

        // Namespace of all the attributes is null
        _defaultAttrValues: Vector.merge(Vector.merge({}, SVG.prototype._defaultAttrValues), {

            width: "100%",

            height: "100%",

            x: "0",

            y: "0",

            preserveAspectRatio: "xMidYMid meet"

        }),

        width: function(width) {
            return this._setAttrGetterSetter("width", width);
        },

        height: function(height) {
            return this._setAttrGetterSetter("height", height);
        },

        x: function(x) {
            return this._setAttrGetterSetter("x", x);
        },

        y: function(y) {
            return this._setAttrGetterSetter("y", y);
        },

        size: function(width, height) {
            if (width === undefined && height === undefined) {
                return {
                    width: this.width(),
                    height: this.height()
                };
            }
            if (width !== undefined)
                this.width(width);
            if (height !== undefined)
                this.height(height);

            return this;
        },

        viewBox: function(x, y, width, height) {
            var temp,
                viewBoxDefValue = this._getViewBoxDefValue(),
                currViewBox,
                viewBox;

            if (x === undefined && y === undefined && width === undefined && height === undefined) {
                viewBox = this.attr("viewBox");
                if (viewBox === null)
                    return viewBoxDefValue;

                viewBox = viewBox.trim();
                temp = viewBox.split(regex.tokenSeparator);
                if (temp.length < 4)
                    return viewBoxDefValue;
                x = temp[0];
                y = temp[1];
                width = temp[2];
                height = temp[3];

                x = +x;
                y = +y;
                width = +width;
                height = +height;

                // x-min and y-min can be negative
                if (!isFinite(x) || !isFinite(y) || !(isFinite(width) && width >= 0) || !(isFinite(height) && height >= 0))
                    return viewBoxDefValue;

                return {
                    x: x,
                    y: y,
                    width: width,
                    height: height
                }
            }

            if (isObject(x)) {
                temp = x;
                x = temp.x;
                y = temp.y;
                width = temp.width;
                height = temp.height;
            }

            currViewBox = this.viewBox();

            if (x === undefined)
                x = currViewBox.x;
            if (y === undefined)
                y = currViewBox.y;
            if (width === undefined)
                width = currViewBox.width;
            if (height === undefined)
                height = currViewBox.height;

            x = +x;
            y = +y;
            width = +width;
            height = +height;

            // If these values are not finite (i.e. NaN, Infinite or -Infinite) then no problem browser will handle it.
            viewBox = x + " " + y + " " + width + " " + height;
            this.attr("viewBox", viewBox);

            return this;
        },

        _getViewBoxDefValue: function() {
            // The default values of width and height for outer <svg> is 300x150
            // and for inner <svg> it is 100%x100%.
            var widthDefValue = parseFloat(this._defaultAttrValues.width),
                heightDefValue = parseFloat(this._defaultAttrValues.height),
                width,
                height;

            width = this.width();
            height = this.height();

            width = parseFloat(width);
            height = parseFloat(height);
            if (!(isFinite(width) && width >= 0))
                width = widthDefValue;
            if (!(isFinite(height) && height >= 0))
                height = heightDefValue;

            return {
                x: 0,
                y: 0,
                width: width,
                height: height
            };
        },

        /**
         * Sets and gets 'preserveAspectRatio' attribute value
         *
         * @param aspectRatio
         * @returns {*}
         */
        aspectRatio: function(aspectRatio) {
            return this._setAttrGetterSetter("preserveAspectRatio", aspectRatio);
        }

    });

    ShapeContainer.makeInheritance(SVG);
    StructuralContainer.makeInheritance(SVG);

    /**
     * Wrapper for SVGSVGElement native interface
     *
     * It can wrap SVGSVGElement elements
     *
     * If svgDOMNode is wrapped by Vector.SVGDoc's super class then
     * it removes that wrapper and returns a new Vector.SVGDoc wrapper.
     * To get a appropriate wrapper please use Vector.wrap() method.
     *
     * This class wraps only outermost <svg> element.
     * It defines a new SVG document.
     *
     * @type {Vector.SVGDoc}
     */
    var SVGDoc = Vector.SVGDoc = function SVGDoc(width, height, svgDOMNode) {
        var wrappedInstance = SVG.call(this, undefined, undefined, undefined, undefined, svgDOMNode),
            attrs = {
                width: width,
                height: height
            };
        if (wrappedInstance) {
            wrappedInstance.attr(attrs, null);
            wrappedInstance._setup();
            return wrappedInstance;
        }
        this.attr(attrs, null);
        this._setup();
    };

    setPrototypeOf(SVGDoc, SVG);

    SVGDoc.prototype = Object.create(SVG.prototype);

    SVGDoc.prototype.constructor = SVGDoc;

    Vector.merge(SVGDoc, {

        domInterface: window.SVGSVGElement

    });

    Vector.merge(SVGDoc.prototype, {

        tag: "svg",

        // Namespace of all the attributes is null
        _defaultAttrValues: Vector.merge(Vector.merge({}, SVGDoc.prototype._defaultAttrValues), {

            /**
             * If width and height attributes are not present, then
             *       1. if viewbox attribute is not present, then default values of width and height = 300x150
             *       2. if viewbox attribute is present, then values of width and height = 100%x100%
             * So for this conflicts just use 100%x100%
             */
            width: "100%",

            height: "100%"

        }),

        _setup: function() {
            var domElem = this._domElement;

            Vector.setAttribute(domElem, "version", "1.1", null);
            // setting "xmlns" attribute by setAttributeNS() method throws exception.
            domElem.setAttribute("xmlns", Vector.ns.svg);
            Vector.setAttribute(domElem, "xmlns:xlink", Vector.ns.xlink, Vector.ns.xml);
            this.defs();
        },


        /**
         * It does nothing if container value is undefined, null, number, boolean, symbol,
         * or any others object other than HTML dom element.
         * @param container string id or HTML dom element
         * @returns {SVGDoc}
         */
        container: function(container) {
            // The parent of outermost <svg> element
            // can only be a html element.
            if (container instanceof window.HTMLElement) {
                container.appendChild(this._domElement);
            } else if (typeof container === "string") {
                return this.container(document.getElementById(container));
            }
            return this;
        },

        /**
         * Only one <defs> element for every SVG document,
         * this can be access by anyElem.doc().defs()
         * @returns {*}
         */
        defs: function() {
            var defsElem = this._getDefsElement();
            if (defsElem)
                return defsElem;
            else
                return this._createDefsElement();
        },

        _getDefsElement: function() {
            var children = this.children(),
                length = children.length,
                i = 0;

            for (; i < length; ++i) {
                if (children[i].node() instanceof window.SVGDefsElement)
                    return new Defs(children[i].node());
            }
            return null;
        },

        _createDefsElement: function() {
            var defs = new Defs();
            this.append(defs);
            return defs;
        }

    });

    /**
     * Wrapper for SVGGElement native interface
     *
     * It can wrap SVGGElement elements
     *
     * If svgDOMNode is wrapped by Vector.G's super class then
     * it removes that wrapper and returns a new Vector.G wrapper.
     * To get a appropriate wrapper please use Vector.wrap() method.
     *
     * @type {Vector.G}
     */
    var G = Vector.G = function G(svgDOMNode) {
        var wrappedInstance = Graphics.call(this, svgDOMNode);
        if (wrappedInstance)
            return wrappedInstance;
    };

    setPrototypeOf(G, Graphics);

    G.prototype = Object.create(Graphics.prototype);

    G.prototype.constructor = G;

    Vector.merge(G, {

        domInterface: window.SVGGElement

    });

    Vector.merge(G.prototype, {

        tag: "g",

        // Namespace of all the attributes is null
        _defaultAttrValues: Vector.merge(Vector.merge({}, G.prototype._defaultAttrValues), {

        })
    });

    ShapeContainer.makeInheritance(G);
    StructuralContainer.makeInheritance(G);

    /**
     * Wrapper for SVGDefsElement native interface
     *
     * It can wrap SVGDefsElement elements
     *
     * If svgDOMNode is wrapped by Vector.Defs's super class then
     * it removes that wrapper and returns a new Vector.Defs wrapper.
     * To get a appropriate wrapper please use Vector.wrap() method.
     *
     * @type {Vector.Defs}
     */
    var Defs = Vector.Defs = function Defs(svgDOMNode) {
        var wrappedInstance = Graphics.call(this, svgDOMNode);
        if (wrappedInstance)
            return wrappedInstance;
    };

    setPrototypeOf(Defs, Graphics);

    Defs.prototype = Object.create(Graphics.prototype);

    Defs.prototype.constructor = Defs;

    Vector.merge(Defs, {

        domInterface: window.SVGDefsElement

    });

    Vector.merge(Defs.prototype, {

        tag: "defs",

        // Namespace of all the attributes is null
        _defaultAttrValues: Vector.merge(Vector.merge({}, Defs.prototype._defaultAttrValues), {

        })
    });

    ShapeContainer.makeInheritance(Defs);
    StructuralContainer.makeInheritance(Defs);

    /**
     * Wrapper for SVGSymbolElement native interface
     *
     * It can wrap SVGSymbolElement elements
     *
     * If svgDOMNode is wrapped by Vector.Symbol's super class then
     * it removes that wrapper and returns a new Vector.Symbol wrapper.
     * To get a appropriate wrapper please use Vector.wrap() method.
     *
     * @type {Vector.Symbol}
     */
    var Symbol = Vector.Symbol = function Symbol(svgDOMNode) {
        var wrappedInstance = Element.call(this, svgDOMNode);
        if (wrappedInstance)
            return wrappedInstance;
    };

    setPrototypeOf(Symbol, Element);

    Symbol.prototype = Object.create(Element.prototype);

    Symbol.prototype.constructor = Symbol;

    Vector.merge(Symbol, {

        domInterface: window.SVGSymbolElement

    });

    Vector.merge(Symbol.prototype, {

        tag: "symbol",

        // Namespace of all the attributes is null
        _defaultAttrValues: Vector.merge(Vector.merge({}, Symbol.prototype._defaultAttrValues), {

            preserveAspectRatio: "xMidYMid meet"

        }),

        viewBox: function(viewBox) {
            return this._setAttrGetterSetter("viewBox", viewBox);
        },

        aspectRatio: function(aspectRatio) {
            return this._setAttrGetterSetter("preserveAspectRatio", aspectRatio);
        }

    });

    ShapeContainer.makeInheritance(Symbol);
    StructuralContainer.makeInheritance(Symbol);

    /**
     * Wrapper for SVGUseElement native interface
     *
     * It can wrap SVGUseElement elements
     *
     * If svgDOMNode is wrapped by Vector.Use's super class then
     * it removes that wrapper and returns a new Vector.Use wrapper.
     * To get a appropriate wrapper please use Vector.wrap() method.
     *
     * @type {Vector.Use}
     */
    var Use = Vector.Use = function Use(elem, width, height, x, y, svgDOMNode) {
        var wrappedInstance = Graphics.call(this, svgDOMNode),
            attrs = {
                width: width,
                height: height,
                x: x,
                y: y
            };
        if (wrappedInstance) {
            wrappedInstance.attr(attrs, null);
            wrappedInstance.href(elem);
            return wrappedInstance;
        }
        this.attr(attrs, null);
        this.href(elem);
    };

    setPrototypeOf(Use, Graphics);

    Use.prototype = Object.create(Graphics.prototype);

    Use.prototype.constructor = Use;

    Vector.merge(Use, {

        domInterface: window.SVGUseElement

    });

    Vector.merge(Use.prototype, {

        tag: "use",

        // Namespace of all the attributes is null
        _defaultAttrValues: Vector.merge(Vector.merge({}, Use.prototype._defaultAttrValues), {

            x: "0",

            y: "0",

            width: "0",

            height: "0",

            href: "" // for SVG2 href attribute, not for xlink:href

        }),

        width: function(width) {
            return this._setAttrGetterSetter("width", width);
        },

        height: function(height) {
            return this._setAttrGetterSetter("height", height);
        },

        x: function(x) {
            return this._setAttrGetterSetter("x", x);
        },

        y: function(y) {
            return this._setAttrGetterSetter("y", y);
        },

        /**
         * gets and sets the href attribute value
         * @param element null, wrapper element, or URL
         * @returns {*}
         */
        href: function(element) {
            var href;
            if (element === undefined)
                return this.attr(["href"], Vector.ns.xlink).href;
            else if (element === null)
                return this.attr("href", null, Vector.ns.xlink);
            else if (element instanceof Element)
                href = "#" + element.id();
            else
                href = String(element);

            return this.attr("href", href, Vector.ns.xlink);
        }

    });

    Vector.merge(Element.prototype, {

        /**
         * Attach the binder function that will be called every time when
         * bind() method is called and the passed data to bind() function
         * to be passed to this binderFn argument.
         *
         * Note: at a time, a single binder function can be attached i.e. setting a new
         * binder replaces the previous one.
         * Pass null as first argument resets the binder function and sets it to null value.
         *
         * @param binderFn The binder function or null to reset
         * @param thisArg the this value of 'this' keyword, default value is current element object
         * @returns {Element}
         */
        binder: function(binderFn, thisArg) {
            if (binderFn === null) {
                this._binder = null;
                return this;
            }
            if (!isCallable(binderFn))
                throw new TypeError("Binder must be a callable");
            thisArg = isNullOrUndefined(thisArg) ? this : thisArg;
            this._binder = binderFn.bind(thisArg);
            return this;
        },

        /**
         * It calls the binder function with the specified data argument.
         * If the binder function is not set then it does nothing.
         *
         * @param data any data to be passed to te binder function
         * @returns {Element}
         */
        bind: function(data) {
            var binder = this._binder;
            if (!isCallable(binder))
                return this;
            binder(data);
            return this;
        }

    });

    Vector.merge(Element.prototype, {

        data: function() {

        }

    });





    return Vector;
});