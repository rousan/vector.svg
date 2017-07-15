
try {



    var path = document.getElementById("path");

    var pr = Vector.wrap(path);

    pr.d("M10,10c200,200,100,200,100,100z").attr("fill", "purple");

    console.log(Vector.Path.prototype._defaultAttrValues);

} catch (e) {
    console.log(e);
}