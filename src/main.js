const boardSize = 15;
const currentPlayersCount = 2;
const playersName = ["Dmitro", "Kate", "Olya", "Artem"];
const theme = "classic"; // You can set it up to modern and see how it will be displayed.
let currentPlayer = 0;
let userColors = [];
let gameBoardLogic = [];

(function main() {
  const board = createBoard(boardSize);
  setGameTheme(theme);
  setPlayerHoverColor();
  createPlayerStats();
  updatePlayerStats();
  appendBoard(board);
})();

//
// Ways to play
//

function setPlayerCell(cellObject) {
  if (gameBoardLogic[cellObject.x][cellObject.y] === -1) {
    gameBoardLogic[cellObject.x][cellObject.y] = currentPlayer;
    fillUserColor(cellObject.cell);
    nextPlayer();
  } else {
    console.log("Cell is already filled!");
  }
}

function nextPlayer() {
  currentPlayer = (currentPlayer + 1) % currentPlayersCount;
  updatePlayerStats();
  setPlayerHoverColor();
}

function setGameTheme(themeName) {
  let board = document.querySelector(".board");
  let body = document.body;
  const defaultTheme = "classic";
  const themes = {
    classic: {
      board: "#dcb25c",
      body: "#e6c789",
      colors: ["#dbe3ee", "#180b10", "#e60c0e", "#222bb0"]
    },
    modern: {
      board: "#fafafa",
      body: "#fff",
      colors: ["#e60c0e", "#222bb0", "#2db022", "#22b0ad", "#7d22b0"]
    }
  };

  if (themes[themeName]) {
    board.style.background = themes[themeName].board;
    body.style.background = themes[themeName].body;
    userColors = themes[themeName].colors;
  }

  if (userColors.length === 0) {
    board.style.background = themes[defaultTheme].board;
    body.style.background = themes[defaultTheme].body;
    userColors = themes[defaultTheme].colors;
  }
}

function setPlayerHoverColor() {
  const getStyles = document.querySelector("style.hover-cell");
  if (getStyles) getStyles.remove();

  let css = ".board-row__cell:hover {background-color: ";
  let style = document.createElement("style");
  style.className = "hover-cell";

  css += userColors[currentPlayer] + "aa; }";

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  document.head.appendChild(style);
}

//
// Other html-methods
//

function fillUserColor(cell) {
  for (let i = 0; i < currentPlayersCount; i++) {
    if (currentPlayer === i) {
      cell.style.background = userColors[i];
      cell.style.cursor = "default";
    }
  }
}

function createPlayerStats() {
  const statsTarget = document.querySelector(".players-data");
  const playerStatTemplate = document.querySelector("#players-data-item-t");

  for (let i = 0; i < currentPlayersCount; i++) {
    let playerStat = document.importNode(playerStatTemplate.content, true);
    let name = playerStat.querySelector(".players-data-item__title");
    let color = playerStat.querySelector(".players-data-item__dot");

    name.innerHTML = playersName[i];
    color.style.background = userColors[i];
    statsTarget.appendChild(playerStat);
  }
}

function updatePlayerStats() {
  let playersStats = document.querySelectorAll(".players-data-item");
  playersStats.forEach(player => {
    player.className = "players-data-item inactive";
  });

  playersStats[currentPlayer].className = "players-data-item";
}

//
// Methods for the game board
//

function appendBoard(board) {
  const boardElem = document.querySelector(".board");
  board.forEach(row => {
    boardElem.appendChild(row);
  });
}

function createBoard(size) {
  const gameBoard = [];
  const _gameBoardLogic = [];

  for (let i = 0; i < size; i++) {
    const cellsArray = [];
    const _mainCellArray = [];

    for (let ii = 0; ii < size; ii++) {
      const cell = createRowCell(i, ii);
      cellsArray.push(cell);
      _mainCellArray.push(-1);
    }

    const row = createRow(cellsArray);
    gameBoard.push(row);
    _gameBoardLogic.push(_mainCellArray);
  }

  gameBoardLogic = _gameBoardLogic;

  return gameBoard;
}

function createRow(cells) {
  let row = document.createElement("div");
  row.className = "board-row";

  cells.forEach(cell => {
    row.appendChild(cell);
  });

  return row;
}

function createRowCell(x, y) {
  let cell = document.createElement("div");
  cell.className = "board-row__cell";
  cell.addEventListener("click", () => {
    setPlayerCell({ cell, x, y });
  });

  return cell;
}
