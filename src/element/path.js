
/**
 * Wrapper for SVGPathElement native interface
 *
 * It can wrap SVGPathElement elements
 *
 * If svgDOMNode is wrapped by Vector.Path's super class then
 * it removes that wrapper and returns a new Vector.Path wrapper.
 * To get a appropriate wrapper please use Vector.wrap() method.
 *
 * @type {Vector.Path}
 */
var Path = Vector.Path = function Path(d, svgDOMNode) {
    var wrappedInstance = Geometry.call(this, svgDOMNode),
        attrs = {
            d: d
        };
    if (wrappedInstance) {
        wrappedInstance.attr(attrs, null);
        return wrappedInstance;
    }
    this.attr(attrs, null);
};

setPrototypeOf(Path, Geometry);

Path.prototype = Object.create(Geometry.prototype);

Path.prototype.constructor = Path;

Vector.merge(Path, {

    domInterface: window.SVGPathElement

});

Vector.merge(Path.prototype, {

    tag: "path",

    // Namespace of all the attributes is null
    _defaultAttrValues: Vector.merge(Vector.merge({}, Path.prototype._defaultAttrValues), {

        d: ""

    }),

    d: function (d) {
        return this._setAttrGetterSetter("d", d);
    }

});