# Sister Wendy — Monetisation Research: Casual Browser Games
**Researched by:** Anita
**Date:** 2026-04-21
**Sources:** RevenueCat State of Subscription Apps 2024, Balancy/BeachBum Domino Dreams breakdown, Indie Hackers posts, AppsFlyer Mobile Gaming Report 2024, IronSource rewarded video data

---

## Current Sister Wendy Setup

- Single-file HTML domino game, no backend
- Donation CTA: Buy Me A Coffee link in game-end overlay
- Hard mode (Merciless) was $1.99 one-time Gumroad unlock — now removed (paywalled the best part of the game before the player had bonded with Wendy)
- No ads currently
- No account system, no backend

---

## Conversion Benchmarks by Model

### Buy Me A Coffee / Donation
- Conversion rate: approximately 1 in 4,200 visitors (0.023%) — Indie Hackers post on 10015.io, an online tools collection
- For a game specifically: one developer reported approximately $1,000 in 3 months from a donation button on a browser game with moderate traffic
- Verdict: nearly useless as a revenue mechanism unless traffic is very high (100k+ monthly visitors). The BMAC link can stay (costs nothing, earns something) but cannot be a primary revenue strategy.

### Hard Mode Paywall (one-time unlock, $1.99)
- RevenueCat 2024: one-time IAP conversion in casual games averages 2-5% of engaged players (those who have played 5+ sessions)
- The Merciless mode paywall was likely correct in principle but incorrect in placement — it gated the best content before the player had reason to pay
- Removing it and making it free is the right call for growth. The question is what replaces it.

### Rewarded Video Ads
- AppsFlyer 2024: 87% positive user sentiment toward rewarded ads (vs 34% for interstitial/banner)
- Completion rate: 80-90% for rewarded formats
- eCPM US market: $8-20 for rewarded video
- The single best placement: extra lives/continue-after-loss (>70% watch rate)
- For a browser game, rewarded ads are possible but technically harder (no standard SDK, must use direct ad network integration like Google AdSense for Games or IronSource Web)
- Verdict: High potential but non-trivial implementation. Best suited for mobile app version, not the current browser-only build.

### Subscription ($X/month)
- The market is littered with subscription betrayals (see Dominoes+ class action, VIP Dominoes complaints)
- RevenueCat 2024: subscription churn in casual games is 40-60% in month 2
- Sister Wendy has no content pipeline to justify a subscription — no new levels, no live events that would require ongoing server costs
- Verdict: Do not implement. Brand mismatch and no content to support recurring billing.

### Cosmetic Unlocks (tile skins, board themes)
- Supercell (Clash Royale) reported 8-12% conversion on cosmetic packs for engaged players
- The key driver: the cosmetic must be visually meaningful and tied to character identity
- For Sister Wendy: "Sister Wendy's Vestments Pack" — a stained-glass tile skin, a candlelit board theme, gold pip variants. These are pure CSS/SVG changes, zero game logic.
- Verdict: High potential for a game with strong character. Low implementation cost for the first pack (CSS-only changes).

---

## Case Studies

### Domino Dreams (SuperPlay/Playtika, $700M acquisition)
- Deferred all IAP until Level 22 — let players bond before asking
- Used FBFB mechanic (can't exit without collecting free item) to create commitment to purchase flow
- Live events and seasonal content drove recurring IAP without subscription
- Key lesson: the "slow ask" is the most important variable in casual game monetisation. Ask too early and you lose the player. Ask after 20+ sessions and conversion is 3-5x higher.

### Wordle / NYT Games
- Zero monetisation on the core game — drove massive organic growth
- Acquired by NYT for reported $1M+ as audience asset
- Key lesson: a beloved free game with strong character is worth more as an acquisition target or email list builder than as a direct revenue generator at small scale.

### Duolingo (language learning, but directly applicable UX)
- Grew paid subscribers from 3% to 8.8% of DAU primarily by increasing perceived value, not adding friction
- The Duolingo owl's passive-aggressive personality ("You missed a day...") was central to the virality that funded conversion
- Key lesson: character personality is a growth mechanism, not just a UX decoration. Sister Wendy's personality is an asset that has not been fully monetised.

### Indie Hacker "buy me a coffee" tool collection (10015.io)
- 1/4,206 conversion rate on BMAC across a multi-tool web app
- Lesson: donation buttons are for goodwill, not revenue. Plan around them accordingly.

---

## Recommendation for Sister Wendy

**Model: Hybrid — Rewarded Ad for Continue + Optional Cosmetic One-Time Purchase + Preserve Donation CTA**

### Tier 1: Free (current)
- Full game, all difficulty levels (including Merciless, now free)
- Daily challenge
- All achievements
- Buy Me A Coffee link (keep — low friction, earns goodwill and occasional money)

### Tier 2: Continue After Loss (rewarded ad)
- When Wendy wins, offer "Watch a short clip to play one more round"
- 70%+ of engaged players will watch
- This is the most palatable ad format and the highest-converting placement in mobile gaming
- Revenue: low per player but scales with traffic
- Implementation: requires direct ad network integration — Google AdSense for Games or similar

### Tier 3: Wendy's Blessing Pack ($2.99 one-time, Gumroad)
- Removes ads permanently
- Unlocks "Stained Glass" tile skin (CSS-only, gold and jewel tones)
- Unlocks "Abbey Board" dark wood theme
- Unlocks 3 exclusive Wendy dialogue lines ("You bought this. She is... mildly impressed.")
- Key: price this as "remove ads + a thank you gift" not as a gated content unlock
- Trigger: show CTA after the player's 10th game (not first), in the game-end overlay
- Expected conversion: 3-5% of players who reach 10+ games (roughly 1 in 25-30 engaged players)

### What Not To Do
- No subscription: no content pipeline to support it, brand mismatch, category is full of subscription betrayals
- No hard mode paywall: already removed, correct decision — the best part of the game should be free to drive engagement and word of mouth
- No interstitial ads: would destroy the experience and brand trust Sister Wendy has built

---

## Revenue Model at Scale

Assumptions (conservative): 5,000 monthly active players, average 10 sessions/month

| Revenue Stream | Conversion | Monthly |
|----------------|------------|---------|
| Buy Me A Coffee | 0.023% of 50k sessions | ~$11 |
| Rewarded ads (if implemented) | 20% of game-overs @ $0.02/view | ~$200 |
| Wendy's Blessing Pack (one-time, amortised) | 4% of engaged players | ~$600 (launch month) |

The numbers are modest at 5k MAU. The path to meaningful revenue is traffic, not conversion rate optimisation — Sister Wendy's conversion mechanics are already above average for a free browser game. The monetisation recommendation above is appropriate at current scale and would scale cleanly with audience growth.

---

## Single Most Important Insight

The $1.99 hard mode paywall was removed. That was the right call. The replacement model is: **make the whole game great and free, then offer to remove ads and add cosmetics after the player has fallen in love with it.** The sequence matters more than the price point.
