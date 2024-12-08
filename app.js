// DOM Elements
const DOM = {
  body: document.body,
  toggleButton: document.getElementById("dark-mode-toggle"),
  scrollToTopBtn: document.getElementById("scrollToTopBtn"),
  typewriterElement: document.getElementById("typewriter"),
  cursorElement: document.getElementById("cursor"),
  gameContainer: document.getElementById("game-container"),
};

const Game = {
  container: document.getElementById("game-container"),
  catcher: document.getElementById("catcher"),
  scoreDisplay: document.getElementById("score"),
  startPauseBtn: document.getElementById("start-pause-btn"),
  gameStatus: document.getElementById("game-status"),

  score: 0,
  missedRecords: 0,
  winningScore: 10,
  maxMisses: 5,
  isRunning: false,
  gameInterval: null,
  catcherPosition: 0,

  moveAmount: 20,
  spawnInterval: 1500,

  //Game-Fumctionality
  init() {
    this.catcherPosition = this.container.offsetWidth / 2 - 25;
    this.setupEventListeners();
    this.setupSwipeControls();
    this.resetScore();
  },

  setupEventListeners() {
    document.addEventListener("keydown", this.handleKeyPress.bind(this));
    this.startPauseBtn.addEventListener("click", this.toggleGame.bind(this));
  },

  handleKeyPress(e) {
    if (!this.isRunning) return;

    if (e.key === "ArrowLeft" && this.catcherPosition > 0) {
      this.catcherPosition = Math.max(
        0,
        this.catcherPosition - this.moveAmount
      );
    } else if (
      e.key === "ArrowRight" &&
      this.catcherPosition < this.container.offsetWidth - 50
    ) {
      this.catcherPosition = Math.min(
        this.container.offsetWidth - 50,
        this.catcherPosition + this.moveAmount
      );
    }
    this.catcher.style.left = `${this.catcherPosition}px`;
  },

  setupSwipeControls() {
    const hammer = new Hammer(this.container);
    hammer.get("swipe").set({ direction: Hammer.DIRECTION_HORIZONTAL });
    hammer.on("swipeleft swiperight", (ev) => {
      this.handleSwipe(ev);
    });
  },

  handleSwipe(ev) {
    if (!this.isRunning) return;

    const velocityFactor = Math.abs(ev.velocityX);
    const moveDistance = this.moveAmount * Math.min(velocityFactor, 3);

    if (ev.type === "swipeleft" && this.catcherPosition > 0) {
      this.catcherPosition = Math.max(0, this.catcherPosition - moveDistance);
    } else if (
      ev.type === "swiperight" &&
      this.catcherPosition < this.container.offsetWidth - 50
    ) {
      this.catcherPosition = Math.min(
        this.container.offsetWidth - 50,
        this.catcherPosition + moveDistance
      );
    }

    this.catcher.style.left = `${this.catcherPosition}px`;

    console.log(
      `Swipe: ${ev.type}, Velocity: ${ev.velocityX}, Move: ${moveDistance}`
    );
  },

  createFallingItem() {
    const item = document.createElement("div");
    item.classList.add("falling-item");

    const startX = Math.random() * (this.container.offsetWidth - 40);
    item.style.left = `${startX}px`;
    item.style.top = `0px`;
    this.container.appendChild(item);

    const fallInterval = setInterval(() => {
      const currentTop = parseInt(item.style.top) || 0;
      const newTop = currentTop + 5;
      item.style.top = `${newTop}px`;

      const itemRect = item.getBoundingClientRect();
      const catcherRect = this.catcher.getBoundingClientRect();
      if (this.isCollision(itemRect, catcherRect)) {
        clearInterval(fallInterval);
        this.handleCatch(item);
      }

      if (newTop > this.container.offsetHeight) {
        clearInterval(fallInterval);
        this.handleMiss(item);
      }
    }, 30);
  },

  isCollision(itemRect, catcherRect) {
    const buffer = 10;
    return (
      itemRect.bottom >= catcherRect.top - buffer &&
      itemRect.top <= catcherRect.bottom + buffer &&
      itemRect.right >= catcherRect.left - buffer &&
      itemRect.left <= catcherRect.right + buffer
    );
  },

  handleCatch(item) {
    item.remove();
    this.score++;
    this.updateScore();
    this.checkGameStatus();
  },

  updateItemsPosition() {
    const catcherRect = this.catcher.getBoundingClientRect();
    Array.from(this.container.getElementsByClassName("falling-item")).forEach(
      (item) => {
        const itemRect = item.getBoundingClientRect();

        if (this.isCollision(itemRect, catcherRect)) {
          this.handleCatch(item);
        }

        const currentTop = parseInt(item.style.top) || 0;
        item.style.top = `${currentTop + 5}px`;
      }
    );

    requestAnimationFrame(this.updateItemsPosition.bind(this));
  },

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
    this.gameInterval = setInterval(
      () => this.createFallingItem(),
      this.spawnInterval
    );
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
    Array.from(document.getElementsByClassName("falling-item")).forEach(
      (item) => item.remove()
    );
  },
};

// Typewriter functionality
const Typewriter = {
  text: "Welcome, I'm Brittany Herbert, a software developer and DJ with a passion for blending tech and music! Here's my journey so far..",
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
      console.error("Typewriter element not found");
    }
  },

  type() {
    if (this.index < this.text.length) {
      // Remove the cursor temporarily
      const cursor = document.getElementById("cursor");
      if (cursor) cursor.remove();

      // Append the next character
      DOM.typewriterElement.innerHTML += this.text.charAt(this.index);

      // Append the cursor back
      DOM.typewriterElement.innerHTML += '<span id="cursor">|</span>';

      this.index++;
      setTimeout(() => this.type(), 100);
    }
  },

  setupCursorBlink() {
    this.cursorInterval = setInterval(() => {
      const cursor = document.getElementById("cursor");
      if (cursor) {
        cursor.style.opacity = this.cursorVisible ? "0" : "1";
        this.cursorVisible = !this.cursorVisible;
      }
    }, 700);
  },
};

// Navigation functionality
const Navigation = {
  init() {
    this.setupSmoothScroll();
    this.setupScrollToTop();
    this.setupDarkMode();
  },

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        document
          .querySelector(anchor.getAttribute("href"))
          .scrollIntoView({ behavior: "smooth" });
      });
    });
  },

  setupScrollToTop() {
    const scrollContainer = document.getElementById("scroll-container");
    const scrollToTopBtn = DOM.scrollToTopBtn; // Reference the button

    // Show or hide button based on scroll position
    window.onscroll = () => {
      const containerScrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;

      // Adjust button visibility
      if (containerScrollTop > 100) {
        scrollToTopBtn.style.display = "block";
        scrollToTopBtn.style.top = `${
          containerScrollTop + window.innerHeight - 80
        }px`; // Adjust button to scroll along
      } else {
        scrollToTopBtn.style.display = "none";
      }
    };

    // Smooth scroll to the top when the button is clicked
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  },

  setupDarkMode() {
    DOM.toggleButton.addEventListener("click", () => {
      DOM.body.classList.toggle("dark-mode");
    });
  },
};

// Initialize everything when the page loads
window.addEventListener("load", () => {
  // Move sections to correct order in DOM if needed
  const homeSection = document.getElementById("home");
  const gameSection = document.getElementById("catch-the-dj-game");
  if (homeSection && gameSection && homeSection.parentNode) {
    homeSection.parentNode.insertBefore(homeSection, gameSection);
  }

  Typewriter.init();
  Game.init();
  Navigation.init();
});
