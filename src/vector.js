
/**
 * @param container
 * @constructor
 */
var Vector = function (container) {

};

/**
 * This method copies all own properties(enumerable and non-enumerable)
 * carefully with descriptors from source objects to target and merges them.
 * It does not make deep copy of properties.
 *
 * @param target object which will be merged by sources
 * @return target object
 */
Vector.merge = function (target) {
    if (isNullOrUndefined(target))
        throw new TypeError("Target object can't be null or undefined");
    target = Object(target);
    var i,
        source,
        descriptors;

    for(i = 1; i<arguments.length; ++i) {
        source = arguments[i];
        if (isNullOrUndefined(source))
            continue;
        source = Object(source);
        descriptors = Object.getOwnPropertyNames(source).reduce(function (descriptors, nextKey) {
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
    createElement: function (tagName) {
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
    setAttribute: function (svgDomNode, name, value, namespace) {
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
    setAttributes: function (svgDomNode, attrs, namespace) {
        Object.keys(attrs).forEach(function (attr) {
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
    hasAttribute: function (svgDomNode, name, namespace) {
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
    getAttribute: function (svgDomNode, name, namespace) {
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
    removeAttribute: function (svgDomNode, name, namespace) {
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
    unique: function (arr) {
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

        for(; i<ln; ++i) {
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
        extIndex.forEach(function (index) {
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
    wrap: function (svgDOMNode) {
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
            default:
                return new Element(svgDOMNode);
        }
    },

    /**
     * Check if a DOM element object is wrapped or not
     * @param svgDOMNode
     * @returns {boolean}
     */
    isWrapped: function (svgDOMNode) {
        if(!isObject(svgDOMNode))
            return false;
        var wrapper = svgDOMNode["_wrappingElement"];
        return wrapper instanceof Element && svgDOMNode instanceof wrapper.constructor.domInterface && wrapper["_domElement"] === svgDOMNode;
    },

    /**
     * It converts any value to Integer length [Positive Integer value]
     * @param value
     * @returns {number}
     */
    toIntLength: function (value) {
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
    unHoles: function (arr) {
        if (isNullOrUndefined(arr))
            return [];

        arr = Object(arr);
        return reduce.call(arr, function (acc, next) {
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
    points: function (pointsString) {
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

        for(; i < coords; i+=2) {
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
    pointString: function (pointList) {
        if(!isObject(pointList))
            pointList = Vector.points(pointList);
        return reduce.call(pointList, function (outs, point) {
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

    distance: function (x1, y1, x2, y2) {
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

