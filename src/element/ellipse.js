
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

    rx: function (rx) {
        return this._setAttrGetterSetter("rx", rx);
    },

    ry: function (ry) {
        return this._setAttrGetterSetter("ry", ry);
    },

    cx: function (cx) {
        return this._setAttrGetterSetter("cx", cx);
    },

    cy: function (cy) {
        return this._setAttrGetterSetter("cy", cy);
    }

});