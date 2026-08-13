import { describe, it, expect } from 'vitest';
import {
  createTile, isDouble, grantsGoAgain, scoreValue, playOnBoard,
  type BoardState,
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
