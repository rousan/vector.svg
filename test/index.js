
try {



    var btn = document.getElementById("btn");
    var rect = document.getElementById("rect");
    var elem = new Vector.Element();
    elem._domElement = rect;


    var fn = function (e) {
        console.log(this === elem);
    };



    elem.onclick(fn);

    console.log(elem.onclick(fn) === elem);

    console.log(Object.getOwnPropertyNames(SVGElement.prototype));

} catch (e) {
    console.log(e);
}