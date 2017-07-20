
try {




    var paper = Vector("paper", 600, 600);

    var t = paper.element("rect");
    t.attr({
        width: 100,
        height: 200,
        fill: "purple"
    });


} catch (e) {
    console.log(e);
}