
var Rect = Vector.Rect = function Rect(width, height, x, y, rx, ry) {
    Geometry.apply(this, []);
    var elem = Vector.createElement(this.tag);
    Vector.setAttributes(elem, {
        width: width,
        height: height,
        x: x,
        y: y,
        rx: rx,
        ry: ry
    }, null);
    this._domElement = elem;
    elem._wrapElement = this;
};

setPrototypeOf(Rect, Geometry);

Rect.prototype = Object.create(Geometry.prototype);

Rect.prototype.constructor = Rect;

Vector.merge(Rect.prototype, {

    tag: "rect"

});