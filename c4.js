/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

// FIRST
// function makeBoard() {
//   // TODO: set "board" to empty HEIGHT x WIDTH matrix array
// }

function makeBoard() {
  board = new Array(HEIGHT);
  for (let i = 0; i < HEIGHT; i++) {
    board[i] = new Array(WIDTH).fill(null);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // SECOND
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById('board'); 

  // THIRD
  // TODO: add comment for this code
  let top = document.createElement("tr"); // Create a new row for the game board and put it in the top variable
  top.setAttribute("id", "column-top"); // Give the new row an ID of column-top
  top.addEventListener("click", handleClick); // When the new row is clicked, run the handleClick function

  for (let x = 0; x < WIDTH; x++) { // For each column in the game board, add a new cell to the top row
    let headCell = document.createElement("td"); // Make a new cell for the game board and put it in the headCell variable
    headCell.setAttribute("id", x); // Give the new cell an ID that matches the current column
    top.append(headCell); // Put the new cell in the top row
  }
  htmlBoard.append(top); // Add the new row with all the new cells to the game board table
 
  // FOURTH
  // TODO: add comment for this code
  for (let y = 0; y < HEIGHT; y++) { // Loop through each row of the game board
    const row = document.createElement("tr"); // Create a new row in the game board table 
    for (let x = 0; x < WIDTH; x++) { // Loop through each column of the game board 
      const cell = document.createElement("td"); // Create a new cell in the game board table 
      cell.setAttribute("id", `${y}-${x}`); // Assign an ID to the cell based on its row and column position in the game board 
      const circle = document.createElement("div");
      circle.classList.add("circle");
      cell.append(circle);
      row.append(cell); // Add the cell to the current row 
    }
    htmlBoard.append(row); // Add the current row to the game board table 
  }
} 

// FIFTH
/** findSpotForCol: given column x, return top empty y (null if filled) */

// function findSpotForCol(x) {
//   // TODO: write the real version of this, rather than always returning 0
//   return 0;
// }

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y][x] === null) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

// SIXTH
// function placeInTable(y, x) {
//   // TODO: make a div and insert into correct table cell
// }

function placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  const cell = document.getElementById(`${y}-${x}`);
  cell.append(piece);

  // Set y-offset custom property to move piece to bottom row
  const topRow = document.getElementById('column-top');
  const style = getComputedStyle(topRow);
  const cellWidth = parseInt(style.width);
  const cellHeight = parseInt(style.height);
  const xCoord = cellWidth * x + cellWidth / 2;
  const yCoord = -cellHeight * (y + 1) - cellHeight / 2;
  piece.style.setProperty('--y-offset', `${yCoord}px`);
}

// SEVENTH
/** endGame: announce game end */ 
function endGame(msg) {
  setTimeout(() => {
    alert(msg);
  }, 600); // Delay the alert by 10 milliseconds
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // EIGHTH
  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // NINTH
  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!');
  }

  // TENTH
  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() { // This function checks if there is a win on the board
  function _win(cells) { // This function checks if a set of cells all belong to the current player
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every( // Check if every cell in the input list of cells belongs to the current player
      ([y, x]) => 
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // ELEVENTH
  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) { // Go through each row of the game board
    for (let x = 0; x < WIDTH; x++) { // For each row, go through each column of the game board
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; // Store the cells in the current row needed to check for a horizontal win
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; // Store the cells in the current column needed to check for a vertical win
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; // Store the cells in the current diagonal needed to check for a win
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; // Store the cells in the current diagonal needed to check for a win

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) { // Check if the cells in any of the win combinations are all the same player
        return true; // If so, return true
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
