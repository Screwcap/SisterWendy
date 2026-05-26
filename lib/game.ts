// lib/game.ts — Sister Wendy Dominoes game engine
// All-Fives / Horse Race scoring. Double-six set (28 tiles).

export interface TileData {
  id: string;
  a: number;
  b: number;
  flipped: boolean;
}

export type BoardEnd = 'left' | 'right' | 'first';
export type Difficulty = 'forgiving' | 'focused' | 'merciless';
export type GameMode = 'forgiving' | 'focused' | 'merciless';

export interface Player {
  id: string;
  name: string;
  isHuman: boolean;
  hand: TileData[];
  score: number;
  personalityId?: string;
}

export interface BoardState {
  chain: TileData[];
  leftEnd: number | null;
  rightEnd: number | null;
}

export type TurnPhase =
  | 'selecting'     // player choosing a tile
  | 'choosingEnd'   // player chose a tile, now picking end
  | 'animating'     // tile being placed (locks input)
  | 'aiThinking'    // AI turn in progress
  | 'drawing'       // player drawing from boneyard
  | 'roundOver'     // round ended, show result
  | 'gameOver';     // game won

export interface GameState {
  mode: GameMode;
  players: Player[];
  currentPlayerIndex: number;
  board: BoardState;
  boneyard: TileData[];
  phase: TurnPhase;
  selectedTile: TileData | null;
  validEndsForSelected: BoardEnd[];
  turnCount: number;
  roundCount: number;
  lastScore: number;
  lastScoringPlayerId: string | null;
  roundWinnerId: string | null;
  gameWinnerId: string | null;
  wendySpeech: string;
  wendyMood: WendyMood;
  bonusTurn: boolean;  // current player gets another turn (scored or double)
  hintsUsed: number;
}

export type WendyMood = 'neutral' | 'pleased' | 'disappointed' | 'suspicious' | 'triumphant' | 'amused';

// ── Tile Constructors ──────────────────────────────────────────────────────

export function createTile(a: number, b: number): TileData {
  return { id: `${a}-${b}`, a, b, flipped: false };
}

export function isDouble(tile: TileData): boolean {
  return tile.a === tile.b;
}

export function tileMatches(tile: TileData, val: number): boolean {
  return tile.a === val || tile.b === val;
}

export function createFullSet(): TileData[] {
  const tiles: TileData[] = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      tiles.push(createTile(i, j));
    }
  }
  return shuffle(tiles);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Board Logic ────────────────────────────────────────────────────────────

export function emptyBoard(): BoardState {
  return { chain: [], leftEnd: null, rightEnd: null };
}

export function boardIsEmpty(board: BoardState): boolean {
  return board.chain.length === 0;
}

/**
 * BUG FIX: The original game had issues with 1st→2nd tile placement because
 * the orientation deduplication fired too eagerly on single-tile boards.
 *
 * Fix: Only deduplicate ends when chain.length > 1. With a single tile on the
 * board, even if leftEnd === rightEnd (a double), we still show both ends so
 * the player can choose a side. For non-doubles with a single tile, both ends
 * have different values and both should be independently valid.
 */
export function validEnds(board: BoardState, tile: TileData): BoardEnd[] {
  if (boardIsEmpty(board)) return ['first'];

  const ends: BoardEnd[] = [];
  if (board.leftEnd !== null && tileMatches(tile, board.leftEnd))  ends.push('left');
  if (board.rightEnd !== null && tileMatches(tile, board.rightEnd)) ends.push('right');

  // Deduplication only when chain has >1 tile and both exposed ends are identical
  if (ends.length === 2 && board.leftEnd === board.rightEnd && board.chain.length > 1) {
    return ['right'];
  }

  return ends;
}

export function canPlay(board: BoardState, tile: TileData): boolean {
  return validEnds(board, tile).length > 0;
}

export function playOnBoard(board: BoardState, tile: TileData, end: BoardEnd): BoardState {
  if (boardIsEmpty(board) || end === 'first') {
    return {
      chain: [{ ...tile, flipped: false }],
      leftEnd: tile.a,
      rightEnd: tile.b,
    };
  }

  if (end === 'left') {
    let flipped: boolean;
    let newLeftEnd: number;
    if (tile.b === board.leftEnd!) {
      // b-side connects; expose a
      flipped = false;
      newLeftEnd = tile.a;
    } else {
      // a-side connects; flip tile, expose b
      flipped = true;
      newLeftEnd = tile.b;
    }
    return {
      chain: [{ ...tile, flipped }, ...board.chain],
      leftEnd: newLeftEnd,
      rightEnd: board.rightEnd,
    };
  } else {
    // right
    let flipped: boolean;
    let newRightEnd: number;
    if (tile.a === board.rightEnd!) {
      flipped = false;
      newRightEnd = tile.b;
    } else {
      flipped = true;
      newRightEnd = tile.a;
    }
    return {
      chain: [...board.chain, { ...tile, flipped }],
      leftEnd: board.leftEnd,
      rightEnd: newRightEnd,
    };
  }
}

// Horse Race / All-Fives: score when sum of open ends is multiple of 5
export function scoreValue(board: BoardState): number {
  if (board.chain.length === 0) return 0;
  const L = board.chain[0];
  const R = board.chain[board.chain.length - 1];
  let sum = 0;
  if (board.chain.length === 1) {
    sum = isDouble(L) ? L.a * 2 : L.a + L.b;
  } else {
    sum += isDouble(L) ? L.a * 2 : (board.leftEnd ?? 0);
    sum += isDouble(R) ? R.a * 2 : (board.rightEnd ?? 0);
  }
  return sum % 5 === 0 ? sum : 0;
}

// ── AI ─────────────────────────────────────────────────────────────────────

export interface AIPlay {
  tile: TileData;
  end: BoardEnd;
  score: number;
}

export function aiPickPlay(
  hand: TileData[],
  board: BoardState,
  difficulty: Difficulty,
  opponentHand?: TileData[]
): AIPlay | null {
  if (hand.length === 0) return null;

  const candidates: Array<{
    tile: TileData;
    end: BoardEnd;
    score: number;
    simBoard: BoardState;
  }> = [];

  for (const tile of hand) {
    for (const end of validEnds(board, tile)) {
      const simBoard = playOnBoard(board, tile, end);
      const sc = scoreValue(simBoard);
      candidates.push({ tile, end, score: sc, simBoard });
    }
  }

  if (candidates.length === 0) return null;

  if (difficulty === 'forgiving') {
    const scoring = candidates.filter(c => c.score > 0);
    const pool = Math.random() < 0.65 && scoring.length > 0 ? scoring : candidates;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    return { tile: pick.tile, end: pick.end, score: pick.score };
  }

  if (difficulty === 'focused') {
    candidates.sort((a, b) =>
      b.score - a.score ||
      (isDouble(b.tile) ? 1 : 0) - (isDouble(a.tile) ? 1 : 0)
    );
    const best = candidates[0];
    return { tile: best.tile, end: best.end, score: best.score };
  }

  // merciless: 2-move lookahead + blocking
  const scored = candidates.map(c => {
    let myFuture = 0;
    for (const t2 of hand.filter(t => t.id !== c.tile.id)) {
      for (const e2 of validEnds(c.simBoard, t2)) {
        myFuture = Math.max(myFuture, scoreValue(playOnBoard(c.simBoard, t2, e2)));
      }
    }
    let opponentPotential = 0;
    if (opponentHand) {
      for (const pt of opponentHand) {
        for (const pe of validEnds(c.simBoard, pt)) {
          opponentPotential = Math.max(opponentPotential, scoreValue(playOnBoard(c.simBoard, pt, pe)));
        }
      }
    }
    return { ...c, value: c.score + myFuture * 0.55 - opponentPotential * 0.45 };
  });

  scored.sort((a, b) => b.value - a.value);
  const best = scored[0];
  return { tile: best.tile, end: best.end, score: best.score };
}

// ── Game Factory ────────────────────────────────────────────────────────────

export const TARGET_SCORE = 61;
export const HAND_SIZE = 7;

export function initGame(mode: GameMode): GameState {
  const tiles = createFullSet();

  const humanPlayer: Player = {
    id: 'human',
    name: 'You',
    isHuman: true,
    hand: tiles.splice(0, HAND_SIZE),
    score: 0,
  };

  const aiPlayers: Player[] =
    mode === 'merciless'
      ? [
          { id: 'wendy', name: 'Sister Wendy', isHuman: false, personalityId: 'wendy', hand: tiles.splice(0, HAND_SIZE), score: 0 },
          { id: 'patricia', name: 'Sister Patricia', isHuman: false, personalityId: 'patricia', hand: tiles.splice(0, HAND_SIZE), score: 0 },
          { id: 'hildegard', name: 'Abbess Hildegard', isHuman: false, personalityId: 'hildegard', hand: tiles.splice(0, HAND_SIZE), score: 0 },
        ]
      : [{ id: 'wendy', name: 'Sister Wendy', isHuman: false, personalityId: 'wendy', hand: tiles.splice(0, HAND_SIZE), score: 0 }];

  return {
    mode,
    players: [humanPlayer, ...aiPlayers],
    currentPlayerIndex: 0,
    board: emptyBoard(),
    boneyard: tiles,
    phase: 'selecting',
    selectedTile: null,
    validEndsForSelected: [],
    turnCount: 0,
    roundCount: 1,
    lastScore: 0,
    lastScoringPlayerId: null,
    roundWinnerId: null,
    gameWinnerId: null,
    wendySpeech: mode === 'merciless'
      ? "Four of us. Oh this is going to be something. Possibly a sin. Probably worth it."
      : "Right, let's go. I didn't put this habit on to lose.",
    wendyMood: 'neutral',
    bonusTurn: false,
    hintsUsed: 0,
  };
}

export function difficultyForMode(mode: GameMode): Difficulty {
  if (mode === 'forgiving') return 'forgiving';
  if (mode === 'focused') return 'focused';
  return 'merciless';
}

// Sum of all opponents' remaining tile pips, rounded to nearest 5.
// Awarded to the player who goes out at end of a round.
export function calcRoundBonus(players: Player[], winnerIndex: number): number {
  const pipTotal = players
    .filter((_, i) => i !== winnerIndex)
    .reduce((sum, p) => sum + p.hand.reduce((s, t) => s + t.a + t.b, 0), 0);
  return Math.round(pipTotal / 5) * 5;
}

// Start the next round: fresh tiles, preserved scores, winner plays first.
export function nextRound(state: GameState): GameState {
  const tiles = createFullSet();
  const newPlayers = state.players.map(p => ({ ...p, hand: tiles.splice(0, HAND_SIZE) }));
  const winnerIdx = Math.max(0, newPlayers.findIndex(p => p.id === state.roundWinnerId));
  const nextPhase: GameState['phase'] = newPlayers[winnerIdx].isHuman ? 'selecting' : 'aiThinking';
  return {
    ...state,
    players: newPlayers,
    board: emptyBoard(),
    boneyard: tiles,
    phase: nextPhase,
    currentPlayerIndex: winnerIdx,
    selectedTile: null,
    validEndsForSelected: [],
    roundCount: state.roundCount + 1,
    roundWinnerId: null,
    lastScore: 0,
    lastScoringPlayerId: null,
    bonusTurn: false,
    turnCount: 0,
    wendySpeech: "New round. Same habit. Let's go.",
    wendyMood: 'neutral',
  };
}
