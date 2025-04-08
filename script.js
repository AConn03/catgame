const clickButton = document.getElementById('clickButton');
const scoreDisplay = document.getElementById('score');
const clockDisplay = document.getElementById('clock'); // Get the clock element
let score = 0;

function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    clockDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

// Update the clock every second
setInterval(updateClock, 1000);

// Function to save the game state
function saveGame() {
    localStorage.setItem('clickerGameScore', score);
    console.log('Game saved. Score:', score); // For debugging
}

// Function to load the game state
function loadGame() {
    const savedScore = localStorage.getItem('clickerGameScore');
    if (savedScore !== null) {
        score = parseInt(savedScore);
        scoreDisplay.textContent = score;
        console.log('Game loaded. Score:', score); // For debugging
    }
}

// Load the game state when the page loads
loadGame();
updateClock(); // Initial call to display the clock immediately

// Function to update the score based on time
function decreaseScore() {
    if (score > 0) {
        score--;
        scoreDisplay.textContent = score;
        saveGame(); // Save the game state after the score changes
    }
}

// Set up the timer to decrease the score every 1000 milliseconds (1 second)
setInterval(decreaseScore, 1000);

clickButton.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score;
    saveGame(); // Save the game state after a click
});

// Save the game state periodically (optional, but good for backups)
setInterval(saveGame, 5000); // Save every 5 seconds
