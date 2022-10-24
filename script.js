function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function isBomb(x) {
    if (x == 0) {
        return false;
    } else {
        return true;
    }
}

let rows = 16;
let cols = 30;
let bombs = 99;
const container = document.getElementById("container");
var timer = document.getElementById("timer");
let arr;
let nearby;
let opened;
let flaged;
let enter;
let isLost = false;
let isStart = false;
let hasOpened = 0;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function start(col, row, bomb) {
    container.innerHTML = "";
    container.style.width = 38 * col + "px";
    container.style.height = 38 * row + "px";
    timer.innerHTML = "00:00";
    arr = createArray(row, col);
    nearby = createArray(row, col);
    opened = createArray(row, col);
    flaged = createArray(row, col);
    enter = createArray(row, col);
    var x = 1;
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            if (x < bomb) {
                arr[i][j] = 1;
            } else {
                arr[i][j] = 0;
            }
            nearby[i][j] = 0;
            opened[i][j] = false;
            flaged[i][i] = false;
            enter[i][i] = false;
            x++;
        }
    }
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            var x = Math.floor(Math.random() * row);
            var y = Math.floor(Math.random() * col);
            var temp = arr[x][y];
            arr[x][y] = arr[i][j];
            arr[i][j] = temp;
        }
    }

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            var block = document.createElement("div");
            block.style.height = "30px";
            block.style.width = "30px";
            block.style.display = "flex";
            block.style.justifyContent = "center";
            block.style.alignItems = "center";
            block.style.borderTop = "4px solid #FFFFFF";
            block.style.borderLeft = "4px solid #FFFFFF";
            block.style.borderRight = "4px solid #808080";
            block.style.borderBottom = "4px solid #808080";
            block.style.fontSize = "16px";
            if (i > 0) {
                if (isBomb(arr[i - 1][j])) {
                    nearby[i][j]++;
                }
            }
            if (i < row - 1) {
                if (isBomb(arr[i + 1][j])) {
                    nearby[i][j]++;
                }
            }
            if (j > 0) {
                if (isBomb(arr[i][j - 1])) {
                    nearby[i][j]++;
                }
            }
            if (j < col - 1) {
                if (isBomb(arr[i][j + 1])) {
                    nearby[i][j]++;
                }
            }
            if (i > 0 && j > 0) {
                if (isBomb(arr[i - 1][j - 1])) {
                    nearby[i][j]++;
                }
            }
            if (i < row - 1 && j < col - 1) {
                if (isBomb(arr[i + 1][j + 1])) {
                    nearby[i][j]++;
                }
            }
            if (i < row - 1 && j > 0) {
                if (isBomb(arr[i + 1][j - 1])) {
                    nearby[i][j]++;
                }
            }
            if (i > 0 && j < col - 1) {
                if (isBomb(arr[i - 1][j + 1])) {
                    nearby[i][j]++;
                }
            }
            if (isBomb(arr[i][j])) {
                nearby[i][j] = 0;
            }
            var pressed = false;
            block.style.background = "#C6C6C6";
            block.setAttribute("row", i);
            block.setAttribute("col", j);
            block.setAttribute("id", i + "-" + j);
            block.addEventListener("mouseenter", function (ev) {
                if (pressed && !opened[i][j] && !isLost) {
                    hovered(i, j);
                } else if (pressed && opened[i][j] && !isLost) {
                    hoveredNearby(i, j, row, col);
                }
            });
            block.addEventListener("mouseleave", function (ev) {
                if (pressed && !opened[i][j] && !isLost) {
                    unhovered(i, j);
                } else if (pressed && opened[i][j] && !isLost) {
                    unhoveredNearby(i, j, row, col);
                }
            });
            block.addEventListener("mousedown", function (e) {
                if (e.button == 0 && !opened[i][j] && !isLost) {
                    hovered(i, j);
                } else if (e.button == 0 && opened[i][j] && !isLost) {
                    hoveredNearby(i, j, row, col);
                }
            });
            window.addEventListener("mousedown", function (e) {
                if (e.button == 0) {
                    pressed = true;
                }
            });
            window.addEventListener("mouseup", function (e) {
                if (e.button == 0) {
                    pressed = false;
                }
            });

            block.addEventListener("mouseup", function (e) {
                if (e.button == 0) {
                    pressed = false;
                }
                if (e.button == 0 && !flaged[i][j] && !opened[i][j]) {
                    open(i, j, row, col, bomb);
                } else if (e.button == 2 && !opened[i][j]) {
                    flag(i, j, row, col, bomb);
                } else if (e.button == 0 && !flaged[i][j] && opened[i][j]) {
                    unhoveredNearby(i, j, row, col);
                    openNearby(i, j, row, col, bomb);
                }
            });
            container.appendChild(block);
        }
    }
}

function hovered(i, j) {
    if (!flaged[i][j]) {
        var ijblock = document.getElementById(i + "-" + j);
        ijblock.style.border = "1px solid #808080";
        ijblock.style.width = "36px";
        ijblock.style.height = "36px";
    }
}

function unhovered(i, j) {
    if (!opened[i][j]) {
        var ijblock = document.getElementById(i + "-" + j);
        ijblock.style.height = "30px";
        ijblock.style.width = "30px";
        ijblock.style.borderTop = "4px solid #FFFFFF";
        ijblock.style.borderLeft = "4px solid #FFFFFF";
        ijblock.style.borderRight = "4px solid #808080";
        ijblock.style.borderBottom = "4px solid #808080";
    }
}

function hoveredNearby(i, j, row, col) {
    if (i > 0) {
        hovered(i - 1, j);
    }
    if (i > 0 && j < col - 1) {
        hovered(i - 1, j + 1);
    }
    if (i < row - 1 && j > 0) {
        hovered(i + 1, j - 1);
    }
    if (j > 0) {
        hovered(i, j - 1);
    }
    if (i > 0 && j > 0) {
        hovered(i - 1, j - 1);
    }
    if (i < row - 1 && j < col - 1) {
        hovered(i + 1, j + 1);
    }
    if (i < row - 1) {
        hovered(i + 1, j);
    }
    if (j < col - 1) {
        hovered(i, j + 1);
    }
}

function unhoveredNearby(i, j, row, col) {
    if (i > 0) {
        unhovered(i - 1, j);
    }
    if (i > 0 && j < col - 1) {
        unhovered(i - 1, j + 1);
    }
    if (i < row - 1 && j > 0) {
        unhovered(i + 1, j - 1);
    }
    if (j > 0) {
        unhovered(i, j - 1);
    }
    if (i > 0 && j > 0) {
        unhovered(i - 1, j - 1);
    }
    if (i < row - 1 && j < col - 1) {
        unhovered(i + 1, j + 1);
    }
    if (i < row - 1) {
        unhovered(i + 1, j);
    }
    if (j < col - 1) {
        unhovered(i, j + 1);
    }
}

function openNearby(i, j, row, col, bomb) {
    var near = 0;
    if (i > 0) {
        if (flaged[i - 1][j]) {
            near++;
        }
    }
    if (j > 0) {
        if (flaged[i][j - 1]) {
            near++;
        }
    }
    if (i < row - 1) {
        if (flaged[i + 1][j]) {
            near++;
        }
    }
    if (j < col - 1) {
        if (flaged[i][j + 1]) {
            near++;
        }
    }
    if (i > 0 && j > 0) {
        if (flaged[i - 1][j - 1]) {
            near++;
        }
    }
    if (i > 0 && j < col - 1) {
        if (flaged[i - 1][j + 1]) {
            near++;
        }
    }
    if (i < row - 1 && j < col - 1) {
        if (flaged[i + 1][j + 1]) {
            near++;
        }
    }
    if (i < row - 1 && j > 0) {
        if (flaged[i + 1][j - 1]) {
            near++;
        }
    }
    if (nearby[i][j] == near) {
        if (i > 0) {
            if (!flaged[i - 1][j]) {
                open(i - 1, j, row, col, bomb);
            }
        }
        if (j > 0) {
            if (!flaged[i][j - 1]) {
                open(i, j - 1, row, col, bomb);
            }
        }
        if (i < row - 1) {
            if (!flaged[i + 1][j]) {
                open(i + 1, j, row, col, bomb);
            }
        }
        if (j < col - 1) {
            if (!flaged[i][j + 1]) {
                open(i, j + 1, row, col, bomb);
            }
        }
        if (i > 0 && j > 0) {
            if (!flaged[i - 1][j - 1]) {
                open(i - 1, j - 1, row, col, bomb);
            }
        }
        if (i > 0 && j < col - 1) {
            if (!flaged[i - 1][j + 1]) {
                open(i - 1, j + 1, row, col, bomb);
            }
        }
        if (i < row - 1 && j < col - 1) {
            if (!flaged[i + 1][j + 1]) {
                open(i + 1, j + 1, row, col, bomb);
            }
        }
        if (i < row - 1 && j > 0) {
            if (!flaged[i + 1][j - 1]) {
                open(i + 1, j - 1, row, col, bomb);
            }
        }
    }
}

function startTimer(row, col, bomb) {
    var time = 0;
    var x = setInterval(function () {
        var xx = parseInt(time / 250) % 60;
        if (xx < 10) {
            xx = "0" + xx;
        }
        var yy = parseInt(parseInt(time / 250) / 60);
        if (yy < 10) {
            yy = "0" + yy;
        }
        timer.innerHTML = yy + ":" + xx;
        time++;
        if (hasOpened == row * col - bomb) {
            clearInterval(x);
        }
        if (!isStart) {
            clearInterval(x);
        }
    }, 4);
}

function flag(i, j, row, col, bomb) {
    var ijblock = document.getElementById(i + "-" + j);
    if (!flaged[i][j]) {
        ijblock.innerHTML = '<h1 style="text-align: center;">!</h1>';
        flaged[i][j] = true;
    } else {
        ijblock.innerHTML = "";
        flaged[i][j] = false;
    }
    if (!isStart) {
        startTimer(row, col, bomb);
        isStart = true;
    }
}

function open(i, j, row, col, bomb) {
    var ijblock = document.getElementById(i + "-" + j);
    if (!isBomb(arr[i][j]) && !opened[i][j]) {
        if (!isStart) {
            startTimer(row, col, bomb);
            isStart = true;
        }
        if (nearby[i][j] != 0) {
            ijblock.innerHTML = '<h1 style="text-align: center;">' + nearby[i][j] + "</h1>";
            if (nearby[i][j] == 1) {
                ijblock.style.color = "#0000FF";
            } else if (nearby[i][j] == 2) {
                ijblock.style.color = "#008200";
            } else if (nearby[i][j] == 3) {
                ijblock.style.color = "#FE0000";
            } else if (nearby[i][j] == 4) {
                ijblock.style.color = "#000084";
            } else if (nearby[i][j] == 5) {
                ijblock.style.color = "#840000";
            } else if (nearby[i][j] == 6) {
                ijblock.style.color = "#008284";
            } else if (nearby[i][j] == 7) {
                ijblock.style.color = "#840084";
            } else if (nearby[i][j] == 8) {
                ijblock.style.color = "#757575";
            }
        }
        hasOpened++;
        opened[i][j] = true;
        ijblock.style.border = "1px solid #808080";
        ijblock.style.width = "36px";
        ijblock.style.height = "36px";
        if ((nearby[i][j] == 0) & !isBomb(arr[i][j])) {
            if (i > 0) {
                if (!isBomb(arr[i - 1][j]) && !flaged[i - 1][j]) {
                    open(i - 1, j, row, col);
                }
            }
            if (i < row - 1) {
                if (!isBomb(arr[i + 1][j]) && !flaged[i + 1][j]) {
                    open(i + 1, j, row, col);
                }
            }
            if (j > 0) {
                if (!isBomb(arr[i][j - 1]) && !flaged[i][j - 1]) {
                    open(i, j - 1, row, col);
                }
            }
            if (j < col - 1) {
                if (!isBomb(arr[i][j + 1]) && !flaged[i][j + 1]) {
                    open(i, j + 1, row, col);
                }
            }
            if (i > 0 && j > 0) {
                if (!isBomb(arr[i - 1][j - 1]) && !flaged[i - 1][j - 1]) {
                    open(i - 1, j - 1, row, col);
                }
            }
            if (i < row - 1 && j < col - 1) {
                if (!isBomb(arr[i + 1][j + 1]) && !flaged[i + 1][j + 1]) {
                    open(i + 1, j + 1, row, col);
                }
            }
            if (i < row - 1 && j > 0) {
                if (!isBomb(arr[i + 1][j - 1]) && !flaged[i + 1][j - 1]) {
                    open(i + 1, j - 1, row, col);
                }
            }
            if (i > 0 && j < col - 1) {
                if (!isBomb(arr[i - 1][j + 1]) && !flaged[i - 1][j + 1]) {
                    open(i - 1, j + 1, row, col);
                }
            }
        }
    } else if (isBomb(arr[i][j]) && !opened[i][j]) {
        ijblock.innerHTML = '<h1 style="text-align: center;">☀</h1>';
        ijblock.style.fontSize = "16px";
        ijblock.style.border = "1px solid #808080";
        ijblock.style.width = "36px";
        ijblock.style.height = "36px";
        ijblock.style.color = "red";
        opened[i][j] = true;
        for (let x = 0; x < row; x++) {
            for (let y = 0; y < col; y++) {
                opened[x][y] = true;
                if (isBomb(arr[x][y])) {
                    var xyblock = document.getElementById(x + "-" + y);
                    xyblock.innerHTML = '<h1 style="text-align: center;">☀</h1>';
                    xyblock.style.fontSize = "16px";
                    xyblock.style.border = "1px solid #808080";
                    xyblock.style.width = "36px";
                    xyblock.style.height = "36px";
                }
            }
        }
        isLost = true;
        isStart = false;
    }
}

function play(col, row, bomb) {
    startTimer(row, col, bomb);
    isStart = false;
    isLost = false;
    rows = row;
    cols = col;
    bombs = bomb;
    start(col, row, bomb);
}

function restart() {
    startTimer(rows, cols, bombs);
    isStart = false;
    isLost = false;
    start(cols, rows, bombs);
}
restart();
