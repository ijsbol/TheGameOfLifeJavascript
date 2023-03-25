var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

let board = [];

const cell_size = 10;
const cell_alive_states = [true, false];
const random_start_state = true;

for (let y = 0; y < canvas.height/cell_size; y++) {
    board.push([])
    for (let x = 0; x < canvas.width/cell_size; x++) {
        if (random_start_state) {
            board[y][x] = cell_alive_states[
                Math.floor(Math.random() * cell_alive_states.length)
            ];
        } else {
            board[y][x] = true;
        }
    }
}

for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
        let cell_state = board[y][x];
        if (cell_state) {
            ctx.fillStyle = "#000000";
        } else {
            ctx.fillStyle = "#ffffff";
        }
        ctx.fillRect(x*cell_size, y*cell_size, cell_size, cell_size);
    }
}

console.log(board);