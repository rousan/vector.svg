
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

    // Namespace of all the attributes is null
    _defaultAttrValues: {

        "fill": "#000",

        "fill-opacity": "1",

        "stroke": "#000",

        "stroke-width": "0",

        "stroke-opacity": "1",

        "stroke-linecap" : "butt",

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
    _setAttrGetterSetter: function (attrName, newValue) {
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
    attr: function (params) {
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
                for(i = 0; i<length; ++i) {
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

        } else if(arguments.length === 2) {
            arg0 = arguments[0];
            arg1 = arguments[1];

            if (isArray(arg0)) {
                arg1 = isNullOrUndefined(arg1) ? null : arg1;
                return arg0.reduce(function (outs, attr) {
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
                Object.keys(arg0).forEach(function (attr) {
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

        } else if(arguments.length >= 3) {
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
    css: function () {

    },

    /**
     * If options is null then all the font attributes will be reset i.e. will be deleted.
     * if options is object then retrieve the attribute names and set them.
     * and for any others value of options, it returns a object containing the current values of font configs.
     *
     * @param options
     * @returns {*}
     */
    font: function (options) {
        var fontAttrs = ["font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight"],
            aliases = ["family", "size", "adjust", "stretch", "style", "variant", "weight"],
            i = 0,
            length = fontAttrs.length,
            values;

        if (options === null) {
            return this.attr(fontAttrs.reduce(function (attrs, attr) {
                attrs[attr] = null;
                return attrs;
            }, {}));

        } else if (isObject(options)) {
            i = 0;
            return this.attr(fontAttrs.reduce(function (attrs, attr) {
                var val = options[aliases[i]];
                i++;
                if (val !== undefined)
                    attrs[attr] = val;
                return attrs;
            }, {}));

        } else {
            values = this.attr(fontAttrs);
            i = 0;
            return aliases.reduce(function (outs, alias) {
                outs[alias] = values[fontAttrs[i]];
                i++;
                return outs;
            }, {});
        }
    },

    byId: function () {

    },

    query: function () {

    },

    queryAll: function () {

    },

    /**
     * Returns underlying DOM element.
     * Remember after creating a wrapper,
     * you should not change the underlying element,
     * if necessary then create a new wrapper.
     * @returns {*}
     */
    node: function () {
        return this._domElement;
    }
});


// It simplifies the raw value of attribute to a simplified form.
// and returns the formatted version.
var simplifyRawAttrValue = function (attrName, value, namespaceURI) {

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
            if (namespaceURI === Vector.ns.xlink) {
                match = regex.referenceAttrVal.exec(value);
            } else if (namespaceURI === null)
                match = regex.hrefAttrVal.exec(value);
            else
                return value;

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
var convertToRawAttrValue = function (attrName, value, namespaceURI) {

    attrName = String(attrName);
    namespaceURI = isNullOrUndefined(namespaceURI) ? null : namespaceURI;

    // For number, string, boolean and symbol(in ES6).
    // value can't be null or undefined due to it is handled previously
    if (!isObject(value))
        return String(value);

    switch (attrName) {

        // value can be array or array like object
        case "class":
            if(namespaceURI !== null)
                return value.toString();
            return Vector.unHoles(value).join(" ").trim();

        case "mask":
            if(namespaceURI !== null)
                return value.toString();
            //To do...
            return value.toString();

        default:
            return value.toString();
    }

};