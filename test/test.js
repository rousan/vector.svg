

function A() {
    console.log(arguments);
}

function B() {
    A.apply(null, Array.prototype.slice.call(arguments));
}

Object.A = A;

console.log( /rv:11\.0/i.test("sefrv:11.0sefs") );