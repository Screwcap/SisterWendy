# Sister Wendy Dominoes — lean core

All-Fives dominoes + a nun's art-history commentary. Full brief (open bugs, personality
overhaul, gameplay-polish sprints, roadmap): **./CLAUDE-FULL.md**.
Note: being MERGED into the DoubleFives engine (constitution M5) — Wendy's commentary voice
is the asset to port; sisterwendy.com will 301 to /wendy.

## WHAT'S ALREADY GREAT — DO NOT TOUCH (this is the moat)
- **Sister Wendy's dialogue** — 17 categories, pip-count art narration, mood system. Every line is gold. Do NOT flatten or genericize.
- **Intro splash** ("Are you playing or not.") — not a pixel.
- **Grade system A–F** — keep exactly as-is.
- **Howler.js audio** (place/score/clear + Web Audio fallback) — working; don't rebuild.
- **GSAP Flip tile animations**, multi-round to 61, BONUS TURN flash, open-ends display,
  localStorage (`sw-game`), Draw/Pass conditional buttons — all present + correct.

## Deploy
Git-connected → sisterwendy.com. Push `main` auto-deploys. Preview first for anything risky.
