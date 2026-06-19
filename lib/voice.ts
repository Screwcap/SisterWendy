'use client';
/*
 * Sister Wendy — Voice (Epley "voice effect": hearing a voice builds more
 * connection than reading text). Web Speech API: zero-cost, no API key, runs
 * client-side. Abstracted behind speak() so ElevenLabs-generated MP3s can
 * replace the synthesis path later with no caller changes.
 *
 * Voice profile target: older Southern woman — unhurried, warm with an edge.
 * The browser won't give us Savannah, but per-character rate/pitch get us close.
 */

const KEY = 'sw-voice';

export function voiceSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
export function voiceEnabled(): boolean {
  try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
}
export function setVoiceEnabled(on: boolean): void {
  try { localStorage.setItem(KEY, on ? '1' : '0'); } catch { /* */ }
  if (!on) cancel();
}

let _voice: SpeechSynthesisVoice | null = null;
function pickVoice(): SpeechSynthesisVoice | null {
  if (!voiceSupported()) return null;
  if (_voice) return _voice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null; // not loaded yet — will retry next call
  const score = (v: SpeechSynthesisVoice) => {
    let s = 0;
    if (/^en[-_]?(US|GB|AU)/i.test(v.lang) || v.lang.startsWith('en')) s += 4;
    if (/female|woman|samantha|victoria|karen|moira|tessa|fiona|susan|zira|joanna|salli/i.test(v.name)) s += 5;
    if (/google|natural|premium|enhanced/i.test(v.name)) s += 2; // nicer engines
    return s;
  };
  _voice = [...voices].sort((a, b) => score(b) - score(a))[0] || null;
  return _voice;
}
// voices populate asynchronously in some browsers
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => { _voice = null; pickVoice(); };
}

export function speak(text: string, personalityId = 'wendy'): void {
  if (!voiceSupported() || !text) return;
  try {
    const synth = window.speechSynthesis;
    synth.cancel(); // never let lines pile up
    const u = new SpeechSynthesisUtterance(text.replace(/[""""]/g, '').trim());
    const v = pickVoice();
    if (v) u.voice = v;
    // Wendy: unhurried, warm. Patricia: quick & clipped. Hildegard: slow, low, deadpan.
    u.rate  = personalityId === 'patricia' ? 1.08 : personalityId === 'hildegard' ? 0.82 : 0.9;
    u.pitch = personalityId === 'hildegard' ? 0.85 : personalityId === 'patricia' ? 1.05 : 0.98;
    u.volume = 1;
    synth.speak(u);
  } catch { /* speech is a bonus, never a blocker */ }
}

export function cancel(): void {
  try { if (voiceSupported()) window.speechSynthesis.cancel(); } catch { /* */ }
}
