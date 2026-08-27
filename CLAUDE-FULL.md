# Sister Wendy Dominoes — Claude Code Brief
## Compiled by Hermes · Updated May 28, 2026
## Live QA pass confirmed: sister-wendy.vercel.app

---

## WHAT'S ALREADY GREAT — DO NOT TOUCH
- **The intro splash screen** — best in the Screwcap portfolio. Black, minimal, domino fan, "Are you playing or not." is perfect. Not a pixel.
- **Sister Wendy's dialogue** — 17 categories, pip-count art narration, mood system. Every line is gold. Do not flatten, do not genericize.
- **The grade system (A–F)** — brilliant. Competitive players care about margin. Keep exactly as-is.
- **Howler.js audio** — 3 sound effects (place.mp3, score.mp3, clear.mp3) + Web Audio fallback. Working. Don't rebuild.
- **GSAP Flip tile animations** — tile placement feel is solid.
- **Multi-round play to 61** — correct All-Fives structure.
- **BONUS TURN flash** — now present and correct.
- **Open-ends display** (← 5 OPEN / 5 OPEN →) — present and correct.
- **localStorage persistence** (sw-game key) — working.
- **Draw/Pass conditional buttons** — working correctly.
- **"Four of us. Oh this is going to be something. Possibly a sin."** — MERCILESS copy is perfect.

---

## SECTION 1 — BUGS STILL OPEN

### BUG 1 — No back/menu button during gameplay
**Impact:** Players are trapped once a game starts. Refresh = feels like data loss (even though sw-game persists).
**Fix:** Add a small "☰ MENU" button top-left in the game header. On click: pause + show modal with [Resume / New Game / Change Mode / Return to Menu]. No routing needed — same page state management.
**Effort:** ~1 hour.

### BUG 2 — Share card returns null
**Location:** `oO()` component — wired but returns null.
**Fix:** Implement share card: game-over screen only, shows Grade + score + best Wendy quote from the round + "Beaten by a nun at dominoes." + navigator.share() fallback to clipboard copy.
**Effort:** ~2 hours.

---

## SECTION 2 — NUN PERSONALITY OVERHAUL (main ask this iteration)

### Current state (confirmed via JS chunk audit May 28)
Patricia and Hildegard exist as player objects but `ou(e)` — the dialogue picker — ignores `personalityId` entirely. Both opponents pull from Wendy's `ol` dialogue object. They are Wendy clones in different names.

### The brief
Replace the **art historian** personality framing with **sassy nun — white Whoopi Goldberg energy.** Sister Act, not art criticism. Quick wit, snap comebacks, zero reverence, zero setup time. Every line is a mic drop.

Apply to **Sister Patricia** and **Abbess Hildegard** as distinct characters. Wendy stays exactly as she is.

---

### Sister Patricia — "The Snap Queen"
Quick, clipped, never elaborates. No setup, straight punchline. 40s, sharp features, eyebrow permanently raised.

```javascript
const op = {
  gameStart:    ["Let's go.", "I've been waiting.", "Finally."],
  playerScores: ["Lucky.", "Don't get used to that.", "Okay. Your turn still coming."],
  playerBigScore: ["...Fine. That was good.", "I see you.", "Alright. I'll allow it."],
  playerDouble: ["Double. Sure. Enjoy the bonus turn.", "Of course."],
  playerCombo:  ["Look at you.", "Going off, huh?", "Okay, okay."],
  playerCantPlay: ["Draw. Yes. Draw.", "Boneyard's waiting, honey.", "Take your time. Actually don't."],
  wendyScores:  ["That's mine.", "Thank you.", "As expected."],
  wendyBigScore: ["Twenty. Write that down.", "Called it.", "I don't celebrate but... yes."],
  wendyDouble:  ["Double. Play again. Already ahead.", "Mm."],
  herTurn:      ["Moving.", "Watch.", "Already done.", "I don't think about this long."],
  smug:         ["Honey, no.", "Did you think about that before or after you played it?", "Bless your heart.", "I see what you were going for. I do."],
  commentary:   ["Board's looking good. For me.", "This is going exactly how I thought.", "You're fighting hard. Respect. Doesn't matter though."],
  angry:        ["Oh you did NOT.", "That tile. That tile right there. Who raised you?", "I'm not mad. I'm disappointed. Actually no — I'm mad."],
  playerWins:   ["Fine. You won. Don't make it weird.", "I let you have that one. Spiritual reasons.", "Go on then. I'll be over here."],
  wendyWins:    ["Called it.", "See? Effortless.", "I could do this all day. And I have.", "Next."],
  tileHover:    ["That one?", "Careful.", "Hmm.", "Think it through."]
};
```

---

### Abbess Hildegard — "The Deadpan Superior"
Older, slower delivery — but the hits land harder. Thinks she's above the game. She isn't. 70s, stern, heavy eyebrows, radiates mild disappointment at all times.

```javascript
const oh = {
  gameStart:    ["Let us begin. God is watching, presumably.", "In my own time.", "I've seen worse tables. Not many."],
  playerScores: ["Noted.", "A point. Congratulations on the minimum.", "Fine."],
  playerBigScore: ["That was... acceptable.", "I won't pretend I'm not slightly irritated.", "You've played well. Don't let it go to your head."],
  playerDouble: ["A double. How festive.", "Bonus turn. Proceed."],
  playerCombo:  ["You're on a run. It won't last.", "Enjoy this moment.", "I've seen this before. It ends."],
  playerCantPlay: ["Draw. Yes. The boneyard is humbling.", "Even the gifted must draw sometimes.", "Take a tile. Reflect."],
  wendyScores:  ["Correct.", "As it should be.", "Order is restored briefly."],
  wendyBigScore: ["Twenty points. Yes. That's what preparation looks like.", "I've been waiting for that.", "Mm."],
  wendyDouble:  ["The double. Play again.", "Expected. But satisfying."],
  herTurn:      ["In my own time.", "The board waits for no one, yet here we are waiting for me.", "I'm deliberating. It's a virtue."],
  smug:         ["I've seen better plays from the postulants.", "That's one approach.", "Interesting choice. Very... human of you.", "I won't comment. The tile speaks for itself."],
  commentary:   ["The board develops. Slowly, in your case.", "We are playing dominoes. I remind myself of this periodically.", "Twenty years of prayer prepared me for many things. Not this."],
  angry:        ["That. Was. Unnecessary.", "I didn't leave the enclosure for this.", "Twenty years of prayer and I'm watching THIS."],
  playerWins:   ["You have beaten an elderly nun. Reflect on that.", "I'll add it to my Lenten penance.", "Enjoy it. God is watching. And so am I."],
  wendyWins:    ["As expected.", "Order restored.", "The younger ones get excited. I don't need to."],
  tileHover:    ["Choose carefully.", "That one?", "Deliberate.", "The wrong tile is its own punishment."]
};
```

---

### Code change — `ou()` function
**Location:** Find `function ou(e)` in the game logic. Currently:
```javascript
function ou(e) {
  let t = ol[e];
  return t[Math.floor(Math.random() * t.length)];
}
```

**Replace with:**
```javascript
function ou(e, personalityId = 'wendy') {
  const banks = { wendy: ol, patricia: op, hildegard: oh };
  const bank = banks[personalityId] || ol;
  const t = bank[e] || ol[e]; // fallback to Wendy if key missing
  return t[Math.floor(Math.random() * t.length)];
}
```

**Then pass personalityId** wherever `ou()` is called for AI opponent turns. The player objects already store `personalityId` — wire it through.

---

### Character portrait differentiation (CSS only — no new art needed)
Currently all 3 nuns share the same portrait card. For Merciless mode, differentiate by accent color:
- **Sister Wendy** — gold `#C9A84C` (existing)
- **Sister Patricia** — deep purple `#6B2FA0`
- **Abbess Hildegard** — forest green `#1A5C3A`

Apply to: portrait card border, name label, dialogue quote highlight. Same card layout, different color. 30 minutes CSS work.

**Optional (Midjourney, not required for v1):** Distinct portrait faces. Same format as Wendy's card. Prompt:
```
minimalist cartoon portrait, Catholic nun, round oval face, black habit, white wimple, small gold cross, dark background, speech bubble, retro playing card style --ar 2:3 --style raw --v 6
```
- Patricia variation: sharp cheekbones, 40s, one raised eyebrow, skeptical expression
- Hildegard variation: 70s, heavy brows, deep-set eyes, expression of mild disappointment

---

## SECTION 3 — GAMEPLAY POLISH (next priority after personality)

### 3A — Undo in FORGIVING mode only
- #1 requested feature across all domino app reviews
- FOCUSED and MERCILESS: no undo (consequential = the point)
- Store previous state in `lastState` on each move in FORGIVING
- Single UNDO button appears in FORGIVING only after a tile play
- **Effort:** ~2 hours

### 3B — Stats persistence
- Track: wins/losses, best grade, longest win streak, highest score
- localStorage key: `sw-stats`
- Show on game-over screen only — not mid-game
- **Effort:** ~1 hour

### 3C — Daily seeded challenge
- Seeded deal from `new Date().toISOString().slice(0,10)` hash
- Same tiles for everyone on a given day
- Button on main menu: "TODAY'S CHALLENGE"
- Mark played with `sw-daily-YYYY-MM-DD` localStorage key (and actually write it — common bug)
- **Effort:** ~2 hours

### 3D — Floating score annotation
- After every scoring play, brief flash showing the math: e.g. `"5 + 10 = 15 ✦ +15 pts"`
- Teaches scoring organically — #1 new-player confusion source
- GSAP fade-in/out, 1.5s, above the board
- **Effort:** ~1 hour

---

## SECTION 4 — FUTURE ROADMAP (not this sprint)

- **"Learn With Wendy" tutorial** — 5-turn guided game, Wendy explains each rule as it comes up
- **Pip education panel** — pip-count narration (`od[0-6]`) already exists in code, just needs a UI slot (left panel below portrait on hover)
- **PWA manifest** — add-to-homescreen, offline play
- **Opponent tells** — Patricia gets impatient when holding a good hand, Hildegard gets unusually quiet

---

## REDDIT LAUNCH ANGLE (when ready)

**r/dominoes, r/boardgames, r/webgames**

*"I built a domino game where a competitive nun, her snap-queen protégée, and a deadpan abbess judge your tile choices in real time."*

Lead with: Grade A screenshot + Patricia's best line. The Whoopi Goldberg-in-a-habit angle writes its own headline. Caribbean/Latin domino culture is very Catholic — this audience gets it immediately.

---

## TECH REFERENCE

- **Stack:** Next.js / Turbopack, Vercel static
- **Main chunk:** `0y7na60.p6h4a.js` (~200KB) — all game logic
- **Audio:** Howler.js bundled, `/place.mp3` `/score.mp3` `/clear.mp3`
- **Animations:** GSAP 3.15.0 (CSSPlugin + Flip + ScrollTrigger)
- **localStorage keys:** `sw-game` (state), `sw-muted`, `sw-intro-seen`, `sw-stats` (add)
- **Dialogue function:** `ou(e)` at ~line equiv of pos 134889 in minified chunk
- **Personality objects:** `ol` = Wendy (exists), `op` = Patricia (add), `oh` = Hildegard (add)
- **Player personality IDs:** already stored in player objects as `personalityId: "wendy"/"patricia"/"hildegard"`
