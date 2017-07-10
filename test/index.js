
try {






    var rect1 = document.getElementById("rect1");
    EventTarget.prototype.addEventListener.apply(rect1, ["click", function () {
        console.log("Ff");
    }]);


    var a = {};

    var b = {};

    Vector.c(a, b);

    console.log(Object.getPrototypeOf(a) === b);








} catch (e) {
    console.log(e);
}