import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { recordMatchAction } from '@/lib/db';

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { targetUserId, action } = body as { targetUserId: string; action: 'like' | 'skip' };

  if (!targetUserId || !['like', 'skip'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  await recordMatchAction(userId, targetUserId, action);

  return NextResponse.json({ ok: true });
}
