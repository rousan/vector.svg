
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

    _setup: function () {
        var domElem = this._domElement;

        Vector.setAttribute(domElem, "version", "1.1", null);
        // setting "xmlns" attribute by setAttributeNS() method throws exception.
        domElem.setAttribute("xmlns", Vector.ns.svg);
        Vector.setAttribute(domElem, "xmlns:xlink", Vector.ns.xlink, Vector.ns.xml);
    }

});