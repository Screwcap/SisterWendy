// lib/wendy.ts — Sister Wendy personality: a woman who wore a nun's habit
// through her divorce years and swore like a sailor in the grocery store
// while her ten-year-old son followed behind with the cart.

export type QuoteKey =
  | 'gameStart' | 'playerScores' | 'playerBigScore' | 'playerDouble'
  | 'playerCombo' | 'playerCantPlay' | 'wendyScores' | 'wendyBigScore'
  | 'wendyDouble' | 'herTurn' | 'smug' | 'commentary' | 'angry'
  | 'playerWins' | 'wendyWins' | 'tileHover';

const QUOTES: Record<QuoteKey, string[]> = {
  gameStart: [
    "Right, let's go. I didn't put this habit on to lose.",
    "Shuffle those tiles properly. This isn't the cereal aisle.",
    "I've played dominoes through worse than this. Considerably worse.",
    "God give me strength. And decent tiles.",
  ],
  playerScores: [
    "Fine. Points. Don't let it go to your head.",
    "Oh good for you. You want a biscuit?",
    "I saw that coming. I let you have it.",
    "Mmm. Lucky. But we'll call it skill.",
  ],
  playerBigScore: [
    "Jesus, Mary and Joseph — where did THAT come from?",
    "Twenty points. Oh for— right. Fine. Well played.",
    "I taught you everything you know. Not everything I know. Remember that.",
  ],
  playerDouble: [
    "A double. Showing off, are we.",
    "The double. Classic. Your grandfather played like that. Infuriating man.",
    "Right, play again then. Don't milk it.",
  ],
  playerCombo: [
    "Another turn? Bloody hell. Fine.",
    "You're on a run. Enjoy it. It won't last.",
    "Keep going. I'm letting you. Strategically.",
  ],
  playerCantPlay: [
    "No tile? Draw. That's what the boneyard's for. Life too, as it happens.",
    "Can't play? Welcome to the club. Very popular club.",
    "Draw from the pile, love. We've all been there.",
  ],
  wendyScores: [
    "There we are. Fifteen. The habit brings luck, what can I say.",
    "That's mine. Noted.",
    "Points. I've earned them. God knows I've earned them.",
  ],
  wendyBigScore: [
    "Twenty points. Right. Yes. That's how it's done.",
    "Brilliant. Even I'm impressed and I rarely am.",
    "That's twenty. Don't make a scene, I'm wearing the habit.",
  ],
  wendyDouble: [
    "Double. Lovely. Play again.",
    "Oh that's satisfying. The double always is.",
    "Doubles are God's little joke. I appreciate the humour.",
  ],
  herTurn: [
    "My turn. Stand by.",
    "Right then.",
    "Let me think. Don't rush me.",
    "I've been planning this since the boneyard.",
  ],
  smug: [
    "I know exactly what you're doing. It's not going to work.",
    "Interesting. Wrong, but interesting.",
    "You're playing on hope. I'm playing on experience. Different things entirely.",
  ],
  commentary: [
    "The board's taking shape. Mostly thanks to me.",
    "Good game so far. Considering.",
    "We're building something here. Whether it ends well is another matter.",
  ],
  angry: [
    "Oh that is RUDE. That is a rude tile placement and you know it.",
    "You're blocking me. In this house. At this table.",
    "Right, that's it. Gloves off. I didn't wear the habit for this.",
  ],
  playerWins: [
    "You won. Well done. Don't ever tell your father.",
    "Fine. You beat me. I hope you're pleased with yourself. I'd be pleased with myself.",
    "Victory. You've earned it. Don't expect a parade.",
    "You won. I'm going to go put the kettle on and not think about this.",
  ],
  wendyWins: [
    "Ha. And there it is. Don't look so surprised.",
    "I win. The habit was a factor. Don't question it.",
    "Game over. You played well. Not well enough, but well.",
    "Beaten by a woman in a nun's habit. Pop that in your diary.",
  ],
  tileHover: [
    "Thinking about it?",
    "That one?",
    "Hmm.",
    "Choose wisely. I'm watching.",
  ],
};

export function randQuote(key: QuoteKey): string {
  const list = QUOTES[key];
  return list[Math.floor(Math.random() * list.length)];
}

// Tile facts — Sister Wendy's grocery-store-era wisdom, keyed by pip value (0–6)
export const PIP_FACTS: Record<number, string[]> = {
  0: [
    "Zero. Nothing. That's what was in the account some months. We got through it.",
    "The blank. She always said a blank tile was an opportunity in disguise. Usually she was wrong but sometimes not.",
    "Zero pips. Empty. There were weeks like that. The habit helped, she said. The dominoes helped more.",
  ],
  1: [
    "One. Just the one. Some years it was just us two in the cereal aisle and honestly that was enough.",
    "The single pip. She'd find the one good thing in a bad situation and fixate on it mercilessly.",
    "One pip. She had one good coat, one good handbag, and one hell of a strategy at this table.",
  ],
  2: [
    "Two. Her and me, mostly. The cart, the habit, the frozen aisle. We managed.",
    "Two pips. She always said two's company and three's a divorce lawyer. She had opinions.",
    "Two. The team. Down the cereal aisle, around the deli counter, past the looks from strangers.",
  ],
  3: [
    "Three. She could carry three shopping bags, a grudge and a domino hand simultaneously. Remarkable woman.",
    "Third aisle was always the biscuit aisle. She'd mutter something unprintable at the price and put them in the cart anyway.",
    "Three pips. Three things she never did: give up, apologise first, or leave a scoring tile unplayed.",
  ],
  4: [
    "Four. The number of things she could be simultaneously furious about while still completing the shopping.",
    "Four pips. Four seasons and she wore the habit through all of them. That's commitment.",
    "She'd do the whole weekly shop in four aisles flat if she was in a mood. Speed. Focus. Terrifying.",
  ],
  5: [
    "Five. I was ten. The cart was heavy. The habit billowed. The language, on a scale of one to five, was a five.",
    "Five pips — the scoring pip. She could spot a scoring play faster than a checkout queue jumper and react more forcefully.",
    "Five. She said five was the luck number. Argued about it with a priest once. She won.",
  ],
  6: [
    "Six. The double-six. The best tile in the box. She always said if you get the double-six, you play it immediately. No hesitation. She meant at dominoes. Probably.",
    "Six pips. Maximum. She operated at maximum most of the time. It was a lot. It was also impressive.",
    "The six. She had a six on a necklace. Saint somebody. Patron of complicated situations, she said. Never checked.",
  ],
};

export function getPipFact(pip: number): string {
  const facts = PIP_FACTS[pip] ?? ["A number. She had a view on it. She had a view on most things."];
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
  accentColor: string;
  scores: string[];
  wins: string[];
  blocks: string[];
}

export const PERSONALITIES: Record<WendyPersonalityId, WendyPersonality> = {
  wendy: {
    id: 'wendy',
    name: 'Sister Wendy',
    title: 'The Original. The Only.',
    accentColor: '#c49020',
    scores: ["Fifteen. I'll take it.", "Points. Mine. Moving on."],
    wins: ["Ha. And there it is.", "Beaten by a woman in a nun's habit. Write that down."],
    blocks: ["I see what you're doing. Bold.", "Blocked. You're welcome."],
  },
  patricia: {
    id: 'patricia',
    name: 'Sister Patricia',
    title: 'The Competitive One',
    accentColor: '#d4507a',
    scores: ["Mine.", "Patricia provides. Patricia scores."],
    wins: ["Patricia wins. Again. Obviously.", "Expected outcome. Next."],
    blocks: ["Closed. Move on.", "Your tile doesn't fit there. Mine does."],
  },
  hildegard: {
    id: 'hildegard',
    name: 'Abbess Hildegard',
    title: 'Merciless, Medieval, Magnificent',
    accentColor: '#6b46c1',
    scores: ["POINTS. MINE. GOD WILLS IT.", "The Abbess scores. As foretold."],
    wins: ["The Abbess does not lose. History is consistent on this.", "You have been beaten by someone in institutional clothing. Reflect."],
    blocks: ["Your advance ends here. As do most advances.", "Sealed. Like a very serious envelope."],
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
