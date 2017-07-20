
try {


    var paper = Vector("paper", 400, 200);

    var rect = paper.rect(100, 100).attr({
        fill: "purple"
    });
    rect.element("title").textContent("This is rect");

    rect.onmousemove(function (e) {
        this.children()[0].textContent(e.x);
    });


} catch (e) {
    console.log(e);
}