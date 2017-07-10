


var t = {};
Object.defineProperty(t, "x", {
    get: function () {

    },
    set: function (e) {

    },
    enumerable: true,
    configurable: true
});


console.log(Object.getOwnPropertyDescriptor(t, "x"));


Object.defineProperty(t, "x", {
    writable: true,
    value: 4
});

Object.defineProperties(t, {});
console.log(Object.getOwnPropertyDescriptor(t, "x"));