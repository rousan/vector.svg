



function A() {
    "use strict";
    console.log(this);
}

var a = A.bind();

a();




