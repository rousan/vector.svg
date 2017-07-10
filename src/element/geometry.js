
var Geometry = Vector.Geometry = function Geometry() {
    Graphics.apply(this, slice.call(arguments));
};

setPrototypeOf(Geometry, Graphics);

Geometry.prototype = create(Graphics.prototype);

Geometry.prototype.constructor = Geometry;