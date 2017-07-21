
/**
 * Wrapper for SVGGElement native interface
 *
 * It can wrap SVGGElement elements
 *
 * If svgDOMNode is wrapped by Vector.G's super class then
 * it removes that wrapper and returns a new Vector.G wrapper.
 * To get a appropriate wrapper please use Vector.wrap() method.
 *
 * @type {Vector.G}
 */
var G = Vector.G = function G(svgDOMNode) {
    var wrappedInstance = Graphics.call(this, svgDOMNode);
    if (wrappedInstance)
        return wrappedInstance;
};

setPrototypeOf(G, Graphics);

G.prototype = Object.create(Graphics.prototype);

G.prototype.constructor = G;

Vector.merge(G, {

    domInterface: window.SVGGElement

});

Vector.merge(G.prototype, {

    tag: "g",

    // Namespace of all the attributes is null
    _defaultAttrValues: Vector.merge(Vector.merge({}, G.prototype._defaultAttrValues), {

    })
});

ShapeContainer.makeInheritance(G);
StructuralContainer.makeInheritance(G);