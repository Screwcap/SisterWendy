// lib/wendy.ts — Sister Wendy personality: voice lines, art facts, verdicts

export type QuoteKey =
  | 'gameStart' | 'playerScores' | 'playerBigScore' | 'playerDouble'
  | 'playerCombo' | 'playerCantPlay' | 'wendyScores' | 'wendyBigScore'
  | 'wendyDouble' | 'herTurn' | 'smug' | 'commentary' | 'angry'
  | 'playerWins' | 'wendyWins' | 'tileHover';

const QUOTES: Record<QuoteKey, string[]> = {
  gameStart: [
    "A new game. I approach it with the same intensity I bring to Caravaggio.",
    "Shall we begin? I warn you — I have played dominoes since the Reformation.",
    "Right then. Try not to embarrass yourself too comprehensively.",
    "One must approach dominoes as one approaches Vermeer: with patience, precision, and no expectation of mercy.",
  ],
  playerScores: [
    "Oh. Well played. Don't expect me to say that again.",
    "Points for you. How tediously competent.",
    "Hmm. I didn't see that coming. Nor, I suspect, did you.",
    "Credit where it's due. Briefly.",
  ],
  playerBigScore: [
    "Good heavens. You must be cheating. Or inspired. In art, the line is blurry.",
    "That was remarkable. I'm going to pretend I let you do that.",
    "Twenty points. The audacity. The Flemish masters would have wept.",
  ],
  playerDouble: [
    "A double! The baroque flourish of domino play.",
    "You lay doubles like Tintoretto lays perspective — aggressively and without apology.",
    "The double. Drama in pip form.",
  ],
  playerCombo: [
    "Another bonus turn? You're becoming presumptuous. I respect it.",
    "Consecutive scoring — like a Bach fugue. I didn't expect it from you.",
    "You've found a rhythm. Don't celebrate. Rhythms break.",
  ],
  playerCantPlay: [
    "No tile fits? Join Cézanne in his late period — stranded, magnificent, forced to reconsider everything.",
    "Draw from the boneyard. Art demands patience.",
    "The tiles resist you. This is not unlike how art resisted Picasso — briefly, then surrendered.",
  ],
  wendyScores: [
    "Fifteen points. I try not to gloat. I try.",
    "The board yields its secrets to those who study it. As with all art.",
    "There we are. The tiles, as usual, have excellent taste.",
  ],
  wendyBigScore: [
    "Twenty points. I have achieved what Rothko called 'the inevitable.'",
    "Ah. That's rather good, isn't it. Yes. It rather is.",
    "I did not choose to score twenty points. The game chose it for me. Like all true art.",
  ],
  wendyDouble: [
    "A double. One does enjoy a double.",
    "The double pip — symmetry made playable.",
    "Doubles are God's geometry. I'm simply deploying it.",
  ],
  herTurn: [
    "My turn. Watch closely. This is what studied attention looks like.",
    "Now then.",
    "Allow me.",
    "I have considered the board. The board has considered me back.",
  ],
  smug: [
    "I see your strategy. It won't work.",
    "Interesting choice. Wrong, but interesting.",
    "You're playing with hope. I'm playing with intention. There is a difference.",
  ],
  commentary: [
    "The board has a certain elegance now. I may be responsible for some of it.",
    "We are constructing something together. Neither of us will mention this.",
    "The chain grows. Like a Flemish altarpiece — panel by panel, inexorable.",
  ],
  angry: [
    "I see what you're doing. It is rude.",
    "That was deliberately blocking. Sister Wendy does not forget.",
    "You're playing like you're angry at something. Are you angry at something?",
  ],
  playerWins: [
    "You've won. I accept this with the grace of Matisse accepting a bad day — briefly, then I paint over it.",
    "Well. You beat a nun at dominoes. Feel what you feel about that.",
    "Victory is yours. Don't let it change you. It usually does.",
    "You won. I shall now go and contemplate a Flemish interior until the feeling passes.",
  ],
  wendyWins: [
    "I win. As God and Mondrian intended.",
    "The tiles were kind to me today. Or perhaps I was kind to the tiles.",
    "There we are. Beaten by a nun. That's going in your biography.",
    "Game over. It was over rather sooner than you expected, wasn't it.",
  ],
  tileHover: [
    "Consider it carefully.",
    "Is that your move?",
    "Interesting selection.",
    "Hmm.",
  ],
};

export function randQuote(key: QuoteKey): string {
  const list = QUOTES[key];
  return list[Math.floor(Math.random() * list.length)];
}

// Art-history facts keyed by pip value (0–6)
export const PIP_FACTS: Record<number, string[]> = {
  0: [
    "Zero. The void. Malevich nearly broke abstract painting debating it.",
    "The blank pip — negative space. Matisse called it 'the paper the paint doesn't cover.' He meant it as praise.",
    "Zero pips. Kazimir Malevich painted a black square on white canvas in 1915 and called it the beginning of everything.",
  ],
  1: [
    "One singular point — Kandinsky's entire theory of composition begins with this mark.",
    "The first commitment. Every masterpiece started with exactly this: a single mark on nothing.",
    "One dot. The loneliest, most loaded pip on the tile. Yves Klein spent a career here.",
  ],
  2: [
    "Two — balance, tension. Think of Rembrandt's portraits: always a dialogue between light and shadow.",
    "Two pips. Duality. Yin and yang. Braque and Picasso circling each other like planets.",
    "The number of Michelangelo's hands that painted the Sistine Chapel ceiling. Both extraordinary.",
  ],
  3: [
    "Three — the Holy Trinity of composition. Every Renaissance painter knew the rule of thirds before they named it.",
    "Three dots. Triangular stability. Raphael built his entire Madonnas on this geometry.",
    "Three is the first odd prime. Mathematicians are fascinated. Artists merely use it constantly.",
  ],
  4: [
    "Four seasons, four humours, four Evangelists — painters adored the square. Paul Klee made a career of it.",
    "Mondrian reduced the entire world to four angles and primary colours. He was, in his way, correct.",
    "Four pips. The grid. Mondrian, Albers, LeWitt — all lived here, in perfect, uncompromising fours.",
  ],
  5: [
    "Five! The Fibonacci sequence begins its persuasion around here. Da Vinci hid it in everything.",
    "Five pips — Dürer's engravings were dominated by fives. He was obsessed with mathematical beauty and so am I.",
    "The pentagram. Five-pointed. Medieval mystics feared it; Renaissance artists worshipped it. Both had a point.",
  ],
  6: [
    "Six — the perfect number. Pythagoras said so. Da Vinci agreed. Vitruvian Man is all sixfold symmetry.",
    "The hexagon — the most efficient shape in nature. Bees know this. Paul Klee painted it. We all bow to six.",
    "Six pips. The maximum. The double-six is the king of this table, and don't pretend otherwise.",
  ],
};

export function getPipFact(pip: number): string {
  const facts = PIP_FACTS[pip] ?? ["A perfectly adequate number. Trust me on this."];
  return facts[Math.floor(Math.random() * facts.length)];
}

export function getTileFact(a: number, b: number): string {
  // Higher pip gets the educational focus; doubles get a double-fact
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
    title: 'Keeper of Art & Dominoes',
    accentColor: '#c49020',
    scores: ["Fifteen points. I try not to gloat.", "The board yields its secrets."],
    wins: ["I win. As God and Mondrian intended.", "Beaten by a nun. That's going in your biography."],
    blocks: ["I see what you're doing. It is rude.", "Playing defensively. How very contemporary."],
  },
  patricia: {
    id: 'patricia',
    name: 'Sister Patricia',
    title: 'Iron Hand of God',
    accentColor: '#d4507a',
    scores: ["Points. Mine now.", "The Lord provides. Specifically, He provides me with scoring tiles."],
    wins: ["The righteous win. This is not surprising.", "I have prevailed. Again."],
    blocks: ["Your path is closed. As it should be.", "I have blocked you. Spiritually as well as literally."],
  },
  hildegard: {
    id: 'hildegard',
    name: 'Abbess Hildegard',
    title: 'Merciless & Medieval',
    accentColor: '#6b46c1',
    scores: ["FÜNFZEHN PUNKTE. The medieval Church had no mercy and neither do I.", "Score. Mine."],
    wins: ["The Abbess does not lose. History confirms this.", "Vanquished. As in 1189."],
    blocks: ["Your advance is stopped. Like the Turks at Vienna.", "I seal this end of the board as I would seal a monastery gate."],
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
      ? "I didn't think you had it in you. Neither did you, I suspect. That's what makes it interesting. Magnificent."
      : "A noble defeat. Cézanne failed repeatedly before his greatness. This is the beginning, not the end.",
    B: won
      ? "Solid. Not inspired, but solid. Solid is underrated — ask any Flemish master."
      : "You played with intelligence but not quite enough of it. There's something honest about that.",
    C: won
      ? "Average, but winning. The Sistine Chapel was not painted by average, but here we are — you've won. Barely."
      : "Average. The middle is a terrible place to live, in art or dominoes. Do better.",
    D: won
      ? "You won despite yourself. This is not uncommon in art history. Turner was called a failure until he wasn't."
      : "You played with the confidence of a forger and the skill of a tax accountant. Not a compliment.",
    F: won
      ? "You won. I do not understand how. Neither do you. Art is sometimes inexplicable."
      : "What we witnessed today will not be discussed again. I am going to go pray and then contemplate Rothko until I feel better.",
  };
  return lines[grade];
}
