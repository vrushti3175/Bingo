let boards = [[], []];
let currentDraw = null;
let usedNumbers = [];

function startGame() {
  usedNumbers = [];
  document.getElementById("winner").textContent = "";
  document.getElementById("current-number").textContent = "--";

  [0, 1].forEach(player => {
    const boardEl = document.getElementById(`board${player + 1}`);
    boardEl.innerHTML = "";
    boards[player] = generateBoard();

    boards[player].forEach((num, i) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = num;
      if (i === 12) {
        cell.textContent = "FREE";
        cell.classList.add("free", "marked");
      }
      cell.dataset.index = i;
      boardEl.appendChild(cell);
    });
  });
}

function generateBoard() {
  let nums = Array.from({ length: 25 }, (_, i) => i + 1);
  shuffle(nums);
  return nums;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function drawNumber() {
  if (usedNumbers.length >= 75) return;

  let num;
  do {
    num = Math.floor(Math.random() * 75) + 1;
  } while (usedNumbers.includes(num));
  usedNumbers.push(num);
  currentDraw = num;
  document.getElementById("current-number").textContent = num;

  markBoards(num);
  checkWin();
}

function markBoards(num) {
  [0, 1].forEach(player => {
    const board = boards[player];
    const boardEl = document.getElementById(`board${player + 1}`).children;

    board.forEach((cellNum, i) => {
      if (cellNum === num) {
        boardEl[i].classList.add("marked");
      }
    });
  });
}

function checkWin() {
  for (let player = 0; player < 2; player++) {
    const boardEl = document.getElementById(`board${player + 1}`).children;
    let grid = [];

    for (let r = 0; r < 5; r++) {
      grid.push([]);
      for (let c = 0; c < 5; c++) {
        const cell = boardEl[r * 5 + c];
        grid[r][c] = cell.classList.contains("marked");
      }
    }

    const win = checkBingo(grid);
    if (win) {
      document.getElementById("winner").textContent = `🎉 Player ${player + 1} wins!`;
    }
  }
}

function checkBingo(grid) {
  for (let i = 0; i < 5; i++) {
    if (grid[i].every(c => c)) return true;
    if (grid.map(r => r[i]).every(c => c)) return true;
  }

  if ([0,1,2,3,4].every(i => grid[i][i])) return true;
  if ([0,1,2,3,4].every(i => grid[i][4-i])) return true;

  return false;
}

window.onload = startGame;
