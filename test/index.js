
var body = document.body,
    fillColorInput = document.getElementById("fill-color"),
    strokeWidthInput = document.getElementById("stroke-width"),
    strokeColorInput = document.getElementById("stroke-color"),
    strokeDashArrayInput = document.getElementById("stroke-dasharray"),
    resetBtn = document.getElementById("reset"),
    clearBtn = document.getElementById("clear"),
    undoBtn = document.getElementById("undo"),
    redoBtn = document.getElementById("redo"),
    paper = Vector("drawing", "100%", "100%");

body.style.width = window.innerWidth + "px";
body.style.height = window.innerHeight + "px";

resetValues();

var isDrawing = false;
var currentDrawing = null;

var undidDraw = [];

resetBtn.onclick = function () {
    resetValues();
};

clearBtn.onclick = function () {
    paper.children().forEach(function (draw) {
        if (draw instanceof Vector.Path)
            paper.remove(draw);
    });
};

undoBtn.onclick = function () {
    var draws = [];
    paper.children().forEach(function (draw) {
        if (draw instanceof Vector.Path) {
            draws.splice(0, 0, draw);
        }
    });
    if (draws.length >= 1) {
        undidDraw.push(draws[0]);
        paper.remove(draws[0]);
    }
};

redoBtn.onclick = function () {
    if (undidDraw.length >= 1) {
        paper.append(undidDraw.pop());
    }
};

paper.onmousedown(function (e) {
    isDrawing = true;
    drawStart(e.clientX, e.clientY);
});

paper.onmouseup(function (e) {
    isDrawing = false;
    drawEnd(e.clientX, e.clientY)
});


paper.onmousemove(function (e) {
    if (isDrawing) {
        draw(e.clientX, e.clientY);
    }
});

function drawStart(x, y) {
    currentDrawing = paper.path("M" + x + "," + y);
    currentDrawing.attr({
        fill: fillColorInput.value,
        stroke: strokeColorInput.value,
        "stroke-width": strokeWidthInput.value,
        "stroke-dasharray": strokeDashArrayInput.value
    });
}

function drawEnd(x, y) {
    draw(x, y);
}

function draw(x, y) {
    currentDrawing.d(currentDrawing.d() + "L" + x + "," + y);
}

function resetValues() {
    fillColorInput.value = "none";
    strokeWidthInput.value = 2;
    strokeDashArrayInput.value = "";
    strokeColorInput.value = "purple";
}