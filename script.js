const clickButton = document.getElementById('clickButton');
const scoreDisplay = document.getElementById('score');
const clockDisplay = document.getElementById('clock');
const lastVisitDisplay = document.createElement('div'); // Create a div for the pop-up
lastVisitDisplay.style.position = 'fixed';
lastVisitDisplay.style.top = '50%';
lastVisitDisplay.style.left = '50%';
lastVisitDisplay.style.transform = 'translate(-50%, -50%)';
lastVisitDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
lastVisitDisplay.style.color = 'white';
lastVisitDisplay.style.padding = '20px';
lastVisitDisplay.style.borderRadius = '10px';
lastVisitDisplay.style.zIndex = '1000'; // Ensure it's on top
lastVisitDisplay.style.display = 'none'; // Hidden by default
document.body.appendChild(lastVisitDisplay);

let score = 0;

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
    localStorage.setItem('lastVisitTime', Date.now()); // Save the current timestamp
    console.log('Game saved. Score:', score, 'Last Visit:', localStorage.getItem('lastVisitTime'));
}

function loadGame() {
    const savedScore = localStorage.getItem('clickerGameScore');
    const lastVisitTime = localStorage.getItem('lastVisitTime');

    if (savedScore !== null) {
        score = parseInt(savedScore);
        scoreDisplay.textContent = score;
        console.log('Game loaded. Score:', score, 'Last Visit:', lastVisitTime);

        if (lastVisitTime !== null) {
            const timeDifference = Date.now() - parseInt(lastVisitTime);
            const secondsGone = Math.floor(timeDifference / 1000);
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

            // Make the pop-up disappear after a few seconds (e.g., 5 seconds)
            setTimeout(() => {
                lastVisitDisplay.style.display = 'none';
            }, 5000);
        }
    }
}

loadGame();
updateClock();

function decreaseScore() {
    if (score > 0) {
        score--;
        scoreDisplay.textContent = score;
        saveGame();
    }
}

setInterval(decreaseScore, 1000);

clickButton.addEventListener('click', () => {
    score += 5;
    scoreDisplay.textContent = score;
    saveGame();
});

setInterval(saveGame, 5000);
