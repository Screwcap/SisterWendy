import { describe, it, expect } from 'vitest';
import { PIP_OFFSETS, pipOffsets, pipRadiusScale, type PipOffset } from './pips';

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

  /**
   * Andrew, 17 Aug: "double six's pips are really close." The six is the only
   * value that crowds ITSELF rather than the edge, because it packs six pips
   * onto a face sized for five. The fix shrinks the six's pips and leaves its
   * positions — and every other value — alone.
   */
  describe('the six draws smaller than everything else', () => {
    it('shrinks only the six', () => {
      [0, 1, 2, 3, 4, 5].forEach(v => expect(pipRadiusScale(v)).toBe(1));
      expect(pipRadiusScale(6)).toBeLessThan(1);
    });

    /**
     * The six is the only value whose nearest neighbours are ORTHOGONAL rather
     * than diagonal — three across where everything else is two — so it can
     * never be quite as airy as the five, and matching it exactly would need
     * pips a third smaller than the rest of the set. What it must not do is
     * read as one mass, which is what shipped: 2.05% of a face of daylight,
     * 0.9px on a real md tile.
     *
     * Note the crowding is LANDSCAPE-only. Portrait was always the roomier of
     * the two (6.35%), which is why this went unnoticed on the table and shows
     * up on the splash's big 6|6 hero.
     */
    const R = (5.6 / 46) * 100;                 // pip radius as % of face, md tile
    const daylight = (v: number, vertical: boolean, scale: number) => {
      const o = pipOffsets(v, vertical);
      let min = Infinity;
      for (let i = 0; i < o.length; i++)
        for (let j = i + 1; j < o.length; j++)
          min = Math.min(min, Math.hypot(o[i][0] - o[j][0], o[i][1] - o[j][1]) - 2 * R * scale);
      return min;
    };
    const margin = (v: number, vertical: boolean, scale: number) => {
      const o = pipOffsets(v, vertical);
      const reach = Math.max(...o.map(([x, y]) => Math.max(Math.abs(x), Math.abs(y))));
      return 50 - (reach + R * scale);
    };

    it('opens the crowded landscape six from unreadable to a real gap', () => {
      const before = daylight(6, false, 1);
      const after = daylight(6, false, pipRadiusScale(6));
      expect(before).toBeLessThan(3);            // what shipped — one mass
      expect(after).toBeGreaterThan(before * 3);
      expect(after).toBeGreaterThan(6);
    });

    it('takes the portrait six past the five, which is what the splash shows', () => {
      expect(daylight(6, true, pipRadiusScale(6)))
        .toBeGreaterThan(daylight(5, true, 1));
    });

    /**
     * "so they look symmetrical to the tile" — the gap to the face edge. The
     * shrink must not be paid for by moving pips outward: positions are the
     * kerning Andrew signed off on 16 Aug, so the margin can only improve.
     */
    it('gives the six more room to the tile edge, not less', () => {
      [true, false].forEach(vertical => {
        expect(margin(6, vertical, pipRadiusScale(6)))
          .toBeGreaterThan(margin(6, vertical, 1));
      });
      // and in landscape it now clears the four and five
      expect(margin(6, false, pipRadiusScale(6)))
        .toBeGreaterThanOrEqual(margin(5, false, 1));
    });

    it('leaves every other value untouched in both orientations', () => {
      [0, 1, 2, 3, 4, 5].forEach(v => {
        expect(pipRadiusScale(v)).toBe(1);
        expect(pipOffsets(v, true)).toEqual(PIP_OFFSETS[v]);
      });
    });
  });
});
