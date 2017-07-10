
/**
 * Base class for all the SVG DOM wrapper elements.
 */
var Element = Vector.Element = function Element() {
    this._domElement = null;
};

Element.prototype.on = function () {
    if (this._domElement === null)
        return;
    EventTarget.prototype.addEventListener.apply(this._domElement, slice.call(arguments));
};

