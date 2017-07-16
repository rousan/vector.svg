
/**
 * Wrapper for SVGGeometryElement interface
 *
 * It can wrap SVGElement elements
 *
 * If svgDOMNode is wrapped by Vector.Geometry's super class then
 * it removes that wrapper and returns a new Vector.Geometry wrapper.
 * To get a appropriate wrapper please use Vector.wrap() method.
 *
 * @type {Vector.Geometry}
 */
var Geometry = Vector.Geometry = function Geometry(svgDOMNode) {
    var wrappedInstance = Graphics.call(this, svgDOMNode);
    if (wrappedInstance)
        return wrappedInstance;
};

setPrototypeOf(Geometry, Graphics);

Geometry.prototype = create(Graphics.prototype);

Geometry.prototype.constructor = Geometry;

Vector.merge(Geometry, {

    /**
     * Some browsers does not support SVGGeometryElement interface at all
     */
    domInterface: window.SVGElement

});

Vector.merge(Geometry.prototype, {

    tag: null,

    // Namespace of all the attributes is null
    _defaultAttrValues: Vector.merge(Vector.merge({}, Geometry.prototype._defaultAttrValues), {

        pathLength: "0"

    }),

    pathLength: function (pathLength) {
        return this._setAttrGetterSetter("pathLength", pathLength);
    },

    length: function () {
        var node = this._domElement,
            defaultLength = 0;

        switch (node.constructor) {
            case Path.domInterface:
                return getTotalLengthOfPath(node);
            case Rect.domInterface:
                return getTotalLengthOfRect(node);
            case Circle.domInterface:
                return getTotalLengthOfCircle(node);
            case Ellipse.domInterface:
                return getTotalLengthOfEllipse(node);
            case Line.domInterface:
                return getTotalLengthOfLine(node);
            case Polyline.domInterface:
                return getTotalLengthOfPolyline(node);
            case Polygon.domInterface:
                return getTotalLengthOfPolygon(node);
            default:
                return defaultLength;
        }
    }

});

var getTotalLengthOfPath = function (pathDOMNode) {

    // getTotalLength() method was added to SVGPathElement interface in SVG 1.1,
    // but in SVG 2, this method was moved to SVGGeometryElement interface (In SVG 1.1
    // there was no SVGGeometryElement interface).
    // So ultimately SVGPathElement instance can access getTotalLength() method directly or by prototype chain
    // in both environment SVG 1.1 and SVG 2.
    return pathDOMNode.getTotalLength();
};

var getTotalLengthOfRect = function (rectDOMNode) {
    var bbox,
        defValueWidth = 0,
        width,
        height,
        defValueHeight = 0;

    // SVG2: Approach 1
    //
    // In SVG 2, getTotalLength() method was added to SVGGeometryElement new interface.
    // and Some browsers implement all shape interfaces(i.e. SVGPathElement,
    // SVGRectElement, SVGCircleElement etc) extends SVGGeometryElement,
    // but some browsers did not implement this i.e. in firefox.
    // So use getTotalLength() if it is available for better result.
    if (isCallable(rectDOMNode["getTotalLength"])) {
        return rectDOMNode.getTotalLength();
    }

    // SVG2: Approach 2
    //
    // SVGGraphicsElement interface was added to SVG 2,
    // So getBBox() method is available in SVG 2,
    //
    // In firefox getBBox() method returns an empty SVGRect when
    // value of 'width' or 'height' attribute is zero or invalid or does not exist,
    // see bug https://bugzilla.mozilla.org/show_bug.cgi?id=1019326
    if (isFirefox()) {
        if (Vector.hasAttribute(rectDOMNode, "width", null) && Vector.hasAttribute(rectDOMNode, "height", null)) {
            width = parseFloat(Vector.getAttribute(rectDOMNode, "width", null));
            height = parseFloat(Vector.getAttribute(rectDOMNode, "height", null));

            if (isFinite(width) && width > 0 && isFinite(height) && height > 0) {
                if (isCallable(rectDOMNode["getBBox"])) {
                    bbox = rectDOMNode.getBBox();
                    return 2 * (bbox.width + bbox.height);
                }
            }
        }

    } else {
        if (isCallable(rectDOMNode["getBBox"])) {
            bbox = rectDOMNode.getBBox();
            return 2 * (bbox.width + bbox.height);
        }
    }

    // Otherwise for SVG 1.1 and for Firefox fallback
    //
    // It extracts the number from attribute value.
    // If the attribute value is like "50%", or "50px", or "50xyz",
    // then it will assume its value is 50, so here percent is ignored.
    // But it is not recommended, later it will be corrected.
    if (Vector.hasAttribute(rectDOMNode, "width", null))
        width = Vector.getAttribute(rectDOMNode, "width", null);
    else
        width = defValueWidth;

    if (Vector.hasAttribute(rectDOMNode, "height", null))
        height = Vector.getAttribute(rectDOMNode, "height", null);
    else
        height = defValueHeight;

    width = parseFloat(width);
    height = parseFloat(height);
    if (!(isFinite(width) && width >= 0))
        width = defValueWidth;
    if (!(isFinite(height) && height >= 0))
        height = defValueHeight;

    return 2 * (width + height);
};

var getTotalLengthOfCircle = function (circleDOMNode) {
    var bbox,
        defValueRadius = 0,
        r;

    // SVG2: Approach 1
    //
    // In SVG 2, getTotalLength() method was added to SVGGeometryElement new interface.
    // and Some browsers implement all shape interfaces(i.e. SVGPathElement,
    // SVGRectElement, SVGCircleElement etc) extends SVGGeometryElement,
    // but some browsers did not implement this i.e. in firefox.
    // So use getTotalLength() if it is available for better result.
    if (isCallable(circleDOMNode["getTotalLength"])) {
        return circleDOMNode.getTotalLength();
    }

    // SVG2: Approach 2
    //
    // SVGGraphicsElement interface was added to SVG 2,
    // So getBBox() method is available in SVG 2,
    if (isCallable(circleDOMNode["getBBox"])) {
        bbox = circleDOMNode.getBBox();
        r = bbox.width / 2;
        return 2 * Math.PI * r;
    }

    // Otherwise for SVG 1.1
    //
    // It extracts the number from attribute value.
    // If the attribute value is like "50%", or "50px", or "50xyz",
    // then it will assume its value is 50, so here percent is ignored.
    // But it is not recommended, later it will be corrected.
    if (Vector.hasAttribute(circleDOMNode, "r", null))
        r = Vector.getAttribute(circleDOMNode, "r", null);
    else
        r = defValueRadius;

    r = parseFloat(r);
    if (!(isFinite(r) && r >= 0))
        r = defValueRadius;

    return 2 * Math.PI * r;
};

var getTotalLengthOfEllipse = function (ellipseDOMNode) {
    var bbox,
        defValueXRadius = 0,
        rx,
        ry,
        defValueYRadius = 0;

    // SVG2: Approach 1
    //
    // In SVG 2, getTotalLength() method was added to SVGGeometryElement new interface.
    // and Some browsers implement all shape interfaces(i.e. SVGPathElement,
    // SVGRectElement, SVGCircleElement etc) extends SVGGeometryElement,
    // but some browsers did not implement this i.e. in firefox.
    // So use getTotalLength() if it is available for better result.
    if (isCallable(ellipseDOMNode["getTotalLength"])) {
        return ellipseDOMNode.getTotalLength();
    }

    // SVG2: Approach 2
    //
    // SVGGraphicsElement interface was added to SVG 2,
    // So getBBox() method is available in SVG 2,
    //
    // In firefox getBBox() method returns an empty SVGRect when
    // value of 'rx' or 'ry' attribute is zero or invalid or does not exist,
    // see bug https://bugzilla.mozilla.org/show_bug.cgi?id=1019326
    if (isFirefox()) {
        if (Vector.hasAttribute(ellipseDOMNode, "rx", null) && Vector.hasAttribute(ellipseDOMNode, "ry", null)) {
            rx = parseFloat(Vector.getAttribute(ellipseDOMNode, "rx", null));
            ry = parseFloat(Vector.getAttribute(ellipseDOMNode, "ry", null));

            if (isFinite(rx) && rx > 0 && isFinite(ry) && ry > 0) {
                if (isCallable(ellipseDOMNode["getBBox"])) {
                    bbox = ellipseDOMNode.getBBox();
                    return calculateEllipsePerimeter(bbox.width / 2, bbox.height / 2);
                }
            }
        }

    } else {
        if (isCallable(ellipseDOMNode["getBBox"])) {
            bbox = ellipseDOMNode.getBBox();
            return calculateEllipsePerimeter(bbox.width / 2, bbox.height / 2);
        }
    }

    // Otherwise for SVG 1.1 and for Firefox fallback
    //
    // It extracts the number from attribute value.
    // If the attribute value is like "50%", or "50px", or "50xyz",
    // then it will assume its value is 50, so here percent is ignored.
    // But it is not recommended, later it will be corrected.
    if (Vector.hasAttribute(ellipseDOMNode, "rx", null))
        rx = Vector.getAttribute(ellipseDOMNode, "rx", null);
    else
        rx = defValueXRadius;

    if (Vector.hasAttribute(ellipseDOMNode, "ry", null))
        ry = Vector.getAttribute(ellipseDOMNode, "ry", null);
    else
        ry = defValueYRadius;

    rx = parseFloat(rx);
    ry = parseFloat(ry);
    if (!(isFinite(rx) && rx >= 0))
        rx = defValueXRadius;
    if (!(isFinite(ry) && ry >= 0))
        ry = defValueYRadius;

    return calculateEllipsePerimeter(rx, ry);
};

var calculateEllipsePerimeter = function(rx, ry) {
    if (rx === 0 && ry === 0)
        return 0;
    var h = Math.pow(rx - ry, 2) / Math.pow(rx + ry, 2);
    return Math.PI * (rx + ry) * (1 + ((3 * h) / (10 + Math.pow(4 - 3 * h, 0.5))));
};

var getTotalLengthOfLine = function (lineDOMNode) {
    var bbox,
        defValueX1 = 0,
        defValueY1 = 0,
        defValueX2 = 0,
        defValueY2 = 0,
        x1,
        y1,
        x2,
        y2;

    // SVG2: Approach 1
    //
    // In SVG 2, getTotalLength() method was added to SVGGeometryElement new interface.
    // and Some browsers implement all shape interfaces(i.e. SVGPathElement,
    // SVGRectElement, SVGCircleElement etc) extends SVGGeometryElement,
    // but some browsers did not implement this i.e. in firefox.
    // So use getTotalLength() if it is available for better result.
    if (isCallable(lineDOMNode["getTotalLength"])) {
        return lineDOMNode.getTotalLength();
    }

    // SVG2: Approach 2
    //
    // SVGGraphicsElement interface was added to SVG 2,
    // So getBBox() method is available in SVG 2
    if (isCallable(lineDOMNode["getBBox"])) {
        bbox = lineDOMNode.getBBox();
        return calculateDiagonal(bbox.width, bbox.height);
    }

    // Otherwise for SVG 1.1
    //
    // It extracts the number from attribute value.
    // If the attribute value is like "50%", or "50px", or "50xyz",
    // then it will assume its value is 50, so here percent is ignored.
    // But it is not recommended, later it will be corrected.
    if (Vector.hasAttribute(lineDOMNode, "x1", null))
        x1 = Vector.getAttribute(lineDOMNode, "x1", null);
    else
        x1 = defValueX1;

    if (Vector.hasAttribute(lineDOMNode, "y1", null))
        y1 = Vector.getAttribute(lineDOMNode, "y1", null);
    else
        y1 = defValueY1;

    if (Vector.hasAttribute(lineDOMNode, "x2", null))
        x2 = Vector.getAttribute(lineDOMNode, "x2", null);
    else
        x2 = defValueX2;

    if (Vector.hasAttribute(lineDOMNode, "y2", null))
        y2 = Vector.getAttribute(lineDOMNode, "y2", null);
    else
        y2 = defValueY2;


    x1 = parseFloat(x1);
    y1 = parseFloat(y1);
    x2 = parseFloat(x2);
    y2 = parseFloat(y2);

    if (!isFinite(x1))
        x1 = defValueX1;
    if (!isFinite(y1))
        y1 = defValueY1;
    if (!isFinite(x2))
        x2 = defValueX2;
    if (!(isFinite(y2)))
        y2 = defValueY2;

    return Vector.distance(x1, y1, x2, y2);
};

var calculateDiagonal = function (width, height) {
    return Math.pow((width * width) + (height * height), 0.5);
};

var getTotalLengthOfPolyline = function (polylineDOMNode) {
    var defValuePoints = "",
        points,
        calcLength = 0;


    // In SVG 2, getTotalLength() method was added to SVGGeometryElement new interface.
    // and Some browsers implement all shape interfaces(i.e. SVGPathElement,
    // SVGRectElement, SVGCircleElement etc) extends SVGGeometryElement,
    // but some browsers did not implement this i.e. in firefox.
    // So use getTotalLength() if it is available for better result.
    if (isCallable(polylineDOMNode["getTotalLength"])) {
        return polylineDOMNode.getTotalLength();
    }

    // For SVG 1.1 and if getTotalLength() is not available
    if (Vector.hasAttribute(polylineDOMNode, "points", null))
        points = Vector.getAttribute(polylineDOMNode, "points", null);
    else
        points = defValuePoints;

    points = Vector.points(points);

    if (points.length === 0)
        return 0;

    points.reduce(function (point1, point2) {
        calcLength += Vector.distance(point1.x, point1.y, point2.x, point2.y);
        return point2;
    });

    return calcLength;
};

var getTotalLengthOfPolygon = function (polygonDOMNode) {
    var defValuePoints = "",
        points,
        calcLength = 0;


    // In SVG 2, getTotalLength() method was added to SVGGeometryElement new interface.
    // and Some browsers implement all shape interfaces(i.e. SVGPathElement,
    // SVGRectElement, SVGCircleElement etc) extends SVGGeometryElement,
    // but some browsers did not implement this i.e. in firefox.
    // So use getTotalLength() if it is available for better result.
    if (isCallable(polygonDOMNode["getTotalLength"])) {
        return polygonDOMNode.getTotalLength();
    }

    // For SVG 1.1 and if getTotalLength() is not available
    if (Vector.hasAttribute(polygonDOMNode, "points", null))
        points = Vector.getAttribute(polygonDOMNode, "points", null);
    else
        points = defValuePoints;

    points = Vector.points(points);

    if (points.length === 0)
        return 0;

    points.push(points[0]);

    points.reduce(function (point1, point2) {
        calcLength += Vector.distance(point1.x, point1.y, point2.x, point2.y);
        return point2;
    });

    return calcLength;
};