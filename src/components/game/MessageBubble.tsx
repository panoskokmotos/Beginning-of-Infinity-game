'use client';

import { Message } from '@/types/game';

interface Props {
  message?: Message;
  isStreaming?: boolean;
  streamingContent?: string;
  round?: number;
}

export default function MessageBubble({
  message,
  isStreaming,
  streamingContent,
  round,
}: Props) {
  const isAi = isStreaming || message?.role === 'ai';
  const content = isStreaming ? streamingContent : message?.content ?? '';
  const roundNum = round ?? message?.round ?? 1;

  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={[
          'max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed relative',
          isAi
            ? [
                'bg-zinc-900 text-zinc-300 border-l-2',
                isStreaming
                  ? 'border-amber-400 animate-pulse-border'
                  : 'border-amber-600/40',
              ].join(' ')
            : 'bg-zinc-700 text-zinc-100 ml-auto',
        ].join(' ')}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className={[
              'text-[10px] font-mono uppercase tracking-widest',
              isAi ? 'text-amber-500/60' : 'text-zinc-400',
            ].join(' ')}
          >
            {isAi ? 'The Crucible' : 'You'}
          </span>
          <span className="text-[10px] font-mono text-zinc-600">
            Round {roundNum}
          </span>
        </div>
        <div className="whitespace-pre-wrap">
          {content}
          {isStreaming && (
            <span className="inline-block w-0.5 h-4 bg-amber-400 ml-0.5 align-middle animate-blink" />
          )}
        </div>
      </div>
    </div>
  );
}
