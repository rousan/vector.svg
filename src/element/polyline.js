
/**
 * Wrapper for SVGPolylineElement native interface
 *
 * It can wrap SVGPolylineElement elements
 *
 * If svgDOMNode is wrapped by Vector.Polyline's super class then
 * it removes that wrapper and returns a new Vector.Polyline wrapper.
 * To get a appropriate wrapper please use Vector.wrap() method.
 *
 * @type {Vector.Polyline}
 */
var Polyline = Vector.Polyline = function Polyline(points, svgDOMNode) {
    var wrappedInstance = Geometry.call(this, svgDOMNode),
        attrs = {
            points: points
        };
    if (wrappedInstance) {
        wrappedInstance.attr(attrs, null);
        return wrappedInstance;
    }
    this.attr(attrs, null);
};

setPrototypeOf(Polyline, Geometry);

Polyline.prototype = Object.create(Geometry.prototype);

Polyline.prototype.constructor = Polyline;

Vector.merge(Polyline, {

    domInterface: window.SVGPolylineElement

});

Vector.merge(Polyline.prototype, {

    tag: "polyline",

    // Namespace of all the attributes is null
    _defaultAttrValues: Vector.merge(Vector.merge({}, Polyline.prototype._defaultAttrValues), {

        points: ""

    }),

    points: function (points) {
        return this._setAttrGetterSetter("points", points);
    }

});