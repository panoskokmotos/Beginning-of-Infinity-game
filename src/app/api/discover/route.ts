import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import {
  getDiscoverCandidates,
  getActedUserIds,
  getUserStats,
  getUserSessions,
  DiscoverUser,
} from '@/lib/db';
import { ReasoningProfile } from '@/lib/profilePrompt';

export const maxDuration = 15;

type MatchType = 'complementary' | 'shared' | 'contrarian';

interface MatchCard {
  user: DiscoverUser;
  matchType: MatchType;
  matchScore: number;
  matchReason: string;
  profile: ReasoningProfile | null;
}

function weakestDimension(reach: number, falsifiability: number, resilience: number) {
  const min = Math.min(reach, falsifiability, resilience);
  if (min === reach) return { dim: 'reach', label: 'Explanatory Reach', value: min };
  if (min === falsifiability) return { dim: 'falsifiability', label: 'Falsifiability', value: min };
  return { dim: 'resilience', label: 'Resilience', value: min };
}

function strongestDimension(reach: number, falsifiability: number, resilience: number) {
  const max = Math.max(reach, falsifiability, resilience);
  if (max === reach) return { dim: 'reach', label: 'Explanatory Reach', value: max };
  if (max === falsifiability) return { dim: 'falsifiability', label: 'Falsifiability', value: max };
  return { dim: 'resilience', label: 'Resilience', value: max };
}

function thinkerLabel(t: string) {
  return { deutsch: 'David Deutsch', naval: 'Naval Ravikant', popper: 'Karl Popper' }[t] ?? t;
}

export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [myStats, mySessions, candidates, actedIds] = await Promise.all([
    getUserStats(userId),
    getUserSessions(userId),
    getDiscoverCandidates(userId),
    getActedUserIds(userId),
  ]);

  const unseen = candidates.filter((c) => !actedIds.includes(c.id));
  const myPhenomenaSet = new Set(mySessions.map((s) => s.phenomenon_id));

  const myWeak = myStats
    ? weakestDimension(myStats.avg_reach, myStats.avg_falsifiability, myStats.avg_resilience)
    : null;

  const myTopThinker = myStats
    ? (['deutsch', 'naval', 'popper'] as Array<'deutsch' | 'naval' | 'popper'>).sort(
        (a, b) =>
          (myStats[`${b}_games` as keyof typeof myStats] as number) -
          (myStats[`${a}_games` as keyof typeof myStats] as number)
      )[0]
    : null;

  const cards: MatchCard[] = unseen.map((candidate) => {
    const cp = candidate.profile_json ? (JSON.parse(candidate.profile_json) as ReasoningProfile) : null;
    const candStrong = strongestDimension(
      candidate.avg_reach,
      candidate.avg_falsifiability,
      candidate.avg_resilience
    );

    // Complementary: their strength = my weakness
    if (myWeak && candStrong.dim === myWeak.dim && candStrong.value > myWeak.value + 15) {
      return {
        user: candidate,
        matchType: 'complementary',
        matchScore: Math.min(99, candStrong.value - myWeak.value + 50),
        matchReason: `Their ${candStrong.label} (${candStrong.value}) can sharpen your ${myWeak.label} (${myWeak.value})`,
        profile: cp,
      };
    }

    // Shared obsession: overlapping phenomena
    const sharedCount = Array.from(myPhenomenaSet).filter(() =>
      candidate.top_thinker === myTopThinker
    ).length;

    if (candidate.top_thinker === myTopThinker && sharedCount > 0) {
      return {
        user: candidate,
        matchType: 'shared',
        matchScore: Math.min(99, 60 + sharedCount * 5),
        matchReason: `Both obsessed with ${thinkerLabel(candidate.top_thinker)} — likely wrestling the same questions`,
        profile: cp,
      };
    }

    // Contrarian: different thinker, similar caliber
    const caliberDiff = myStats
      ? Math.abs(myStats.avg_overall - candidate.avg_overall)
      : 999;
    return {
      user: candidate,
      matchType: 'contrarian',
      matchScore: Math.max(10, 80 - caliberDiff * 2),
      matchReason: `You favour ${thinkerLabel(myTopThinker ?? 'deutsch')}, they favour ${thinkerLabel(candidate.top_thinker)} — productive tension`,
      profile: cp,
    };
  });

  // Sort: complementary first, then by score
  cards.sort((a, b) => {
    const typeOrder = { complementary: 0, shared: 1, contrarian: 2 };
    const typeDiff = typeOrder[a.matchType] - typeOrder[b.matchType];
    return typeDiff !== 0 ? typeDiff : b.matchScore - a.matchScore;
  });

  return NextResponse.json({ cards: cards.slice(0, 20), totalCandidates: candidates.length });
}
