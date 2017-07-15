
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

    r: function (r) {
        return this._setAttrGetterSetter("r", r);
    },

    cx: function (cx) {
        return this._setAttrGetterSetter("cx", cx);
    },

    cy: function (cy) {
        return this._setAttrGetterSetter("cy", cy);
    }

});