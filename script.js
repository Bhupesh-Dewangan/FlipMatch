/**
 * FlipMatch — Modern Card Matching Memory Game
 * Phase 5: Audio Engine, Confetti Cannon & Multi-Difficulty Personal Bests
 */

// ==========================================================================
// 1. Audio System (Synthesized via Web Audio API)
// ==========================================================================
class SoundManager {
  constructor() {
    this.muted = localStorage.getItem("flipmatch_muted") === "true";
    this.audioCtx = null;
    this.updateSoundButtonUI();

    const soundBtn = document.getElementById("sound-toggle-btn");
    if (soundBtn) {
      soundBtn.addEventListener("click", () => this.toggle());
    }
  }

  init() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  playFlip() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (_) {}
  }

  playMatch() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const startTime = this.audioCtx.currentTime + idx * 0.06;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.22);
      });
    } catch (_) {}
  }

  playMismatch() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.16);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (_) {}
  }

  playCountdownTick() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (_) {}
  }

  playCountdownGo() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (_) {}
  }

  playWin() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const fanfare = [
        { f: 523.25, d: 0.1 },  // C5
        { f: 659.25, d: 0.1 },  // E5
        { f: 783.99, d: 0.1 },  // G5
        { f: 1046.5, d: 0.35 }  // C6
      ];
      let cur = this.audioCtx.currentTime;
      fanfare.forEach(({ f, d }) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, cur);

        gain.gain.setValueAtTime(0.18, cur);
        gain.gain.exponentialRampToValueAtTime(0.001, cur + d);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(cur);
        osc.stop(cur + d);
        cur += d;
      });
    } catch (_) {}
  }

  toggle() {
    this.muted = !this.muted;
    localStorage.setItem("flipmatch_muted", String(this.muted));
    this.updateSoundButtonUI();
  }

  updateSoundButtonUI() {
    const onIcon = document.getElementById("sound-icon-on");
    const offIcon = document.getElementById("sound-icon-off");
    if (onIcon && offIcon) {
      if (this.muted) {
        onIcon.classList.add("hidden");
        offIcon.classList.remove("hidden");
      } else {
        onIcon.classList.remove("hidden");
        offIcon.classList.add("hidden");
      }
    }
  }
}

// ==========================================================================
// 2. Confetti Particle Cannon
// ==========================================================================
class ConfettiEffect {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.particles = [];
    this.animationId = null;
    this.colors = ["#ffffff", "#e5e5e5", "#d4d4d4", "#a3a3a3", "#737373", "#f5f5f5"];
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }

  handleResize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  burst() {
    if (!this.canvas || !this.ctx) return;
    this.handleResize();
    this.particles = [];

    const particleCount = Math.min(100, Math.floor(window.innerWidth / 8));
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: this.canvas.width / 2,
        y: this.canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 16,
        size: Math.random() * 8 + 4,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        gravity: 0.35,
      });
    }

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.render();
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let activeParticles = 0;
    this.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.007;

      if (p.opacity > 0) {
        activeParticles++;
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        this.ctx.restore();
      }
    });

    if (activeParticles > 0) {
      this.animationId = requestAnimationFrame(() => this.render());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animationId = null;
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// ==========================================================================
// 3. Game State & Configuration
// ==========================================================================
const soundManager = new SoundManager();
const confetti = new ConfettiEffect("confetti-canvas");

// DOM Elements
const board = document.getElementById("game-board");
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const pauseBtn = document.getElementById("pause-btn");
const exitBtn = document.getElementById("exit-btn");
const timerDisplay = document.getElementById("timer");
const movesDisplay = document.getElementById("moves");
const pairsLeftDisplay = document.getElementById("pairs-left");
const currentDiffBadge = document.getElementById("current-diff-badge");

// Pause & Modal Elements
const pauseOverlay = document.getElementById("pause-overlay");
const resumeDialogBtn = document.getElementById("resume-dialog-btn");
const winModal = document.getElementById("win-modal");
const finalTime = document.getElementById("final-time");
const finalMoves = document.getElementById("final-moves");
const bestScoreText = document.getElementById("best-score");
const playAgainBtn = document.getElementById("play-again-btn");
const modalMenuBtn = document.getElementById("modal-menu-btn");
const newRecordBadge = document.getElementById("new-record-badge");
const starRatingContainer = document.getElementById("star-rating");

// Option Buttons
const diffButtons = document.querySelectorAll(".diff-btn");
const themeButtons = document.querySelectorAll(".theme-btn");

// Themes
const themes = {
  fruits: [
    "🍎", "🍌", "🍓", "🍇", "🍉", "🍒", "🥝", "🍍", "🥑", "🍑",
    "🍋", "🍊", "🍐", "🍈", "🥭", "🍏", "🍅", "🍆", "🥕", "🌽",
    "🥔", "🥥", "🥬", "🌶", "🫐", "🍠", "🥒", "🫑", "🍄", "🌰",
    "🥜", "🥦",
  ],
  emojis: [
    "😀", "😂", "😍", "😎", "😡", "😭", "🤔", "🥳", "😴", "🤯",
    "🤩", "😇", "😱", "😏", "😤", "🤪", "😜", "🤐", "🤫", "🥺",
    "🤢", "🤮", "🤧", "🥶", "🥵", "😵", "😶", "😳", "🤠", "🤖",
    "👻", "👽",
  ],
  animals: [
    "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯",
    "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🐣",
    "🦆", "🦅", "🦉", "🦇", "🐺", "🦄", "🐴", "🐗", "🐙", "🦋",
    "🐢", "🐬",
  ],
  numbers: [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
    "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
    "31", "32",
  ],
};

const difficultyConfig = {
  easy: { grid: 4, pairs: 8, name: "Easy" },
  medium: { grid: 6, pairs: 18, name: "Medium" },
  hard: { grid: 8, pairs: 32, name: "Hard" },
};

let currentTheme = "fruits";
let difficulty = "easy";
let cards = [];
let flipped = [];
let matchedCount = 0;
let moves = 0;
let timer = null;
let seconds = 0;
let isPaused = false;
let isLocked = false;

// ==========================================================================
// 4. Personal Best Scores Manager
// ==========================================================================
function getBestScoreKey(diff) {
  return `flipmatch_best_${diff}`;
}

function getBestScore(diff) {
  const val = localStorage.getItem(getBestScoreKey(diff));
  return val ? parseInt(val, 10) : null;
}

function updateRecordsDashboard() {
  ["easy", "medium", "hard"].forEach((diff) => {
    const el = document.getElementById(`record-${diff}`);
    if (el) {
      const best = getBestScore(diff);
      el.textContent = best !== null ? `${best} moves` : "—";
    }
  });
}

// Initial dashboard load
updateRecordsDashboard();

// ==========================================================================
// 5. Board Generation & Responsive Engine
// ==========================================================================
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function formatTime(sec) {
  const min = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${min}:${s}`;
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (!isPaused) {
      seconds++;
      timerDisplay.textContent = formatTime(seconds);
    }
  }, 1000);
}

function resetStats() {
  clearInterval(timer);
  moves = 0;
  seconds = 0;
  isPaused = false;
  isLocked = false;
  matchedCount = 0;
  flipped = [];

  const label = pauseBtn.querySelector(".btn-label");
  if (label) label.textContent = "Pause";
  const pauseIcon = document.getElementById("pause-btn-icon-pause");
  const playIcon = document.getElementById("pause-btn-icon-play");
  if (pauseIcon && playIcon) {
    pauseIcon.classList.remove("hidden");
    playIcon.classList.add("hidden");
  }
  if (pauseOverlay) pauseOverlay.classList.add("hidden");

  timerDisplay.textContent = "00:00";
  movesDisplay.textContent = "0";

  const totalPairs = difficultyConfig[difficulty].pairs;
  if (pairsLeftDisplay) pairsLeftDisplay.textContent = `0 / ${totalPairs}`;
  if (currentDiffBadge) currentDiffBadge.textContent = difficultyConfig[difficulty].name;
}

function applyResponsiveLayout(grid) {
  const gap = grid >= 8 ? 6 : grid >= 6 ? 8 : 10;
  const horizontalPadding = 32;

  const maxAvailWidth = Math.min(window.innerWidth - horizontalPadding, 560);
  const isMobile = window.innerWidth <= 480;
  const headerAndControlsHeight = isMobile ? 180 : 210;
  const maxAvailHeight = Math.max(260, window.innerHeight - headerAndControlsHeight);

  const boardDim = Math.floor(Math.min(maxAvailWidth, maxAvailHeight));
  const cardSize = Math.floor((boardDim - gap * (grid - 1)) / grid);
  const actualBoardSize = cardSize * grid + gap * (grid - 1);

  board.style.width = `${actualBoardSize}px`;
  board.style.height = `${actualBoardSize}px`;
  board.style.gridTemplateColumns = `repeat(${grid}, ${cardSize}px)`;
  board.style.gridTemplateRows = `repeat(${grid}, ${cardSize}px)`;
  board.style.gap = `${gap}px`;

  const fontSize = Math.floor(cardSize * (grid >= 8 ? 0.45 : 0.52));
  document.querySelectorAll(".card").forEach((card) => {
    card.style.width = `${cardSize}px`;
    card.style.height = `${cardSize}px`;
    card.style.fontSize = `${fontSize}px`;
  });
}

function createBoard() {
  board.innerHTML = "";
  confetti.stop();
  winModal.classList.add("hidden");

  const { grid, pairs } = difficultyConfig[difficulty];
  const pool = themes[currentTheme] || themes.fruits;
  const selectedIcons = pool.slice(0, pairs);

  cards = [...selectedIcons, ...selectedIcons];
  shuffle(cards);

  resetStats();

  cards.forEach((icon, index) => {
    const card = document.createElement("div");
    card.classList.add("card", "is-flipped");
    card.dataset.icon = icon;
    card.dataset.index = index;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", "Hidden card");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    cardFront.innerHTML = `<span>?</span>`;

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    cardBack.textContent = icon;

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    board.appendChild(card);
  });

  applyResponsiveLayout(grid);
  isLocked = true;

  setTimeout(() => {
    board.querySelectorAll(".card").forEach((card) => {
      card.classList.remove("is-flipped");
    });
    startCountdown(3);
  }, 1800);
}

// ==========================================================================
// 6. Countdown Overlay
// ==========================================================================
function startCountdown(duration) {
  let count = duration;

  const overlay = document.createElement("div");
  overlay.classList.add("countdown-overlay");

  const numberEl = document.createElement("div");
  numberEl.classList.add("countdown-number");
  numberEl.textContent = count;
  overlay.appendChild(numberEl);
  board.appendChild(overlay);

  soundManager.playCountdownTick();

  const timerId = setInterval(() => {
    count--;
    if (count > 0) {
      numberEl.textContent = count;
      soundManager.playCountdownTick();
    } else {
      numberEl.textContent = "GO!";
      soundManager.playCountdownGo();
      clearInterval(timerId);

      setTimeout(() => {
        overlay.remove();
        isLocked = false;
        startTimer();
        bindCardClicks();
      }, 500);
    }
  }, 900);
}

function bindCardClicks() {
  board.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", handleCardInteraction);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCardInteraction(e);
      }
    });
  });
}

// ==========================================================================
// 7. Card Flipping & Matching Logic
// ==========================================================================
function handleCardInteraction(e) {
  if (isPaused || isLocked) return;

  const card = e.currentTarget;
  if (
    card.classList.contains("is-flipped") ||
    card.classList.contains("is-matched") ||
    flipped.length >= 2
  ) {
    return;
  }

  soundManager.playFlip();
  card.classList.add("is-flipped");
  flipped.push(card);

  if (flipped.length === 2) {
    moves++;
    movesDisplay.textContent = String(moves);

    const [first, second] = flipped;
    if (first.dataset.icon === second.dataset.icon) {
      soundManager.playMatch();
      first.classList.add("is-matched");
      second.classList.add("is-matched");
      matchedCount++;

      const totalPairs = difficultyConfig[difficulty].pairs;
      if (pairsLeftDisplay) pairsLeftDisplay.textContent = `${matchedCount} / ${totalPairs}`;
      flipped = [];

      if (matchedCount === totalPairs) {
        clearInterval(timer);
        setTimeout(showWinModal, 450);
      }
    } else {
      soundManager.playMismatch();
      isLocked = true;
      first.classList.add("is-mismatched");
      second.classList.add("is-mismatched");

      setTimeout(() => {
        first.classList.remove("is-flipped", "is-mismatched");
        second.classList.remove("is-flipped", "is-mismatched");
        flipped = [];
        isLocked = false;
      }, 700);
    }
  }
}

// ==========================================================================
// 8. Win Modal & Star Rating
// ==========================================================================
function calculateStars(movesTaken, pairsCount) {
  if (movesTaken <= Math.floor(pairsCount * 1.5)) return 3;
  if (movesTaken <= Math.floor(pairsCount * 2.2)) return 2;
  return 1;
}

function renderStars(count) {
  if (!starRatingContainer) return;
  starRatingContainer.innerHTML = "";
  for (let i = 1; i <= 3; i++) {
    const star = document.createElement("span");
    star.classList.add("star");
    if (i <= count) {
      star.classList.add("filled");
      star.style.animationDelay = `${i * 0.15}s`;
    }
    star.textContent = "★";
    starRatingContainer.appendChild(star);
  }
}

function showWinModal() {
  soundManager.playWin();
  confetti.burst();

  finalTime.textContent = formatTime(seconds);
  finalMoves.textContent = String(moves);

  const bestKey = getBestScoreKey(difficulty);
  const currentBest = getBestScore(difficulty);
  let isNewRecord = false;

  if (currentBest === null || moves < currentBest) {
    localStorage.setItem(bestKey, String(moves));
    bestScoreText.textContent = `${moves} (New!)`;
    isNewRecord = true;
  } else {
    bestScoreText.textContent = `${currentBest} moves`;
  }

  if (newRecordBadge) {
    if (isNewRecord) {
      newRecordBadge.classList.remove("hidden");
    } else {
      newRecordBadge.classList.add("hidden");
    }
  }

  const { pairs } = difficultyConfig[difficulty];
  const stars = calculateStars(moves, pairs);
  renderStars(stars);

  updateRecordsDashboard();
  winModal.classList.remove("hidden");
}

// ==========================================================================
// 9. Pause & Controls
// ==========================================================================
function togglePause() {
  if (isLocked && !isPaused) return;

  isPaused = !isPaused;
  const label = pauseBtn.querySelector(".btn-label");
  const pauseIcon = document.getElementById("pause-btn-icon-pause");
  const playIcon = document.getElementById("pause-btn-icon-play");

  if (isPaused) {
    if (label) label.textContent = "Resume";
    if (pauseIcon && playIcon) {
      pauseIcon.classList.add("hidden");
      playIcon.classList.remove("hidden");
    }
    if (pauseOverlay) pauseOverlay.classList.remove("hidden");
  } else {
    if (label) label.textContent = "Pause";
    if (pauseIcon && playIcon) {
      pauseIcon.classList.remove("hidden");
      playIcon.classList.add("hidden");
    }
    if (pauseOverlay) pauseOverlay.classList.add("hidden");
  }
}

pauseBtn.addEventListener("click", togglePause);
if (resumeDialogBtn) {
  resumeDialogBtn.addEventListener("click", togglePause);
}

resetBtn.addEventListener("click", () => {
  createBoard();
});

function exitToMenu() {
  clearInterval(timer);
  confetti.stop();
  winModal.classList.add("hidden");
  if (pauseOverlay) pauseOverlay.classList.add("hidden");
  gameContainer.style.display = "none";
  startScreen.style.display = "flex";
  startScreen.classList.add("active");
  updateRecordsDashboard();
}

exitBtn.addEventListener("click", exitToMenu);
if (modalMenuBtn) {
  modalMenuBtn.addEventListener("click", exitToMenu);
}

startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  startScreen.classList.remove("active");
  gameContainer.style.display = "flex";
  createBoard();
});

playAgainBtn.addEventListener("click", () => {
  createBoard();
});

diffButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    diffButtons.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-checked", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-checked", "true");
    difficulty = btn.dataset.level;
  });
});

themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    themeButtons.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-checked", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-checked", "true");
    currentTheme = btn.dataset.theme;
  });
});

window.addEventListener("resize", () => {
  if (gameContainer.style.display === "flex") {
    applyResponsiveLayout(difficultyConfig[difficulty].grid);
  }
});
