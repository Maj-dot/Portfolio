// DOM Elements
const DOM = {
    body: document.body,
    toggleButton: document.getElementById('dark-mode-toggle'),
    scrollToTopBtn: document.getElementById('scrollToTopBtn'),
    typewriterElement: document.getElementById('typewriter'),
    cursorElement: document.getElementById('cursor')
};

// Game Elements
const Game = {
    container: document.getElementById('game-container'),
    catcher: document.getElementById('catcher'),
    scoreDisplay: document.getElementById('score'),
    startPauseBtn: document.getElementById('start-pause-btn'),
    gameStatus: document.getElementById('game-status'),
    
    // Game state
    score: 0,
    missedRecords: 0,
    winningScore: 10,
    maxMisses: 5,
    isRunning: false,
    gameInterval: null,
    catcherPosition: 0,
    
    // Game configuration
    moveAmount: 20,
    fallSpeed: 5,
    spawnInterval: 1500,
    
    // Initialize game
    init() {
        this.catcherPosition = this.container.offsetWidth / 2 - 25;
        this.setupEventListeners();
        this.resetScore();
    },
    
    // Event listeners setup
    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.startPauseBtn.addEventListener('click', this.toggleGame.bind(this));
    },
    
    // Handle keyboard input
    handleKeyPress(e) {
        if (!this.isRunning) return;
        
        if (e.key === 'ArrowLeft' && this.catcherPosition > 0) {
            this.catcherPosition = Math.max(0, this.catcherPosition - this.moveAmount);
        } else if (e.key === 'ArrowRight' && this.catcherPosition < this.container.offsetWidth - 50) {
            this.catcherPosition = Math.min(this.container.offsetWidth - 50, this.catcherPosition + this.moveAmount);
        }
        this.catcher.style.left = `${this.catcherPosition}px`;
    },
    
    // Create falling item
    createFallingItem() {
        const item = document.createElement('div');
        item.classList.add('falling-item');
        const startX = Math.random() * (this.container.offsetWidth - 40);
        item.style.left = `${startX}px`;
        item.style.top = '0px';
        this.container.appendChild(item);
        
        let itemPosition = 0;
        let fallInterval = setInterval(() => {
            if (!this.isRunning) {
                clearInterval(fallInterval);
                item.remove();
                return;
            }
            
            itemPosition += this.fallSpeed;
            item.style.top = `${itemPosition}px`;
            
            this.checkCollisions(item, itemPosition, fallInterval);
        }, 30);
    },
    
    // Check collisions
    checkCollisions(item, itemPosition, fallInterval) {
        const itemRect = item.getBoundingClientRect();
        const catcherRect = this.catcher.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        
        if (this.isCollision(itemRect, catcherRect)) {
            this.handleCatch(item, fallInterval);
        } else if (itemRect.top >= containerRect.bottom) {
            this.handleMiss(item, fallInterval);
        }
    },
    
    // Collision detection
    isCollision(itemRect, catcherRect) {
        return itemRect.bottom >= catcherRect.top &&
               itemRect.top <= catcherRect.bottom &&
               itemRect.right >= catcherRect.left &&
               itemRect.left <= catcherRect.right;
    },
    
    // Handle successful catch
    handleCatch(item, interval) {
        item.remove();
        clearInterval(interval);
        this.score++;
        this.updateScore();
        this.checkGameStatus();
    },
    
    // Handle missed item
    handleMiss(item, interval) {
        item.remove();
        clearInterval(interval);
        this.missedRecords++;
        this.checkGameStatus();
    },
    
    // Toggle game state
    toggleGame() {
        if (this.isRunning) {
            this.pauseGame();
        } else {
            this.startGame();
        }
    },
    
    // Start game
    startGame() {
        this.isRunning = true;
        this.startPauseBtn.textContent = "Pause Game";
        this.gameStatus.textContent = "";
        this.resetScore();
        this.gameInterval = setInterval(() => this.createFallingItem(), this.spawnInterval);
    },
    
    // Pause game
    pauseGame() {
        this.isRunning = false;
        this.startPauseBtn.textContent = "Start Game";
        clearInterval(this.gameInterval);
    },
    
    // Reset score
    resetScore() {
        this.score = 0;
        this.missedRecords = 0;
        this.updateScore();
    },
    
    // Update score display
    updateScore() {
        this.scoreDisplay.textContent = `Score: ${this.score}`;
    },
    
    // Check game status
    checkGameStatus() {
        if (this.score >= this.winningScore) {
            this.endGame("You Win! 🎉");
        } else if (this.missedRecords >= this.maxMisses) {
            this.endGame("Game Over. Try Again!");
        }
    },
    
    // End game
    endGame(message) {
        this.isRunning = false;
        clearInterval(this.gameInterval);
        this.gameStatus.textContent = message;
        this.startPauseBtn.textContent = "Start Game";
        Array.from(document.getElementsByClassName('falling-item')).forEach(item => item.remove());
    }
};

// Typewriter functionality
const Typewriter = {
    text: "Hi, I'm Brittany Herbert",
    index: 0,
    
    init() {
        this.type();
    },
    
    type() {
        if (this.index < this.text.length) {
            DOM.typewriterElement.innerHTML = this.text.substring(0, this.index + 1) + "<span id='cursor'>|</span>";
            this.index++;
            setTimeout(() => this.type(), 100);
        } else {
            DOM.cursorElement.style.animation = 'none';
        }
    }
};

// Navigation functionality
const Navigation = {
    init() {
        this.setupSmoothScroll();
        this.setupScrollToTop();
        this.setupDarkMode();
    },
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector(anchor.getAttribute('href'))
                    .scrollIntoView({ behavior: 'smooth' });
            });
        });
    },
    
    setupScrollToTop() {
        window.onscroll = () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                DOM.scrollToTopBtn.style.display = "block";
            } else {
                DOM.scrollToTopBtn.style.display = "none";
            }
        };
        
        DOM.scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },
    
    setupDarkMode() {
        DOM.toggleButton.addEventListener('click', () => {
            DOM.body.classList.toggle('dark-mode');
        });
    }
};

// Initialize everything when the page loads
window.onload = () => {
    Game.init();
    Typewriter.init();
    Navigation.init();
};