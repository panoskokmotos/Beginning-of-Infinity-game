import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getProfile, getUserStats, getUserSessions } from '@/lib/db';

export const maxDuration = 10;

export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [profile, stats, sessions] = await Promise.all([
    getProfile(userId),
    getUserStats(userId),
    getUserSessions(userId),
  ]);

  return NextResponse.json({ profile, stats, sessionCount: sessions.length });
}
