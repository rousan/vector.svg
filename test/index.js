
try {



    var btn = document.getElementById("btn");
    var rect = document.getElementById("rect");
    var elem = new Vector.Element();
    elem._domElement = rect;


    var fn = function (e) {
        console.log(this === elem);
    };


    elem.onmouseover(function () {
        rect.setAttribute("fill", "green");
    }).onmouseout(function () {
        rect.setAttribute("fill", "red");
    });

    console.log(Object.getOwnPropertyNames(SVGElement.prototype));

    console.log(SVGElement.prototype.hasOwnProperty("oncopy"));



} catch (e) {
    console.log(e);
}