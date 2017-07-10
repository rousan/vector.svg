

function A() {
    console.log(arguments);
}

function B() {
    A.apply(null, Array.prototype.slice.call(arguments));
}


B(345, 34,53);