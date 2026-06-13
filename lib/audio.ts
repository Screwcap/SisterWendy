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

export const audio = {
  play(name: SoundName) {
    if (_muted) return;
    init();
    _sounds[name]?.play();
  },
  get muted() { return _muted; },
  toggleMute(): boolean {
    _muted = !_muted;
    try { localStorage.setItem('sw-muted', _muted ? '1' : '0'); } catch { /* */ }
    return _muted;
  },
};
