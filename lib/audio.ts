// lib/audio.ts — Sister Wendy sound effects
// SSR-safe: Howl construction deferred to client only.

import { Howl } from 'howler';

type SoundName = 'place' | 'score' | 'clear' | 'error' | 'draw';

let _muted = false;
let _initialized = false;
const _sounds: Partial<Record<'place' | 'score' | 'clear', Howl>> = {};

function init() {
  if (_initialized || typeof window === 'undefined') return;
  _initialized = true;
  try { _muted = localStorage.getItem('sw-muted') === '1'; } catch { /* */ }
  _sounds.place = new Howl({ src: ['/place.mp3'], volume: 0.5, preload: true });
  _sounds.score = new Howl({ src: ['/score.mp3'], volume: 0.65, preload: true });
  _sounds.clear = new Howl({ src: ['/clear.mp3'], volume: 0.6, preload: true });
}

function _webAudioBeep(freq: number, endFreq: number, gainVal: number, dur: number) {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + dur);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
    osc.onended = () => ctx.close();
  } catch { /* AudioContext unavailable */ }
}

export const audio = {
  play(name: SoundName) {
    if (_muted) return;
    init();
    if (name === 'error') { _webAudioBeep(200, 90, 0.15, 0.12); return; }
    if (name === 'draw')  { _webAudioBeep(440, 330, 0.10, 0.12); return; }
    _sounds[name]?.play();
  },

  get muted() { return _muted; },

  toggleMute(): boolean {
    _muted = !_muted;
    try { localStorage.setItem('sw-muted', _muted ? '1' : '0'); } catch { /* */ }
    return _muted;
  },
};
