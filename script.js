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

let money = 0;
const moneyThresholdPercentage = 90; // Threshold as a percentage (e.g., 50%)
const moneyEarnedPerSecond = 1; // Amount of money earned per second

const moneyDisplay = document.createElement('div');
moneyDisplay.style.position = 'fixed';
moneyDisplay.style.top = '10px';
moneyDisplay.style.left = '10px';
moneyDisplay.style.color = 'white';
moneyDisplay.style.fontSize = '20px';
moneyDisplay.style.zIndex = '1000';
moneyDisplay.textContent = `Money: $${money}`;
document.body.appendChild(moneyDisplay);


const clicker1Button = document.getElementById('clicker1Button');
const clicker1Progress = document.getElementById('clicker1Progress');
let clicker1Value = 0;
const clicker1AddValue = 100;
const clicker1MaxValue = 1000;
const clicker1LossPerSecond = 0.01;

const clicker2Button = document.getElementById('clicker2Button');
const clicker2Progress = document.getElementById('clicker2Progress');
let clicker2Value = 0;
const waterValue = 50;
const clicker2AddValue = 10;
const clicker2MaxValue = 1000;
const clicker2LossPerSecond = 0.1;

const clicker3Button = document.getElementById('clicker3Button');
const clicker3Progress = document.getElementById('clicker3Progress');
let clicker3Value = 0;
const fishValue = 100;
const clicker3AddValue = 10;
const clicker3MaxValue = 1000;
const clicker3LossPerSecond = 0.05;

function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    clockDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);

function saveGame() {
    localStorage.setItem('lastVisitTime', Date.now());
    localStorage.setItem('money', money);

    localStorage.setItem('clicker1Value', clicker1Value);
    localStorage.setItem('clicker2Value', clicker2Value);
    localStorage.setItem('clicker3Value', clicker3Value);
    console.log('Game saved. Clicker 1:', clicker1Value, 'Last Visit:', localStorage.getItem('lastVisitTime'), 'Clicker 2:', clicker2Value, 'Clicker 3:', clicker3Value);
}

function loadGame() {
    const lastVisitTime = localStorage.getItem('lastVisitTime');
    
    const savedMoney = localStorage.getItem('money');
    const savedClicker1Value = localStorage.getItem('clicker1Value');
    const savedClicker2Value = localStorage.getItem('clicker2Value');
    const savedClicker3Value = localStorage.getItem('clicker3Value');
    
    if (savedMoney !== null) {
        money = parseInt(savedMoney);
        moneyDisplay.textContent = `Money: $${money}`;
    }
    

    if (savedClicker1Value !== null) {
        clicker1Value = parseInt(savedClicker1Value);
        updateProgressBar(clicker1Progress, clicker1Value, clicker1MaxValue);
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

        const clicker1LossWhileAway = secondsGone * clicker1LossPerSecond;
        clicker1Value = Math.max(0, clicker2Value - clicker1LossWhileAway);
        updateProgressBar(clicker1Progress, clicker1Value, clicker1MaxValue);
        console.log('Clicker 1 lost while away:', clicker1LossWhileAway);


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
    console.log('Game loaded. Clicker 1:', clicker1Value, 'Last Visit:', lastVisitTime, 'Clicker 2:', clicker2Value, 'Clicker 3:', clicker3Value);
}

function updateProgressBar(progressBar, value, maxValue) {
    const percentage = (value / maxValue) * 100;
    progressBar.style.width = `${percentage}%`;

    // Create or update the text displaying value/percent after the progress bar
    let progressText = progressBar.nextElementSibling;

    // If the progress text does not exist, create it
    if (!progressText) {
        progressText = document.createElement('div');
        progressText.classList.add('progress-text');
        progressBar.parentNode.appendChild(progressText);
    }

    // Set the text content in the format of 'value / maxValue (percent%)'
    progressText.textContent = `${value} / ${maxValue} (${Math.round(percentage)}%)`;
}


loadGame();
updateClock();

// Function to check if the clicker is above the threshold
function isAboveThreshold(clickerValue, clickerMaxValue, thresholdPercentage) {
    const percentage = (clickerValue / clickerMaxValue) * 100;
    return percentage >= thresholdPercentage;
}

function decreaseScore() {
    if (clicker1Value > 0) {
        clicker1Value = Math.max(0, clicker1Value - clicker1LossPerSecond);
        updateProgressBar(clicker1Progress, clicker1Value, clicker1MaxValue);
    }
    // Decrease Clicker 2 value
    if (clicker2Value > 0) {
        clicker2Value = Math.max(0, clicker2Value - clicker2LossPerSecond);
        updateProgressBar(clicker2Progress, clicker2Value, clicker2MaxValue);
    }
    // Decrease Clicker 3 value
    if (clicker3Value > 0) {
        clicker3Value = Math.max(0, clicker3Value - clicker3LossPerSecond);
        updateProgressBar(clicker3Progress, clicker3Value, clicker3MaxValue);
    }
}

setInterval(decreaseScore, 1000);

// Clicker event listeners (for clicking actions)
clicker1Button.addEventListener('click', () => {
    clicker1Value = Math.min(clicker1Value + clicker1AddValue, clicker1MaxValue);
    updateProgressBar(clicker1Progress, clicker1Value, clicker1MaxValue);
});

clicker2Button.addEventListener('click', () => {
    clicker2Value = Math.min(clicker2Value + clicker2AddValue, clicker2MaxValue);
    updateProgressBar(clicker2Progress, clicker2Value, clicker2MaxValue);
});

clicker3Button.addEventListener('click', () => {
    clicker3Value = Math.min(clicker3Value + clicker3AddValue, clicker3MaxValue);
    updateProgressBar(clicker3Progress, clicker3Value, clicker3MaxValue);
});

setInterval(() => {
    // Check if each clicker is above the threshold and earn money if true
    if (
        isAboveThreshold(clicker1Value, clicker1MaxValue, moneyThresholdPercentage) &&
        isAboveThreshold(clicker2Value, clicker2MaxValue, moneyThresholdPercentage) &&
        isAboveThreshold(clicker3Value, clicker3MaxValue, moneyThresholdPercentage)
    ) {
        money += moneyEarnedPerSecond;
    }

    // Update the money display
    moneyDisplay.textContent = `Money: $${money}`;
}, 1000);

setInterval(saveGame, 5000);

// Get references to the draggable images
const draggableImage = document.getElementById('draggableImage');
let draggableImage2 = document.getElementById('draggableImage2');

// Store mouse move and up handlers so we can remove them later
let mouseMoveHandler, mouseUpHandler;

// Function to handle the dragging logic
function makeDraggable(imageElement) {
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    // Remove previous event listeners if they exist
    imageElement.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);

    function handleMouseDown(e) {
        isDragging = true;
        offsetX = e.clientX - imageElement.getBoundingClientRect().left;
        offsetY = e.clientY - imageElement.getBoundingClientRect().top;
        imageElement.style.cursor = 'grabbing';
        imageElement.style.position = 'absolute';
    }

    mouseMoveHandler = function(e) {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            imageElement.style.left = `${x}px`;
            imageElement.style.top = `${y}px`;
        }
    };

    mouseUpHandler = function() {
        if (isDragging) {
            isDragging = false;
            imageElement.style.cursor = 'grab';
            
            // Check collision with current fish image
            if (draggableImage2 && isOnTopOf(draggableImage, draggableImage2)) {
                clicker3Value += fishValue;
                clicker2Value += waterValue;
                console.log("Fish eaten! clicker3Value:", clicker3Value);
                
                // Remove old fish
                draggableImage2.remove();
                
                // Create new fish
                addRandomFishImage();
            }
        }
    };

    // Add new event listeners
    imageElement.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);

    // Prevent default drag behavior
    imageElement.addEventListener('dragstart', (e) => e.preventDefault());
}

// Improved collision detection with threshold
function isOnTopOf(image1, image2) {
    if (!image1 || !image2) return false;
    
    const rect1 = image1.getBoundingClientRect();
    const rect2 = image2.getBoundingClientRect();
    
    // 20px threshold for easier collision
    const threshold = 20;
    
    return (
        rect2.left + threshold < rect1.right - threshold &&
        rect2.right - threshold > rect1.left + threshold &&
        rect2.top + threshold < rect1.bottom - threshold &&
        rect2.bottom - threshold > rect1.top + threshold
    );
}

function addRandomFishImage() {
    // Create new fish
    const newFishImage = document.createElement('img');
    newFishImage.src = 'images/fish.png';
    newFishImage.alt = 'Fish Image';
    newFishImage.id = 'draggableImage2';
    newFishImage.classList.add('draggable');
    newFishImage.style.position = 'absolute';
    newFishImage.style.cursor = 'grab';
    
    // Position within visible area (accounting for image size)
    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 100;
    const randomX = Math.max(0, Math.random() * maxX);
    const randomY = Math.max(0, Math.random() * maxY);
    
    newFishImage.style.left = `${randomX}px`;
    newFishImage.style.top = `${randomY}px`;
    
    // Add to DOM
    document.body.appendChild(newFishImage);
    
    // Update global reference
    draggableImage2 = newFishImage;
    
    // Make draggable
    makeDraggable(newFishImage);
}

// Initialize
makeDraggable(draggableImage);
makeDraggable(draggableImage2);
