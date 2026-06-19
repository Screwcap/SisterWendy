// lib/wendy.ts — Sister Wendy Calhoun (1945–2019). A sharp, preppy Southern woman
// who ended up in a habit and never lost her edge. Vanderbilt, married a farmer,
// traveled the world, knows her wine, proud of her rural roots, opinions on EVERYTHING.
// Snarky but warm — she roasts you because you're family. Never mean. (CARL_SPEC §5)

export type QuoteKey =
  | 'gameStart' | 'playerScores' | 'playerBigScore' | 'playerDouble'
  | 'playerCombo' | 'playerCantPlay' | 'wendyScores' | 'wendyBigScore'
  | 'wendyDouble' | 'herTurn' | 'smug' | 'commentary' | 'angry'
  | 'playerWins' | 'wendyWins' | 'tileHover';

const QUOTES: Record<QuoteKey, string[]> = {
  gameStart: [
    "Sit down, darling. Let's see what you're made of.",
    "I've got nowhere to be and all afternoon to beat you.",
    "Deal them out. Mind your manners and your math.",
    "Right. Let's play. I'll try to be gracious. No promises.",
  ],
  playerScores: [ // small (≈5)
    "Every point counts. That's what I tell myself about calories too.",
    "Modest. Like a Tuesday wine.",
    "Five points. Enough to notice, not enough to brag about.",
    "That's what we call 'showing up' where I'm from.",
    "Small but honest. Like my first apartment.",
    "I've seen bigger scores from a sleeping cat.",
    "Well, it's not nothing. I'll give you that.",
    "Five points. The participation trophy of dominoes.",
    "That's a starter, not a main course.",
    "Bless your heart, you're trying.",
  ],
  playerBigScore: [ // 15+
    "Well. Someone's been paying attention.",
    "That's the kind of play that earns a second glass.",
    "Darling, if you keep that up, I'll have to start trying.",
    "Twenty points? I haven't been this impressed since the '98 Bordeaux.",
    "That was almost rude. I liked it.",
    "My garden doesn't grow things that fast.",
    "Alright, alright. Don't let it go to your head.",
    "That play had legs. Like a good Burgundy.",
    "Even my rooster doesn't crow that loud. Settle down.",
    "Fine. You earned a slow clap. *clap... clap... clap.*",
  ],
  playerDouble: [
    "A double. Aren't you pleased with yourself.",
    "Play it again, darling. I'll wait.",
    "Doubles. Showy. I respect it.",
  ],
  playerCombo: [
    "Another turn? Somebody's feeling their oats.",
    "On a little run, are we. Enjoy the weather.",
    "Keep going. The fall's always more fun from up high.",
  ],
  playerCantPlay: [ // draw from boneyard
    "Drawing again? The boneyard isn't a buffet, dear.",
    "Slim pickings? Story of my dating life in the '70s.",
    "Sometimes you have to dig before you plant. Keep going.",
    "The boneyard giveth and the boneyard taketh away.",
    "I once drew four tiles in a row in Provence. Worst game, best trip.",
    "Reaching into the unknown. How very brave of you.",
    "That's the third draw. Are you collecting them?",
    "The boneyard is not a strategy, darling.",
    "Keep drawing. I'll wait. I have wine.",
    "Even my chickens find what they're looking for faster.",
  ],
  wendyScores: [ // wendy small
    "Mine. I'll take the five and say thank you.",
    "A few points. They add up, like good manners.",
    "There we are. Tidy.",
  ],
  wendyBigScore: [
    "Oh, don't look at me like that. You left it wide open.",
    "I learned that move in Tuscany. Long story.",
    "That's what happens when you underestimate a woman in sensible shoes.",
    "I'd apologize, but my mother raised me not to lie.",
    "Fifteen points. I believe that's what they call 'getting schooled.'",
    "I picked that up at a café in Lyon. The dominoes, not the wine. Well, both.",
    "Some days the garden just blooms, darling.",
    "You know what pairs well with that play? Your silence.",
    "That wasn't personal. Well, maybe a little.",
    "I've been saving that one. Like a good Sauternes.",
  ],
  wendyDouble: [
    "A double for me. How nice. Again, then.",
    "Doubles. The Lord provides, occasionally.",
    "Play again. Don't mind if I do.",
  ],
  herTurn: [
    "My turn. Sit tight, darling.",
    "Let me think. Patience is a virtue I'm still working on.",
    "Give me a moment. Good things, and all that.",
    "Watch and learn, sweetheart.",
  ],
  smug: [
    "Bless your heart. I see exactly what you're doing.",
    "Honestly, darling. I was reading people before you were born.",
    "That's one way to play it. Not the right way, but one way.",
    "I'd let you take that back, but where's the fun.",
  ],
  commentary: [
    "Nice little board we're building. I'll take most of the credit.",
    "This is pleasant. For me, anyway.",
    "A civilized game. Let's keep it that way, darling.",
  ],
  angry: [
    "Well that was just rude. Effective, but rude.",
    "Blocking me? In my own house? Bold.",
    "Alright. Gloves off, darling. You asked for it.",
  ],
  playerWins: [
    "You won. Don't gloat — it's unbecoming. But well done.",
    "Fine. You beat me. I'll allow it. Once.",
    "Victory's yours, darling. I'll have the wine ready for the rematch.",
    "Beaten at my own table. I taught you too well.",
  ],
  wendyWins: [
    "And that's the game. Don't take it personally, dear.",
    "I win. Sensible shoes, sharp mind. Works every time.",
    "Game's mine. You played well — for a while.",
    "There it is. Now, who's pouring?",
  ],
  tileHover: [
    "Thinking about it, are we?",
    "That one, darling?",
    "Mm. Choose carefully.",
    "I'm watching. Take your time.",
  ],
};

// ──────────────────────────────────────────────────────────────
// SISTER PATRICIA — "THE SNAP QUEEN" — 40s, sharp, clipped, straight
// to the punchline. White Whoopi energy. Accent: #6B2FA0
// ──────────────────────────────────────────────────────────────
const PATRICIA: Record<QuoteKey, string[]> = {
  gameStart: ["Let's go.", "I've been waiting.", "Finally.", "Deal the tiles. I don't have all day."],
  playerScores: ["Lucky.", "Don't get used to that.", "Okay. Your turn still coming.", "Cute."],
  playerBigScore: ["...Fine. That was good.", "I see you.", "Alright. I'll allow it.", "Not bad. For an amateur."],
  playerDouble: ["Double. Sure. Enjoy the bonus turn.", "Of course.", "Play again. Don't get cocky."],
  playerCombo: ["Look at you.", "Going off, huh?", "Okay, okay. Calm down."],
  playerCantPlay: ["Draw. Yes. Draw.", "Boneyard's waiting, honey.", "Take your time. Actually don't."],
  wendyScores: ["That's mine.", "Thank you.", "As expected.", "Record that."],
  wendyBigScore: ["Twenty. Write that down.", "Called it.", "I don't celebrate but... yes."],
  wendyDouble: ["Double. Play again. Already ahead.", "Mm.", "Again. Obviously."],
  herTurn: ["Moving.", "Watch.", "Already done.", "I don't think about this long."],
  smug: ["Honey, no.", "Did you think about that before or after you played it?", "Bless your heart.", "I see what you were going for. I do."],
  commentary: ["Board's looking good. For me.", "This is going exactly how I thought.", "You're fighting hard. Respect. Doesn't matter though."],
  angry: ["Oh you did NOT.", "That tile. That tile right there. Who raised you?", "I'm not mad. I'm disappointed. Actually no — I'm mad."],
  playerWins: ["Fine. You won. Don't make it weird.", "I let you have that one. Spiritual reasons.", "Go on then. I'll be over here.", "Congratulations. You're the champion of... this table."],
  wendyWins: ["Called it.", "See? Effortless.", "I could do this all day. And I have.", "Next."],
  tileHover: ["That one?", "Careful.", "Hmm.", "Think it through."],
};

// ──────────────────────────────────────────────────────────────
// ABBESS HILDEGARD — "THE DEADPAN SUPERIOR" — 70s, stern, radiates
// mild disappointment. Thinks she's above the game. Accent: #1A5C3A
// ──────────────────────────────────────────────────────────────
const HILDEGARD: Record<QuoteKey, string[]> = {
  gameStart: ["Let us begin. God is watching, presumably.", "In my own time.", "I've seen worse tables. Not many.", "The Lord helps those who help themselves. Deal."],
  playerScores: ["Noted.", "A point. Congratulations on the minimum.", "Fine.", "Adequate."],
  playerBigScore: ["That was... acceptable.", "I won't pretend I'm not slightly irritated.", "You've played well. Don't let it go to your head."],
  playerDouble: ["A double. How festive.", "Bonus turn. Proceed."],
  playerCombo: ["You're on a run. It won't last.", "Enjoy this moment.", "I've seen this before. It ends."],
  playerCantPlay: ["Draw. Yes. The boneyard is humbling.", "Even the gifted must draw sometimes.", "Take a tile. Reflect."],
  wendyScores: ["Correct.", "As it should be.", "Order is restored briefly."],
  wendyBigScore: ["Twenty points. Yes. That's what preparation looks like.", "I've been waiting for that.", "Mm."],
  wendyDouble: ["The double. Play again.", "Expected. But satisfying."],
  herTurn: ["In my own time.", "The board waits for no one, yet here we are waiting for me.", "I'm deliberating. It's a virtue."],
  smug: ["I've seen better plays from the postulants.", "That's one approach.", "Interesting choice. Very... human of you.", "I won't comment. The tile speaks for itself."],
  commentary: ["The board develops. Slowly, in your case.", "We are playing dominoes. I remind myself of this periodically.", "Twenty years of prayer prepared me for many things. Not this."],
  angry: ["That. Was. Unnecessary.", "I didn't leave the enclosure for this.", "Twenty years of prayer and I'm watching THIS."],
  playerWins: ["You have beaten an elderly nun. Reflect on that.", "I'll add it to my Lenten penance.", "Enjoy it. God is watching. And so am I."],
  wendyWins: ["As expected.", "Order restored.", "The younger ones get excited. I don't need to."],
  tileHover: ["Choose carefully.", "That one?", "Deliberate.", "The wrong tile is its own punishment."],
};

const QUOTE_BANKS: Record<string, Record<QuoteKey, string[]>> = {
  wendy: QUOTES,
  patricia: PATRICIA,
  hildegard: HILDEGARD,
};


export function randQuote(key: QuoteKey, personalityId?: string): string {
  const bank = (personalityId && QUOTE_BANKS[personalityId]) ? QUOTE_BANKS[personalityId] : QUOTES;
  const list = bank[key] ?? QUOTES[key];
  return list[Math.floor(Math.random() * list.length)];
}

const _pick = (a: string[]) => a[Math.floor(Math.random() * a.length)];

// Context-aware Wendy commentary (CARL_SPEC §5) — fired on her non-scoring turns,
// keyed off the score gap so she reacts to a blowout / a nail-biter. Wendy-only;
// Patricia & Hildegard fall back to their own commentary bank.
const WENDY_LOSING = [ // player is down 15+
  "Don't panic. I've seen comebacks. Not from you yet, but I've seen them.",
  "This is what we call a 'character-building moment.'",
  "You know what? The view from behind isn't so bad. You can see all your mistakes.",
  "I once lost a game by 40 points in Lisbon. Beautiful city though.",
  "Chin up. Even bad wine has its moments.",
  "If it helps, you're losing with dignity. Mostly.",
  "The scoreboard is just a number. A very unflattering number, but still.",
  "My garden looked this bad once. Then spring came.",
  "Would you like some cheese with that whine? Sorry. Had to.",
  "Down by twenty? That's not a deficit, that's an adventure.",
];
const WENDY_CLOSE = [ // within ~5 points
  "Now THIS is a game.",
  "I can hear my own heartbeat. Don't tell anyone.",
  "This is tighter than my schedule in harvest season.",
  "One of us is about to be very smug. I hope it's me.",
  "Close games are like good wine — they make you sweat a little.",
  "I haven't been this nervous since customs in Morocco.",
  "This is where the amateurs fold. You're not folding, are you?",
  "Neck and neck. Just how I like my scarves and my dominoes.",
  "If this gets any closer, I'm opening the reserve bottle.",
  "Three points apart. I can taste the finish line. Tastes like victory.",
];
const WENDY_RARE = [ // 1-in-25 flavor, any play
  "You know, I once played dominoes with a duchess on a train to Vienna. She cheated. I let her. She was buying dinner.",
  "My mother used to say, 'Wendy, you'd argue with a fence post.' She was right. And I'd win.",
  "I spent a summer in Mendoza learning two things: Malbec and patience. You're testing both.",
  "There's a vineyard in Burgundy where I left a domino set in 1987. I think about it sometimes.",
  "My nephew once asked me why I play dominoes. I told him it's cheaper than therapy and the company is better.",
];

/** A Wendy filler/commentary line that reacts to the current score gap (humanScore − wendyScore). */
export function wendyCommentary(humanScore: number, wendyScore: number, personalityId = 'wendy'): string {
  if (personalityId !== 'wendy') return randQuote('commentary', personalityId);
  if (Math.random() < 0.04) return _pick(WENDY_RARE);
  const gap = humanScore - wendyScore;
  if (gap <= -15) return _pick(WENDY_LOSING);
  if (Math.abs(gap) <= 5 && humanScore + wendyScore >= 20) return _pick(WENDY_CLOSE);
  return randQuote('commentary', 'wendy');
}

// ────────────────────────────────────────────────────────────────────────────
// RELATIONSHIP TIERS (Epley: depth > breadth — the relationship deepens with time)
// Wendy evolves from surface snark → genuine connection as you keep coming back.
// Keyed off total games played (lib/stats). Tier 4 stays RARE even past 61 games.
// These are occasional, earned interjections layered ON TOP of her normal play
// dialogue — never replacing it. Wendy only (Patricia/Hildegard keep their banks).
// ────────────────────────────────────────────────────────────────────────────
const RELATIONSHIP_LINES: Record<1 | 2 | 3 | 4, string[]> = {
  // Tier 1 — Surface (games 1–10): standard snark, no personal questions
  1: [
    "Drawing again? The boneyard isn't a buffet, dear.",
    "We've only just met. Don't expect mercy.",
    "Sit up straight. We're playing dominoes, not waiting for a bus.",
  ],
  // Tier 2 — Curious (11–30): she notices patterns in YOUR play
  2: [
    "You always play your doubles early. Interesting strategy. Reminds me of someone.",
    "You get more aggressive when you're behind. I respect that. I also intend to punish it.",
    "Back again. You're starting to play like someone who means it.",
    "I'm beginning to learn your tells, dear. That should worry you.",
  ],
  // Tier 3 — Personal (31–60): she shares small details. It's deepening.
  3: [
    "I played this game with my sister every Sunday for thirty years. She cheated. I let her.",
    "You remind me of someone I used to know in Charleston. They were stubborn too.",
    "My mother taught me dominoes on a porch in the heat. She never once let me win. Neither will I.",
    "Thirty-odd games now. I've had parishioners I knew less well.",
  ],
  // Tier 4 — Real (61+): rare moments of genuine warmth. Earned.
  4: [
    "I'm glad you keep coming back. Not everyone does.",
    "You've gotten better. Don't let it go to your head — but you have.",
    "It's good company, this. I won't say it twice, so don't make me.",
  ],
};

export function wendyTier(played: number): 1 | 2 | 3 | 4 {
  if (played >= 61) return 4;
  if (played >= 31) return 3;
  if (played >= 11) return 2;
  return 1;
}

/** An occasional, tier-appropriate relationship line. Tier 4 stays rare (≈1 in 5)
 *  even once unlocked — warmth has to feel earned, not automatic. Returns '' for
 *  non-Wendy personalities (they keep their own character banks). */
export function wendyRelationshipLine(played: number, personalityId = 'wendy'): string {
  if (personalityId !== 'wendy') return '';
  const tier = wendyTier(played);
  // at tier 4, only ~20% of the time is it actually a tier-4 line; else tier 2/3
  let pool = RELATIONSHIP_LINES[tier];
  if (tier === 4 && Math.random() > 0.2) pool = RELATIONSHIP_LINES[Math.random() < 0.5 ? 2 : 3];
  return _pick(pool);
}

// Tile facts — Sister Wendy's grocery-store-era wisdom, keyed by pip value (0–6)
export const PIP_FACTS: Record<number, string[]> = {
  0: [
    "Zero. A blank — empty as a Sunday pew once the sermon's done.",
    "The blank, darling. My grandmother grew the best tomatoes out of a patch of nothing. Don't underestimate it.",
    "Nothing on it. Like the polite answer I give when someone asks my age.",
  ],
  1: [
    "One. The loneliest number, they say. They never gardened alone at dawn — it's heaven.",
    "A single pip. One good husband, one good dog, one good bottle for company. That's plenty.",
    "Just the one. I've started whole adventures on less, darling.",
  ],
  2: [
    "Two. A pair — like me and trouble. We travel together.",
    "Two pips. Two things I trust: a sharp knife and a sharper opinion.",
    "Two. Mother said good things and bad news both come in twos. She was usually right.",
  ],
  3: [
    "Three. The number of times I've been told to mind my manners. I declined, politely.",
    "Three pips. Spring, summer, and the long supper in between. My favorite math.",
    "Three. I can hold a grudge, a wineglass, and a winning hand all at once. It's a gift.",
  ],
  4: [
    "Four. Four seasons on the farm, and I had an opinion about every one of them.",
    "Four pips — the number of countries I've nearly been thrown out of. Nearly.",
    "Four. A good dinner-party number. Any more and someone starts in on politics.",
  ],
  5: [
    "Five — the scoring pip, darling. Treat it with the respect you'd give a good Bordeaux.",
    "Five. My lucky number. I argued the point with a priest once. I won. He poured.",
    "Five pips. I can spot a five-play across a crowded table faster than gossip travels in a small town.",
  ],
  6: [
    "Six. The double-six is the queen of the box. Play her the moment you can — like accepting a good invitation.",
    "Six pips. Maximum. I've lived most of my life at maximum. Exhausting, and entirely worth it.",
    "The six. I wore a little six on a chain for years — a saint of complicated situations. We understood each other.",
  ],
};

export function getPipFact(pip: number): string {
  const facts = PIP_FACTS[pip] ?? ["A number. I have a view on it. I have a view on most things, darling."];
  return facts[Math.floor(Math.random() * facts.length)];
}

export function getTileFact(a: number, b: number): string {
  if (a === b) {
    return `[${a}|${a}] — the double-${a}. ${getPipFact(a)}`;
  }
  const dominant = Math.max(a, b);
  return `[${a}|${b}] — ${getPipFact(dominant)}`;
}

export type WendyPersonalityId = 'wendy' | 'patricia' | 'hildegard';

export interface WendyPersonality {
  id: WendyPersonalityId;
  name: string;
  title: string;
  emoji: string;        // shown on the character-select card
  blurb: string;        // one-line pitch on the select screen
  accentColor: string;  // portrait + card theming
  scores: string[];
  wins: string[];
  blocks: string[];
}

export const PERSONALITIES: Record<WendyPersonalityId, WendyPersonality> = {
  wendy: {
    id: 'wendy',
    name: 'Sister Wendy',
    title: 'THE COMPETITOR',
    emoji: '👁',
    blurb: 'Plays to win. The original. You know her. You fear her.',
    accentColor: '#c49020',
    scores: ["Fifteen. I'll take it.", "Points. Mine. Moving on."],
    wins: ["Ha. And there it is.", "Beaten by a woman in a nun's habit. Write that down."],
    blocks: ["I see what you're doing. Bold.", "Blocked. You're welcome."],
  },
  patricia: {
    id: 'patricia',
    name: 'Sister Patricia',
    title: 'THE SNAP QUEEN',
    emoji: '⚡',
    blurb: 'Quick wit, zero patience. Whoopi Goldberg in a habit. She sees through you.',
    accentColor: '#6B2FA0',
    scores: ["That's mine.", "As expected.", "Record that."],
    wins: ["Called it.", "See? Effortless.", "Next."],
    blocks: ["Honey, no.", "Not today.", "Sit with that."],
  },
  hildegard: {
    id: 'hildegard',
    name: 'Abbess Hildegard',
    title: 'THE DEADPAN SUPERIOR',
    emoji: '🕯️',
    blurb: "Seventy years of disappointment. She thinks she's above this. She isn't.",
    accentColor: '#1A5C3A',
    scores: ["Correct.", "As it should be.", "Order is restored briefly."],
    wins: ["As expected.", "Order restored.", "The younger ones get excited. I don't need to."],
    blocks: ["A wall. How biblical.", "Reflect on that.", "The tile speaks for itself."],
  },
};

export function getPersonalityQuote(
  id: WendyPersonalityId,
  type: 'scores' | 'wins' | 'blocks'
): string {
  const p = PERSONALITIES[id];
  const list = p[type];
  return list[Math.floor(Math.random() * list.length)];
}

// End-of-game verdict
export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

export function calcGrade(playerScore: number, opponentScore: number, hintsUsed: number): Grade {
  if (playerScore >= 61 && opponentScore < 30 && hintsUsed === 0) return 'A';
  if (playerScore >= 61 && opponentScore < 45) return 'B';
  if (playerScore >= 61) return 'C';
  if (playerScore >= 30) return 'D';
  return 'F';
}

export function getVerdictText(grade: Grade, won: boolean): string {
  const lines: Record<Grade, string> = {
    A: won
      ? "I'm impressed. Genuinely. Don't tell anyone I said that."
      : "A good run. You played hard. The tiles weren't with you. These things happen and then you carry on.",
    B: won
      ? "Solid game. Not flashy, but solid. Solid gets the shopping done."
      : "You were close. Close is something. Close means you nearly had it. Nearly.",
    C: won
      ? "You won. I'll give you that. The habit may have distracted you at key moments. It does that."
      : "Middle of the road. She always said the middle of the road is where you get hit by traffic. Think on that.",
    D: won
      ? "You won but I'm not sure how. Nor are you. We'll move on."
      : "That was a difficult watch. You played like someone who learned the rules five minutes ago. Did you learn the rules five minutes ago?",
    F: won
      ? "You won. I cannot explain it. I've seen a lot and I cannot explain it."
      : "Right. Cup of tea. We don't speak of this. We simply do better next time. That's always been the approach.",
  };
  return lines[grade];
}
