
/**
 * Wrapper for SVGPolygonElement native interface
 *
 * It can wrap SVGPolygonElement elements
 *
 * If svgDOMNode is wrapped by Vector.Polygon's super class then
 * it removes that wrapper and returns a new Vector.Polygon wrapper.
 * To get a appropriate wrapper please use Vector.wrap() method.
 *
 * @type {Vector.Polygon}
 */
var Polygon = Vector.Polygon = function Polygon(points, svgDOMNode) {
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

setPrototypeOf(Polygon, Geometry);

Polygon.prototype = Object.create(Geometry.prototype);

Polygon.prototype.constructor = Polygon;

Vector.merge(Polygon, {

    domInterface: window.SVGPolygonElement

});

Vector.merge(Polygon.prototype, {

    tag: "polygon",

    // Namespace of all the attributes is null
    _defaultAttrValues: Vector.merge(Vector.merge({}, Polygon.prototype._defaultAttrValues), {

        points: ""

    }),

    points: function (points) {
        return this._setAttrGetterSetter("points", points);
    }

});