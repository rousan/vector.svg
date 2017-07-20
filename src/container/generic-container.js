
/**
 * This type of container provides capability of
 * adding any svg element as Element wrapper class.
 * This Interface is useful when some svg element has no wrapper class implemented
 * in Vector.svg.
 *
 * In this case Element wrapper class is used as wrapper.
 *
 * @constructor
 */
var GenericContainer = function () {};

setPrototypeOf(GenericContainer, Container);

GenericContainer.prototype = Object.create(Container.prototype);

GenericContainer.prototype.constructor = GenericContainer;

GenericContainer.prototype.exports = {};

Vector.merge(GenericContainer.prototype.exports, {

    element: function (tagName) {
        var wrapper = new Element(Vector.createElement(tagName));
        this.node().appendChild(wrapper.node());
        return wrapper;
    }

});