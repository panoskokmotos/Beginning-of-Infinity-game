import { Difficulty, Score } from '@/types/game';

export function getTimerDuration(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'novice': return 300; // 5 min
    case 'adept':  return 210; // 3.5 min
    case 'master': return 150; // 2.5 min
  }
}

export function getPassThreshold(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'novice': return 40;
    case 'adept':  return 50;
    case 'master': return 60;
  }
}

export function averageScore(score: Score): number {
  return Math.round((score.reach + score.falsifiability + score.resilience) / 3);
}

export const ADEPT_UNLOCK_THRESHOLD = 55;
export const MASTER_UNLOCK_THRESHOLD = 65;

export function getDifficultyLabel(d: Difficulty): string {
  return { novice: 'Novice', adept: 'Adept', master: 'Master' }[d];
}

export function getDifficultyBadgeClass(d: Difficulty): string {
  return {
    novice: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    adept:  'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    master: 'bg-red-500/20 text-red-400 border border-red-500/30',
  }[d];
}

export function getDifficultyDotClass(d: Difficulty): string {
  return {
    novice: 'bg-emerald-400',
    adept:  'bg-amber-400',
    master: 'bg-red-400',
  }[d];
}
