const tetrominoes = [
    [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ],
    [
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
    ],
    [
        [0, 0, 0, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
    ],
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
    ],
];
var field = [];
var fallingTetrominoes = [];
var score;
var playing = false;

function FallingTetromino(tetrominoIndex, posX, posY) {
    this.tetrominoIndex = tetrominoIndex;
    this.posX = posX;
    this.posY = posY;
    this.rotation = 0;
    this.render = function (onField) {
        return addTetromino(onField, this.tetrominoIndex, this.posX, this.posY, this.rotation).field;
    };
    this.rotate = function () {
        this.rotation++;
        this.rotation %= 4;
        if (!addTetromino(field, this.tetrominoIndex, this.posX, this.posY, this.rotation).success) {
            if (addTetromino(field, this.tetrominoIndex, this.posX, this.posY + 1, this.rotation).success) this.posY++;
            else if (addTetromino(field, this.tetrominoIndex, this.posX, this.posY - 1, this.rotation).success) this.posY--;
            else if (addTetromino(field, this.tetrominoIndex, this.posX, this.posY + 2, this.rotation).success) this.posY += 2;
            else if (addTetromino(field, this.tetrominoIndex, this.posX, this.posY - 2, this.rotation).success) this.posY -= 2;
            else {
                this.rotation--;
                if (this.rotation == -1) this.rotation = 3;
            }
        }
    };
    this.goUp = function () {
        this.posY--;
        if (!addTetromino(field, this.tetrominoIndex, this.posX, this.posY, this.rotation).success) {
            this.posY++;
        }
    };
    this.goDown = function () {
        this.posY++;
        if (!addTetromino(field, this.tetrominoIndex, this.posX, this.posY, this.rotation).success) {
            this.posY--;
        }
    };
    this.goLeft = function () {
        this.posX--;
        if (!addTetromino(field, this.tetrominoIndex, this.posX, this.posY, this.rotation).success) {
            this.posX++;
            field = addTetromino(field, this.tetrominoIndex, this.posX, this.posY, this.rotation).field;
            this.delete();
        }
    };
    this.delete = function () {
        fallingTetrominoes.forEach((e, index) => {
            if (e === this) fallingTetrominoes.splice(index, 1);
        });
        fallingTetrominoes.push(new FallingTetromino(0, 22, 0));
        checkRows();
    };
}

function setUrl(url) {
    history.replaceState({}, url, "#" + url);
}

// leftColoum and rightColoum are arrays of bit from the top to the bottom
function getBraille(leftColumn, rightColumn) {
    // https://en.wikipedia.org/wiki/Braille_Patterns
    return String.fromCharCode(
        0x2800 +
            leftColumn[0] +
            leftColumn[1] * 2 +
            leftColumn[2] * 4 +
            rightColumn[0] * 8 +
            rightColumn[1] * 16 +
            rightColumn[2] * 32 +
            leftColumn[3] * 64 +
            rightColumn[3] * 128
    );
}

function checkRows() {
    // Check for full rows
    for (let index = field.length - 1; index >= 0; index--) {
        row = field[index];
        if (row.reduce((a, b) => a + b) == 4) {
            score++;
            field.splice(index, 1);
            field.push([0, 0, 0, 0]);
            document.title = "Score: " + score;
        }
    }

    // Check for game over
    console.log(field[20].reduce((a, b) => a + b) > 0);
    if (field[20].reduce((a, b) => a + b) > 0) {
        playing = false;
        setUrl("Game Over! Score: " + score);
        document.title = "url-tetris"
    }
}

function renderField(f) {
    if (f.length % 2 == 1) f.push([0, 0, 0, 0]);
    let urlsting = "";
    for (let index = 0; index < f.length; index += 2) {
        urlsting += getBraille(f[index], f[index + 1]);
    }
    setUrl(urlsting);
}

function renderTetrominoes() {
    if (playing) {
        let newField = field;
        fallingTetrominoes.forEach((e) => {
            newField = e.render(newField);
        });
        renderField(newField);
    }
}

function addTetromino(field, tetrominoIndex, posX, posY, rotation) {
    // rotation -> from 0 to 4 clockwise
    let newField = [];
    let success = true;

    field.forEach((e1) => {
        let line = [];
        e1.forEach((e2) => {
            line.push(e2);
        });
        newField.push(line);
    });
    let newTetromino = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    tetrominoes[tetrominoIndex].forEach((e1, x) => {
        e1.forEach((e2, y) => {
            switch (rotation) {
                case 0:
                    newTetromino[x][y] = e2;
                    break;
                case 1:
                    newTetromino[y][3 - x] = e2;
                    break;
                case 2:
                    newTetromino[3 - x][3 - y] = e2;
                    break;
                case 3:
                    newTetromino[3 - y][x] = e2;
                    break;
            }
        });
    });

    let collision = false;

    newTetromino.forEach((e1, x) => {
        e1.forEach((e2, y) => {
            if (e2 == 1) {
                if (y + posX < 0 || x + posY < 0 || x + posY > 3 || newField[y + posX][x + posY] == 1) {
                    success = false;
                    if (y + posX < 0 || newField[y + posX][x + posY] == 1) {
                        collision = true;
                    }
                } else {
                    newField[y + posX][x + posY] = 1;
                }
            }
        });
    });

    return { success, collision, field: newField };
}

function upPressed() {
    console.log("up");
    fallingTetrominoes.forEach((e) => e.goUp());
    renderTetrominoes();
}

function downPressed() {
    console.log("down");
    fallingTetrominoes.forEach((e) => e.goDown());
    renderTetrominoes();
}

function leftPressed() {
    console.log("left");
    fallingTetrominoes.forEach((e) => e.goLeft());
    renderTetrominoes();
}

function rightPressed() {
    console.log("right");
    fallingTetrominoes.forEach((e) => e.rotate());
    renderTetrominoes();
}

function startGame() {
    field = [];
    fallingTetrominoes = [];
    score = 0;
    playing = true;
    for (let index = 0; index < 30; index++) {
        field.push([0, 0, 0, 0]);
    }
    fallingTetrominoes.push(new FallingTetromino(0, 22, 0));

    frame();
}

function frame() {
    if (playing) {
        fallingTetrominoes.forEach((e) => e.goLeft());
        renderTetrominoes();
        setTimeout(frame, 1000);
    }
}

document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp" && playing) upPressed();
    else if (e.code === "ArrowDown" && playing) downPressed();
    else if (e.code === "ArrowLeft" && playing) leftPressed();
    else if (e.code === "ArrowRight" && playing) rightPressed();
    else if (e.code === "KeyW" && playing) upPressed();
    else if (e.code === "KeyS" && playing) downPressed();
    else if (e.code === "KeyA" && playing) leftPressed();
    else if (e.code === "KeyD" && playing) rightPressed();
    else if (e.code === "Space") startGame();
});
