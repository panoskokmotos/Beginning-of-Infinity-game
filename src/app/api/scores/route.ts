import { NextRequest, NextResponse } from 'next/server';
import { Difficulty } from '@/types/game';

export const maxDuration = 10;

// Module-level in-memory store — persists within a warm serverless instance.
// Seeded with synthetic scores so first players see realistic percentiles.
const store = new Map<string, number[]>();

const BASELINES: Record<Difficulty, { mean: number; std: number; n: number }> = {
  novice: { mean: 58, std: 14, n: 80 },
  adept:  { mean: 49, std: 15, n: 80 },
  master: { mean: 41, std: 14, n: 80 },
};

function normalRandom(mean: number, std: number): number {
  // Box-Muller
  const u1 = Math.random() || 1e-10;
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return Math.max(0, Math.min(100, Math.round(mean + std * z)));
}

function getOrSeed(id: string, difficulty: Difficulty): number[] {
  if (!store.has(id)) {
    const { mean, std, n } = BASELINES[difficulty];
    store.set(id, Array.from({ length: n }, () => normalRandom(mean, std)));
  }
  return store.get(id)!;
}

function percentile(score: number, scores: number[]): number {
  const below = scores.filter((s) => s < score).length;
  return Math.round((below / scores.length) * 100);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    phenomenonId: string;
    score: number;
    difficulty: Difficulty;
  };

  const scores = getOrSeed(body.phenomenonId, body.difficulty);
  const pct = percentile(body.score, scores);
  scores.push(body.score); // record after computing percentile

  return NextResponse.json({ percentile: pct, totalPlayers: scores.length });
}
