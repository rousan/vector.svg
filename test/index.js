
try {




  var t = function () {
      console.log("clicked");
  };

  function A() {

  }

A.capture = "";

  document.body.addEventListener("click", t, A);


  document.body.removeEventListener("click", t, 54);

  console.log(Vector.Geometry.prototype.__proto__ === Vector.Graphics.prototype);





} catch (e) {
    console.log(e);
}