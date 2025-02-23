let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameStarted = false;

// Winning combinations
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Set initial player turn message
document.getElementById("result").textContent = `Player ${currentPlayer}'s Turn`;

// Handle button click
function handleClick(event) {
    let index = event.target.id.replace("b", "");

    if (board[index] === "") { 
        board[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        gameStarted = true;

        if (checkWinner()) {
            document.getElementById("result").textContent = `Player ${currentPlayer} Wins!`;
            disableButtons();
            return;
        } else if (board.every(cell => cell !== "")) { // Check for tie
            document.getElementById("result").textContent = "It's a Tie!";
            return;
        } 

        // Switch turns
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        document.getElementById("result").textContent = `Player ${currentPlayer}'s Turn`;
    }
}

// Check for a winner
function checkWinner() {
    return winPatterns.some(pattern => {
        let [a, b, c] = pattern;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

// Disable all buttons after a win
function disableButtons() {
    for (let i = 0; i < 9; i++) {
        document.getElementById("b" + i).disabled = true;
    }
}

// Add event listeners
for (let i = 0; i < 9; i++) {
    document.getElementById("b" + i).addEventListener("click", handleClick);
}

// Change First Player
const changePlayer = document.querySelector('.changePlayer');

changePlayer.addEventListener('click', () => {
    if (!gameStarted) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        document.getElementById("result").innerText = `First Player is ${currentPlayer}!`;
    } else {
        document.getElementById("result").innerText = "Error! Game already started!";
    }
});

// Reset board
const resetGameButton = document.querySelector('.js-reset-game');

resetGameButton.addEventListener('click', () => {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameStarted = false;
    document.getElementById("result").innerText = `Player ${currentPlayer}'s Turn`;

    for (let i = 0; i < 9; i++) {
        document.getElementById("b" + i).textContent = "";
        document.getElementById("b" + i).disabled = false;
    }
});
