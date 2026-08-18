import { describe, it, expect } from 'vitest';
import {
  createTile, isDouble, grantsGoAgain, scoreValue, playOnBoard,
  initGame, nextRound, isBlocked, resolveBlockedRound, handPips,
  type BoardState, type GameState, type TileData,
} from '@/lib/game';

// Sister Wendy is a RaceHorse-only game: lay a double OR score and you play again.
// The scoring half of that rule shipped missing twice, so it is pinned here.

const board = (ids: Array<[number, number]>, leftEnd: number, rightEnd: number): BoardState => ({
  chain: ids.map(([a, b]) => createTile(a, b)),
  leftEnd,
  rightEnd,
});

describe('grantsGoAgain — the RaceHorse rule', () => {
  it('grants on a double that scores nothing', () => {
    expect(grantsGoAgain(createTile(3, 3), 0)).toBe(true);
  });

  it('grants on a scoring play that is NOT a double — the half that kept going missing', () => {
    expect(grantsGoAgain(createTile(1, 2), 5)).toBe(true);
  });

  it('grants when a play is both', () => {
    expect(grantsGoAgain(createTile(5, 5), 10)).toBe(true);
  });

  it('does not grant on a plain non-scoring play', () => {
    expect(grantsGoAgain(createTile(0, 1), 0)).toBe(false);
  });

  it('is never satisfied by the double alone once scoring is possible', () => {
    // Guards the exact regression: `isDouble(tile)` on its own passed every test
    // that only ever exercised doubles. A scoring non-double must be enough.
    const scoringNonDoubles = [createTile(1, 2), createTile(4, 5), createTile(0, 4)];
    for (const t of scoringNonDoubles) {
      expect(isDouble(t)).toBe(false);
      expect(grantsGoAgain(t, 5)).toBe(true);
    }
  });
});

describe('scoreValue — what the go-again depends on', () => {
  it('scores the sum of the open ends when it is a multiple of 5', () => {
    expect(scoreValue(board([[1, 2], [2, 3], [3, 4]], 1, 4))).toBe(5);
  });

  it('scores nothing when the ends do not total a multiple of 5', () => {
    expect(scoreValue(board([[2, 3], [3, 4]], 2, 4))).toBe(0);
  });

  it('counts a double at an end as both its pips', () => {
    // left 0-1 exposes 0, right 5-5 is a double exposing 10 -> 10, scores.
    expect(scoreValue(board([[0, 1], [1, 5], [5, 5]], 0, 5))).toBe(10);
  });

  it('scores an opening double off its own pips', () => {
    expect(scoreValue(board([[5, 5]], 5, 5))).toBe(10);
  });

  it('scores nothing on an empty board', () => {
    expect(scoreValue({ chain: [], leftEnd: null, rightEnd: null })).toBe(0);
  });
});

describe('the shipped combination — play, score, go again', () => {
  it('a non-double laid for points keeps the turn', () => {
    // The exact position QA'd in the browser: ends 2 and 4, play 1-2 on the left.
    const before = board([[2, 3], [3, 4]], 2, 4);
    expect(scoreValue(before)).toBe(0);

    const tile = createTile(1, 2);
    const after = playOnBoard(before, tile, 'left');
    const scored = scoreValue(after);

    expect(scored).toBe(5);              // ends are now 1 and 4
    expect(isDouble(tile)).toBe(false);  // and it is not a double
    expect(grantsGoAgain(tile, scored)).toBe(true);
  });

  it('a non-double laid for nothing hands the turn over', () => {
    const before = board([[1, 2], [2, 3], [3, 4]], 1, 4);
    const tile = createTile(0, 1);
    const after = playOnBoard(before, tile, 'left');
    const scored = scoreValue(after);

    expect(scored).toBe(0);              // ends are now 0 and 4
    expect(grantsGoAgain(tile, scored)).toBe(false);
  });
});

/**
 * THE BLOCKED ROUND — Andrew, 17 Aug: "when boneyard is depleted... our
 * sisterwendy game loops infinitely & needs to be cut short after the full
 * first 2 passes."
 *
 * The engine had no concept of a block at all: PASS advanced the turn and
 * nothing counted, so two stuck players handed the turn back and forth for
 * ever. These tests pin the ending AND the scoring.
 */
describe('a blocked round ends, and pays out', () => {
  const tile = (a: number, b: number) => createTile(a, b);

  function stuck(humanHand: TileData[], wendyHand: TileData[], passes = 0): GameState {
    const base = initGame('focused', 'wendy', 61);
    return {
      ...base,
      boneyard: [],
      consecutivePasses: passes,
      currentPlayerIndex: 0,
      players: [
        { ...base.players[0], hand: humanHand, score: 0 },
        { ...base.players[1], hand: wendyHand, score: 0 },
      ],
    };
  }

  it('is not blocked until everyone has passed', () => {
    expect(isBlocked(stuck([tile(1, 1)], [tile(2, 2)], 0))).toBe(false);
    expect(isBlocked(stuck([tile(1, 1)], [tile(2, 2)], 1))).toBe(false);
    expect(isBlocked(stuck([tile(1, 1)], [tile(2, 2)], 2))).toBe(true);
  });

  it('gives the round to the lighter hand and ends the round', () => {
    // human 1+1 = 2 pips, Wendy 6+6 + 5+4 = 21 pips → human takes it
    const s = resolveBlockedRound(stuck([tile(1, 1)], [tile(6, 6), tile(5, 4)], 2));
    expect(s.phase).toBe('roundOver');
    expect(s.roundWinnerId).toBe('human');
    // 21 pips rounds to 20
    expect(s.players[0].score).toBe(20);
    expect(s.players[1].score).toBe(0);
  });

  it('gives it to Sister Wendy when she is the lighter one', () => {
    const s = resolveBlockedRound(stuck([tile(6, 6), tile(6, 5)], [tile(0, 1)], 2));
    expect(s.roundWinnerId).not.toBe('human');
    expect(s.players[1].score).toBe(25); // 23 pips → 25
  });

  it('pays nobody on a dead-level tie', () => {
    const s = resolveBlockedRound(stuck([tile(3, 3)], [tile(2, 4)], 2));
    expect(s.players[0].score).toBe(0);
    expect(s.players[1].score).toBe(0);
    expect(s.roundWinnerId).toBeTruthy();   // still names someone, to lead next round
    expect(s.phase).toBe('roundOver');
  });

  it('ends the GAME when the block carries someone to the target', () => {
    const s0 = stuck([tile(1, 1)], [tile(6, 6), tile(6, 5)], 2);
    s0.players[0].score = 55;               // 23 pips → 25, past 61
    const s = resolveBlockedRound(s0);
    expect(s.phase).toBe('gameOver');
    expect(s.gameWinnerId).toBe('human');
  });

  it('clears the pass count so the next round does not settle on one pass', () => {
    const s = resolveBlockedRound(stuck([tile(1, 1)], [tile(6, 6)], 2));
    expect(s.consecutivePasses).toBe(0);
    expect(isBlocked(nextRound(s))).toBe(false);
  });

  it('counts pips the way the go-out bonus does', () => {
    expect(handPips([tile(6, 6), tile(5, 4)])).toBe(21);
    expect(handPips([])).toBe(0);
  });
});
