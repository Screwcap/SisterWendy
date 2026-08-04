# AAA Polish Brief — review and implementation record

**Brief:** `docs/BRIEF_AAA_POLISH_AUG4.md` (received 4 Aug 2026)
**Instruction:** "review this document and implement its findings"

The review mattered. The brief targets
`/Users/andrewfritz/Downloads/SisterWendy-main 2/` — a downloaded snapshot, not
this repo — and roughly half its findings describe a build we no longer ship.
Rather than apply them blind, every measurable claim was checked in a real
browser against the live component tree. The numbers below are measured, not
estimated.

---

## Built

| § | Item | Note |
|---|---|---|
| 1 P0 | PLAY button material | Was a flat `#c49020` block. Now a brushed-gold gradient with a top highlight, contact shadow, gold bloom, and proper hover/press states. |
| 1 P0 | Splash footer legibility | `CLICK ANYWHERE TO CONTINUE` was `rgba(196,144,32,0.25)` at 0.58rem — measured **1.8:1**. Now 0.78rem at 0.72 alpha with a shadow. |
| 3 P0 | Felt texture | Added an inline `feTurbulence` fibre grain over the existing ruled weave. No request, tiles seamlessly. |
| 3 P0 | Playable-tile pulse | Genuinely absent. Forgiving mode only (Hand passes `isPlayable=false` when hints are off), 2.4s, low amplitude. |
| 3 P1 | Tile hover glow | The lift existed; the glow didn't. Added a gold bloom to the existing 8px lift. |
| 3 P1 | Label contrast | The big one — see below. |
| 4 P0 | Open-end flash | Genuinely absent. Gold bloom over the tile that just landed, on FLIP completion. |
| 4 P0 | BONUS TURN toast | Already a gold-bordered box, not the "bright yellow banner" described. Added the fade-up entrance and a little more presence. |
| 4 P1 | Turn indicator pulse | Slow ring on `▶ YOUR TURN`. |
| 5 P1 | Board vignette | Kills the flat empty table in early rounds. |
| 2 P1 | Screwcap card hover | Border/background already existed; added the 2px lift + shadow. |
| 6 P2 | Clack pitch by tile | `rateForTile()` maps pip total → 0.88–1.12 playback rate. A 6\|6 thuds, a 0\|1 ticks. |
| 6 P1 | Wendy's tiles panned left | See the rejection note on HRTF below — this is the achievable version. |

### The contrast pass (§3 P1, §8)

Audited every leaf text node against its true composited background.

| Screen | Failing < 4.5:1 before | After |
|---|---|---|
| Setup | 22+ | 0 |
| In-game | 12 | 0 |

Worst offenders were the score-bar `0`/`61` end labels (**1.67:1**),
`7 TILES IN HAND` (1.73), `▶ YOUR TURN` (2.00), `BONEYARD` (2.04) and the mode
strip (2.24). Sub-9px type was raised as well as lightened.

Two colour decisions inside this pass are worth naming, because they touch
brand rather than just alpha:

- **The nuns.** Patricia's `#6B2FA0` and Hildegard's `#1A5C3A` read at ~2.3:1 as
  type on the near-black cards. `accentColor` still drives borders and washes;
  a new `textColor` field carries a lightened same-hue variant for text.
- **The cross-promo strip.** Each game's brand colour was used directly as type
  at 0.8rem and failed the same way. Lightened per game, same hue. The other
  games' own branding is untouched — this is only how they render here.

---

## Rejected, with reasons

**§7 — the font swap.** The brief asks for Playfair Display / Inter / SF Mono
and says "no system fonts anywhere." This repo already uses a deliberate,
loaded, non-system stack: **Bebas Neue / Cormorant Garamond / DM Mono**, wired
through `--font-bebas`, `--font-garamond`, `--font-mono`. Swapping it would
replace the game's visual identity with a generic one. Not done, and not a
close call.

**§2 P0 — all four spacing fixes.** Measured against the live build:

| Claim | Measured | Verdict |
|---|---|---|
| 👁 sits 2–3px above ⚡ and 🕯️ | all three at **18.0px**, heights identical | already aligned |
| "QUICK MATCH" 1–2px closer to top | all four cards **15.6px / 65.3px** | already identical |
| Quote→"→ PLAY" gap ~40px, reduce to 28px | actually **14px** | the fix would *increase* it |
| Footer links 2–3px apart, add 12px gap | actually **18.5px** | the fix would *decrease* it |

**Already shipped** — the brief describes them as missing: the scoring popup
(§4 P0 — `scoreFlash` floats above the board today), the end-of-round recap
(§5 P1), cross-promo pills (§5 P2 — already pills, not HUD clutter), the
speech-bubble serif (§1 P1 — already Cormorant italic), and the "hard red
border on selected tiles" (§3 P0 — it has been gold for months).

**§4 P2 hand centering.** The hand is `flex-wrap` + `justify-center`; gaps are
symmetric by construction.

**§6 P1 HRTF spatialisation.** The brief's code assumes an `<audio>` element it
can wrap in `createMediaElementSource`. Wendy's voice is Web Speech synthesis
(`lib/voice.ts`), whose output is not an AudioNode and cannot be routed through
a `PannerNode`. Implemented the honest equivalent instead: her tile lands at
`stereo(-0.35)`, matching the portrait on the left of the table.

**§5 P1 board scale on short chains.** Scaling the board container to hide empty
space fights the layout and moves the tiles under the player's cursor. The
vignette addresses the same complaint — a dead-flat middle — without that cost.

---

## Respected

§10's out-of-scope list held: no game rules, scoring, deal logic, API calls, or
`Game.tsx` state machine were touched. Wendy's dialogue text is unchanged;
only its delivery (timing, panning) moved.

All motion added here is disabled under `prefers-reduced-motion: reduce`.

---

## Still open for Andrew

The splash still reads **"Sister Wendy Beckett · 1930–2018"** — the real
art critic — while the setup screen has been rebranded to **"Sister Wendy
Calhoun · 1945–2019."** This predates the brief and the brief doesn't mention
it. Repo `CLAUDE.md` says not to touch the splash; that instruction is older
than this brief, which asks for splash polish. One line to align, if he wants
it aligned.
