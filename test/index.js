
try {




    var yu = function (e) {
        console.log(this);
    };

    document.getElementById("btn").addEventListener("click", yu, true);

    document.getElementById("btn").addEventListener("click", yu, false);


    document.getElementById("btn").addEventListener("click", yu, false);


    var event = new CustomEvent('click', { 'detail': "d" });


    document.getElementById("btn").onclick = function () {
        console.log(typeof Boolean({}));
    }


    setTimeout(function () {
        document.getElementById("btn").dispatchEvent(event);
    }, 1000);

} catch (e) {
    console.log(e);
}