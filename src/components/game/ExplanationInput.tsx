'use client';

import { GamePhase } from '@/types/game';
import { formatTime } from '@/lib/useTimer';

interface Props {
  phase: GamePhase;
  round: number;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  timerSecondsLeft?: number | null;
  timerDuration?: number;
}

const PLACEHOLDERS: Record<number, string> = {
  1: 'Propose your explanation for this phenomenon...',
  2: 'Refine your explanation based on the challenge above...',
  3: 'Refine again — make it hard to vary, reach further...',
  4: 'Give your final, best explanation...',
};

const BUTTON_LABELS: Record<number, string> = {
  1: 'Submit to the Crucible',
  2: 'Refine',
  3: 'Refine Again',
  4: 'Submit Final Explanation',
};

function timerColor(left: number, total: number): string {
  const frac = left / total;
  if (frac > 0.5) return 'text-zinc-400';
  if (frac > 0.25) return 'text-amber-400';
  return 'text-red-400';
}

export default function ExplanationInput({
  phase,
  round,
  value,
  onChange,
  onSubmit,
  disabled,
  timerSecondsLeft,
  timerDuration,
}: Props) {
  const isStreaming = phase === 'challenging' || phase === 'scoring';
  const overLimit = value.length > 1000;
  const nearLimit = value.length > 800;
  const showTimer =
    timerSecondsLeft != null &&
    timerSecondsLeft > 0 &&
    !isStreaming;

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !disabled && value.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <textarea
          className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-500/50 focus:outline-none rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 resize-none transition-colors font-mono leading-relaxed disabled:opacity-40"
          rows={4}
          placeholder={
            isStreaming
              ? 'Waiting for The Crucible...'
              : PLACEHOLDERS[round] ?? PLACEHOLDERS[4]
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
        />
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-4">
            <span
              className={[
                'text-xs font-mono transition-colors',
                overLimit
                  ? 'text-red-400'
                  : nearLimit
                  ? 'text-amber-400'
                  : 'text-zinc-600',
              ].join(' ')}
            >
              {value.length}/1000
            </span>
            <span className="text-xs text-zinc-600 font-mono">⌘↵ to submit</span>
            {showTimer && timerDuration && (
              <span
                className={[
                  'text-xs font-mono font-semibold tabular-nums transition-colors',
                  timerColor(timerSecondsLeft!, timerDuration),
                ].join(' ')}
              >
                ⏱ {formatTime(timerSecondsLeft!)}
              </span>
            )}
          </div>
          <button
            onClick={onSubmit}
            disabled={disabled || !value.trim() || overLimit}
            className="px-5 py-2 text-sm font-mono bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 rounded-lg transition-all active:scale-95 disabled:cursor-not-allowed font-semibold"
          >
            {isStreaming ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-zinc-500 border-t-amber-400 rounded-full animate-spin" />
                Challenging…
              </span>
            ) : (
              BUTTON_LABELS[round] ?? BUTTON_LABELS[4]
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
