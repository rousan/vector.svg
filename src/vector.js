
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
 * @returns target object
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
     * @returns SVGElement
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
     * @returns Vector
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
     * @returns Vector
     */
    setAttributes: function (svgDomNode, attrs, namespace) {
        Object.keys(attrs).forEach(function (attr) {
            Vector.setAttribute(svgDomNode, attr, attrs[attr], namespace);
        });
        return this;
    }

});