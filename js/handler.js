// Edit these.
const CELL_SIZE = 10;
const DELAY_BETWEEN_GENERATIONS_IN_MILLISECONDS = 10;


var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const CELL_ALIVE_STATES = [true, false];
const RANDOM_START_STATE = true;
const WINDOW_WIDTH_IN_CELLS = canvas.width / CELL_SIZE
const WINDOW_HEIGHT_IN_CELLS = canvas.height / CELL_SIZE

let cell_permutations_enabled = false;
let inital_generation = true;
let updated_cells = [];

window.addEventListener("keydown", checkKeyPressed, false);

function checkKeyPressed(event) {
    if (event.keyCode == "32") {
        // Enable cell permutations if the space key is pressed.
        cell_permutations_enabled = true;
    } else if (event.keyCode == "9") {
        // Disable cell permutations if the tab key is pressed.
        cell_permutations_enabled = false;
    } else if (event.keyCode == "82") {
        // Randomly regenerate the entire board if the R key is pressed.
        inital_generation = true;
        board = generateEmptyBoard();
    }
}


function generateEmptyBoard() {
    let new_board = []
    for (let y = 0; y < canvas.height / CELL_SIZE; y++) {
        new_board.push([])
        for (let x = 0; x < canvas.width / CELL_SIZE; x++) {
            if (RANDOM_START_STATE && inital_generation) {
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
                    ctx.fillStyle = "#000000";
                } else {
                    ctx.fillStyle = "#ffffff";
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
                ctx.fillStyle = "#000000";
            } else {
                ctx.fillStyle = "#ffffff";
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

function main() {
    drawCells();
    if (cell_permutations_enabled) {
        permutate();
    }
}

let board = generateEmptyBoard();

setInterval("main()", DELAY_BETWEEN_GENERATIONS_IN_MILLISECONDS);