const clickButton = document.getElementById('clickButton');
const scoreDisplay = document.getElementById('score');
let score = 0;

// Function to update the score based on time
function decreaseScore() {
    if (score > 0) {
        score--;
        scoreDisplay.textContent = score;
    }
}

// Set up the timer to decrease the score every 1000 milliseconds (1 second)
setInterval(decreaseScore, 1000);

clickButton.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score;
});

// Initial display of the score
scoreDisplay.textContent = score;
