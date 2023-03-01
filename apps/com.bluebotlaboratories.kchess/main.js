// Globals
var columnLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
var validPieceIDs = ['b', 'k', 'n', 'p', 'q', 'r'];

// The logging function
function log(logStuff) {
  var p = document.createElement("p");
  p.innerText = logStuff.toString();
  document.getElementById("log").appendChild(p);
}

// Log js errors to log
//addEventListener("error", function (event) {
//  log(event.message + "\nAt: " + event.lineno + ":" + event.colno + "\nIn: " + event.filename);
//});

// Create chess board data structure
function createBoard(rows, columns) {
  // Board structure info:
  // Chess has 8 rows 8 cols
  // Counting starts from 0
  // Cols are letters in game, in data they are still numbers counting from 0
  // Rows are numbers counting form 1 in game, in data they are still numbers counting from 0
  // 0,0 is the top-left
  // null indicates empty space
  // The list access format is (y, x)

  var boardData = Array(rows);
  for (var i = 0; i < rows; i++) {
    boardData[i] = Array(columns);
  }

  return boardData;
}

function createGame() {
  return {
    currentTurn: 'w',
    lastmove: '',
    moves: 0,
    whiteTime: 0,
    blackTime: 0
  };
}

// Bulk of game logic
function handleCellClick(event) {
  var selectionCoords = convertToNumericalCoords(event.currentTarget.id)
  // Check if the selected cell is even a piece or if it is valid given the current player's turn
  if (document.getElementsByClassName("boardActiveCell").length == 0 && window.boardData[selectionCoords[0]][selectionCoords[1]] != null && window.boardData[selectionCoords[0]][selectionCoords[1]][0] != window.gameData.currentTurn) {
    return;
  }

  var targetCoords = convertToNumericalCoords(event.currentTarget.id);

  // Check if cell is a movable one, if so, move the corresponding piece
  if (event.currentTarget.classList.contains("boardMovableCell")) {
    log("Movable cell")
    log("Converting coordinates")
    var startCoords = convertToNumericalCoords(document.getElementsByClassName("boardActiveCell")[0].id);

    log("moving piece")
    window.boardData[targetCoords[0]][targetCoords[1]] = window.boardData[startCoords[0]][startCoords[1]];
    window.boardData[startCoords[0]][startCoords[1]] = null;

    log("Rendering board")
    var renderedBoard = renderBoard(window.boardData, renderChessBoardCell);

    log("Updating html board")
    document.getElementById("chessBoard").children[0].remove();
    document.getElementById("chessBoard").appendChild(renderedBoard);

    log("changing turn")
    if (window.gameData.currentTurn == 'w') {
      window.gameData.currentTurn = 'b';
    } else {
      window.gameData.currentTurn = 'w';
    }
  } else if (window.boardData[targetCoords[0]][targetCoords[1]] == null || window.gameData.currentTurn == window.boardData[targetCoords[0]][targetCoords[1]].toLowerCase()[0]) {
    log("Deselecting cells")
    // Deselect any movable cells
    var movableCells = document.getElementsByClassName("boardMovableCell");
    log(movableCells.length.toString())
    while (movableCells.length > 0) {
      movableCells = document.getElementsByClassName("boardMovableCell");
      movableCells[0].classList.remove("boardMovableCell");
    }
    
    // If it is active, then deactivate it and end function
    if (event.currentTarget.classList.contains("boardActiveCell")) {
      event.currentTarget.classList.remove("boardActiveCell");
      return;
    } else {
      // Deselect any other active cells
      var activeCells = document.getElementsByClassName("boardActiveCell");
      while (activeCells.length > 0) {
        activeCells = document.getElementsByClassName("boardActiveCell");
        activeCells[0].classList.remove("boardActiveCell");
      }

      // Set cell as selected
      event.currentTarget.classList.add("boardActiveCell");

      // Render new movables
      var possibleMoves = generateMoves(window.boardData, convertToNumericalCoords(event.currentTarget.id)[0], convertToNumericalCoords(event.currentTarget.id)[1]);
      renderMovables(possibleMoves);
    }
  }
}

// Move generator
// Generates possible moves
function generateMoves(boardData, pieceRowCoordinate, pieceColumnCoordinate, firstMove) {
  if (firstMove == undefined) {
    firstMove = false;
  }
  if (!boardData[pieceRowCoordinate][pieceColumnCoordinate]) {
    return []
  }

  var pieceMovements = {
    'n': { hop: true, vertical: false, horizontal: false, diagonal: false, diagonalCapture: false, retreat: true, limit: 2, firstLimit: 1 },
    'b': { hop: false, vertical: false, horizontal: false, diagonal: true, diagonalCapture: false, retreat: true, limit: -1, firstLimit: -1 },
    'k': { hop: false, vertical: true, horizontal: true, diagonal: true, diagonalCapture: false, retreat: true, limit: 1, firstLimit: 1 },
    'p': { hop: false, vertical: true, horizontal: false, diagonal: false, diagonalCapture: true, retreat: false, limit: 1, firstLimit: 2 },
    'q': { hop: false, vertical: true, horizontal: true, diagonal: true, diagonalCapture: false, retreat: true, limit: -1, firstLimit: -1 },
    'r': { hop: false, vertical: true, horizontal: true, diagonal: false, diagonalCapture: false, retreat: true, limit: -1, firstLimit: -1 }
  }

  var pieceID = boardData[pieceRowCoordinate][pieceColumnCoordinate].toLowerCase();
  var possibleMovements = [];

  if (firstMove) {
    var movementLimit = pieceMovements[pieceID[1]].firstLimit;
  } else {
    var movementLimit = pieceMovements[pieceID[1]].limit;
  }

  if (pieceMovements[pieceID[1]].hop) { // Knight hopping ability
    if (pieceRowCoordinate - 2 > 0) {
      if (pieceColumnCoordinate + 1 < 8 && boardData[pieceRowCoordinate - (pieceMovements[pieceID[1]].firstLimit)][pieceColumnCoordinate + (movementLimit)][0] != pieceID[0]) {
        possibleMovements.push([pieceRowCoordinate - (pieceMovements[pieceID[1]].firstLimit), pieceColumnCoordinate + (movementLimit)]);
      }
      if (pieceColumnCoordinate - 1 > 0 && boardData[pieceRowCoordinate - (pieceMovements[pieceID[1]].firstLimit)][pieceColumnCoordinate - (movementLimit)][0] != pieceId[0]) {
        possibleMovements.push([pieceRowCoordinate - (pieceMovements[pieceID[1]].firstLimit), pieceColumnCoordinate - (movementLimit)]);
      }
    }

    if (pieceMovements[pieceID[1]].retreat) { // If the knight can retreat
      if (pieceRowCoordinate + 2 < 8) {
        if (pieceColumnCoordinate + 1 < 8 && boardData[pieceRowCoordinate + (pieceMovements[pieceID[1]].firstLimit)][pieceColumnCoordinate + (movementLimit)][0] != pieceID[0]) {
          possibleMovements.push([pieceRowCoordinate + (pieceMovements[pieceID[1]].firstLimit), pieceColumnCoordinate + (movementLimit)]);
        }
        if (pieceColumnCoordinate - 1 > 0 && boardData[pieceRowCoordinate + (pieceMovements[pieceID[1]].firstLimit)][pieceColumnCoordinate - (movementLimit)][0] != pieceID[0]) {
          possibleMovements.push([pieceRowCoordinate + (pieceMovements[pieceID[1]].firstLimit), pieceColumnCoordinate - (movementLimit)]);
        }
      }
    }
  }

  if (pieceMovements[pieceID[1]].vertical) { // Vertical movement ability
    if (pieceMovements[pieceID[1]].retreat || pieceID[0] == 'w') {
      if (movementLimit != -1 && pieceRowCoordinate - movementLimit >= 0) {
        var calculatedLimit = movementLimit;
      } else {
        var calculatedLimit = pieceRowCoordinate;
      }

      for (var i = pieceRowCoordinate - 1; i >= pieceRowCoordinate - calculatedLimit; i--) {
        if (boardData[i][pieceColumnCoordinate] == null || (!pieceMovements[pieceID[1]].diagonalCapture && boardData[i][pieceColumnCoordinate][0] != pieceID[0])) { // If there is blank space or capturable piece
          possibleMovements.push([i, pieceColumnCoordinate]);
          if (boardData[i][pieceColumnCoordinate] != null) {
            break; // Stop checking when a piece is hit
          }
        } else {
          break;
        }
      }
    }

    if (pieceMovements[pieceID[1]].retreat || pieceID[0] == 'b') { // Going backwards (or black)
      if (movementLimit != -1 && pieceRowCoordinate + movementLimit < 8) { // If there is blank space or capturable piece
        var calculatedLimit = movementLimit;
      } else {
        var calculatedLimit = 7 - pieceRowCoordinate;
      }

      for (var i = pieceRowCoordinate + 1; i <= pieceRowCoordinate + calculatedLimit; i++) {
        if (boardData[i][pieceColumnCoordinate] == null || (!pieceMovements[pieceID[1]].diagonalCapture && boardData[i][pieceColumnCoordinate][0] != pieceID[0])) {
          possibleMovements.push([i, pieceColumnCoordinate]);
          if (boardData[i][pieceColumnCoordinate] != null) {
            break; // Stop checking when a piece is hit
          }
        } else {
          break;
        }
      }
    }
  }

  if (pieceMovements[pieceID[1]].horizontal) { // Horizontal movement ability
    if (pieceMovements[pieceID[1]].retreat || pieceID[0] == 'w') {
      if (movementLimit != -1 && pieceColumnCoordinate + movementLimit < 8) { // If there is blank space or capturable piece
        var calculatedLimit = movementLimit;
      } else {
        var calculatedLimit = 7 - pieceColumnCoordinate;
      }

      for (var i = pieceColumnCoordinate + 1; i <= pieceColumnCoordinate + calculatedLimit; i++) {
        if (boardData[pieceRowCoordinate][i] == null || boardData[pieceRowCoordinate][i][0] != pieceID[0]) {
          possibleMovements.push([pieceRowCoordinate, i]);
          if (boardData[pieceRowCoordinate][i] != null) {
            break; // Stop checking once a piece is hit
          }
        } else {
          break;
        }
      }
    }

    if (pieceMovements[pieceID[1]].retreat || pieceID[0] == 'b') { // Going "backwards"
      if (movementLimit != -1 && pieceColumnCoordinate - movementLimit >= 0) {
        var calculatedLimit = movementLimit;
      } else {
        var calculatedLimit = pieceColumnCoordinate;
      }

      for (var i = pieceColumnCoordinate - 1; i >= pieceColumnCoordinate - calculatedLimit; i--) {
        if (boardData[pieceRowCoordinate][i] == null || boardData[pieceRowCoordinate][i][0] != pieceID[0]) { // If there is blank space or capturable piece
          possibleMovements.push([pieceRowCoordinate, i]);
          if (boardData[pieceRowCoordinate][i] != null) {
            break; // Stop checking once a piece is hit
          }
        } else {
          break;
        }
      }
    }
  }

  if (pieceMovements[pieceID[1]].diagonal || pieceMovements[pieceID[1]].diagonalCapture) { // Diagonal movement
    if (movementLimit == -1) {
      var calculatedLimit = 7;
    } else {
      var calculatedLimit = movementLimit;
    }

    // Going row+ col+
    for (var i = 1; i <= calculatedLimit; i++) {
      if (pieceRowCoordinate + i >= 8 || pieceColumnCoordinate + i >= 8 || (boardData[pieceRowCoordinate + i][pieceColumnCoordinate + i] == null && pieceMovements[pieceID[1]].diagonalCapture)) {
        break;
      }
      if (boardData[pieceRowCoordinate + i][pieceColumnCoordinate + i] == null || boardData[pieceRowCoordinate + i][pieceColumnCoordinate + i][0] != pieceID[0]) {
        possibleMovements.push([pieceRowCoordinate + i, pieceColumnCoordinate + i]);
        if (boardData[pieceRowCoordinate + i][pieceColumnCoordinate + i] != null) {
          break; // Stop checking once a piece is hit
        }
      } else {
        break;
      }
    }

    // Going row- col+
    for (var i = 1; i <= calculatedLimit; i++) {
      if (pieceRowCoordinate - i < 0 || pieceColumnCoordinate + i >= 8 || (boardData[pieceRowCoordinate - i][pieceColumnCoordinate + i] == null && pieceMovements[pieceID[1]].diagonalCapture)) {
        break;
      }
      if (boardData[pieceRowCoordinate - i][pieceColumnCoordinate + i] == null || boardData[pieceRowCoordinate - i][pieceColumnCoordinate + i][0] != pieceID[0]) {
        possibleMovements.push([pieceRowCoordinate - i, pieceColumnCoordinate + i]);
        if (boardData[pieceRowCoordinate - i][pieceColumnCoordinate + i] != null) {
          break; // Stop checking once a piece is hit
        }
      } else {
        break;
      }
    }

    // Going row+ col-
    for (var i = 1; i <= calculatedLimit; i++) {
      if (pieceRowCoordinate + i >= 8 || pieceColumnCoordinate - i < 0 || (boardData[pieceRowCoordinate + i][pieceColumnCoordinate - i] == null && pieceMovements[pieceID[1]].diagonalCapture)) {
        break
      }
      if (boardData[pieceRowCoordinate + i][pieceColumnCoordinate - i] == null || boardData[pieceRowCoordinate + i][pieceColumnCoordinate - i][0] != pieceID[0]) {
        possibleMovements.push([pieceRowCoordinate + i, pieceColumnCoordinate - i]);
        if (boardData[pieceRowCoordinate + i][pieceColumnCoordinate - i] != null) {
          break; // Stop checking once a piece is hit
        }
      } else {
        break;
      }
    }

    // Going row- col-
    for (var i = 1; i <= calculatedLimit; i++) {
      if (pieceRowCoordinate - i < 0 || pieceColumnCoordinate - i < 0 || (boardData[pieceRowCoordinate - i][pieceColumnCoordinate - i] == null && pieceMovements[pieceID[1]].diagonalCapture)) {
        break;
      }
      if (boardData[pieceRowCoordinate - i][pieceColumnCoordinate - i] == null || boardData[pieceRowCoordinate - i][pieceColumnCoordinate - i][0] != pieceID[0]) {
        possibleMovements.push([pieceRowCoordinate - i, pieceColumnCoordinate - i]);
        if (boardData[pieceRowCoordinate - i][pieceColumnCoordinate - i] != null) {
          break; // Stop checking once a piece is hit
        }
      } else {
        break;
      }
    }
  }

  return possibleMovements;
}





// RENDERING //

// Renders selection outlines
function renderMovables(selectionCoordinates) {
  for (var i = 0; i < selectionCoordinates.length; i++) {
    var elementCoords = convertToChessCoords(selectionCoordinates[i][0], selectionCoordinates[i][1]);
    document.getElementById(elementCoords).classList.add("boardMovableCell");
  }
}

// Creates a cell element for the chess board
function renderChessBoardCell(row, col, pieceID) {
  // Create cell table element and style accordingly
  var cell = document.createElement("td");
  cell.classList.add("boardCell");
  var cellCoords = convertToChessCoords(row, col);

  // Cell is blank so attribute should reflect accordingly
  cell.setAttribute("piece", '');
  cell.id = cellCoords; // ID is equal to coordinate

  // Cell interaction logic
  cell.addEventListener('click', handleCellClick);

  // Check if cell should be black or white
  var cellIndex = row + col;
  if (cellIndex % 2 == 0) {
    cell.classList.add("boardWhiteCell");
  } else {
    cell.classList.add("boardBlackCell");
  }

  // Create image element for cell
  var cellImage = document.createElement("img");
  cellImage.classList.add("cellImage");
  if (pieceID !== null && pieceID !== undefined) {
    // Set image source to corresponding piece
    cellImage.src = './pieces/' + pieceID + '.svg';
  } else {
    cellImage.src = '';
  }
  cell.appendChild(cellImage);

  // Apply pieceID to cell
  cell.setAttribute("piece", pieceID); // Set attributes
  var cellImage = cell.children[0]; // Get img element

  // Return finalised cell element
  return cell;
}

function convertToNumericalCoords(alphaCoords) {
  var columnNumberCoordinate = columnLetters.findIndex(function (element) { return (element == alphaCoords[0]) });
  var rowNumberCoordinate = 8 - parseInt(alphaCoords[1]);

  return [rowNumberCoordinate, columnNumberCoordinate];
}

function convertToChessCoords(numericalRowCoord, numericalColCoord) {
  return columnLetters[numericalColCoord] + (8 - numericalRowCoord).toString();
}

// Renders a chess board
function renderBoard(boardData, renderCellFn) {
  // Default function call
  if (renderCellFn === undefined) {
    renderCellFn = function () { return document.createElement('td') }
  }

  // Create table
  var table = document.createElement("table");

  // Create table rows
  for (var rowIndex = 0; rowIndex < boardData.length; rowIndex++) {
    var rowElement = document.createElement("tr");
    // Create table cells
    for (var cellIndex = 0; cellIndex < boardData[rowIndex].length; cellIndex++) {
      // Add cell to table
      rowElement.appendChild(renderCellFn(rowIndex, cellIndex, boardData[rowIndex][cellIndex]));
    }

    // Add row to table
    table.appendChild(rowElement);
  }

  // Return created table element
  return table;
}


// Sets a cell in the chess board given X and Y coordinates
function setRenderedCell(cellColCoord, cellRowCoord, pieceID) {
  coordinates = convertToChessCoords(cellRowCoord, cellColCoord);

  // Get cell (ID is coordinate remember)
  var cell = document.getElementById(coordinates);
  cell.setAttribute("piece", pieceID); // Set attributes
  var cellImage = cell.children[0]; // Get img element

  // If no piece, recreate image element to "refresh" it to blank
  if (pieceID === null || pieceID === undefined) {
    cellImage.remove(); // TODO: Instead replace with blank svg

    // Create image element for cell
    var cellImage = document.createElement("img");
    cellImage.classList.add("cellImage");
    cellImage.src = '';
    cell.appendChild(cellImage);
  } else {
    // Set image source to corresponding piece
    cellImage.src = './pieces/' + pieceID + '.svg';
  }
}


// Parses FEN string to board
function parseFenToBoard(fen) {
  // Create board data
  var boardData = createBoard(8, 8);

  // Split FEN into individual elements
  fen = fen.split(' ');

  // Check validity
  if (fen.length == 6) {
    // PARSE PIECE PLACEMENT //

    // Split rows
    var rows = fen[0].split('/'); // Every row

    // Set current board row to top (FEN is top->bottom)
    var boardRowIndex = 0; // ID of current row being edited on board

    // Loop through FEN rows
    for (var rowDataIndex = 0; rowDataIndex < rows.length; rowDataIndex++) {
      var rowPositions = rows[rowDataIndex].split(''); // Get positions in a row
      var boardCellIndex = 0; // ID of current column/cell being edited on board

      // Loop through cells in row
      for (var cellDataIndex = 0; cellDataIndex < rowPositions.length; cellDataIndex++) {
        // Check if is piece or number
        if (validPieceIDs.includes(rowPositions[cellDataIndex].toLowerCase())) {
          // Check if it is black/white piece based on 
          if (rowPositions[cellDataIndex].toLowerCase() == rowPositions[cellDataIndex]) {
            var pieceColour = 'b';
          } else {
            var pieceColour = 'w';
          }
          // Calculate coordinates and set cell accordingly
          boardData[boardRowIndex][boardCellIndex] = pieceColour + rowPositions[cellDataIndex];
          boardCellIndex++;
        } else {
          // If it is a number, set x amount of cells as empty
          for (var i = 0; i < rowPositions[cellDataIndex]; i++) {
            boardData[boardRowIndex][boardCellIndex] = null;
            boardCellIndex++;
          }
        }
      }

      boardRowIndex++;
    }
  } else {
    // FEN Value is invalid
    console.log("INVALID FEN")
  }

  return boardData;
}



// Run initialisation on load
function onPageLoad() {
  chessBoard = document.getElementById("chessBoard");

  window.boardData = createBoard(8, 8);

  window.gameData = createGame();

  chessBoard.appendChild(renderBoard(boardData, renderChessBoardCell));
}