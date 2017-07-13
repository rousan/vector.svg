
/**
 * Wrapper for SVGGeometryElement interface
 *
 * It can wrap SVGElement elements
 *
 * If svgDOMNode is wrapped by Vector.Geometry's super class then
 * it removes that wrapper and returns a new Vector.Geometry wrapper.
 * To get a appropriate wrapper please use Vector.wrap() method.
 *
 * @type {Vector.Geometry}
 */
var Geometry = Vector.Geometry = function Geometry(svgDOMNode) {
    var wrappedInstance = Graphics.call(this, svgDOMNode);
    if (wrappedInstance)
        return wrappedInstance;
};

setPrototypeOf(Geometry, Graphics);

Geometry.prototype = create(Graphics.prototype);

Geometry.prototype.constructor = Geometry;

Vector.merge(Graphics, {

    /**
     * Some browsers does not support SVGGeometryElement interface at all
     */
    domInterface: window.SVGElement

});

Vector.merge(Graphics.prototype, {

    tag: null

});