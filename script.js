const board = document.getElementById("game-board");
const resetBtn = document.getElementById("reset-btn");
const startBtn = document.getElementById("start-btn");
const gameContainer = document.getElementById("game-container");
const startScreen = document.getElementById("start-screen");

const timerDisplay = document.getElementById("timer");
const movesDisplay = document.getElementById("moves");
const pauseBtn = document.getElementById("pause-btn");

const winModal = document.getElementById("win-modal");
const finalTime = document.getElementById("final-time");
const finalMoves = document.getElementById("final-moves");
const bestScoreText = document.getElementById("best-score");
const playAgainBtn = document.getElementById("play-again-btn");

const diffButtons = document.querySelectorAll(".diff-btn");

const themes = {
  fruits: [
    "🍎",
    "🍌",
    "🍓",
    "🍇",
    "🍉",
    "🍒",
    "🥝",
    "🍍",
    "🥑",
    "🍑",
    "🍋",
    "🍊",
    "🍐",
    "🍈",
    "🥭",
    "🍏",
    "🍅",
    "🍆",
    "🥕",
    "🌽",
    "🥔",
    "🥥",
    "🥬",
    "🌶",
    "🫐",
    "🍠",
    "🫛",
    "🫑",
  ],
  emojis: [
    "😀",
    "😂",
    "😍",
    "😎",
    "😡",
    "😭",
    "🤔",
    "🥳",
    "😴",
    "🤯",
    "🤩",
    "😇",
    "😱",
    "😏",
    "😤",
    "🤪",
    "😜",
    "🤐",
    "🤫",
    "🥺",
    "🤢",
    "🤮",
    "🤧",
    "🥶",
    "🥵",
    "😵",
    "😶",
    "😳",
  ],
  animals: [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵",
    "🐔",
    "🐧",
    "🐦",
    "🐤",
    "🐣",
    "🦆",
    "🦅",
    "🦉",
    "🦇",
    "🐺",
    "🦄",
    "🐴",
    "🐗",
  ],
  numbers: [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
  ],
};

let currentTheme = "fruits"; // default

const iconPool = [
  "🍎",
  "🍌",
  "🍓",
  "🍇",
  "🍉",
  "🍒",
  "🥝",
  "🍍",
  "🥑",
  "🍑",
  "🍋",
  "🍊",
  "🍐",
  "🍈",
  "🍎",
  "🍌",
  "🍓",
  "🍇",
  "🍉",
  "🍒",
  "🥝",
  "🍍",
  "🥑",
  "🍑",
  "🍋",
  "🍊",
  "🍐",
  "🍈",
  "🍎",
  "🍌",
  "🍓",
  "🍇",
];

let cards = [];
let flipped = [];
let matchedCount = 0;
let moves = 0;

let timer;
let seconds = 0;
let isPaused = false;
let difficulty = "easy";

const difficultyConfig = {
  easy: { grid: 4, pairs: 8 },
  medium: { grid: 6, pairs: 18 },
  hard: { grid: 8, pairs: 32 },
};

// Shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Timer
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (!isPaused) {
      seconds++;
      let min = String(Math.floor(seconds / 60)).padStart(2, "0");
      let sec = String(seconds % 60).padStart(2, "0");
      timerDisplay.textContent = `Time: ${min}:${sec}`;
    }
  }, 1000);
}

// Reset stats
function resetStats() {
  moves = 0;
  seconds = 0;
  isPaused = false;
  pauseBtn.textContent = "Pause";
  movesDisplay.textContent = "Moves: 0";
  startTimer();
}

// Create board
function createBoard() {
  board.innerHTML = "";

  const { grid, pairs } = difficultyConfig[difficulty];

  const pool = themes[currentTheme];
  const selectedIcons = pool.slice(0, pairs);
  cards = [...selectedIcons, ...selectedIcons];
  shuffle(cards);

  matchedCount = 0;
  flipped = [];

  resetStats();

  cards.forEach((icon, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.icon = icon;
    card.dataset.index = index;
    card.textContent = icon; // show icon for preview
    board.appendChild(card);
  });

  applyResponsiveLayout(grid);

  // Disable clicking during preview
  board.querySelectorAll(".card").forEach((card) => {
    card.removeEventListener("click", flipCard); // remove old just in case
  });

  // Preview duration (2 seconds)
  setTimeout(() => {
    // Hide all cards
    board.querySelectorAll(".card").forEach((card) => {
      card.textContent = "";
      card.addEventListener("click", flipCard); // enable flipping
    });

    // Start countdown before enabling clicks
    startCountdown(3); // 3-second countdown
  }, 2000);
}

function formatTime(sec) {
  const min = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${min}:${s}`;
}

function showWinModal() {
  clearInterval(timer);

  finalTime.textContent = `⏱ Time: ${formatTime(seconds)}`;
  finalMoves.textContent = `🔁 Moves: ${moves}`;

  // Best score logic (lower moves = better)
  const best = localStorage.getItem("flipmatch_best");

  if (!best || moves < Number(best)) {
    localStorage.setItem("flipmatch_best", moves);
    bestScoreText.textContent = "🏆 Best Score: " + moves + " (New!)";
  } else {
    bestScoreText.textContent = "🏆 Best Score: " + best;
  }

  winModal.classList.remove("hidden");
}

function startCountdown(seconds) {
  let countdown = seconds;

  // Create overlay element
  const overlay = document.createElement("div");
  overlay.style.position = "absolute";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.5)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.fontSize = "4rem";
  overlay.style.color = "white";
  overlay.style.zIndex = 10;
  overlay.style.borderRadius = "12px";
  board.appendChild(overlay);

  overlay.textContent = countdown;

  const interval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      overlay.textContent = countdown;
    } else {
      overlay.textContent = "GO!";
      setTimeout(() => {
        overlay.remove();
        startTimer(); // Start the timer when countdown ends
      }, 500);
      clearInterval(interval);
    }
  }, 1000);
}

// Flip card
function flipCard(e) {
  if (isPaused) return;
  const card = e.currentTarget;
  if (
    card.classList.contains("flipped") ||
    card.classList.contains("matched") ||
    flipped.length === 2
  )
    return;

  card.textContent = card.dataset.icon;
  card.classList.add("flipped");
  flipped.push(card);

  if (flipped.length === 2) {
    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;

    const [first, second] = flipped;
    if (first.dataset.icon === second.dataset.icon) {
      first.classList.add("matched");
      second.classList.add("matched");
      matchedCount += 1;
      if (matchedCount === difficultyConfig[difficulty].pairs) {
        setTimeout(showWinModal, 300);
      }
    } else {
      setTimeout(() => {
        first.textContent = "";
        second.textContent = "";
        first.classList.remove("flipped");
        second.classList.remove("flipped");
      }, 800);
    }
    flipped = [];
  }
}

function applyResponsiveLayout(grid) {
  // Gap scales based on grid density
  const gap = grid >= 8 ? 6 : grid >= 6 ? 8 : 10;
  const horizontalPadding = 32;

  // Measure viewport bounds
  const maxAvailWidth = Math.min(window.innerWidth - horizontalPadding, 560);

  // Available vertical room for board (accounting for header, HUD and controls)
  const isMobile = window.innerWidth <= 480;
  const headerAndControlsHeight = isMobile ? 180 : 210;
  const maxAvailHeight = Math.max(260, window.innerHeight - headerAndControlsHeight);

  // Board stays square and fits both bounds perfectly without scrolling
  const boardDim = Math.floor(Math.min(maxAvailWidth, maxAvailHeight));
  const cardSize = Math.floor((boardDim - gap * (grid - 1)) / grid);
  const actualBoardSize = cardSize * grid + gap * (grid - 1);

  board.style.width = `${actualBoardSize}px`;
  board.style.height = `${actualBoardSize}px`;
  board.style.gridTemplateColumns = `repeat(${grid}, ${cardSize}px)`;
  board.style.gridTemplateRows = `repeat(${grid}, ${cardSize}px)`;
  board.style.gap = `${gap}px`;

  // Scale icon and font sizes proportionally
  const fontSize = Math.floor(cardSize * (grid >= 8 ? 0.45 : 0.52));
  document.querySelectorAll(".card").forEach((card) => {
    card.style.width = `${cardSize}px`;
    card.style.height = `${cardSize}px`;
    card.style.fontSize = `${fontSize}px`;
  });
}

// Restart
resetBtn.addEventListener("click", createBoard);

diffButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    diffButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    difficulty = btn.dataset.level;
  });
});

document.querySelector('[data-level="easy"]').classList.add("active");

// Start
startBtn.addEventListener("click", function () {
  startScreen.style.display = "none";
  gameContainer.style.display = "flex";
  createBoard();
});

pauseBtn.addEventListener("click", function () {
  isPaused = !isPaused;

  if (isPaused) {
    pauseBtn.textContent = "Resume";
  } else {
    pauseBtn.textContent = "Pause";
  }
});

window.addEventListener("resize", () => {
  if (gameContainer.style.display === "flex") {
    applyResponsiveLayout(difficultyConfig[difficulty].grid);
  }
});

const exitBtn = document.getElementById("exit-btn");

exitBtn.addEventListener("click", () => {
  // Hide game container and win modal
  gameContainer.style.display = "none";
  winModal.classList.add("hidden");

  // Show start screen
  startScreen.style.display = "flex";

  // Reset stats so a new game starts fresh
  resetStats();
});

const themeButtons = document.querySelectorAll(".theme-btn");

themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    themeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentTheme = btn.dataset.theme;
  });
});

// Default active theme
document.querySelector('[data-theme="fruits"]').classList.add("active");
