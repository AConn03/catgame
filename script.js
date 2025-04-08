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

let score = 0;
const scoreLossPerSecond = 1; // Define how many points are lost per second

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
    console.log('Game saved. Score:', score, 'Last Visit:', localStorage.getItem('lastVisitTime'));
}

function loadGame() {
    const savedScore = localStorage.getItem('clickerGameScore');
    const lastVisitTime = localStorage.getItem('lastVisitTime');

    if (savedScore !== null) {
        score = parseInt(savedScore);

        if (lastVisitTime !== null) {
            const timeDifference = Date.now() - parseInt(lastVisitTime);
            const secondsGone = Math.floor(timeDifference / 1000);
            const pointsToLose = secondsGone * scoreLossPerSecond;

            if (score > 0) {
                score = Math.max(0, score - pointsToLose); // Ensure score doesn't go below 0
                console.log('Points lost while away:', pointsToLose);
            }

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
        scoreDisplay.textContent = score; // Update the score display after loading and potential point loss
        console.log('Game loaded. Score:', score, 'Last Visit:', lastVisitTime);
    }
}

loadGame();
updateClock();

function decreaseScore() {
    if (score > 0) {
        score -= 1;
        scoreDisplay.textContent = score;
        saveGame();
    }
}

setInterval(decreaseScore, 1000);

clickButton.addEventListener('click', () => {
    score += 1;
    scoreDisplay.textContent = score;
    saveGame();
});

setInterval(saveGame, 5000);
