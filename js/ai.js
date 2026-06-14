'use strict';

function aiPickPlay(hand, board, difficulty = 'normal') {
  if (hand.length === 0) return null;

  // Build all first-move candidates with sim boards
  const candidates = [];
  for (const tile of hand) {
    for (const end of board.validEnds(tile)) {
      const sim = new Board();
      sim.chain    = board.chain.map(t => { const n = new Tile(t.a, t.b); n.flipped = t.flipped; return n; });
      sim.leftEnd  = board.leftEnd;
      sim.rightEnd = board.rightEnd;
      const st = new Tile(tile.a, tile.b);
      sim.play(st, end);
      const sc = sim.scoreValue();
      candidates.push({ tile, end, sc, sim });
    }
  }
  if (candidates.length === 0) return null;

  if (difficulty === 'easy') {
    // 45% chance to pick randomly, otherwise weakly score-greedy
    const scoring = candidates.filter(c => c.sc > 0);
    const pool = Math.random() < 0.45 && scoring.length ? scoring : candidates;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  if (difficulty === 'hard') {
    // 2-move lookahead: after each candidate play, simulate what Wendy could score
    // on a bonus turn (since she scores again if she scored this turn).
    // Also factors in end-blocking (exposing ends that don't match remaining hand).
    for (const c of candidates) {
      let futurePotential = 0;
      // If this play scores, Wendy gets a bonus turn — try all her remaining tiles
      if (c.sc > 0) {
        const remainingHand = hand.filter(t => t !== c.tile);
        for (const t2 of remainingHand) {
          for (const e2 of c.sim.validEnds(t2)) {
            const sim2 = new Board();
            sim2.chain    = c.sim.chain.map(t => { const n=new Tile(t.a,t.b); n.flipped=t.flipped; return n; });
            sim2.leftEnd  = c.sim.leftEnd;
            sim2.rightEnd = c.sim.rightEnd;
            const st2 = new Tile(t2.a, t2.b);
            sim2.play(st2, e2);
            futurePotential = Math.max(futurePotential, sim2.scoreValue());
          }
        }
      }
      c.totalValue = c.sc + futurePotential * 0.6; // discount future score slightly
    }
    candidates.sort((a, b) => {
      if (Math.abs(b.totalValue - a.totalValue) > 1) return b.totalValue - a.totalValue;
      return b.tile.pips() - a.tile.pips();
    });
    return candidates[0];
  }

  // Normal: greedy by immediate score, then double preference, then pips
  candidates.sort((a, b) => {
    if (b.sc !== a.sc) return b.sc - a.sc;
    if (a.tile.isDouble() !== b.tile.isDouble()) return a.tile.isDouble() ? -1 : 1;
    return b.tile.pips() - a.tile.pips();
  });
  return candidates[0];
}

