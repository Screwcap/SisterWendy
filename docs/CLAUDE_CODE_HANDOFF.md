# Sister Wendy's Dominoes - Claude Code Handoff

**Version:** 0.9.1  
**Date:** 2026-03-12  
**Live URL:** https://sister-wendy.vercel.app  
**GitHub:** Screwcap/sister-wendy  
**Status:** Playable but has critical UX bugs

---

## 🚨 CRITICAL BUGS TO FIX

### 1. Tile Selection Breaks After First Play
**Symptom:** Player plays first tile successfully, but subsequent tile selections don't work. Click/tap on tiles in hand does nothing or flashes briefly then disappears.

**Root Cause Analysis:**
- The `_placementLock` flag gets stuck in `true` state
- `renderAll()` is called during placement which resets UI state
- Event listeners may be getting removed/re-added incorrectly during `renderHand()`
- Race condition between animation completion and state reset

**Suspected Code Locations:**
```javascript
// Line ~1650 - playerSelectTile()
this._placementLock = true;  // Gets set but may not always clear

// Line ~1750 - playerPlayTile() 
this._placementLock = false;  // Should release but doesn't always

// Line ~1900 - _handToPlayer()
this._placementLock = false;  // Another reset point
```

**Suggested Fix:**
- Add defensive `_placementLock = false` at START of `playerSelectTile()`
- Add timeout failsafe: `setTimeout(() => this._placementLock = false, 2000)`
- Don't call `renderAll()` during active placement - only render specific changed elements

---

### 2. Sister Wendy Goes First → Game Freezes
**Symptom:** When Wendy wins the coin toss and plays first, after her tile is placed, player cannot interact with their hand.

**Root Cause:**
- `_handToPlayer()` may not be called after Wendy's turn
- `this.turn` stays as `'wendy'` or `'wendy-thinking'` instead of becoming `'player'`
- The turn indicator shows "Your Turn" but click handlers check `if (this.turn !== 'player') return;`

**Suspected Code Locations:**
```javascript
// Line ~1950 - _wendyPlayTile()
// After Wendy plays, should call _handToPlayer() but may hit early return

// Line ~1980 - bonus turn logic
if (getBonusTurn) {
  // Wendy plays again - but what if she can't?
}
```

**Suggested Fix:**
- Add explicit state logging: `console.log('[STATE] turn:', this.turn, 'phase:', this.phase)`
- Ensure `_handToPlayer()` ALWAYS sets `this.turn = 'player'`
- Add watchdog timer that forces turn to player after 5 seconds of inactivity

---

### 3. Drop Zones Disappear Prematurely
**Symptom:** When a tile fits both ends, the LEFT/RIGHT drop zones flash briefly then vanish before player can click them.

**Root Cause:**
- `renderAll()` calls `renderBoard()` which clears drop zones
- `showBoardDropZones()` creates zones but something removes them immediately
- The `phase` may be getting reset from `'end'` back to `'select'`

**Suspected Code:**
```javascript
// Line ~1700 - showBoardDropZones()
// Creates zones correctly...

// Line ~2100 - renderAll()
if (this.phase !== 'end') {
  this.hideBoardDropZones();  // This fires when it shouldn't
}
```

**Suggested Fix:**
- DON'T call `renderAll()` when showing end choice - only call `renderHand()` to highlight selected tile
- Track drop zones in `this._activeDropZones` array and check before removing
- Add `data-persistent="true"` attribute to zones and check before removal

---

## 🎯 UX IMPROVEMENTS NEEDED

### 1. Smooth Drag & Drop (Currently Broken)
The `DragDropHandler` class exists but doesn't integrate well with the click-to-play system.

**Reference Implementations:**
- Chess.js + Chessboard.js: https://github.com/oakmac/chessboardjs
- Backgammon: https://github.com/nickvdyck/backgammon
- Generic drag-drop: https://github.com/bevacqua/dragula

**Desired Behavior:**
1. Tap tile = select it (current)
2. Drag tile = pick it up and show drop zones
3. Drop on valid zone = play tile with smooth animation
4. Drop elsewhere = return tile to hand with spring animation

**Animation Style (from FlyMacroPilot):**
```javascript
// Smooth spring easing
const spring = (t) => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

// Animate tile from hand to board
function animateTileToBoard(tileEl, targetX, targetY, duration = 400) {
  const start = performance.now();
  const startRect = tileEl.getBoundingClientRect();
  
  function frame(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    const eased = spring(t);
    
    const x = startRect.left + (targetX - startRect.left) * eased;
    const y = startRect.top + (targetY - startRect.top) * eased;
    
    tileEl.style.transform = `translate(${x - startRect.left}px, ${y - startRect.top}px)`;
    
    if (t < 1) requestAnimationFrame(frame);
    else onComplete();
  }
  
  requestAnimationFrame(frame);
}
```

---

### 2. Dynamic Board Scaling
Currently implemented but could be smoother:

```javascript
// Current approach - CSS classes
#board-chain.tiles-few .domino.board-tile { transform: scale(1.2); }
#board-chain.tiles-many .domino.board-tile { transform: scale(0.7); }

// Better approach - calculate based on viewport
function calculateTileScale() {
  const chain = document.getElementById('board-chain');
  const viewport = chain.parentElement.clientWidth;
  const tileCount = game.board.chain.length;
  const tileWidth = 88; // base tile width
  const totalWidth = tileCount * tileWidth;
  
  if (totalWidth < viewport * 0.8) return 1.2;
  if (totalWidth < viewport) return 1.0;
  return Math.max(0.6, (viewport * 0.9) / totalWidth);
}
```

---

### 3. Version Display
Add to the header or footer:

```html
<!-- In #header or footer -->
<span class="version">v0.9.1</span>

<style>
.version {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.3);
  position: absolute;
  bottom: 4px;
  right: 8px;
}
</style>
```

---

## 🏗️ ARCHITECTURE ISSUES

### State Machine is Implicit
The game uses `this.turn` and `this.phase` but they're not enforced:

```javascript
// Current - scattered state
this.turn = 'player' | 'wendy' | 'wendy-thinking'
this.phase = 'select' | 'end'
this._placementLock = true | false

// Better - explicit state machine
const GameState = {
  MENU: 'menu',
  PLAYER_SELECT: 'player_select',
  PLAYER_CHOOSE_END: 'player_choose_end', 
  PLAYER_ANIMATING: 'player_animating',
  WENDY_THINKING: 'wendy_thinking',
  WENDY_PLAYING: 'wendy_playing',
  ROUND_END: 'round_end',
  GAME_END: 'game_end'
};

// Transition function
function transition(newState) {
  console.log(`[STATE] ${this.state} → ${newState}`);
  this.state = newState;
  this.render(); // Single render point
}
```

### Render Thrashing
`renderAll()` is called too frequently, causing:
- Event listeners to be removed and re-added
- Animations to restart
- State to be visually reset

**Fix:** Implement dirty flags:
```javascript
this._dirty = { hand: false, board: false, scores: false };

markDirty(what) { this._dirty[what] = true; }

render() {
  if (this._dirty.hand) this.renderHand();
  if (this._dirty.board) this.renderBoard();
  if (this._dirty.scores) this.updateScoreDisplay();
  this._dirty = { hand: false, board: false, scores: false };
}
```

---

## 📱 MOBILE ISSUES

### Touch Events Conflict with Click
Both touch and click handlers fire, causing double-actions:

```javascript
// Current - both fire
div.addEventListener('click', handler);
// Plus DragDropHandler adds touchstart

// Fix - use pointer events
div.addEventListener('pointerdown', handler);
div.addEventListener('pointerup', handler);
```

### Fat Finger Problem
Tiles are too close together on mobile. Current gap is 6px, should be 12px+ on touch devices.

---

## 🧪 TESTING CHECKLIST

Before deploying, manually test:

1. [ ] Start game - player goes first - play 3 tiles
2. [ ] Start game - Wendy goes first - play after her
3. [ ] Play a tile that fits BOTH ends - choose left
4. [ ] Play a tile that fits BOTH ends - choose right
5. [ ] Play onto a double (should auto-play, no choice needed)
6. [ ] Draw from boneyard when no valid moves
7. [ ] Score 5, 10, 15, 20 points - verify animations
8. [ ] Play a double - verify bonus turn
9. [ ] Score AND play double - verify bonus turn
10. [ ] Win a round - verify round end screen
11. [ ] Win the game (reach 61) - verify game end
12. [ ] HELP button when stuck - verify it plays best tile
13. [ ] Mobile: tap tiles, drag tiles, tap drop zones

---

## 📁 FILE STRUCTURE

```
sister-wendy/
├── index.html          # EVERYTHING is in here (monolith)
├── assets/
│   ├── images/
│   │   ├── avatar.jpg
│   │   ├── winning.jpeg
│   │   ├── losing.jpeg
│   │   ├── thinking.jpeg
│   │   └── icon-512.jpeg
│   └── videos/
│       ├── wendy-main.mp4
│       ├── wendy-smirk.mp4
│       ├── wendy-thinking.mp4
│       ├── wendy-victory.mp4
│       ├── wendy-winning.mp4
│       ├── wendy-lose.mp4
│       └── wendy-frustration.mp4
└── docs/
    └── CLAUDE_CODE_HANDOFF.md  # This file
```

---

## 🎮 GAME RULES REFERENCE

**Horse Race / All Fives Dominoes:**
- Double-6 set (28 tiles)
- 7 tiles each, rest in boneyard
- First to 61 points wins
- Score when open ends sum to multiple of 5
- **Doubles count BOTH pips** (e.g., [5|5] on end = 10, not 5)
- Playing a double = bonus turn
- Scoring = bonus turn
- Domino (empty hand) = winner scores opponent's remaining pips (rounded to 5)

---

## 🚀 DEPLOYMENT

```bash
# Push to GitHub triggers Vercel auto-deploy
cd /home/andrewfritz/dominobrain/sister-wendy
git add -A
git commit -m "Fix: description"
git push origin main

# Vercel deploys in ~60 seconds
# Hard refresh to see changes: Cmd+Shift+R
```

---

## 💡 QUICK WINS

1. **Add version number** - 5 minutes
2. **Add console logging** - 10 minutes (helps debug state)
3. **Fix placement lock** - 30 minutes (add defensive resets)
4. **Simplify end selection** - 1 hour (remove overlay, use only board zones)

---

## 🙏 CREDITS

- **Game Design:** Andrew Fritz
- **AI Assistance:** Jonathon (Claude)
- **Character:** Sister Wendy Beckett (inspiration)
- **Sound:** Web Audio API synthesis

---

*Last updated: 2026-03-12 22:30 CST*
