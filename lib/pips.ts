/**
 * Pip geometry — one definition, shared by the splash tile and every in-game
 * tile.
 *
 * Positions are offsets from the CENTRE of a half-face, in percent of that
 * face, never absolute coordinates. Measuring from the centre is what makes
 * the margins symmetrical by construction: the splash tile drifted top-heavy
 * for months because it used absolute y values against a face whose top edge
 * wasn't where the numbers assumed (Andrew, 15 Aug).
 *
 * These are the numbers Andrew signed off on ("the kerning is perfect",
 * 16 Aug), lifted off the splash tile and applied to the whole game.
 */

export type PipOffset = [number, number];

/** Column offset from the face centre. Every layout uses the same columns. */
const COL = 25;
/** Row offset for the 3×3 layouts — two, three, four, five. */
const ROW = 25;
/** The six fits three rows where the others fit two, so its rows sit wider. */
const ROW6 = 30.7;

/**
 * A PORTRAIT face, the way you'd hold a tile: the six reads as two columns
 * of three.
 */
export const PIP_OFFSETS: Record<number, PipOffset[]> = {
  0: [],
  1: [[0, 0]],
  2: [[-COL, -ROW], [COL, ROW]],
  3: [[-COL, -ROW], [0, 0], [COL, ROW]],
  4: [[-COL, -ROW], [COL, -ROW], [-COL, ROW], [COL, ROW]],
  5: [[-COL, -ROW], [COL, -ROW], [0, 0], [-COL, ROW], [COL, ROW]],
  6: [[-COL, -ROW6], [COL, -ROW6], [-COL, 0], [COL, 0], [-COL, ROW6], [COL, ROW6]],
};

/**
 * Lay a tile on its side and the pips turn with it — a six becomes three
 * columns of two, not two columns of three.
 *
 * The six's three-across axis is the only one that doesn't fit once it's
 * horizontal: at ±30.7% plus a pip radius of ~11% it leaves 8% of the face
 * as margin, and Andrew called that crowded on 4 Aug. So landscape pulls in
 * THAT AXIS ONLY (to ±26.4%, a ~12% margin, in line with the ~14% the four
 * and five leave). Everything else keeps the spacing exactly as approved —
 * the old code squeezed all six values uniformly, which cost every tile in
 * the game the kerning to solve a problem only the six had.
 */
const SIX_ACROSS_SQUEEZE = 0.86;

/**
 * The six carries SIX pips where the five carries five, on a face the same
 * size — so it is the only value whose pips crowd each OTHER rather than the
 * edge (Andrew, 17 Aug: "double six's pips are really close").
 *
 * The margins were never the problem and moving the pips would undo the
 * kerning he signed off on. Measured on a md tile (46px face, 5.6px radius):
 * the six's adjacent pips sit 12.1px apart centre-to-centre carrying an 11.2px
 * diameter, which leaves **0.9px of daylight** — they read as one mass. Every
 * other value's nearest neighbours are diagonal and ~16px apart.
 *
 * So the six — and only the six — draws at a smaller radius. Its POSITIONS are
 * untouched, which is what keeps the face symmetrical; the gaps open up and the
 * outer margin grows slightly, landing in line with the four and five rather
 * than tighter than them.
 */
const PIP_RADIUS_SCALE: Record<number, number> = { 6: 0.8 };

export function pipRadiusScale(value: number): number {
  return PIP_RADIUS_SCALE[value] ?? 1;
}

export function pipOffsets(value: number, vertical: boolean): PipOffset[] {
  const offsets = PIP_OFFSETS[value] ?? [];
  if (vertical) return offsets;
  return offsets.map(([dx, dy]): PipOffset => {
    // Rotate 90°: the row axis becomes the column axis.
    const rx = -dy;
    const ry = dx;
    return value === 6 ? [rx * SIX_ACROSS_SQUEEZE, ry] : [rx, ry];
  });
}
