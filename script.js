let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameStarted = false;
let aiLevel = "min"; // Default AI difficulty

// Winning combinations remain the same
const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Set initial turn message
document.getElementById("result").textContent = `Player ${currentPlayer}'s Turn`;

// --- Utility: Get Winner ---
// This function returns "X" or "O" if there is a winning pattern, or null otherwise.
function getWinner(b) {
  for (let pattern of winPatterns) {
    const [a, bIndex, c] = pattern;
    if (b[a] && b[a] === b[bIndex] && b[a] === b[c]) {
      return b[a];
    }
  }
  return null;
}

// --- AI Difficulty Selection ---
document.getElementById("ai-level").addEventListener("change", (event) => {
  aiLevel = event.target.value;
});

// --- Handle Button Click (Player Move) ---
function handleClick(event) {
  let index = event.target.id.replace("b", "");

  // If cell is already taken, ignore click.
  if (board[index] !== "") return;

  // Place current player's symbol on board and update UI.
  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;
  gameStarted = true;

  // Check if someone won
  let winner = getWinner(board);
  if (winner) {
    document.getElementById("result").textContent = `Player ${winner} Wins!`;
    disableButtons();
    return;
  } else if (board.every(cell => cell !== "")) {
    document.getElementById("result").textContent = "It's a Tie!";
    return;
  }

  // Switch turns.
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  // Check if AI mode is enabled.
  const aiEnabled = document.getElementById("ai-toggle").checked;
  if (aiEnabled && currentPlayer === "O") {
    document.getElementById("result").textContent = `AI's Turn`;
    setTimeout(aiMove, 500);
  } else {
    document.getElementById("result").textContent = `Player ${currentPlayer}'s Turn`;
  }
}

// --- AI Move ---
function aiMove() {
  if (aiLevel === "min") {
    randomMove();
  } else if (aiLevel === "normal") {
    smartMove();
  } else if (aiLevel === "max") {
    bestMove();
  }

  let winner = getWinner(board);
  if (winner) {
    document.getElementById("result").textContent = "AI Wins!";
    disableButtons();
  } else if (board.every(cell => cell !== "")) {
    document.getElementById("result").textContent = "It's a Tie!";
  } else {
    currentPlayer = "X";
    document.getElementById("result").textContent = "Player X's Turn";
  }
}

// --- AI Min Level (Random Moves) ---
function randomMove() {
  let emptyCells = board.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  if (emptyCells.length > 0) {
    let move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[move] = "O";
    document.getElementById("b" + move).textContent = "O";
  }
}

// --- AI Normal Level (Smart: Block & Win) ---
function smartMove() {
  // First try to win or block in each win pattern.
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    let values = [board[a], board[b], board[c]];

    // Try to win if possible.
    if (values.filter(v => v === "O").length === 2 && values.includes("")) {
      let move = pattern[values.indexOf("")];
      board[move] = "O";
      document.getElementById("b" + move).textContent = "O";
      return;
    }

    // Block the opponent if they are about to win.
    if (values.filter(v => v === "X").length === 2 && values.includes("")) {
      let move = pattern[values.indexOf("")];
      board[move] = "O";
      document.getElementById("b" + move).textContent = "O";
      return;
    }
  }
  // If no immediate win or block, pick randomly.
  randomMove();
}

// --- AI Max Level (Unbeatable via Minimax) ---
function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  board[move] = "O";
  document.getElementById("b" + move).textContent = "O";
}

function minimax(b, depth, isMaximizing) {
  let winner = getWinner(b);
  if (winner === "O") return 1;
  if (winner === "X") return -1;
  if (b.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i] === "") {
        b[i] = "O";
        let score = minimax(b, depth + 1, false);
        b[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i] === "") {
        b[i] = "X";
        let score = minimax(b, depth + 1, true);
        b[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// --- Disable All Buttons (after game over) ---
function disableButtons() {
  for (let i = 0; i < 9; i++) {
    document.getElementById("b" + i).disabled = true;
  }
}

// --- Add Click Event Listeners for Game Board ---
for (let i = 0; i < 9; i++) {
  document.getElementById("b" + i).addEventListener("click", handleClick);
}

// --- Change First Player Button ---
const changePlayer = document.querySelector('.changePlayer');
changePlayer.addEventListener('click', () => {
  if (!gameStarted) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById("result").innerText = `First Player is ${currentPlayer}!`;
    document.getElementById("changePlayerBtn").innerText = `Starting Player: ${currentPlayer}`;
  } else {
    document.getElementById("result").innerText = "Error! Game already started!";
  }
});

// --- Reset Game ---
document.querySelector('.js-reset-game').addEventListener('click', () => {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameStarted = false;
  document.getElementById("result").innerText = `Player ${currentPlayer}'s Turn`;
  document.getElementById("changePlayerBtn").innerText = 'Starting Player: X'

  for (let i = 0; i < 9; i++) {
    let btn = document.getElementById("b" + i);
    btn.textContent = "";
    btn.disabled = false;
  }
});
