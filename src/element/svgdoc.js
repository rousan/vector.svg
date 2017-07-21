
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
        this.defs();
    },


    /**
     * It does nothing if container value is undefined, null, number, boolean, symbol,
     * or any others object other than HTML dom element.
     * @param container string id or HTML dom element
     * @returns {SVGDoc}
     */
    container: function (container) {
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
    defs: function () {
        var defsElem = this._getDefsElement();
        if (defsElem)
            return defsElem;
        else
            return this._createDefsElement();
    },

    _getDefsElement: function () {
        var children = this.children(),
            length = children.length,
            i = 0;

        for(; i<length; ++i) {
            if (children[i].node() instanceof window.SVGDefsElement)
                return new Defs(children[i].node());
        }
        return null;
    },

    _createDefsElement: function () {
        var defs = new Defs();
        this.append(defs);
        return defs;
    }

});