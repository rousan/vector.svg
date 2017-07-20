/**
 *
 * This type of container contains shape elements
 * i.e Path, Rect, Circle etc.
 *
 * @constructor
 */
var ShapeContainer = function () {};

setPrototypeOf(ShapeContainer, Container);

ShapeContainer.prototype = Object.create(Container.prototype);

ShapeContainer.prototype.constructor = ShapeContainer;

ShapeContainer.prototype.exports = {};

Vector.merge(ShapeContainer.prototype.exports, {

    rect: function (width, height, x, y, rx, ry) {
        var wrapper = new Rect(width, height, x, y, rx, ry);
        this.node().appendChild(wrapper.node());
        return wrapper;
    },

    circle: function (r, cx, cy) {
        var wrapper = new Circle(r, cx, cy);
        this.node().appendChild(wrapper.node());
        return wrapper;
    },

    ellipse: function (rx, ry, cx, cy) {
        var wrapper = new Ellipse(rx, ry, cx, cy);
        this.node().appendChild(wrapper.node());
        return wrapper;
    },

    line: function (x1, y1, x2, y2) {
        var wrapper = new Line(x1, y1, x2, y2);
        this.node().appendChild(wrapper.node());
        return wrapper;
    },

    path: function (d) {
        var wrapper = new Path(d);
        this.node().appendChild(wrapper.node());
        return wrapper;
    },

    polygon: function (points) {
        var wrapper = new Polygon(points);
        this.node().appendChild(wrapper.node());
        return wrapper;
    },

    polyline: function (points) {
        var wrapper = new Polyline(points);
        this.node().appendChild(wrapper.node());
        return wrapper;
    }

});