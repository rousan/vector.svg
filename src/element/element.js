
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
    attr: function (params) {
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
                for(; i<length; ++i) {
                    attr = attrs.item(i);
                    if (attr === null)
                        continue;
                    outs[attr.localName] = simplifyRawAttrValue(attr.localName, attr.value, attr.namespaceURI);
                }

                // IE 5.5 returns a key-value pair instead of NamedNodeMap
            } else {
                Object.keys(attrs).forEach(function (attr) {
                    outs[attr] = simplifyRawAttrValue(attr, attrs[attr], null);
                });
            }

            return outs;
        }
    },

    byId: function () {

    },

    query: function () {

    },

    queryAll: function () {

    }
});


// It simplifies the raw value of attribute to a simplified form.
// and returns the formatted version.
var simplifyRawAttrValue = function (attrName, value, namespaceURI) {

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