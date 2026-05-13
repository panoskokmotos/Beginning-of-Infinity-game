import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { saveSession, getUserSessions, upsertUser } from '@/lib/db';

export const maxDuration = 15;

export async function POST(request: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await currentUser();
  if (user) {
    await upsertUser(
      userId,
      user.emailAddresses[0]?.emailAddress ?? '',
      user.fullName,
      user.imageUrl
    );
  }

  const body = await request.json();
  await saveSession({
    user_id: userId,
    phenomenon_id: body.phenomenonId,
    phenomenon_title: body.phenomenonTitle,
    difficulty: body.difficulty,
    thinker: body.thinker,
    mode: body.mode,
    reach: body.reach,
    falsifiability: body.falsifiability,
    resilience: body.resilience,
    avg_score: body.avgScore,
    verdict: body.verdict ?? null,
    best_moment: body.bestMoment ?? null,
    growth_edge: body.growthEdge ?? null,
    initial_explanation: body.initialExplanation ?? null,
    final_explanation: body.finalExplanation ?? null,
    survival_streak: body.survivalStreak ?? 0,
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sessions = await getUserSessions(userId);
  return NextResponse.json({ sessions });
}
