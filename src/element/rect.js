
/**
 * Wrapper for SVGRectElement native interface
 *
 * It can wrap SVGRectElement elements
 *
 * If svgDOMNode is wrapped by Vector.Rect's super class then
 * it removes that wrapper and returns a new Vector.Rect wrapper.
 * To get a appropriate wrapper please use Vector.wrap() method.
 *
 * @type {Vector.Rect}
 */
var Rect = Vector.Rect = function Rect(width, height, x, y, rx, ry, svgDOMNode) {
    var wrappedInstance = Geometry.call(this, svgDOMNode),
        attrs = {
            width: width,
            height: height,
            x: x,
            y: y,
            rx: rx,
            ry: ry
        };
    if (wrappedInstance) {
        wrappedInstance.attr(attrs, null);
        return wrappedInstance;
    }
    this.attr(attrs, null);
};

setPrototypeOf(Rect, Geometry);

Rect.prototype = Object.create(Geometry.prototype);

Rect.prototype.constructor = Rect;

Vector.merge(Rect, {

    domInterface: window.SVGRectElement

});

Vector.merge(Rect.prototype, {

    tag: "rect"

});