import { Difficulty } from '@/types/game';

const KEYS = {
  UNLOCKED: 'crucible_unlocked_v1',
  BEST_STREAK: 'crucible_best_streak_v1',
  SCORES: 'crucible_scores_v1',
} as const;

function safe<T>(fn: () => T, fallback: T): T {
  try { return fn(); } catch { return fallback; }
}

// ── Unlocked difficulties ────────────────────────────────────────────────────

export function getUnlockedDifficulties(): Difficulty[] {
  return safe(() => {
    const raw = localStorage.getItem(KEYS.UNLOCKED);
    return raw ? (JSON.parse(raw) as Difficulty[]) : ['novice'];
  }, ['novice']);
}

export function addUnlockedDifficulty(d: Difficulty): boolean {
  return safe(() => {
    const current = getUnlockedDifficulties();
    if (current.includes(d)) return false;
    localStorage.setItem(KEYS.UNLOCKED, JSON.stringify([...current, d]));
    return true;
  }, false);
}

// ── Streak records ───────────────────────────────────────────────────────────

export function getBestStreak(): number {
  return safe(() => parseInt(localStorage.getItem(KEYS.BEST_STREAK) ?? '0', 10), 0);
}

export function updateBestStreak(streak: number): void {
  safe(() => {
    if (streak > getBestStreak()) {
      localStorage.setItem(KEYS.BEST_STREAK, String(streak));
    }
  }, undefined);
}

// ── Personal score history ───────────────────────────────────────────────────

interface ScoreEntry { score: number; ts: number }

export function recordPersonalScore(phenomenonId: string, score: number): void {
  safe(() => {
    const raw = localStorage.getItem(KEYS.SCORES);
    const all: Record<string, ScoreEntry[]> = raw ? JSON.parse(raw) : {};
    if (!all[phenomenonId]) all[phenomenonId] = [];
    all[phenomenonId].push({ score, ts: Date.now() });
    localStorage.setItem(KEYS.SCORES, JSON.stringify(all));
  }, undefined);
}

export function getPersonalBest(phenomenonId: string): number | null {
  return safe(() => {
    const raw = localStorage.getItem(KEYS.SCORES);
    if (!raw) return null;
    const all: Record<string, ScoreEntry[]> = JSON.parse(raw);
    const entries = all[phenomenonId];
    if (!entries?.length) return null;
    return Math.max(...entries.map((e) => e.score));
  }, null);
}
