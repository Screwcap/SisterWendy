// Persistent player stats (localStorage 'sw-stats') — the meta-loop:
// a record to build, a streak to protect, a best grade to beat. Shown on game-over.

export interface SWStats {
  played: number;
  won: number;
  lost: number;
  bestScore: number;
  currentStreak: number;
  bestStreak: number;
  bestGrade: string; // '' | F | D | C | B | A
}

const KEY = 'sw-stats';
const GRADE_ORDER = ['', 'F', 'D', 'C', 'B', 'A'];

function defaults(): SWStats {
  return { played: 0, won: 0, lost: 0, bestScore: 0, currentStreak: 0, bestStreak: 0, bestGrade: '' };
}

export function getStats(): SWStats {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...defaults(), ...JSON.parse(raw) };
  } catch { /* corrupt / unavailable */ }
  return defaults();
}

export function recordResult(r: { won: boolean; score: number; grade: string }): SWStats {
  const s = getStats();
  s.played += 1;
  if (r.won) {
    s.won += 1;
    s.currentStreak += 1;
    if (s.currentStreak > s.bestStreak) s.bestStreak = s.currentStreak;
  } else {
    s.lost += 1;
    s.currentStreak = 0;
  }
  if (r.score > s.bestScore) s.bestScore = r.score;
  if (GRADE_ORDER.indexOf(r.grade) > GRADE_ORDER.indexOf(s.bestGrade)) s.bestGrade = r.grade;
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* quota */ }
  return s;
}
