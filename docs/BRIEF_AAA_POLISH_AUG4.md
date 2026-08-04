# Sister Wendy — AAA Polish Implementation Brief
**For:** Claude Code / ClaudeCoder  
**Project:** `/Users/andrewfritz/Downloads/SisterWendy-main 2/`  
**Goal:** Elevate from "polished indie" to "AAA game feel" — material quality, juice, spatial composition, and personality delivery.  
**Constraint:** Do not rebuild game logic. All changes are visual, audio, animation, and layout polish.  
**Priority:** P0 = ship-blocking polish. P1 = high-impact feel. P2 = nice-to-have atmosphere.

---

## 1. Splash Screen Polish

### P0 — PLAY Button Material
**File:** `app/page.tsx` or `components/IntroScreen.tsx`  
**Current:** Flat mustard block (`background-color: #D4AF37`).  
**Change:** Brushed-gold button with bevel and inner shadow.

```css
.play-button {
  background: linear-gradient(180deg, #e6c45e 0%, #D4AF37 40%, #b8952e 100%);
  border: 1px solid #8b7326;
  border-radius: 6px;
  box-shadow:
    0 1px 0 rgba(255,255,255,0.25) inset,
    0 2px 4px rgba(0,0,0,0.4),
    0 4px 12px rgba(0,0,0,0.3);
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  padding: 16px 48px;
  transition: transform 0.1s, box-shadow 0.1s;
}
.play-button:hover {
  transform: translateY(-1px);
  box-shadow:
    0 1px 0 rgba(255,255,255,0.3) inset,
    0 4px 8px rgba(0,0,0,0.5),
    0 6px 16px rgba(0,0,0,0.35);
}
.play-button:active {
  transform: translateY(1px);
  box-shadow:
    0 1px 0 rgba(255,255,255,0.2) inset,
    0 1px 2px rgba(0,0,0,0.4);
}
```

### P0 — Footer Text Legibility
**Current:** “CLICK ANYWHERE TO CONTINUE” is tiny, widely tracked, low-contrast.  
**Change:** Increase size to `14px`, tracking to `0.05em`, color to `rgba(212,175,55,0.7)`.

```css
.footer-hint {
  font-size: 14px;
  letter-spacing: 0.05em;
  color: rgba(212,175,55,0.7);
  text-shadow: 0 1px 4px rgba(0,0,0,0.8);
}
```

### P1 — Speech Bubble Font Unification
**File:** wherever the intro speech bubble renders  
**Current:** Uses system/default font.  
**Change:** Force same serif family as headers, e.g. `'Playfair Display', serif`, weight 400, italic.

```css
.speech-bubble {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-weight: 400;
}
```

### P1 — Vertical Rhythm Between Sections
**Current:** Massive gap between middle and bottom sections.  
**Change:** Reduce margin from `120px` to `64px`. Use consistent section spacing scale: `48px`, `64px`, `96px`.

---

## 2. Setup Screen Polish

### P0 — Opponent Icon Alignment
**File:** `components/GameSetup.tsx`  
**Current:** 👁 icon sits 2-3px higher than ⚡ and 🕯️.  
**Change:** Force icon container to fixed height with flex centering.

```tsx
<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '40px', // fixed container
  fontSize: '28px',
  lineHeight: 1,
}}>
  {icon}
</div>
```

### P0 — Duration Card Padding Consistency
**File:** `components/GameSetup.tsx`  
**Current:** “QUICK MATCH” text is 1-2px closer to top border than adjacent cards.  
**Change:** Enforce uniform padding: `padding: 16px 20px` on all duration cards. Do not use auto/percentage padding for text block.

### P0 — Game Mode “→ PLAY” Link Spacing
**Current:** Gap between quote and “→ PLAY” is ~40px; feels floating.  
**Change:** Reduce to `28px`. Add a faint separator rule or increase quote opacity to ground the link.

```css
.mode-quote {
  margin-bottom: 20px;
  opacity: 0.85;
}
.mode-play-link {
  margin-top: 8px;
  font-size: 14px;
  letter-spacing: 0.08em;
}
```

### P0 — Footer Link Spacing
**Current:** “Research · Terms · Privacy” — links are 2-3px apart.  
**Change:** Add `margin: 0 8px` or `gap: 12px` to the footer link container.

```css
.footer-links {
  display: flex;
  gap: 12px;
  justify-content: center;
}
```

### P1 — “More from Screwcap” Card Unification
**Current:** Text links with no border/shadow.  
**Change:** Give them the same gold-bordered card treatment as duration cards, but smaller. Add hover state: `transform: translateY(-2px)` + `box-shadow: 0 4px 12px rgba(0,0,0,0.3)`.

```css
.game-link-card {
  border: 1px solid rgba(212,175,55,0.25);
  border-radius: 6px;
  padding: 12px 16px;
  background: rgba(255,255,255,0.03);
  transition: all 0.15s ease;
}
.game-link-card:hover {
  transform: translateY(-2px);
  border-color: rgba(212,175,55,0.6);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
```

### P1 — “Today’s Challenge” Card Treatment
Same as above: add border, background, and hover state so it doesn’t look like a text label.

---

## 3. Gameplay Screen — Material & Atmosphere

### P0 — Table Texture
**File:** `components/Board.tsx` or global CSS  
**Current:** Flat dark-green grid (`#1a2e1f` or similar).  
**Change:** Replace with a PBR-like felt texture.

```css
.baize-felt {
  background-color: #1b3a2a;
  background-image:
    url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  box-shadow:
    inset 0 0 80px rgba(0,0,0,0.6),
    0 0 40px rgba(0,0,0,0.4);
  border: 1px solid rgba(212,175,55,0.15);
}
/* Reduce grid line visibility */
.baize-felt::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}
```

### P0 — Tile Material Upgrade
**File:** `components/Hand.tsx`, `components/Board.tsx`  
**Current:** Flat rectangles with faint shadow.  
**Change:** Beveled bone with pip indentation and specular highlight.

```css
.domino-tile {
  background: linear-gradient(135deg, #f5f0e6 0%, #e8dcc8 50%, #d4c9a8 100%);
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.15);
  box-shadow:
    0 1px 0 rgba(255,255,255,0.6) inset,
    0 -1px 0 rgba(0,0,0,0.1) inset,
    0 2px 4px rgba(0,0,0,0.25),
    0 4px 8px rgba(0,0,0,0.15);
  position: relative;
}
/* Pip indentation */
.domino-pip {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(0,0,0,0.9), rgba(0,0,0,0.7));
  box-shadow: 0 1px 0 rgba(255,255,255,0.2) inset, 0 1px 2px rgba(0,0,0,0.4);
}
/* Center line */
.domino-tile::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  height: 1px;
  background: rgba(0,0,0,0.12);
  transform: translateY(-50%);
}
```

### P0 — Tile Hover & Selection Juice
**File:** `components/Hand.tsx`  
**Current:** Hard red border on selected tiles.  
**Change:** Golden glow + lift on hover/selection.

```css
.domino-tile {
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  cursor: pointer;
}
.domino-tile:hover {
  transform: translateY(-6px);
  box-shadow:
    0 1px 0 rgba(255,255,255,0.6) inset,
    0 8px 16px rgba(0,0,0,0.3),
    0 0 16px rgba(212,175,55,0.35);
}
.domino-tile.selected {
  transform: translateY(-4px);
  box-shadow:
    0 1px 0 rgba(255,255,255,0.6) inset,
    0 6px 12px rgba(0,0,0,0.3),
    0 0 20px rgba(212,175,55,0.5);
  border-color: rgba(212,175,55,0.8);
}
/* Playable hint pulse for Forgiving mode */
.domino-tile.playable {
  animation: playablePulse 2s ease-in-out infinite;
}
@keyframes playablePulse {
  0%, 100% { box-shadow: 0 0 0 rgba(212,175,55,0); }
  50% { box-shadow: 0 0 10px rgba(212,175,55,0.3); }
}
```

### P1 — Portrait Frame Depth
**File:** `components/Board.tsx` or wherever portrait renders  
**Current:** Flat yellow circle.  
**Change:** Add shadow and rim light.

```css
.portrait-frame {
  border-radius: 50%;
  box-shadow:
    0 0 0 3px rgba(212,175,55,0.4),
    0 4px 12px rgba(0,0,0,0.5),
    0 0 30px rgba(212,175,55,0.15);
  border: 2px solid rgba(212,175,55,0.6);
}
```

### P1 — UI Panel Texturing
**File:** `components/Board.tsx`, `components/ScorePanel.tsx`  
**Current:** Flat translucent divs.  
**Change:** Add noise texture and inner stroke.

```css
.panel-textured {
  background: rgba(10, 20, 15, 0.85);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(212,175,55,0.2);
  box-shadow:
    0 0 0 1px rgba(0,0,0,0.3) inset,
    0 4px 12px rgba(0,0,0,0.3);
  /* Optional noise overlay via SVG data URI */
  background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
}
```

### P1 — Label Contrast Fixes
**Files:** `components/Board.tsx`, `components/Hand.tsx`  
**Current:** “YOUR HAND”, “BONEYARD”, “FORGIVING MODE” are faint.  
**Change:** Minimum contrast ratio 4.5:1 against background.

```css
.game-label {
  color: rgba(230, 225, 210, 0.9);
  text-shadow: 0 1px 3px rgba(0,0,0,0.8);
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.06em;
}
```

---

## 4. Gameplay Juice & Feedback

### P0 — Tile Play Feedback
**File:** `components/Board.tsx` or `components/Game.tsx`  
**Trigger:** On tile play.  
**Effects:**
1. **Audio:** Play existing Web Audio clack at `0.8` volume, `1.0` playbackRate.
2. **Visual flash:** Brief `rgba(212,175,55,0.3)` flash on the open end where tile landed — duration `120ms`.
3. **Tile snap:** Use GSAP `to(tile, { x: targetX, y: targetY, duration: 0.15, ease: "back.out(1.4)" })`.

```ts
// GSAP snap example
const playTile = (tileEl: HTMLElement, targetX: number, targetY: number) => {
  playClack();
  gsap.to(tileEl, {
    x: targetX,
    y: targetY,
    duration: 0.15,
    ease: "back.out(1.4)",
    onComplete: () => {
      // flash the open end
      const flash = document.createElement('div');
      flash.style.cssText = `
        position:absolute; left:${targetX}px; top:${targetY}px;
        width:40px; height:40px; border-radius:50%;
        background:rgba(212,175,55,0.3); pointer-events:none;
        animation: flashOut 120ms forwards;
      `;
      boardRef.current.appendChild(flash);
      setTimeout(() => flash.remove(), 150);
    }
  });
};
```

```css
@keyframes flashOut {
  to { opacity: 0; transform: scale(1.5); }
}
```

### P0 — Scoring Popup
**File:** `components/ScorePanel.tsx`  
**Current:** Score updates silently.  
**Change:** When score changes, spawn a floating `+N` that drifts up and fades.

```tsx
const ScorePopup = ({ points, x, y }: { points: number; x: number; y: number }) => (
  <div style={{
    position: 'absolute',
    left: x,
    top: y,
    color: '#D4AF37',
    fontSize: '24px',
    fontWeight: 700,
    textShadow: '0 2px 4px rgba(0,0,0,0.6)',
    pointerEvents: 'none',
    animation: 'scoreFloat 900ms ease-out forwards',
  }}>
    +{points}
  </div>
);
```

```css
@keyframes scoreFloat {
  0% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-40px) scale(1.2); }
}
```

### P0 — “BONUS TURN” Banner Restyle
**File:** wherever the bonus turn banner renders  
**Current:** Bright yellow, generic, jarring.  
**Change:** Gold-bordered toast, fade-up, smaller footprint.

```css
.bonus-turn-toast {
  background: rgba(10, 20, 15, 0.9);
  border: 1px solid rgba(212,175,55,0.5);
  border-radius: 8px;
  padding: 10px 20px;
  color: #D4AF37;
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  animation: fadeUp 300ms ease-out;
}
```

### P1 — Turn Indicator Enhancement
**Current:** Small gold triangle “▶ YOUR TURN”.  
**Change:** Add a pulsing outer ring + vignette flash on turn start.

```css
.turn-indicator {
  position: relative;
}
.turn-indicator::before {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid rgba(212,175,55,0.5);
  animation: turnPulse 1.5s ease-in-out infinite;
}
@keyframes turnPulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.15); opacity: 1; }
}
```

### P1 — Wendy Dialogue Timing
**File:** `components/Board.tsx` or dialogue component  
**Current:** Dialogue appears after silence.  
**Change:** Fade dialogue in over first 200ms of tile clack, not after. Use GSAP timeline.

```ts
const playDialogue = (text: string) => {
  playClack();
  const el = dialogueRef.current;
  gsap.fromTo(el,
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 0.25, delay: 0.15, ease: "power2.out" }
  );
};
```

### P2 — Hand Centering Fix
**File:** `components/Hand.tsx`  
**Current:** Right edge gap is wider than left.  
**Change:** Use flexbox with `justify-content: center` and explicit tile width so gaps are symmetric. Or compute `paddingLeft` and `paddingRight` from container width minus `tileCount * tileWidth`.

---

## 5. Gameplay Screen — Layout & Composition

### P1 — Board Crop / Scale
**File:** `app/play/page.tsx` or game layout wrapper  
**Current:** Central play area is ~70% empty during early rounds.  
**Change:** Add a `transform: scale(0.9)` on the board container when tile chain length < 4, or zoom camera to tile chain region. Alternatively, fill the middle with subtle atmospheric elements (candle glow, vignette).

```css
.board-area {
  position: relative;
  overflow: hidden;
}
.board-area::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%);
  pointer-events: none;
}
```

### P1 — End-of-Round Recap
**File:** `components/Game.tsx`  
**Add:** When round ends, show a summary overlay before advancing.

```tsx
<div className="round-recap">
  <h3>Round {round} Complete</h3>
  <p>You scored <strong>{playerDelta}</strong> · Wendy scored <strong>{wendyDelta}</strong></p>
  <p className="wendy-take">“{wendyCommentary}”</p>
  <button onClick={nextRound}>Continue</button>
</div>
```

```css
.round-recap {
  position: absolute;
  inset: 0;
  background: rgba(5,10,8,0.92);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  animation: fadeIn 200ms ease;
  z-index: 50;
}
```

### P2 — Bottom Button Clutter
**File:** `components/Board.tsx`  
**Current:** “DOUBLE FIVES · THE CHAIR · FLYMACROPILOT” sit on the gameplay HUD.  
**Change:** Move to a collapsible “More Games” drawer triggered by a small icon. If they must stay visible, restyle as tiny gold-bordered pills.

```css
.cross-promo-pill {
  border: 1px solid rgba(212,175,55,0.3);
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 11px;
  color: rgba(212,175,55,0.8);
  background: rgba(0,0,0,0.3);
  transition: all 0.15s;
}
.cross-promo-pill:hover {
  border-color: rgba(212,175,55,0.7);
  color: #D4AF37;
}
```

---

## 6. Audio & Personality Spice

### P1 — Wendy Voice Spatialization
**File:** `components/Board.tsx` or audio service  
**Current:** Plays as plain UI button audio.  
**Change:** Use Web Audio panner to place voice at portrait position with slight reverb.

```ts
const playWendyLine = (audioUrl: string) => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  const ctx = new AudioContext();
  const source = ctx.createMediaElementSource(audioEl);
  const panner = ctx.createPanner();
  panner.panningModel = 'HRTF';
  panner.distanceModel = 'inverse';
  panner.refDistance = 1;
  panner.maxDistance = 100;
  panner.rolloffFactor = 1;
  // Position at portrait (left side of screen)
  panner.setPosition(-200, 0, 0);
  source.connect(panner).connect(ctx.destination);
  audioEl.play();
};
```

### P1 — Reaction Timing
**Current:** Wendy lines play after player action completes.  
**Change:** For barbs on bad plays, trigger her line at `t=150ms` after the tile lands — not after the snap animation completes.

### P2 — Tile Clack Mix
**Current:** Basic click.  
**Change:** Layer two sounds: a high “tick” for small tiles, a deeper “clack” for doubles. Use `playbackRate` to vary by tile size.

```ts
const playClack = (tileValue: number) => {
  const rate = tileValue >= 6 ? 0.9 : 1.1;
  audio.currentTime = 0;
  audio.playbackRate = rate;
  audio.volume = 0.8;
  audio.play();
};
```

---

## 7. Typography & Fonts

### P1 — Font Audit
Ensure these font stacks are used consistently:

```css
:root {
  --font-display: 'Playfair Display', 'Cinzel', serif;
  --font-body: 'Inter', 'Helvetica Neue', sans-serif;
  --font-mono: 'SF Mono', 'Menlo', monospace;
}
```

- All headers: `var(--font-display)`
- All body/labels: `var(--font-body)`
- No system fonts anywhere. If Playfair Display isn’t loaded, add via Google Fonts in `app/layout.tsx`.

---

## 8. Verification Checklist

After implementation, run these checks:

- [ ] PLAY button has visible gradient + shadow, not flat color.
- [ ] Footer text is legible at 14px.
- [ ] Opponent icons are vertically aligned across the row.
- [ ] Duration cards have identical padding.
- [ ] “→ PLAY” link is 28px below quote, not floating.
- [ ] Footer links have 12px gap.
- [ ] Table has subtle noise texture; grid lines are faint.
- [ ] Tiles have bevel, pip indentation, and specular highlight.
- [ ] Hovering a tile lifts it 6px + golden glow.
- [ ] Selected tile has golden glow, not red border.
- [ ] Playable tiles pulse gently in Forgiving mode.
- [ ] Tile play triggers: clack audio + snap animation + open-end flash.
- [ ] Score changes spawn floating `+N` popup.
- [ ] BONUS TURN is a gold-bordered toast, not a yellow banner.
- [ ] Turn indicator pulses on turn start.
- [ ] Board has vignette overlay; no dead 70% empty zone.
- [ ] Wendy dialogue fades in over tile sound, not after.
- [ ] Cross-promo buttons are pills or in a drawer.
- [ ] All text meets 4.5:1 contrast minimum.

---

## 9. Asset References

- **Gold palette:** `#D4AF37` (primary), `#e6c45e` (highlight), `#b8952e` (shadow)
- **Felt green:** `#1b3a2a` (base), `rgba(255,255,255,0.03)` grid lines
- **Bone tile:** `#f5f0e6` → `#d4c9a8` vertical gradient
- **Shadow scale:** `0 2px 4px` (near), `0 4px 12px` (mid), `0 8px 24px` (far)

---

## 10. Out of Scope

Do NOT change:
- Game rules or scoring logic.
- Tile values or deal logic.
- Network/API calls.
- State machine in `Game.tsx`.
- Wendy dialogue text content (only timing/delivery).

If a change touches game logic, stop and create a separate task.

---

**Estimated effort:** 3-4 days focused UI pass.  
**Risk:** Low — all changes are additive CSS/animation layers.  
**Validation:** Run `npm run build` and test on Chrome + Safari.
