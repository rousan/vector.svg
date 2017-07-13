





function A(a) {
    if (a)
        return {};
    this.x = 3;
}


function B(a) {
    var r = A.call(this, a);
    console.log(r);
    if (r)
        return r;
}

console.log(isFinite("99"));