
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

    width: function (width) {
        return this._setAttrGetterSetter("width", width);
    },

    height: function (height) {
        return this._setAttrGetterSetter("height", height);
    },

    x: function (x) {
        return this._setAttrGetterSetter("x", x);
    },

    y: function (y) {
        return this._setAttrGetterSetter("y", y);
    },

    /**
     * gets and sets the href attribute value
     * @param element null, wrapper element, or URL
     * @returns {*}
     */
    href: function (element) {
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