
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

    tag: "rect",

    // Namespace of all the attributes is null
    _defaultAttrValues: Vector.merge(Vector.merge({}, Rect.prototype._defaultAttrValues), {

        width: "0",

        height: "0",

        x: "0",

        y: "0",

        rx: "0",

        ry: "0"

    }),

    width: function (width) {
        return this._setAttrGetterSetter("width", width);
    },

    height: function (height) {
        return this._setAttrGetterSetter("height", height);
    },

    x: function (x) {
        return this._setAttrGetterSetter("x", x);
    },

    y: function (y) {
        return this._setAttrGetterSetter("y", y);
    },

    rx: function (rx) {
        return this._setAttrGetterSetter("rx", rx);
    },

    ry: function (ry) {
        return this._setAttrGetterSetter("ry", ry);
    },

    size: function (width, height) {
        if (width === undefined && height === undefined) {
            return {
                width: this.width(),
                height: this.height()
            };
        }
        if (width !== undefined)
            this.width(width);
        if (height !== undefined)
            this.height(height);

        return this;
    }

});