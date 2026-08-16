import { describe, it, expect } from 'vitest';
import { PIP_OFFSETS, pipOffsets, type PipOffset } from './pips';

/**
 * The pip layout has now drifted off-centre twice — once on the splash tile
 * (absolute coordinates against a face whose top edge wasn't where they
 * assumed) and once in the game (a face that overflowed its own content box
 * and got cropped on one side). Both times it shipped, and both times Andrew
 * caught it by eye. These tests catch it before he has to.
 */

const VALUES = [0, 1, 2, 3, 4, 5, 6];

/** A layout is centred iff negating every offset gives back the same set. */
function isCentred(offsets: PipOffset[]): boolean {
  const key = ([x, y]: PipOffset) => `${x.toFixed(3)},${y.toFixed(3)}`;
  const set = new Set(offsets.map(key));
  return offsets.every(([x, y]) => set.has(key([-x, -y])));
}

describe('pip layout', () => {
  it('has an entry for every value a domino half can hold', () => {
    VALUES.forEach(v => expect(PIP_OFFSETS[v], `value ${v}`).toBeDefined());
  });

  it('places exactly as many pips as the value says', () => {
    VALUES.forEach(v => expect(PIP_OFFSETS[v].length, `value ${v}`).toBe(v));
  });

  it.each(VALUES)('centres value %i in its face (portrait)', v => {
    expect(isCentred(pipOffsets(v, true))).toBe(true);
  });

  it.each(VALUES)('centres value %i in its face (landscape)', v => {
    expect(isCentred(pipOffsets(v, false))).toBe(true);
  });

  it('keeps every pip inside the face, with room for its radius', () => {
    // Pip radius runs ~11% of the face across the three tile sizes.
    const RADIUS = 11.7; // the worst case: lg, 7px on a 60px face
    VALUES.forEach(v => {
      [true, false].forEach(vertical => {
        pipOffsets(v, vertical).forEach(([dx, dy]) => {
          expect(Math.abs(dx) + RADIUS, `value ${v} dx`).toBeLessThan(50);
          expect(Math.abs(dy) + RADIUS, `value ${v} dy`).toBeLessThan(50);
        });
      });
    });
  });

  it('turns the six on its side — three columns of two, not two of three', () => {
    const portrait = pipOffsets(6, true);
    const landscape = pipOffsets(6, false);
    // Portrait: two distinct columns, three distinct rows. Landscape: the
    // other way round.
    const cols = (o: PipOffset[]) => new Set(o.map(([x]) => x.toFixed(2))).size;
    const rows = (o: PipOffset[]) => new Set(o.map(([, y]) => y.toFixed(2))).size;
    expect([cols(portrait), rows(portrait)]).toEqual([2, 3]);
    expect([cols(landscape), rows(landscape)]).toEqual([3, 2]);
  });

  it('pulls in only the six, and only when it is on its side', () => {
    // Every other value keeps the approved spacing in both orientations, so
    // rotating is a pure 90° turn: (dx, dy) -> (-dy, dx).
    [1, 2, 3, 4, 5].forEach(v => {
      const rotated = pipOffsets(v, true).map(([dx, dy]) => [-dy, dx]);
      expect(pipOffsets(v, false)).toEqual(rotated);
    });
    // The six's three-across axis is the one that doesn't fit horizontally.
    const sixAcross = Math.max(...pipOffsets(6, false).map(([dx]) => Math.abs(dx)));
    const sixDown = Math.max(...pipOffsets(6, true).map(([, dy]) => Math.abs(dy)));
    expect(sixAcross).toBeLessThan(sixDown);
  });
});
