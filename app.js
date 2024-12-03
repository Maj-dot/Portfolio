// DOM Elements
const DOM = {
    body: document.body,
    toggleButton: document.getElementById('dark-mode-toggle'),
    scrollToTopBtn: document.getElementById('scrollToTopBtn'),
    typewriterElement: document.getElementById('typewriter'),
    cursorElement: document.getElementById('cursor'),
    gameContainer: document.getElementById('game-container')
};

const Game = {
    container: document.getElementById('game-container'),
    catcher: document.getElementById('catcher'),
    scoreDisplay: document.getElementById('score'),
    startPauseBtn: document.getElementById('start-pause-btn'),
    gameStatus: document.getElementById('game-status'),
    
    score: 0,
    missedRecords: 0,
    winningScore: 10,
    maxMisses: 5,
    isRunning: false,
    gameInterval: null,
    catcherPosition: 0,
    
    moveAmount: 20,
    spawnInterval: 1500,
    
    init() {
        this.catcherPosition = this.container.offsetWidth / 2 - 25;
        this.setupEventListeners();
        this.resetScore();
    },
    
    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.startPauseBtn.addEventListener('click', this.toggleGame.bind(this));
    },
    
    handleKeyPress(e) {
        if (!this.isRunning) return;
        
        if (e.key === 'ArrowLeft' && this.catcherPosition > 0) {
            this.catcherPosition = Math.max(0, this.catcherPosition - this.moveAmount);
        } else if (e.key === 'ArrowRight' && this.catcherPosition < this.container.offsetWidth - 50) {
            this.catcherPosition = Math.min(this.container.offsetWidth - 50, this.catcherPosition + this.moveAmount);
        }
        this.catcher.style.left = `${this.catcherPosition}px`;
    },
    
    // Create falling item with CSS animation
    createFallingItem() {
        const item = document.createElement('div');
        item.classList.add('falling-item');
        
        const startX = Math.random() * (this.container.offsetWidth - 40);
        item.style.left = `${startX}px`;
        this.container.appendChild(item);

        // Event listener for collision or miss detection at the end of animation
        item.addEventListener('animationend', () => {
            if (this.isRunning) {
                const itemRect = item.getBoundingClientRect();
                const catcherRect = this.catcher.getBoundingClientRect();
                if (this.isCollision(itemRect, catcherRect)) {
                    this.handleCatch(item);
                } else {
                    this.handleMiss(item);
                }
            }
            item.remove(); // Remove item after it reaches the end of animation
        });
    },
    
    // Check if item and catcher are colliding
    isCollision(itemRect, catcherRect) {
        console.log("itemRect", itemRect);
        console.log("catcherRect", catcherRect);
        return itemRect.bottom >= catcherRect.top &&
               itemRect.top <= catcherRect.bottom &&
               itemRect.right >= catcherRect.left &&
               itemRect.left <= catcherRect.right;
    },
    
    // Handle successful catch
    handleCatch(item) {
        item.style.backgroundColor = 'green';
        if (item.parentNode) item.parentNode.removeChild(item);
        this.score++;
        this.updateScore();
        this.checkGameStatus();
    },

    updateItemsPosition() {
        this.items.forEach(item => {
            const currentTop = parseInt(item.style.top) || 0;
            item.style.top = `${currentTop + this.fallSpeed}px`;
    
            // Check for collision with catcher
            if (this.isCollision(item.getBoundingClientRect(), this.catcher.getBoundingClientRect())) {
                this.handleCatch(item);
            }
        });
        requestAnimationFrame(this.updateItemsPosition.bind(this));
    },
    
    // Handle missed item
    handleMiss(item) {
        item.remove();
        this.missedRecords++;
        this.checkGameStatus();
    },
    
    toggleGame() {
        if (this.isRunning) {
            this.pauseGame();
        } else {
            this.startGame();
        }
    },
    
    startGame() {
        this.isRunning = true;
        this.startPauseBtn.textContent = "Pause Game";
        this.gameStatus.textContent = "";
        this.resetScore();
        this.gameInterval = setInterval(() => this.createFallingItem(), this.spawnInterval);
    },
    
    pauseGame() {
        this.isRunning = false;
        this.startPauseBtn.textContent = "Start Game";
        clearInterval(this.gameInterval);
    },
    
    resetScore() {
        this.score = 0;
        this.missedRecords = 0;
        this.updateScore();
    },
    
    updateScore() {
        this.scoreDisplay.textContent = `Score: ${this.score}`;
    },
    
    checkGameStatus() {
        if (this.score >= this.winningScore) {
            this.endGame("You Win! 🎉");
        } else if (this.missedRecords >= this.maxMisses) {
            this.endGame("Game Over. Try Again!");
        }
    },
    
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
    text: "Hi, I'm Brittany Herbert, a software developer and DJ with a passion for blending tech and music. Here's my journey so far..",
    index: 0,
    cursorVisible: true,
    cursorInterval: null,
    
    init() {
        // Reset the typewriter element
        if (DOM.typewriterElement) {
            DOM.typewriterElement.innerHTML = '<span id="cursor">|</span>';
            this.type();
            this.setupCursorBlink();
        } else {
            console.error('Typewriter element not found');
        }
    },
    
    type() {
        if (this.index < this.text.length) {
            // Get current text without cursor
            const currentText = DOM.typewriterElement.innerHTML.replace('<span id="cursor">|</span>', '');
            
            // Add next character
            DOM.typewriterElement.innerHTML = currentText + 
                this.text.charAt(this.index) + 
                '<span id="cursor">|</span>';
                
            this.index++;
            setTimeout(() => this.type(), 100);
        }
    },
    
    setupCursorBlink() {
        this.cursorInterval = setInterval(() => {
            const cursor = document.getElementById('cursor');
            if (cursor) {
                cursor.style.opacity = this.cursorVisible ? '0' : '1';
                this.cursorVisible = !this.cursorVisible;
            }
        }, 700);
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
window.addEventListener('load', () => {
    // Move sections to correct order in DOM if needed
    const homeSection = document.getElementById('home');
    const gameSection = document.getElementById('catch-the-dj-game');
    if (homeSection && gameSection && homeSection.parentNode) {
        homeSection.parentNode.insertBefore(homeSection, gameSection);
    }
    
    // Initialize components
    Typewriter.init();
    Game.init();
    Navigation.init();
});