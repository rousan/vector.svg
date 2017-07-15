
try {



    var ellipse = document.getElementById("ellipse");

    var er = Vector.wrap(ellipse);

    er.attr({
        cx: "50%",
        cy: "50%",
        rx: 10,
        ry: 10,
        fill: "purple"
    });


    er.onmousemove(function () {
        if (er.rx() > 300)
            er.rx(10);
        if (er.ry() > 200)
            er.ry(10);
        er.ry(er.ry() +  Math.floor(Math.random() * 2));
        er.rx(er.rx() + Math.floor(Math.random() * 2));
    });




} catch (e) {
    console.log(e);
}