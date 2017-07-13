
/**
 * Wrapper class for <rect> svg element
 * @type {Vector.Rect}
 */
var Rect = Vector.Rect = function Rect(width, height, x, y, rx, ry, rectSVGDom) {
    Geometry.apply(this, []);
    var newInstance = Rect.construct(this, rectSVGDom);
    newInstance.attr({
        width: width,
        height: height,
        x: x,
        y: y,
        rx: rx,
        ry: ry
    }, null);

    return newInstance;
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