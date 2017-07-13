
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

        xhtml: xhtmlNS
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
     * @return Vector
     */
    setAttribute: function (svgDomNode, name, value, namespace) {
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
    setAttributes: function (svgDomNode, attrs, namespace) {
        Object.keys(attrs).forEach(function (attr) {
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
    unique: function (arr) {
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

        for(; i<ln; ++i) {
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
    }

});

