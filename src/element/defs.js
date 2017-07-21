
/**
 * Wrapper for SVGDefsElement native interface
 *
 * It can wrap SVGDefsElement elements
 *
 * If svgDOMNode is wrapped by Vector.Defs's super class then
 * it removes that wrapper and returns a new Vector.Defs wrapper.
 * To get a appropriate wrapper please use Vector.wrap() method.
 *
 * @type {Vector.Defs}
 */
var Defs = Vector.Defs = function Defs(svgDOMNode) {
    var wrappedInstance = Graphics.call(this, svgDOMNode);
    if (wrappedInstance)
        return wrappedInstance;
};

setPrototypeOf(Defs, Graphics);

Defs.prototype = Object.create(Graphics.prototype);

Defs.prototype.constructor = Defs;

Vector.merge(Defs, {

    domInterface: window.SVGDefsElement

});

Vector.merge(Defs.prototype, {

    tag: "defs",

    // Namespace of all the attributes is null
    _defaultAttrValues: Vector.merge(Vector.merge({}, Defs.prototype._defaultAttrValues), {

    })
});

ShapeContainer.makeInheritance(Defs);
StructuralContainer.makeInheritance(Defs);