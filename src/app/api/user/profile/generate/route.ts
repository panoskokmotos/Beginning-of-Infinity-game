import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getUserSessions, upsertProfile } from '@/lib/db';
import { buildProfilePrompt } from '@/lib/profilePrompt';

export const maxDuration = 60;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sessions = await getUserSessions(userId);
  if (sessions.length < 3) {
    return NextResponse.json(
      { error: 'Need at least 3 completed games to generate a profile' },
      { status: 400 }
    );
  }

  const prompt = buildProfilePrompt(sessions);

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].type === 'text' ? message.content[0].text : '';

  // Strip markdown code fences if Claude added them
  const jsonStr = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

  let parsed: object;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    return NextResponse.json({ error: 'Profile generation failed — invalid JSON from model' }, { status: 500 });
  }

  await upsertProfile(userId, JSON.stringify(parsed), sessions.length);

  return NextResponse.json({ profile: parsed, gamesAnalyzed: sessions.length });
}
