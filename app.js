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
    const moveAmount = 20; // Increased for more responsive movement
    if (e.key === 'ArrowLeft' && catcherPosition > 0) {
        catcherPosition = Math.max(0, catcherPosition - moveAmount);
    } else if (e.key === 'ArrowRight' && catcherPosition < gameContainer.offsetWidth - 50) {
        catcherPosition = Math.min(gameContainer.offsetWidth - 50, catcherPosition + moveAmount);
    }
    catcher.style.left = `${catcherPosition}px`;
});

// Function to create falling items (records)
function createFallingItem() {
    const item = document.createElement('div');
    item.classList.add('falling-item');
    // Adjust starting position to account for item width
    const startX = Math.random() * (gameContainer.offsetWidth - 40);
    item.style.left = `${startX}px`;
    item.style.top = '0px';
    gameContainer.appendChild(item);

    let itemPosition = 0;
    const fallSpeed = 5; // Adjust this value to change falling speed

    let fallInterval = setInterval(() => {
        if (!isGameRunning) {
            clearInterval(fallInterval);
            item.remove();
            return;
        }

        itemPosition += fallSpeed;
        item.style.top = `${itemPosition}px`;

        // Get updated positions for collision detection
        const itemRect = item.getBoundingClientRect();
        const catcherRect = catcher.getBoundingClientRect();
        const containerRect = gameContainer.getBoundingClientRect();

        // Check for collision with catcher
        if (itemRect.bottom >= catcherRect.top &&
            itemRect.top <= catcherRect.bottom &&
            itemRect.right >= catcherRect.left &&
            itemRect.left <= catcherRect.right) {
            item.remove();
            score += 1;
            scoreDisplay.textContent = `Score: ${score}`;
            clearInterval(fallInterval);
            checkGameStatus();
        }
        // Check if item has fallen past the catcher
        else if (itemRect.top >= containerRect.bottom) {
            item.remove();
            missedRecords += 1;
            clearInterval(fallInterval);
            checkGameStatus();
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
        gameStatus.textContent = "";
        score = 0;
        missedRecords = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        gameInterval = setInterval(createFallingItem, 1500); // Adjusted timing for better gameplay
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
    // Remove all existing falling items
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

