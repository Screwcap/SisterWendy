# Sister Wendy — Feature Spec for Carl
## June 10, 2026 | From: Anita & Andy

Carl — implement these in priority order. Each section is a discrete feature. Ship and verify each one before moving to the next.

---

## 1. EXTENDED GAME MODES

### Current
- All-Fives to 61 (classic)

### Add Three New Options
| Mode | Target Score | Label | Wendy's Comment |
|------|-------------|-------|-----------------|
| Classic | 61 | "Quick Match" | "A proper game. Five minutes, no excuses." |
| Extended | 100 | "Long Lunch" | "Settling in, are we? Good. I'll open a bottle." |
| Marathon | 175 | "Sunday Affair" | "Cancel your plans. We're going to be here a while." |
| Epic | 250 | "The Full Wendy" | "Only the committed need apply. I hope you've eaten." |

### Implementation Notes
- Mode selection on landing page, BEFORE choosing Forgiving/Focused
- Score target displayed prominently during game
- Longer games need a **save/resume** feature (localStorage). Players will close the tab mid-marathon. If they come back, pick up where they left off.
- Wendy's commentary should scale — more lines unlocked in longer games. She gets more personal, more revealing, more snarky as the game goes on. By point 200 she's telling stories.
- Win stats tracked per mode separately

---

## 2. CUSTOMIZATION SUITE (THE IKEA EFFECT)

The psychology: when players customize their environment, they feel ownership. They won't leave because THIS is THEIR version of the game.

### 2A. Table Felt Color
| Option | Color | Unlock |
|--------|-------|--------|
| Classic Green | #2d5a27 | Default |
| Navy Blue | #1a2744 | Win 5 games |
| Burgundy | #5c1a2a | Win 10 games |
| Charcoal | #2a2a2a | Win 15 games |
| Cream | #f5f0e1 | Win 25 games |
| Wendy's Choice | Random each game | Win 50 games |

### 2B. Domino Tile Style
| Style | Description | Unlock |
|-------|-------------|--------|
| Classic Ivory | Cream tiles, black pips | Default |
| Bone White | Bright white, sharp contrast | Win 3 games |
| Midnight | Black tiles, white pips | Win 10 games |
| Mahogany | Dark wood texture, inlaid pips | Win 20 games |
| Gold Leaf | Ivory with gold pip accents | Win 30 games |
| Wendy's Vintage | Aged/weathered look, slightly yellowed | Win 40 games |

### 2C. Ambient Soundscapes
Each soundscape is a looping background audio. Player picks one in settings. Mute toggle always available.

| Soundscape | Description | Unlock |
|------------|-------------|--------|
| Silence | No ambient sound | Default |
| Zen Garden | Gentle water drops on stone, distant wind chime, soft breeze | Default |
| Country Estate | Birdsong, distant church bells, light wind through trees | Win 5 games |
| City Café | Espresso machine hiss, quiet conversation murmur, clinking cups, street sounds | Win 8 games |
| Airplane Cabin | White noise hum, occasional soft ding, muffled engine | Win 12 games |
| Rainy Window | Rain on glass, distant thunder, occasional gust | Win 15 games |
| Wine Cellar | Echoing stone room, dripping, cork pop every few minutes | Win 20 games |
| Library | Clock ticking, page turning, fireplace crackle | Win 25 games |
| Wendy's Garden | Bees buzzing, wind through lavender, a gate creaking | Win 35 games |

**Sound sources:** Use freesound.org (CC0 licensed) or generate with AI ambient tools. Each loop should be 2-5 minutes, seamless.

### 2D. Game Sounds
| Sound | When | Notes |
|-------|------|-------|
| Tile place | Player places a domino | Satisfying click/snap. Short. |
| Tile place (Wendy) | Wendy places a domino | Slightly different tone — her tiles sound deliberate |
| Score | Points awarded | Quick ascending chime. Scales with points — bigger score, bigger sound. |
| Near-miss | Board total is 1 away from scoring | Subtle "almost" tone — not annoying, just noticeable |
| Draw | Player draws from boneyard | Card-draw swoosh |
| Win | Player wins the game | Warm, satisfying chord. Brief. |
| Lose | Wendy wins | Minor key. Not depressing — dignified. |
| Streak milestone | Hit 3, 5, 10 win streak | Escalating celebration sounds |

### 2E. Settings Panel
- Accessible via gear icon ⚙️ in top corner during gameplay
- Tabs: Table | Tiles | Sounds | Ambient
- Show locked items grayed out with "Win X more games to unlock"
- Preview before applying (click a felt color, see it change in real-time behind the settings panel)

---

## 3. GLOBAL STATS (SOCIAL PROOF)

### Implementation
Display on landing page, subtle but visible. Updates in real-time (or appears to).

### Starting Numbers
Seed with believable baseline. These grow over time with real data mixed in.

```
Games Played: 1,385
Sister Wendy's Win Rate: 58%
Average Game Length: 6m 12s
Longest Win Streak (Any Player): 11
Players Today: 47
```

### Growth Logic
- Increment "Games Played" by 1 every time any player finishes a game (real)
- Seed +3-7 fake games per hour until real traffic exceeds that (be transparent about this internally — remove fake increment once real traffic > 50 games/day)
- "Players Today" = real unique sessions today via localStorage counter + modest seed
- Wendy's Win Rate = real calculation from all completed games

### Post-Game Stats
After each game, show the player:
```
Your Score: 61 | Wendy's Score: 38
You scored higher than 71% of players
Your best play: 15 points (Turn 7)
Games played: 14 | Win rate: 57%
Current streak: 3 🔥
```

### Percentile Calculation
Until we have real data, use a normal distribution centered on the average losing score (~35-40 for classic mode). Player's score maps to a percentile. This feels real and motivating even with small sample sizes.

---

## 4. SCORING EXPLAINER (LEARNING FEATURE)

### Design: Corner Pop-Up
- Small floating widget in bottom-left or bottom-right corner
- Appears ONLY when points are scored (yours or Wendy's)
- Shows the math:

```
┌─────────────────────────────┐
│ 📊 Score Breakdown          │
│                             │
│ Open ends: 5 + 10 + 5 = 20 │
│ 20 ÷ 5 = 4 points! ✨      │
│                             │
│ [Got it] [Don't show again] │
└─────────────────────────────┘
```

### Behavior
- **First 3 games:** Shows automatically on every scoring play
- **Games 4-10:** Shows only on YOUR scoring plays (assumes you understand Wendy's by now)
- **After game 10:** Hidden by default, but accessible via a "?" icon that stays in the corner
- **"Don't show again" button** — respects immediately, stores in localStorage
- **Can be re-enabled** in settings panel

### Near-Miss Variant
When the board total is 1-2 away from a multiple of 5:
```
┌──────────────────────────────┐
│ 😬 Close!                    │
│                              │
│ Open ends: 5 + 10 + 6 = 21  │
│ One away from 20 (4 points)  │
│                              │
│ [Got it]                     │
└──────────────────────────────┘
```

This is a behavioral economics play — near-misses trigger loss aversion and drive engagement. Players will actively try to avoid near-misses, which means they're LEARNING the scoring system through emotion, not instruction.

---

## 5. SISTER WENDY'S VOICE — CHARACTER REWRITE

### The Old Voice (REMOVE)
Art history nun. "Caravaggio would have..." — this is wrong for the character.

### The New Voice
**Sister Wendy Calhoun, 1945-2019. Critic of Life, Friends & Family Alike.**

She's a sharp, preppy Southern woman who ended up in a habit somehow and never lost her edge. She knows wine, she's traveled, she grew up rural and is proud of it, she judges everyone warmly but precisely. Think: your grandmother who went to Vanderbilt, married a farmer, traveled the world, and has opinions about EVERYTHING.

### Voice Rules
- **Snarky but warm** — she's teasing you, not insulting you
- **Preppy vocabulary** — "darling," "honestly," "bless your heart"
- **Rural references** — gardens, seasons, weather, land, animals
- **Wine & travel drops** — casual, never pretentious. She's been places.
- **NEVER mean** — she's family. She roasts you because she loves you.

### Commentary Lines (Minimum 60 total — 10 per category)

#### When Player Scores Big (15+ points)
1. "Well. Someone's been paying attention."
2. "That's the kind of play that earns a second glass."
3. "Darling, if you keep that up, I'll have to start trying."
4. "Twenty points? I haven't been this impressed since the '98 Bordeaux."
5. "That was almost rude. I liked it."
6. "My garden doesn't grow things that fast."
7. "Alright, alright. Don't let it go to your head."
8. "That play had legs. Like a good Burgundy."
9. "Even my rooster doesn't crow that loud. Settle down."
10. "Fine. You earned a slow clap. *clap... clap... clap.*"

#### When Player Scores Small (5 points)
1. "Every point counts. That's what I tell myself about calories too."
2. "Modest. Like a Tuesday wine."
3. "Five points. Enough to notice, not enough to brag about."
4. "That's what we call 'showing up' where I'm from."
5. "Small but honest. Like my first apartment."
6. "I've seen bigger scores from a sleeping cat."
7. "Well, it's not nothing. I'll give you that."
8. "Five points. The participation trophy of dominoes."
9. "That's a starter, not a main course."
10. "Bless your heart, you're trying."

#### When Wendy Scores Big
1. "Oh, don't look at me like that. You left it wide open."
2. "I learned that move in Tuscany. Long story."
3. "That's what happens when you underestimate a woman in sensible shoes."
4. "I'd apologize, but my mother raised me not to lie."
5. "Fifteen points. I believe that's what they call 'getting schooled.'"
6. "I picked that up at a café in Lyon. The dominoes, not the wine. Well, both."
7. "Some days the garden just blooms, darling."
8. "You know what pairs well with that play? Your silence."
9. "That wasn't personal. Well, maybe a little."
10. "I've been saving that one. Like a good Sauternes."

#### When Player Draws from Boneyard
1. "Drawing again? The boneyard isn't a buffet, dear."
2. "Slim pickings? Story of my dating life in the '70s."
3. "Sometimes you have to dig before you plant. Keep going."
4. "The boneyard giveth and the boneyard taketh away."
5. "I once drew four tiles in a row in Provence. Worst game, best trip."
6. "Reaching into the unknown. How very brave of you."
7. "That's the third draw. Are you collecting them?"
8. "The boneyard is not a strategy, darling."
9. "Keep drawing. I'll wait. I have wine."
10. "Even my chickens find what they're looking for faster."

#### When Player is Losing Badly (Down 15+ points)
1. "Don't panic. I've seen comebacks. Not from you yet, but I've seen them."
2. "This is what we call a 'character-building moment.'"
3. "You know what? The view from behind isn't so bad. You can see all your mistakes."
4. "I once lost a game by 40 points in Lisbon. Beautiful city though."
5. "Chin up. Even bad wine has its moments."
6. "If it helps, you're losing with dignity. Mostly."
7. "The scoreboard is just a number. A very unflattering number, but still."
8. "My garden looked this bad once. Then spring came."
9. "Would you like some cheese with that whine? Sorry. Had to."
10. "Down by twenty? That's not a deficit, that's an adventure."

#### When Game is Close (Within 5 points)
1. "Now THIS is a game."
2. "I can hear my own heartbeat. Don't tell anyone."
3. "This is tighter than my schedule in harvest season."
4. "One of us is about to be very smug. I hope it's me."
5. "Close games are like good wine — they make you sweat a little."
6. "I haven't been this nervous since customs in Morocco."
7. "This is where the amateurs fold. You're not folding, are you?"
8. "Neck and neck. Just how I like my scarves and my dominoes."
9. "If this gets any closer, I'm opening the reserve bottle."
10. "Three points apart. I can taste the finish line. Tastes like victory."

### Rare Lines (1-in-25 chance, per category)

#### Rare — After Any Play
- "You know, I once played dominoes with a duchess on a train to Vienna. She cheated. I let her. She was buying dinner."
- "My mother used to say, 'Wendy, you'd argue with a fence post.' She was right. And I'd win."
- "I spent a summer in Mendoza learning two things: Malbec and patience. You're testing both."
- "There's a vineyard in Burgundy where I left a domino set in 1987. I think about it sometimes."
- "My nephew once asked me why I play dominoes. I told him it's cheaper than therapy and the company is better."

### Progression-Based Lines (Unlock with games played)

#### After Game 10
- "You keep coming back. I respect persistence. Even misguided persistence."
- "Ten games. We're past small talk now."

#### After Game 25
- "Twenty-five games. You might be the most stubborn person I've met. And I own a mirror."
- "At this point, I consider you a regular. Don't let it go to your head."

#### After Game 50
- "Fifty games. I should charge you rent."
- "You know, most people give up by now. You're not most people."

#### After Game 100
- "A hundred games. You're family now. That means I get to be honest with you."
- "Welcome to the inner circle. The wine is better here."

---

## 6. ADDITIONAL ENGAGEMENT FEATURES

### 6A. Daily Challenge
One new challenge per day, generated from a seed (date-based, no server needed).

| Example Challenges |
|-------------------|
| "Beat Wendy by 15+ points" |
| "Win without drawing more than twice" |
| "Score 20+ on a single play" |
| "Win a game of Extended (100) mode" |
| "Beat Wendy on Focused difficulty" |
| "Win with Wendy scoring less than 30" |

- Show on landing page: "Today's Challenge: [challenge]"
- Completed challenges get a ✅ and are logged
- Streak counter for consecutive days with a completed challenge

### 6B. Title Progression
Displayed under the player's name/score area.

| Games Played | Title |
|-------------|-------|
| 1 | "The New One" |
| 5 | "Acquaintance" |
| 10 | "Regular" |
| 25 | "Worthy Opponent" |
| 50 | "Old Friend" |
| 75 | "Confidant" |
| 100 | "Family" |
| 150 | "Inner Circle" |
| 200 | "The One Who Stayed" |
| 250 | "Legend" |

Wendy acknowledges title changes: "Oh, you've been promoted. 'Worthy Opponent.' Don't let it go to your head."

### 6C. Win Streak Tracking
- Display current streak prominently: "🔥 Streak: 5"
- Streak milestones get special Wendy reactions:
  - 3: "Three in a row. Don't get cocky."
  - 5: "Five. Alright, I'm paying attention now."
  - 10: "Ten straight? Either you're brilliant or I need new glasses."
  - 15: "This is getting embarrassing. For me."
  - 20: "Twenty. I'm telling everyone I taught you."

### 6D. Share Card
After each game, option to generate a shareable image:

```
┌─────────────────────────────────┐
│ 🎯 SISTER WENDY                │
│                                 │
│ I beat Sister Wendy 61-34       │
│ Best play: 20 points            │
│ Current streak: 7 🔥            │
│ Title: Worthy Opponent          │
│                                 │
│ sisterwendy.com                 │
│ "She's not actually a nun."     │
└─────────────────────────────────┘
```

- One-tap copy to clipboard
- Share to Twitter/X with pre-filled text
- Download as image (PNG)

---

## 7. TECHNICAL NOTES

### localStorage Schema
```json
{
  "sw_stats": {
    "gamesPlayed": 47,
    "wins": 27,
    "losses": 20,
    "currentStreak": 3,
    "bestStreak": 8,
    "bestScore": { "player": 61, "wendy": 12 },
    "biggestSinglePlay": 25,
    "byMode": {
      "61": { "played": 30, "won": 18 },
      "100": { "played": 12, "won": 7 },
      "175": { "played": 4, "won": 2 },
      "250": { "played": 1, "won": 0 }
    }
  },
  "sw_unlocks": {
    "felts": ["classic_green", "navy_blue"],
    "tiles": ["classic_ivory", "bone_white"],
    "ambients": ["silence", "zen_garden"],
    "quotes_seen": ["q_big_01", "q_big_02", "q_rare_03"],
    "title": "Regular",
    "challenges_completed": 8,
    "challenge_streak": 3
  },
  "sw_preferences": {
    "felt": "navy_blue",
    "tiles": "classic_ivory",
    "ambient": "zen_garden",
    "sounds": true,
    "scoring_popup": true,
    "volume": 0.7
  },
  "sw_saved_game": {
    "mode": 175,
    "playerScore": 89,
    "wendyScore": 72,
    "board": [...],
    "timestamp": "2026-10-15T14:30:00Z"
  }
}
```

### Priority Order for Implementation
1. Extended game modes (61/100/175/250) — quick win, expands replayability immediately
2. Wendy's voice rewrite — swap all existing lines with new character voice
3. Scoring explainer pop-up — educational, reduces bounce from confused new players
4. Sound effects (tile place, score, win/lose) — biggest "feel" improvement per dev hour
5. Global stats on landing page — social proof, makes the game feel alive
6. Post-game stats screen — retention hook, gives reason to play again
7. Win streak tracking — loss aversion, "one more game" trigger
8. Title progression — endowment effect, long-term ownership
9. Customization suite (felts, tiles, ambients) — IKEA effect, deep ownership
10. Daily challenges — return visits, consistency loop
11. Share card — virality, organic growth
12. Save/resume for long games — required for 175/250 modes
13. Rare Wendy lines — variable reinforcement, delight factor
14. Near-miss scoring display — behavioral nudge, learning acceleration

---

## NOTES FOR CARL

- Every feature should degrade gracefully. If localStorage is full or blocked, the game still works — just without persistence.
- Sound files should lazy-load. Don't block the game on audio.
- All Wendy lines are in a JSON file, not hardcoded. This lets us add/swap lines without touching game logic.
- Test on mobile. Touch targets for dominoes must be minimum 44x44px.
- The customization unlocks should feel rewarding — brief animation or Wendy comment when something new unlocks.
- Keep the landing page fast. Under 2 seconds to interactive.

---

*Spec written by Anita. Behavioral economics framework by Kahneman, Tversky, Thaler, Cialdini, Ariely, and one very opinionated grandmother.*
