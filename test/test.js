




var calculateEllipsePerimeter = function(rx, ry) {
    var h = Math.pow(rx - ry, 2) / Math.pow(rx + ry, 2);
    return Math.PI * (rx + ry) * (1 + ((3 * h) / (10 + Math.pow(4 - 3 * h, 0.5))));
};

var t = 8687;

console.log(Math.pow(t, 0.5), Math.sqrt(t));