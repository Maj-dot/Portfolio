const body = document.body;
const toggleButton = document.getElementById('dark-mode-toggle');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const gameContainer = document.getElementById('game-container');
const catcher = document.getElementById('catcher');
const scoreDisplay = document.getElementById('score');
const startPauseBtn = document.getElementById('start-pause-btn');
const gameStatus = document.getElementById('game-status');

const text = "Hi, I'm Brittany Herbert";
let index = 0;
const typewriterElement = document.getElementById('typewriter');
const cursorElement = document.getElementById('cursor');

let score = 0;
let missedRecords = 0;
const winningScore = 10;
const maxMisses = 5;
let isGameRunning = false;
let gameInterval;
let catcherPosition = gameContainer.offsetWidth / 2 - 25;

// Update catcher position based on arrow keys
document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;
    if (e.key === 'ArrowLeft' && catcherPosition > 0) {
        catcherPosition -= 10;
    } else if (e.key === 'ArrowRight' && catcherPosition < gameContainer.offsetWidth - 50) {
        catcherPosition += 10;
    }
    catcher.style.left = `${catcherPosition}px`;
});

// Function to create falling items (records)
function createFallingItem() {
    const item = document.createElement('div');
    item.classList.add('falling-item');
    item.style.left = `${Math.random() * (gameContainer.offsetWidth - 40)}px`; // Adjust for item width
    gameContainer.appendChild(item);

    let fallInterval = setInterval(() => {
        if (!isGameRunning) {
            clearInterval(fallInterval);
            return;
        }

        const itemRect = item.getBoundingClientRect();
        const catcherRect = catcher.getBoundingClientRect();

        // Check if item reaches the catcher
        if (
            itemRect.bottom >= catcherRect.top &&
            itemRect.left >= catcherRect.left &&
            itemRect.right <= catcherRect.right
        ) {
            item.remove();
            score += 1;
            scoreDisplay.textContent = `Score: ${score}`;
            clearInterval(fallInterval);
            checkGameStatus();
        } else if (itemRect.bottom > gameContainer.offsetHeight) {
            item.remove();
            missedRecords += 1;
            clearInterval(fallInterval);
            checkGameStatus();
        } else {
            item.style.top = `${item.offsetTop + 5}px`;
        }
    }, 30);
}

// Start or pause the game
startPauseBtn.addEventListener('click', () => {
    if (isGameRunning) {
        isGameRunning = false;
        startPauseBtn.textContent = "Start Game";
        clearInterval(gameInterval);
    } else {
        isGameRunning = true;
        startPauseBtn.textContent = "Pause Game";
        gameStatus.textContent = ""; // Clear status message
        score = 0;
        missedRecords = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        gameInterval = setInterval(createFallingItem, 1000);
    }
});

// Check for winning or losing conditions
function checkGameStatus() {
    if (score >= winningScore) {
        gameStatus.textContent = "You Win! 🎉";
        endGame();
    } else if (missedRecords >= maxMisses) {
        gameStatus.textContent = "Game Over. Try Again!";
        endGame();
    }
}

// End the game
function endGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    Array.from(document.getElementsByClassName('falling-item')).forEach(item => item.remove());
    startPauseBtn.textContent = "Start Game";
}

// Dark mode toggle
toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll to top button
window.onscroll = function() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Typewriter effect
function typeWriter() {
    if (index < text.length) {
        typewriterElement.innerHTML = text.substring(0, index + 1) + "<span id='cursor'>|</span>";
        index++;
        setTimeout(typeWriter, 100);
    } else {
        cursorElement.style.animation = 'none';
    }
}

window.onload = () => {
    typeWriter();
};