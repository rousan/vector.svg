
try {






    var rect1 = document.getElementById("rect1");
    EventTarget.prototype.addEventListener.apply(rect1, ["click", function () {
        console.log("Ff");
    }])










} catch (e) {
    console.log(e);
}