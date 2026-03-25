# Sister Wendy's Dominoes

A browser-based All-Fives / Horse Race dominoes game featuring Sister Wendy Beckett as your opponent — equal parts art critic, theologian, and ruthless domino player.

**Single HTML file. No build step. No dependencies.**

---

## How to Play

Standard All-Fives (Horse Race) rules:

- First to **61 points** wins the game (across multiple rounds)
- Score points when the **sum of both open ends** is a multiple of 5
- **Doubles** count both pips on that end (e.g. [5|5] on an end = 10 points)
- Playing a **double** or **scoring** earns a bonus turn
- If you can't play, draw from the boneyard until you can (or must pass)

---

## Running Locally

```bash
npx http-server . -p 7777
# then open http://localhost:7777
```

---

## Architecture

Everything lives in `index.html` — one file, ~5000 lines. No framework, no build.

### Key Classes

| Class | Purpose |
|---|---|
| `Tile` | Immutable domino tile with `a`, `b` pips and `flipped` state |
| `Board` | Chain of played tiles; tracks `leftEnd`/`rightEnd`; scores via `scoreValue()` |
| `Game` | All game state and UI logic |
| `DragDropHandler` | Touch + pointer drag-to-board support |
| `AudioSystem` | Web Audio API sound effects |
| `DailyChallenge` | Seeded daily tile draw — same tiles for everyone |
| `StatsManager` | localStorage win/loss/streak tracking |
| `AchievementManager` | 20+ badge definitions |

### Board Logic

`Board.validEnds(tile)` returns which ends a tile can play to:

| Return value | Meaning |
|---|---|
| `['first']` | Board is empty — this is the opening tile |
| `['left']` | Only fits the left end |
| `['right']` | Only fits the right end |
| `['left', 'right']` | Fits both ends — player must choose |
| `['middle']` | Both ends same value, no spinner — auto-plays as right |
| `['top']` / `['bottom']` | Fits a spinner arm |
| `[]` | Can't play this tile |

#### Spinner doubles

The first double played becomes the **spinner**. It has four playable arms: left, right, top, bottom. Drop zones appear for each open arm. Once all four sides are covered that pip value is closed. Spinner arm end-pips count toward scoring once tiles are played there.

### Turn Flow

```
Player clicks tile
  → playerSelectTile()
    → if one valid end: playerPlayTile(tile, end)
    → if two ends: show drop zones, wait for playerSelectEnd()
      → playerPlayTile(tile, end)
        → score, render, check win
        → if scored or double: bonus turn (player plays again)
        → else: doWendyTurn()

doWendyTurn()
  → _executeWendyTurn() [synchronous, all draws in-loop]
    → _wendyPlayTile(play)
      → score, render, check win
      → if scored or double: setTimeout(_executeWendyTurn, 1500ms)
      → else: _handToPlayer()
```

### AI (Sister Wendy)

`aiPickPlay(hand, board, difficulty)` in `difficulty` modes:

- **easy** — picks randomly from valid plays, weighted slightly toward scoring moves
- **medium** — picks the highest-scoring play; ties broken by pip count (lower = better)
- **hard** — scores maximally AND uses number-frequency analysis to block the player's likely tiles

---

## Bug Fixes (this session)

### The `renderBoard` crash — root cause + fix

**Symptom:** Game crashed after the first tile was played by either player.

```
TypeError: Cannot read properties of null (reading 'style')
    at Game.renderBoard
```

**Root cause — two-part:**

1. **HTML structure:** `board-empty-msg` was originally nested *inside* `board-chain` in the HTML. The browser also parses it this way (confirmed via `MutationObserver` + DOM inspection). The previous fix attempt moved the element to be a sibling in the HTML source, but the browser's HTML parser re-nests it back inside `board-chain` anyway.

2. **JS destroying the element:** The old `renderBoard` code explicitly moved `board-empty-msg` back into `board-chain` via `chain.appendChild(emptyMsg)` (when board was empty). When the board became non-empty, `chain.innerHTML = ''` then permanently destroyed `board-empty-msg`. All subsequent renders crashed trying to access `.style` on `null`.

**Fix:**

```js
// OLD — destroys board-empty-msg
chain.innerHTML = '';

// NEW — removes only tile elements, preserves anything else in the chain
chain.querySelectorAll('.board-tile').forEach(t => t.remove());
```

Added null guards on `emptyMsg` throughout, and removed the `chain.appendChild(emptyMsg)` call. The element is now controlled purely via `display: none/block` regardless of where it lives in the DOM.

### Multi-end tile selection

**Symptom:** When a tile fit both the left and right end, the game silently picked an end (often costing points the player didn't intend to sacrifice).

**Fix:** `playerSelectTile()` now shows interactive drop zones (`← PLAY LEFT` / `PLAY RIGHT →`) and waits for the player to choose. A 12-second watchdog auto-picks `ends[0]` if the player doesn't respond (prevents lock-up).

---

## File Structure

```
sister-wendy/
├── index.html          # The entire game
├── assets/
│   ├── audio/
│   │   ├── place.mp3   # Tile-laid sound effect
│   │   └── score.mp3   # Scoring point sound effect
│   ├── images/
│   │   └── avatar.jpg  # Sister Wendy portrait
│   └── videos/         # Optional MP4s (wendy-main, wendy-frustration, etc.)
│                       # Game works fine without these — falls back to static image
└── static-backup/      # Snapshot of a known-good version
```

---

## Notes

- **Videos are optional.** The game works fully without `assets/videos/`. The 404 errors in the console are expected on setups without the video files.
- **Daily Challenge** uses a seeded PRNG based on today's date — same tile draw for all players on the same day.
- **One round ≠ one game.** Rounds continue until someone reaches 61 total points.
