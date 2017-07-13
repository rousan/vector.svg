
try {



    var rect = document.getElementById("rect");
    var circle = document.getElementById("circle");
    var clip = document.getElementById("clipPath");


    var rr = Vector.wrap(rect);
    var cc = Vector.wrap(circle);
    var cpp = Vector.wrap(clip);

    console.log(rr.attr()["clip-path"].constructor.name);

} catch (e) {
    console.log(e);
}