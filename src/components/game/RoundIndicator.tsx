'use client';

import { GamePhase } from '@/types/game';

interface Props {
  currentRound: number;
  phase: GamePhase;
}

const ROUNDS = [
  { n: 1, label: 'Propose' },
  { n: 2, label: 'Refine' },
  { n: 3, label: 'Refine' },
  { n: 4, label: 'Final' },
];

export default function RoundIndicator({ currentRound, phase }: Props) {
  const isStreaming = phase === 'challenging' || phase === 'scoring';

  return (
    <div className="flex items-center gap-0 w-full max-w-xs mx-auto">
      {ROUNDS.map((r, i) => {
        const done = r.n < currentRound || phase === 'scored';
        const active = r.n === currentRound;
        const future = r.n > currentRound && phase !== 'scored';

        return (
          <div key={r.n} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={[
                  'w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold transition-all duration-500',
                  done
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                    : active && isStreaming
                    ? 'border-amber-400 bg-amber-400/20 text-amber-300 animate-pulse'
                    : active
                    ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                    : 'border-zinc-700 bg-zinc-800/50 text-zinc-600',
                ].join(' ')}
              >
                {done ? '✓' : r.n}
              </div>
              <span
                className={[
                  'text-[10px] font-mono mt-1 transition-colors duration-300',
                  done
                    ? 'text-emerald-500/70'
                    : active
                    ? 'text-amber-400/80'
                    : 'text-zinc-600',
                ].join(' ')}
              >
                {r.label}
              </span>
            </div>
            {i < ROUNDS.length - 1 && (
              <div
                className={[
                  'flex-1 h-px mx-1 transition-colors duration-500',
                  done ? 'bg-emerald-500/40' : 'bg-zinc-700',
                ].join(' ')}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
