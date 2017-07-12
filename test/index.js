
try {



    var rect = document.getElementById("rect");

    var r = new Vector.Rect(100, 200);
    r.on("click", function () {

    });

    var t = document.querySelector("use").classList;
    t.add("ytut");


    console.log(document.querySelector("use").getAttribute("class"));





    console.time("t");

    var x = Symbol();
    var y = [1, 2];
    var arr = [undefined, y, "A", "a", "A", null, undefined, 44, 2, 33, 44, -0, 0, "test", x, "Ff", Symbol(), y, Object, 99, Object];

    console.log(Vector.unique(arr));

    console.timeEnd("t");

} catch (e) {
    console.log(e);
}