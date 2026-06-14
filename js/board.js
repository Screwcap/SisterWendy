'use strict';

// ── TILE ──
class Tile {
  constructor(a, b) {
    this.a = a;
    this.b = b;
    this.id = `${a}-${b}`;
    this.flipped = false;
  }
  isDouble() { return this.a === this.b; }
  pips() { return this.a + this.b; }
  matches(val) { return this.a === val || this.b === val; }
}

// ── BOARD ──
class Board {
  constructor() {
    this.chain = [];
    this.leftEnd = null;
    this.rightEnd = null;
  }
  isEmpty() { return this.chain.length === 0; }

  validEnds(tile) {
    if (this.isEmpty()) return ['first'];
    const ends = [];
    if (tile.matches(this.leftEnd)) ends.push('left');
    if (tile.matches(this.rightEnd)) ends.push('right');
    if (ends.length === 2 && this.leftEnd === this.rightEnd) return ['right'];
    return ends;
  }

  canPlay(tile) { return this.validEnds(tile).length > 0; }

  play(tile, end) {
    if (this.isEmpty() || end === 'first') {
      tile.flipped = false;
      this.chain = [tile];
      this.leftEnd = tile.a;
      this.rightEnd = tile.b;
      return;
    }
    if (end === 'left') {
      if (tile.b === this.leftEnd) {
        tile.flipped = false;
        this.leftEnd = tile.a;
      } else {
        tile.flipped = true;
        this.leftEnd = tile.b;
      }
      this.chain.unshift(tile);
    } else {
      if (tile.a === this.rightEnd) {
        tile.flipped = false;
        this.rightEnd = tile.b;
      } else {
        tile.flipped = true;
        this.rightEnd = tile.a;
      }
      this.chain.push(tile);
    }
  }

  scoreValue() {
    if (this.chain.length === 0) return 0;
    const L = this.chain[0], R = this.chain[this.chain.length - 1];
    let sum = 0;
    if (this.chain.length === 1) {
      sum = L.isDouble() ? L.a * 2 : L.a + L.b;
    } else {
      sum += L.isDouble() ? L.a * 2 : this.leftEnd;
      sum += R.isDouble() ? R.a * 2 : this.rightEnd;
    }
    return sum % 5 === 0 ? sum : 0;
  }
}

window.Board = Board;
window.Tile = Tile;
