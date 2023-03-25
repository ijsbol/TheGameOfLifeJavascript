var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const CELL_SIZE = 10;
const CELL_ALIVE_STATES = [true, false];
const RANDOM_START_STATE = false;
const DELAY_BETWEEN_GENERATIONS_IN_MILLISECONDS = 10;

let inital_generation = true;

const WINDOW_WIDTH_IN_CELLS = canvas.width / CELL_SIZE
const WINDOW_HEIGHT_IN_CELLS = canvas.height / CELL_SIZE

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

    if (inital_generation) {
        inital_generation = false;
    }

    return new_board;
}

function drawCells() {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            let cell_state = board[y][x];
            if (cell_state) {
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
    let temp_board = generateEmptyBoard();
    for (let y = 0; y < temp_board.length; y++) {
        for (let x = 0; x < temp_board[y].length; x++) {
            let surroundingCellCount = findSurroundingCells(x, y);
            if (board[y][x]) {
                // Current cell is live.
                if (surroundingCellCount < 2) {
                    // A live cell dies if it has fewer than two live neighbors.
                    // temp_board[y][x] = false
                } else if (surroundingCellCount == 2 || surroundingCellCount == 3) {
                    // A live cell with two or three live neighbors lives on to the next generation.
                    temp_board[y][x] = true
                } else if (surroundingCellCount > 3) {
                    // A live cell with more than three live neighbors dies.
                    // temp_board[y][x] = false
                }
            } else {
                // Current cell is dead
                if (surroundingCellCount == 3) {
                    // A dead cell will be brought back to live if it has exactly three live neighbors.
                    temp_board[y][x] = true
                }
            }
        }
    }

    board = temp_board;
}

function main() {
    drawCells();
    permutate();
}

let board = generateEmptyBoard();

// manually drawing a glyder
board[0][1] = true;
board[1][2] = true;
board[2][0] = true;
board[2][1] = true;
board[2][2] = true;

setInterval("main()", DELAY_BETWEEN_GENERATIONS_IN_MILLISECONDS);