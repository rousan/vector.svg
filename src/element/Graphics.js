
var Graphics = Vector.Graphics = function Graphics() {
    Element.apply(this, slice.call(arguments));
};



Graphics.prototype = create(Element.prototype);

Graphics.prototype.constructor = Graphics;

