
/**
 * Wrapper for SVGGraphicsElement native interface
 *
 * It can wrap SVGElement elements
 *
 * If svgDOMNode is wrapped by Vector.Graphics's super class then
 * it removes that wrapper and returns a new Vector.Graphics wrapper.
 * To get a appropriate wrapper please use Vector.wrap() method.
 *
 * @type {Vector.Graphics}
 */
var Graphics = Vector.Graphics = function Graphics(svgDOMNode) {
    var wrappedInstance = Element.call(this, svgDOMNode);
    if (wrappedInstance)
        return wrappedInstance;
};

setPrototypeOf(Graphics, Element);

Graphics.prototype = create(Element.prototype);

Graphics.prototype.constructor = Graphics;

Vector.merge(Graphics, {

    /**
     * Some browsers does not support SVGGraphicsElement interface at all
     */
    domInterface: window.SVGElement

});

Vector.merge(Graphics.prototype, {

    tag: null,

    // Namespace of all the attributes is null
    _defaultAttrValues: Vector.merge(Vector.merge({}, Graphics.prototype._defaultAttrValues), {

        // Add here SVGGraphicsElement interface specific attribute's default values

    })

});