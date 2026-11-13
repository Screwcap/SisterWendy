> # RETIRED: DO NOT RUN OR DEPLOY. Kept for history.
>
> **Sister Wendy is retired as a standalone game.** Her personality lives on inside **DoubleFives** (https://doublefives-next.vercel.app):
> Sister Wendy, Sister Patricia and Abbess Hildegard were ported as optional commentary for DoubleFives' existing opponents
> (DoubleFives commits `bab5bb1` "Sister Wendy Comes Home (M5): port the commentary, not the game", `83eddc5`, `abb0b9a`, early September 2026).
> This repository is the original game. Its domain, sisterwendy.com, has no DNS records and nothing is served there, and this
> repository's Vercel project should stay inactive. Do not run it, deploy it, or re-add its domains. Nothing below describes a live product.

# Sister Wendy Dominoes

**Was live at sisterwendy.com (no longer; the domain does not resolve)** · A [Screwcap Games](https://screwcap.games) property

> *"Sit down, darling. Let's see what you're made of."* — Sister Wendy Calhoun

All-Fives dominoes against a sharp, preppy-Southern nun who knows her wine, has travelled, grew up rural, and judges your every tile with the warmth of a maître d' and the mercy of a margin clerk. A stylish table game on the surface; underneath, a compact behavioural-economics machine (see the in-app [Research essay](https://sisterwendy.com/research): *The Nun, the Boneyard, and the Roast Chicken*).

## What it does
- **All-Fives / Horse Race scoring** to a target you choose — Quick Match (61), Long Lunch (100), Sunday Affair (175), or **The Full Wendy** (250).
- **Three opponents, three voices** — Sister Wendy (the competitor), Sister Patricia (the snap queen), Abbess Hildegard (the deadpan superior) — each with a distinct dialogue bank and accent colour.
- **Calhoun voice** — 60+ context-aware lines: she reacts to your confidence band, blow-out leads, nail-biters, and the occasional rare zinger.
- **Scoring explainer** — a corner pop-up teaches All-Fives scoring with the live math (gated by games played, with a near-miss nudge).
- **Streak shields**, **daily challenge** (seeded deal), **undo** (forgiving mode), **share card**, **sound effects**, **Forgiving/Focused** difficulty, art-history tile facts, and a cinematic intro.

## The journey
Started as a polished dominoes engine with a single grumpy nun. Then the personality became the product: Patricia & Hildegard got their own voices and a "choose your opponent" picker; the character was reimagined as **Sister Wendy Calhoun** and her whole dialogue + tile-fact voice was rewritten preppy-Southern; extended game lengths, a scoring-explainer, and streak shields followed; an ElevenLabs sound set was integrated; the intro's old hand-drawn "egg" nun-face was swapped for the real portrait; and the behavioural-strategy thesis was published as an in-app research essay. Design specs by the team; built by Claude Code (Carl).

## Tech
Next.js 16 / React 19 (App Router), GSAP (Flip animations + intro), Howler (audio), localStorage persistence, Vercel. `lib/wendy.ts` holds the dialogue system; `lib/game.ts` the engine.

## Run & deploy
**Retired: do not run or deploy.** The commands that used to be here were removed so nobody follows them by habit; the history of this repository has them.

## Status
Retired (see the banner at the top). Historical spec backlog, never built (`CARL_SPEC_JUNE10.md`): post-game stats screen, win-streak milestones + title progression (lights up the streak sound), the customization suite (felts/tiles/ambient soundscapes), save/resume for long games, and a refreshed icon/portrait set.
