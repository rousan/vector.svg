
/**
 *
 * This type of container contains structural elements
 * i.e <defs>, <g>, <svg>, <symbol>, <use>
 *
 * Note: Only SVGDoc wrapper can contain <defs> element.
 *
 * @constructor
 */
var StructuralContainer = function () {};

setPrototypeOf(StructuralContainer, Container);

StructuralContainer.prototype = Object.create(Container.prototype);

StructuralContainer.prototype.constructor = StructuralContainer;

StructuralContainer.prototype.exports = {};

Vector.merge(StructuralContainer.prototype.exports, {

    g: function () {
        var wrapper = new G();
        this.node().appendChild(wrapper.node());
        return wrapper;
    },

    svg: function (width, height, x, y) {
        var wrapper = new SVG(width, height, x, y);
        this.node().appendChild(wrapper.node());
        return wrapper;
    },

    symbol: function () {
        var wrapper = new Symbol();
        this.node().appendChild(wrapper.node());
        return wrapper;
    },

    use: function (elem, width, height, x, y) {
        var wrapper = new Use(elem, width, height, x, y);
        this.node().appendChild(wrapper.node());
        return wrapper;
    }

});