# Sister Wendy — Claude Code Update + Behavioral Layer
**Version:** 1.0  
**Date:** June 8, 2026  
**Status:** Active — verified patch workflow  
**Target:** Fix layout (margins, overlap), then layer behavioral nudges on top

---

## ACTIVE TASKS (P0 — do these in order)

### 1. Add 1/8" (≈3px) margins everywhere
**Problem:** Text and board elements are touching the screen edges. The user wants 1/8" breathing room (~3px) on every side of text blocks and the game board.

**File:** `/Users/andrewfritz/Downloads/SisterWendy-main/index.html`  
**Priority CSS blocks:**
- `body` global padding (line 87 area)
- `#board-area` inner padding (around line 431+)
- `.overlay-box` inner padding (around line 1238+)
- `.help-box-large`, `.stats-box` (around line 1532+)

**Action:**
```bash
# Verify current state
grep -n "padding: 6px 16px\|padding: 36px 44px\|padding: 13px 34px\|padding: 24px 20px" /Users/andrewfritz/Downloads/SisterWendy-main/index.html

# Expected outcome after patches:
# Global body padding: add padding: 3px; to body rule
# board-area padding: add padding: 3px; to #board-area
# overlay-box padding: change 36px 44px → 39px 47px (adds +3px each side)
# overlay-box padding 13px 34px → 16px 37px
# overlay-box padding 24px 20px → 27px 23px
```

**Verification:**
```bash
grep -nE "padding: 3px;|padding: 39px 47px|padding: 16px 37px|padding: 27px 23px" /Users/andrewfritz/Downloads/SisterWendy-main/index.html
# Should return 4+ matches
```

### 2. Fix Boneyard / "?" overlap in lower right
**Problem:** The Boneyard badge (🃏 + count) is absolutely positioned `top: 10px; right: 10px` (line 492-505). The `#stuck-nudge` button ("🆘 STUCK? BEST PLAY") is fixed at `bottom: 22px; right: 22px` (line 1023-1040). These two elements share near-identical right-side X coordinates but one is top and one is bottom, so visually they don't overlap — but the `#audio-toggle` button at `bottom: 10px; left: 12px` and the `#keyboard-hint` at `bottom: 8px; right: 8px` create a crowded bottom-right cluster. The user may also be seeing an issue where the boneyard badge's right edge bleeds into the board's horizontal scroll area on mobile.

**File:** `/Users/andrewfritz/Downloads/SisterWendy-main/index.html`

**A) Move Boneyard badge away from right edge:**
Change `#boneyard-badge` from:
```
top: 10px; right: 10px;
```
to:
```
top: 10px; right: 52px;   /* moved right to avoid collision with difficulty badge area */
```

**B) Move stuck-nudge away from keyboard-hint cluster:**
Change `#stuck-nudge` from:
```
bottom: 22px; right: 22px;
```
to:
```
bottom: 60px; right: 16px;
```
This lifts it above the audio toggle (bottom 10px) and keyboard hint (bottom 8px), and shifts it 6px further from the edge.

**C) Move audio-toggle higher:**
Change `#audio-toggle` from:
```
bottom: 10px; left: 12px;
```
to:
```
bottom: 60px; left: 14px;
```
So it pairs horizontally with the stuck-nudge rather than cannibalizing the corner.

**Verification:**
```bash
grep -nE "#boneyard-badge|#stuck-nudge|#audio-toggle" /Users/andrewfritz/Downloads/SisterWendy-main/index.html
# Should show: right: 52px for boneyard, bottom: 60px for both stuck-nudge and audio-toggle
```

---

## BEHAVIORAL ENHANCEMENTS (P1 — after layout fixes)

These are citations-first nudges aligned with the Gold Digger behavioral framework. Add them as the game stabilizes.

### 3. Uncertainty display on boneyard count
**Behavioral hook:** Loss aversion makes the boneyard count feel punishing when high. Show it with neutral framing, not alarmist red.
- Add `<span id="boneyard-context">Draw pile neutralises as the game progresses</span>` next to count
- Cite: Kahneman & Tversky 1979 — reframing reduces threat response to loss-framed counts

### 4. Streak celebration fade timing
**Behavioral hook:** The streak multiplier in Gold Digger uses a 1.5×/2× ramp. In Sister Wendy, the streak display at line 377 fires immediately. Delay the "🔥 Win Streak" pop by 800ms to let the score-total resolve first — this makes the streak feel earned rather than reflex.
- Cite: Miller, Richmond & Huber 2019 — perceived momentum increases effort when timing reinforces sequence

### 5. Difficulty badge color → cognitive load signal
**Behavioral hook:** Red/green is Cialdini's "social proof color heuristic." Keep it but add a microcopy hint ("Hard = +20% opponent IQ") so the nudge is explicit about cost, not just cosmetic.
- Cite: Cialdini 2007 — social proof works best when the behavior it signals is named, not merely colored

### 6. Undo button reappearance framing
**Behavioral hook:** When the undo button re-appears (visible class toggled), add a 120ms CSS transition opacity: 0→1 so it feels like a recovery, not a penalty reversal. The word "undo" carries loss-framing; frame it as "↩️ retry" in the button span.
- Cite: Thaler 1985 — mental accounting: relabeling changes which account the player processes the event in

### 7. Daily challenge lock icon
**Behavioral hook:** If the daily challenge is already completed (line 2961+), replace the calendar button with a trophy icon rather than disabling the button. Disabled = loss; trophy = completion record.
- Cite: prospect theory — status quo bias: a completed record feels more valuable than an unlocked opportunity when framed as attainment rather than availability

### 8. Help/?" button — rename to hint
**Behavioral hook:** The `?` key (line 2024, 2052) opens help. Rename from "?" to "HINT" in the help-overlay header. The `?` symbol triggers uncertainty anxiety; the word "hint" triggers curiosity without threat.
- Cite: Loewenstein 1994 — information gap theory: named curiosity ("hint") > anxiety symbol ("?")

---

## VERIFICATION CHECKLIST (per change)

- [ ] `grep -n` for the new class/id/padding value returns 1+ matches in the expected block
- [ ] `grep -n` for the old value returns 0 matches (if a rename/replacement)
- [ ] `git diff --stat` (or `diff -u` if no git) shows only the intended lines changed
- [ ] Game board still centers horizontally after margin changes
- [ ] No horizontal scroll introduced by the new padding
- [ ] Z-index stack: boneyard (4), difficulty (4), keyboard-hint (5), stuck-nudge (500), help-box (200) — verify no overrides needed

---

## CITATION APPENDIX (SisterWendy behavioral layer)

- Brehm 1966 — reactance (undo framing)
- Carmon & Ariely 2007 — abstract vs real loss framing (boneyard count)
- Cialdini 2007 — social proof color heuristic, consider-the-opposite
- Loewenstein 1994 — information gap theory (? vs hint)
- Thaler 1985 — mental accounting (undo/retry relabeling)
- Wilson, Centerbar & Brekke 2002 — bias pre-exposure (difficulty badge)
- Kahneman & Tversky 1979 — prospect theory, loss aversion
- Miller, Richmond & Huber 2019 — streak biases in skilled performance
- Hertwig & Erev 2009 — description-experience gap (help text framing)

---

## OPEN QUESTIONS

1. Is the overlap you're seeing on `sister-wendy.vercel.app` or localhost? If live, the deploy pulls from the 4735-line monolith here — any change needs a push.
2. Should the margin padding be uniform across ALL views (menu, round overlay, gameover, help), or just the main game board?
3. Should the boneyard badge stay on the board when the player's hand is in focus mode, or dim it?
4. Does the `#stuck-nudge` auto-appear during Wendy's turn? If so, lowering it to bottom:60px might clip it on mobile — verify viewport height.
