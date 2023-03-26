// Edit these.
const CELL_SIZE = 2;
const DELAY_BETWEEN_GENERATIONS_IN_MILLISECONDS = 1;


var canvas = document.getElementById("myCanvas");
var fpsCounter = document.getElementById("fps");
var ctx = canvas.getContext("2d");

const CELL_ALIVE_STATES = [true, false];
const WINDOW_WIDTH_IN_CELLS = canvas.width / CELL_SIZE
const WINDOW_HEIGHT_IN_CELLS = canvas.height / CELL_SIZE
const ALIVE_CELL_COLOUR = "white";
const DEAD_CELL_COLOUR = "black";

const currentDate = new Date();
const timestamp = currentDate.getTime();

let cell_permutations_enabled = false;
let inital_generation = true;
let random_state = false;
let mousedown = false;
let inital_clicked_cell_live_state = false;
let updated_cells = [];

window.addEventListener("keydown", checkKeyPressed, false);

function randomBoard() {
    inital_generation = true;
    random_state = true;
    board = generateEmptyBoard();
    drawCells();
}

function startGenerations() {
    cell_permutations_enabled = true;
}

function stopGenerations() {
    cell_permutations_enabled = false;
}

function stepGeneration() {
    permutate();
}

function clearBoard() {
    inital_generation = true;
    random_state = false;
    board = generateEmptyBoard();
    drawCells();
}

function checkKeyPressed(event) {
    if (event.keyCode == "32") {
        // Enable cell permutations if the space key is pressed.
        startGenerations();
    } else if (event.keyCode == "9") {
        // Disable cell permutations if the tab key is pressed.
        stopGenerations();
    } else if (event.keyCode == "82") {
        // Randomly regenerate the entire board if the R key is pressed.
        randomBoard();
    } else if (event.keyCode == "83") {
        // Permutate the board exactly once.
        stepGeneration();
    } else if (event.keyCode == "67") {
        // Clearn the board if the "C" key is pressed.
        clearBoard();
    }
}

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor((event.clientX - rect.left) / CELL_SIZE),
      y: Math.floor((event.clientY - rect.top) / CELL_SIZE)
    };
}

function mousedownevent(event) {
    mousedown = true;
    var pos = getMousePos(canvas, event);
    inital_clicked_cell_live_state = board[pos['y']][pos['x']]
    board[pos['y']][pos['x']] = !inital_clicked_cell_live_state;
    updated_cells.push(pos['x'], pos['y']);
    drawCells();
}

function mouseupevent(event) {
    mousedown = false;
}

function mousemovement(event) {
    if (mousedown) {
        var pos = getMousePos(canvas, event);
        board[pos['y']][pos['x']] = !inital_clicked_cell_live_state;
        updated_cells.push(pos['x'], pos['y']);
        drawCells();
    }
}

function generateEmptyBoard() {
    let new_board = []
    for (let y = 0; y < canvas.height / CELL_SIZE; y++) {
        new_board.push([])
        for (let x = 0; x < canvas.width / CELL_SIZE; x++) {
            if (random_state && inital_generation) {
                new_board[y][x] = CELL_ALIVE_STATES[
                    Math.floor(Math.random() * CELL_ALIVE_STATES.length)
                ];
            } else {
                new_board[y][x] = false;
            }
        }
    }

    return new_board;
}

function drawCells() {
    if (inital_generation) {
        // Initial generation.
        inital_generation = false;
        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                if (board[y][x]) {
                    ctx.fillStyle = ALIVE_CELL_COLOUR;
                } else {
                    ctx.fillStyle = DEAD_CELL_COLOUR;
                }
                ctx.fillRect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    } else {
        // Every other generation.
        for (let i = 0; i < updated_cells.length; i += 2) {
            let x = updated_cells[i];
            let y = updated_cells[i + 1];

            if (board[y][x]) {
                ctx.fillStyle = ALIVE_CELL_COLOUR;
            } else {
                ctx.fillStyle = DEAD_CELL_COLOUR;
            }
            ctx.fillRect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }
}

function findSurroundingCells(x, y) {
    let offsets = [-1, 0, 1];

    let liveSurroudningCells = 0;

    for (let delta_x_index = 0; delta_x_index < offsets.length; delta_x_index++) {
        for (let delta_y_index = 0; delta_y_index < offsets.length; delta_y_index++) {
            let delta_x = offsets[delta_x_index];
            let delta_y = offsets[delta_y_index];

            if (delta_x == 0 && delta_y == 0) {}
            else {
                let cell_x = x + delta_x;
                let cell_y = y + delta_y;
                
                if (cell_x >= WINDOW_WIDTH_IN_CELLS) {
                    cell_x -= WINDOW_WIDTH_IN_CELLS;
                } else if (cell_x < 0) {
                    cell_x += WINDOW_WIDTH_IN_CELLS;
                } if (cell_y >= WINDOW_HEIGHT_IN_CELLS) {
                    cell_y -= WINDOW_HEIGHT_IN_CELLS;
                } else if (cell_y < 0) {
                    cell_y += WINDOW_HEIGHT_IN_CELLS;
                }
                if (board[cell_y][cell_x]) {
                    liveSurroudningCells += 1;
                }
            }
        }
    }

    return liveSurroudningCells;   
}

function permutate() {
    updated_cells = [];
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            let surroundingCellCount = findSurroundingCells(x, y);
            if (board[y][x]) {
                // Current cell is live.
                if (surroundingCellCount < 2) {
                    // A live cell dies if it has fewer than two live neighbors.
                    updated_cells.push(x, y);
                } else if (surroundingCellCount == 2 || surroundingCellCount == 3) {
                    // A live cell with two or three live neighbors lives on to the next generation.
                } else if (surroundingCellCount > 3) {
                    // A live cell with more than three live neighbors dies.
                    updated_cells.push(x, y);
                }
            } else {
                // Current cell is dead
                if (surroundingCellCount == 3) {
                    // A dead cell will be brought back to live if it has exactly three live neighbors.
                    updated_cells.push(x, y);
                }
            }
        }
    }

    for (let i = 0; i < updated_cells.length; i+=2) {
        let x = updated_cells[i];
        let y = updated_cells[i + 1];
        if (board[y][x]) {
            board[y][x] = false;
        } else {
            board[y][x] = true;
        }
    }
}

let timestampAfter;
let timestampBefore;
let frameTime;
let previousFrameTime = 0;
let diffInFrameTime;

function main() {
    timestampBefore = performance.now();
    drawCells();
    if (cell_permutations_enabled) {
        permutate();
    }
    timestampAfter = performance.now();
    frameTime = timestampAfter - timestampBefore;
    diffInFrameTime = frameTime - previousFrameTime;
    fpsCounter.textContent=(" | Frame time: " + (frameTime).toString() + "ms (diff: " + diffInFrameTime + "ms)");
    
}

let board = generateEmptyBoard();

fpsCounter.textContent=" | Simulation has not been started.";
setInterval("main()", DELAY_BETWEEN_GENERATIONS_IN_MILLISECONDS);