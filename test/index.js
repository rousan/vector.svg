
try {



    var x = {};

    Object.defineProperty(x, "A", {
        get: function () {

        }
    });


    var y = Vector.extend({}, x, Object.prototype);

    console.log( Object.getOwnPropertyNames(y) );












} catch (e) {
    console.log(e);
}