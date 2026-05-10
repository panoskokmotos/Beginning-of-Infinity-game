import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CRUCIBLE_SYSTEM_PROMPT, buildUserMessage } from '@/lib/prompts';
import { ChallengeRequest, Score } from '@/types/game';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function extractScore(text: string): Score | null {
  const match = text.match(/```json\n([\s\S]+?)\n```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]) as Score;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ChallengeRequest;
  const { phenomenon, conversationHistory, round, playerExplanation } = body;

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured' },
      { status: 500 }
    );
  }

  const userMessage = buildUserMessage(round, phenomenon, playerExplanation);

  const messages: Anthropic.MessageParam[] = [
    ...conversationHistory.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: object) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        let fullText = '';

        const anthropicStream = client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: round === 4 ? 1500 : 800,
          temperature: 0.7,
          system: CRUCIBLE_SYSTEM_PROMPT,
          messages,
        });

        for await (const event of anthropicStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            const text = event.delta.text;
            fullText += text;
            sendEvent({ type: 'delta', content: text });
          }
        }

        if (round === 4) {
          const score = extractScore(fullText);
          if (score) {
            sendEvent({ type: 'score', score });
          }
        }

        sendEvent({ type: 'done' });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        sendEvent({ type: 'error', error: message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
