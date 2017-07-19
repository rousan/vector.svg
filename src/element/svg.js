
/**
 * Wrapper for SVGSVGElement native interface
 *
 * It can wrap SVGSVGElement elements
 *
 * If svgDOMNode is wrapped by Vector.SVG's super class then
 * it removes that wrapper and returns a new Vector.SVG wrapper.
 * To get a appropriate wrapper please use Vector.wrap() method.
 *
 * This class wraps normally inner <svg> element, but also can wrap outer most <svg> element.
 *
 * @type {Vector.SVG}
 */
var SVG = Vector.SVG = function SVG(width, height, x, y, svgDOMNode) {
    var wrappedInstance = Graphics.call(this, svgDOMNode),
        attrs = {
            width: width,
            height: height,
            x: x,
            y: y
        };
    if (wrappedInstance) {
        wrappedInstance.attr(attrs, null);
        return wrappedInstance;
    }
    this.attr(attrs, null);
};

setPrototypeOf(SVG, Graphics);

SVG.prototype = Object.create(Graphics.prototype);

SVG.prototype.constructor = SVG;

Vector.merge(SVG, {

    domInterface: window.SVGSVGElement

});

Vector.merge(SVG.prototype, {

    tag: "svg",

    // Namespace of all the attributes is null
    _defaultAttrValues: Vector.merge(Vector.merge({}, SVG.prototype._defaultAttrValues), {

        width: "100%",

        height: "100%",

        x: "0",

        y: "0",

        preserveAspectRatio: "xMidYMid meet"

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
    },

    viewBox: function (x, y, width, height) {
        var temp,
            viewBoxDefValue = this._getViewBoxDefValue(),
            currViewBox,
            viewBox;

        if (x === undefined && y === undefined && width === undefined && height === undefined) {
            viewBox = this.attr("viewBox");
            if (viewBox === null)
                return viewBoxDefValue;

            viewBox = viewBox.trim();
            temp = viewBox.split(regex.tokenSeparator);
            if (temp.length < 4)
                return viewBoxDefValue;
            x = temp[0];
            y = temp[1];
            width = temp[2];
            height = temp[3];

            x = +x;
            y = +y;
            width = +width;
            height = +height;

            // x-min and y-min can be negative
            if (!isFinite(x) || !isFinite(y) || !(isFinite(width) && width >=0) || !(isFinite(height) && height >=0))
                return viewBoxDefValue;

            return {
                x: x,
                y: y,
                width: width,
                height: height
            }
        }

        if (isObject(x)) {
            temp = x;
            x = temp.x;
            y = temp.y;
            width = temp.width;
            height = temp.height;
        }

        currViewBox = this.viewBox();

        if (x === undefined)
            x = currViewBox.x;
        if (y === undefined)
            y = currViewBox.y;
        if (width === undefined)
            width = currViewBox.width;
        if (height === undefined)
            height = currViewBox.height;

        x = +x;
        y = +y;
        width = +width;
        height = +height;

        // If these values are not finite (i.e. NaN, Infinite or -Infinite) then no problem browser will handle it.
        viewBox = x + " " + y + " " + width + " " + height;
        this.attr("viewBox", viewBox);

        return this;
    },

    _getViewBoxDefValue: function () {
        // The default values of width and height for outer <svg> is 300x150
        // and for inner <svg> it is 100%x100%.
        var widthDefValue = parseFloat(this._defaultAttrValues.width),
            heightDefValue = parseFloat(this._defaultAttrValues.height),
            width,
            height;

        width = this.width();
        height = this.height();

        width = parseFloat(width);
        height = parseFloat(height);
        if (!(isFinite(width) && width >= 0))
            width = widthDefValue;
        if (!(isFinite(height) && height >= 0))
            height = heightDefValue;

        return {
            x: 0,
            y: 0,
            width: width,
            height: height
        };
    },

    /**
     * Sets and gets 'preserveAspectRatio' attribute value
     *
     * @param aspectRatio
     * @returns {*}
     */
    aspectRatio: function (aspectRatio) {
        return this._setAttrGetterSetter("preserveAspectRatio", aspectRatio);
    }

});

Container.makeInheritance(SVG);
ShapeContainer.makeInheritance(SVG);