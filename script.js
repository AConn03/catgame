const clickButton = document.getElementById('clickButton');
const scoreDisplay = document.getElementById('score');
const clockDisplay = document.getElementById('clock');
const lastVisitDisplay = document.createElement('div');
lastVisitDisplay.style.position = 'fixed';
lastVisitDisplay.style.top = '50%';
lastVisitDisplay.style.left = '50%';
lastVisitDisplay.style.transform = 'translate(-50%, -50%)';
lastVisitDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
lastVisitDisplay.style.color = 'white';
lastVisitDisplay.style.padding = '20px';
lastVisitDisplay.style.borderRadius = '10px';
lastVisitDisplay.style.zIndex = '1000';
lastVisitDisplay.style.display = 'none';
document.body.appendChild(lastVisitDisplay);

const clicker2Button = document.getElementById('clicker2Button');
const clicker2Progress = document.getElementById('clicker2Progress');
let clicker2Value = 0;
const clicker2MaxValue = 100;
const clicker2LossPerSecond = 1; // Adjust the loss rate as needed

const clicker3Button = document.getElementById('clicker3Button');
const clicker3Progress = document.getElementById('clicker3Progress');
let clicker3Value = 0;
const clicker3MaxValue = 150;
const clicker3LossPerSecond = 1; // Adjust the loss rate as needed

let score = 0;
const scoreLossPerSecond = 1;

function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    clockDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);

function saveGame() {
    localStorage.setItem('clickerGameScore', score);
    localStorage.setItem('lastVisitTime', Date.now());
    localStorage.setItem('clicker2Value', clicker2Value);
    localStorage.setItem('clicker3Value', clicker3Value);
    console.log('Game saved. Score:', score, 'Last Visit:', localStorage.getItem('lastVisitTime'), 'Clicker 2:', clicker2Value, 'Clicker 3:', clicker3Value);
}

function loadGame() {
    const savedScore = localStorage.getItem('clickerGameScore');
    const lastVisitTime = localStorage.getItem('lastVisitTime');
    const savedClicker2Value = localStorage.getItem('clicker2Value');
    const savedClicker3Value = localStorage.getItem('clicker3Value');

    if (savedScore !== null) {
        score = parseInt(savedScore);
    }
    if (savedClicker2Value !== null) {
        clicker2Value = parseInt(savedClicker2Value);
        updateProgressBar(clicker2Progress, clicker2Value, clicker2MaxValue);
    }
    if (savedClicker3Value !== null) {
        clicker3Value = parseInt(savedClicker3Value);
        updateProgressBar(clicker3Progress, clicker3Value, clicker3MaxValue);
    }

    if (lastVisitTime !== null) {
        const timeDifference = Date.now() - parseInt(lastVisitTime);
        const secondsGone = Math.floor(timeDifference / 1000);

        if (score > 0) {
            const scoreToLoseWhileAway = secondsGone * scoreLossPerSecond;
            score = Math.max(0, score - scoreToLoseWhileAway);
            console.log('Score lost while away:', scoreToLoseWhileAway);
        }

        const clicker2LossWhileAway = secondsGone * clicker2LossPerSecond;
        clicker2Value = Math.max(0, clicker2Value - clicker2LossWhileAway);
        updateProgressBar(clicker2Progress, clicker2Value, clicker2MaxValue);
        console.log('Clicker 2 lost while away:', clicker2LossWhileAway);

        const clicker3LossWhileAway = secondsGone * clicker3LossPerSecond;
        clicker3Value = Math.max(0, clicker3Value - clicker3LossWhileAway);
        updateProgressBar(clicker3Progress, clicker3Value, clicker3MaxValue);
        console.log('Clicker 3 lost while away:', clicker3LossWhileAway);

        const minutesGone = Math.floor(secondsGone / 60);
        const hoursGone = Math.floor(minutesGone / 60);

        let goneMessage = 'You\'ve been gone for ';
        if (hoursGone > 0) {
            goneMessage += `${hoursGone} hours, `;
        }
        if (minutesGone % 60 > 0) {
            goneMessage += `${minutesGone % 60} minutes, `;
        }
        goneMessage += `${secondsGone % 60} seconds.`;

        lastVisitDisplay.textContent = goneMessage;
        lastVisitDisplay.style.display = 'block';

        setTimeout(() => {
            lastVisitDisplay.style.display = 'none';
        }, 5000);
    }
    scoreDisplay.textContent = score;
    console.log('Game loaded. Score:', score, 'Last Visit:', lastVisitTime, 'Clicker 2:', clicker2Value, 'Clicker 3:', clicker3Value);
}

function updateProgressBar(progressBar, value, maxValue) {
    const percentage = (value / maxValue) * 100;
    progressBar.style.width = `${percentage}%`;
}

loadGame();
updateClock();

function decreaseScore() {
    if (score > 0) {
        score -= scoreLossPerSecond;
        scoreDisplay.textContent = score;
        saveGame();
    }
    // Decrease Clicker 2 value
    if (clicker2Value > 0) {
        clicker2Value = Math.max(0, clicker2Value - clicker2LossPerSecond);
        updateProgressBar(clicker2Progress, clicker2Value, clicker2MaxValue);
        saveGame();
    }
    // Decrease Clicker 3 value
    if (clicker3Value > 0) {
        clicker3Value = Math.max(0, clicker3Value - clicker3LossPerSecond);
        updateProgressBar(clicker3Progress, clicker3Value, clicker3MaxValue);
        saveGame();
    }
}

setInterval(decreaseScore, 1000);

clickButton.addEventListener('click', () => {
    score += 5;
    scoreDisplay.textContent = score;
    saveGame();
});

clicker2Button.addEventListener('click', () => {
    clicker2Value = Math.min(clicker2Value + 10, clicker2MaxValue);
    updateProgressBar(clicker2Progress, clicker2Value, clicker2MaxValue);
    saveGame();
});

clicker3Button.addEventListener('click', () => {
    clicker3Value = Math.min(clicker3Value + 10, clicker3MaxValue);
    updateProgressBar(clicker3Progress, clicker3Value, clicker3MaxValue);
    saveGame();
});

setInterval(saveGame, 5000);
