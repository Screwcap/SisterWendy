# Sister Wendy Dominoes
**sister-wendy.vercel.app** | Screwcap Holdings

Horse-race dominoes with a competitive nun who judges your tile choices in real time.
Malcolm Gladwell meets Sister Act. Every play gets a verdict.

## Status
Production — live at sister-wendy.vercel.app. Next.js app deployed on Vercel.

## Stack
- Next.js / Turbopack, Vercel static
- GSAP 3.15.0 (CSSPlugin + Flip + ScrollTrigger)
- Howler.js — audio (place.mp3, score.mp3, clear.mp3)
- localStorage — game state persistence (sw-game)

## Characters
- **Sister Wendy** — art historian, gold accent. The original. Don't touch her dialogue.
- **Sister Patricia** — snap queen, deep purple. 40s, zero setup, straight punchline.
- **Abbess Hildegard** — deadpan superior, forest green. 70s, hits land harder.

## Game
All-Fives domino variant, play to 61 points. 3 difficulty modes: Forgiving / Focused / Merciless.

## Edit content
See `CLAUDE.md` for full brief, bug list, and enhancement roadmap.

## Priority fixes
1. Back/menu button during gameplay (BUG 1)
2. Share card (BUG 2 — `oO()` returns null)
3. Patricia + Hildegard personality differentiation (main ask)

© 2026 Screwcap Holdings
