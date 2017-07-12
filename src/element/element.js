
/**
 * Base class for all the SVG DOM wrapper elements.
 */
var Element = Vector.Element = function Element() {
    this._domElement = null;
    this._events = {};
};

Vector.merge(Element.prototype, {

    byId: function () {

    },

    query: function () {

    },

    queryAll: function () {

    }
});