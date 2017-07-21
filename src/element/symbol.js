
/**
 * Wrapper for SVGSymbolElement native interface
 *
 * It can wrap SVGSymbolElement elements
 *
 * If svgDOMNode is wrapped by Vector.Symbol's super class then
 * it removes that wrapper and returns a new Vector.Symbol wrapper.
 * To get a appropriate wrapper please use Vector.wrap() method.
 *
 * @type {Vector.Symbol}
 */
var Symbol = Vector.Symbol = function Symbol(svgDOMNode) {
    var wrappedInstance = Element.call(this, svgDOMNode);
    if (wrappedInstance)
        return wrappedInstance;
};

setPrototypeOf(Symbol, Element);

Symbol.prototype = Object.create(Element.prototype);

Symbol.prototype.constructor = Symbol;

Vector.merge(Symbol, {

    domInterface: window.SVGSymbolElement

});

Vector.merge(Symbol.prototype, {

    tag: "symbol",

    // Namespace of all the attributes is null
    _defaultAttrValues: Vector.merge(Vector.merge({}, Symbol.prototype._defaultAttrValues), {

        preserveAspectRatio: "xMidYMid meet"

    }),

    viewBox: function (viewBox) {
        return this._setAttrGetterSetter("viewBox", viewBox);
    },

    aspectRatio: function (aspectRatio) {
        return this._setAttrGetterSetter("preserveAspectRatio", aspectRatio);
    }

});

ShapeContainer.makeInheritance(Symbol);
StructuralContainer.makeInheritance(Symbol);