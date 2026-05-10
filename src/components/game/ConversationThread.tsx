'use client';

import { useEffect, useRef } from 'react';
import { Message, GamePhase } from '@/types/game';
import MessageBubble from './MessageBubble';

interface Props {
  messages: Message[];
  phase: GamePhase;
  streamingContent: string;
  currentRound: number;
}

export default function ConversationThread({
  messages,
  phase,
  streamingContent,
  currentRound,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const isStreaming = phase === 'challenging' || phase === 'scoring';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm font-mono">
        Your explanation will appear here.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="max-w-3xl mx-auto">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isStreaming && (
          <MessageBubble
            isStreaming
            streamingContent={streamingContent}
            round={currentRound}
          />
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
