# 🃏 FlipMatch — Modern Card Matching Memory Game

FlipMatch is an arcade-style, interactive card matching memory game built with vanilla HTML5, CSS3, and modern JavaScript. Flip cards, match pairs, track moves and time, and climb the personal best leaderboard across multiple difficulty tiers!

Designed with a modern glassmorphic arcade aesthetic, full mobile-to-desktop responsiveness, synthesized sound effects, and rewarding win celebrations.

---

## ✨ Features

- 📱 **Fluid Viewport-Aware Responsive Engine** — The entire board, HUD, and controls automatically fit within `100dvh` without requiring vertical or horizontal scrolling on mobile, tablet, or desktop.
- 🃏 **True 3D Dual-Sided Flip Mechanics** — Hardware-accelerated CSS 3D transforms (`rotateY(180deg)`) with front and back card textures, smooth flip-back preview, and match/mismatch physics.
- 🔊 **Synthesized Web Audio System** — Crisp sound effects for card flips, pair matches, mismatches, countdown beats, and victory fanfares generated via the Web Audio API (zero external assets or network requests) with a persistent mute toggle.
- 🎯 **Multiple Difficulty Tiers**:
  - **Easy:** 4 × 4 grid (8 pairs)
  - **Medium:** 6 × 6 grid (18 pairs)
  - **Hard:** 8 × 8 grid (32 pairs) with density-optimized scaling
- 🎨 **Multiple Card Themes** — Fruits 🍎, Emojis 😀, Animals 🐶, and Numbers 🔢.
- 🏆 **Multi-Difficulty Personal Bests** — Persistent local storage tracking best scores independently per difficulty tier, featured right on the Start Screen.
- ⏸️ **Anti-Cheat Pause Shield** — Pausing activates a backdrop-filter blur shield over the board so players cannot peek at card placements while paused.
- 🎊 **Celebration Confetti & 3-Star Rating** — Dynamic star rating (1 to 3 stars based on move efficiency) and a vibrant canvas confetti cannon upon victory.
- ♿ **Accessibility & Polish** — Full keyboard navigation (`Tab`, `Enter`, `Space`), touch-optimized interaction (`touch-action: manipulation`), and `prefers-reduced-motion` support.

---

## 🕹️ Controls

| Action | Mouse / Touch | Keyboard |
| :--- | :--- | :--- |
| **Flip Card** | Click / Tap card | `Tab` to navigate, `Enter` or `Space` to flip |
| **Pause / Resume** | Click Pause button | Click or press Resume |
| **Restart Game** | Click Restart button | Quick board re-shuffle |
| **Toggle Sound** | Click 🔊 / 🔇 button | Persistent mute preference |
| **Back to Menu** | Click Menu button | Returns to difficulty/theme select |

---

## 📂 Project Structure

```bash
FlipMatch/
│
├── index.html        # Semantic HTML5 markup, accessible HUD & modals
├── style.css         # Modern arcade design system, 3D flip CSS & responsive rules
├── script.js         # Game loop, Web Audio synthesizer, canvas confetti & board math
└── README.md         # Documentation
```

---

## 🚀 Getting Started

No build tools or servers required! Simply clone and open:

```bash
# Clone the Repository
git clone https://github.com/Bhupesh-Dewangan/FlipMatch.git
cd FlipMatch

# Open the game in your browser
# (Double-click index.html or open via VS Code Live Server)
```

---

## 🧠 Technical Highlights

- **CSS Custom Properties & Glassmorphism:** Theme tokens, backdrop filters, and subtle ambient gradients.
- **Dynamic Viewport Math:** Viewport-aware grid dimensions calculated dynamically against `window.innerHeight` and `window.innerWidth`.
- **Web Audio API:** Oscillator and gain node synthesis with zero audio file latency.
- **Vanilla Canvas Particle Engine:** Autonomous multi-colored confetti physics with frame-rate request animation loops.
