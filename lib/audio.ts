// lib/audio.ts — Sister Wendy sound effects (Howler, SSR-safe, lazy-loaded).
import { Howl } from 'howler';

type SoundName =
  | 'place' | 'place-wendy' | 'score' | 'score-big' | 'near-miss'
  | 'draw' | 'clear' | 'win' | 'lose' | 'streak' | 'error';

const FILES: Record<SoundName, { src: string; volume: number }> = {
  'place':       { src: '/place.mp3',       volume: 0.5 },
  'place-wendy': { src: '/place-wendy.mp3', volume: 0.5 },  // her tiles sound deliberate
  'score':       { src: '/score.mp3',       volume: 0.65 },
  'score-big':   { src: '/score-big.mp3',   volume: 0.7 },  // 15+ point play
  'near-miss':   { src: '/near-miss.mp3',   volume: 0.45 }, // one off a multiple of 5
  'draw':        { src: '/draw.mp3',        volume: 0.5 },
  'clear':       { src: '/clear.mp3',       volume: 0.6 },
  'win':         { src: '/win.mp3',         volume: 0.7 },
  'lose':        { src: '/lose.mp3',        volume: 0.6 },
  'streak':      { src: '/streak.mp3',      volume: 0.65 },
  'error':       { src: '/nope.mp3',        volume: 0.45 }, // invalid tile tap
};

let _muted = false;
let _initialized = false;
const _sounds: Partial<Record<SoundName, Howl>> = {};

function init() {
  if (_initialized || typeof window === 'undefined') return;
  _initialized = true;
  try { _muted = localStorage.getItem('sw-muted') === '1'; } catch { /* */ }
  (Object.keys(FILES) as SoundName[]).forEach((n) => {
    _sounds[n] = new Howl({ src: [FILES[n].src], volume: FILES[n].volume, preload: false });
  });
}

/**
 * Heavier tiles should land heavier. Maps a tile's pip total to a playback
 * rate: a 6|6 thuds, a 0|1 ticks. Deliberately narrow (0.88–1.12) — enough to
 * feel, not enough to sound like a broken sample.
 */
export function rateForTile(a: number, b: number): number {
  const weight = (a + b) / 12;            // 0 (blank|blank) … 1 (six|six)
  return +(1.12 - weight * 0.24).toFixed(3);
}

export const audio = {
  /**
   * @param opts.rate  playback rate (see rateForTile)
   * @param opts.pan   stereo position, -1 left … 1 right. Sister Wendy's
   *                   portrait sits on the left of the table, so her tiles are
   *                   nudged left — the honest version of "spatialised voice"
   *                   (Web Speech TTS can't be routed through a Web Audio
   *                   panner, so the brief's HRTF approach doesn't apply here).
   */
  play(name: SoundName, opts?: { rate?: number; pan?: number }) {
    if (_muted) return;
    init();
    const s = _sounds[name];
    if (!s) return;
    if (opts?.rate !== undefined) s.rate(opts.rate);
    if (opts?.pan !== undefined) s.stereo(opts.pan);
    s.play();
  },
  get muted() { return _muted; },
  toggleMute(): boolean {
    _muted = !_muted;
    try { localStorage.setItem('sw-muted', _muted ? '1' : '0'); } catch { /* */ }
    return _muted;
  },
};
