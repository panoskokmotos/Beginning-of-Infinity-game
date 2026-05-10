import { ChallengeResponse } from '@/types/game';

export function parseSSEChunk(chunk: string): ChallengeResponse[] {
  const events: ChallengeResponse[] = [];
  const lines = chunk.split('\n');

  for (const line of lines) {
    if (!line.startsWith('data: ')) continue;
    const raw = line.slice(6).trim();
    if (!raw) continue;
    try {
      events.push(JSON.parse(raw) as ChallengeResponse);
    } catch {
      // Partial chunk — skip
    }
  }

  return events;
}
