
/**
 * Wrapper for SVGLineElement native interface
 *
 * It can wrap SVGLineElement elements
 *
 * If svgDOMNode is wrapped by Vector.Line's super class then
 * it removes that wrapper and returns a new Vector.Line wrapper.
 * To get a appropriate wrapper please use Vector.wrap() method.
 *
 * @type {Vector.Line}
 */
var Line = Vector.Line = function Line(x1, y1, x2, y2, svgDOMNode) {
    var wrappedInstance = Geometry.call(this, svgDOMNode),
        attrs = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        };
    if (wrappedInstance) {
        wrappedInstance.attr(attrs, null);
        return wrappedInstance;
    }
    this.attr(attrs, null);
};

setPrototypeOf(Line, Geometry);

Line.prototype = Object.create(Geometry.prototype);

Line.prototype.constructor = Line;

Vector.merge(Line, {

    domInterface: window.SVGLineElement

});

Vector.merge(Line.prototype, {

    tag: "line",

    // Namespace of all the attributes is null
    _defaultAttrValues: Vector.merge(Vector.merge({}, Line.prototype._defaultAttrValues), {

        x1: "0",

        y1: "0",

        x2: "0",

        y2: "0"

    }),

    x1: function (x1) {
        return this._setAttrGetterSetter("x1", x1);
    },

    y1: function (y1) {
        return this._setAttrGetterSetter("y1", y1);
    },

    x2: function (x2) {
        return this._setAttrGetterSetter("x2", x2);
    },

    y2: function (y2) {
        return this._setAttrGetterSetter("y2", y2);
    },

    from: function (x1, y1) {
        if (x1 === undefined && y1 === undefined) {
            return {
                x: this.x1(),
                y: this.y1()
            };
        }

        if (x1 !== undefined)
            this.x1(x1);
        if (y1 !== undefined)
            this.y1(y1);

        return this;
    },

    to: function (x2, y2) {
        if (x2 === undefined && y2 === undefined) {
            return {
                x: this.x2(),
                y: this.y2()
            };
        }

        if (x2 !== undefined)
            this.x2(x2);
        if (y2 !== undefined)
            this.y2(y2);

        return this;
    }

});