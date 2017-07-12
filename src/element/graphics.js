
/**
 * Wrapper of SVGGraphicsElement class
 * @type {Vector.Graphics}
 */
var Graphics = Vector.Graphics = function Graphics() {
    Element.apply(this, slice.call(arguments));
};

setPrototypeOf(Graphics, Element);

Graphics.prototype = create(Element.prototype);

Graphics.prototype.constructor = Graphics;