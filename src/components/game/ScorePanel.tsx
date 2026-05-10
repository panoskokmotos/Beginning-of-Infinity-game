'use client';

import { useEffect, useState } from 'react';
import { Score, Phenomenon } from '@/types/game';

interface Props {
  score: Score;
  phenomenon: Phenomenon;
  onNewGame: () => void;
}

function ScoreBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const color =
    value >= 71 ? 'bg-emerald-500' : value >= 41 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
          {label}
        </span>
        <span
          className={[
            'text-sm font-mono font-bold',
            value >= 71
              ? 'text-emerald-400'
              : value >= 41
              ? 'text-amber-400'
              : 'text-red-400',
          ].join(' ')}
        >
          {displayed}
        </span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${displayed}%` }}
        />
      </div>
    </div>
  );
}

export default function ScorePanel({ score, phenomenon, onNewGame }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={[
        'fixed inset-0 z-50 flex items-end justify-center transition-all duration-500',
        visible ? 'bg-black/60' : 'bg-transparent',
      ].join(' ')}
    >
      <div
        className={[
          'w-full max-w-3xl bg-zinc-900 border-t border-zinc-700 rounded-t-2xl px-6 py-6 shadow-2xl transition-transform duration-500',
          visible ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
        style={{ maxHeight: '85vh', overflowY: 'auto' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-mono text-amber-500/70 uppercase tracking-widest mb-1">
              Assessment Complete
            </p>
            <h3 className="text-lg font-serif text-zinc-100">
              {phenomenon.title}
            </h3>
          </div>
          <span className="text-amber-400 text-2xl">◈</span>
        </div>

        <ScoreBar label="Explanatory Reach" value={score.reach} delay={100} />
        <ScoreBar label="Falsifiability" value={score.falsifiability} delay={300} />
        <ScoreBar label="Resilience / Hard to Vary" value={score.resilience} delay={500} />

        <div className="mt-6 mb-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <p className="text-sm text-zinc-300 leading-relaxed">{score.verdict}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-lg">
            <p className="text-xs font-mono text-emerald-500/70 uppercase tracking-wider mb-1">
              Best Moment
            </p>
            <p className="text-xs text-zinc-300 leading-relaxed">{score.bestMoment}</p>
          </div>
          <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-lg">
            <p className="text-xs font-mono text-amber-500/70 uppercase tracking-wider mb-1">
              Growth Edge
            </p>
            <p className="text-xs text-zinc-300 leading-relaxed">{score.growthEdge}</p>
          </div>
        </div>

        <button
          onClick={onNewGame}
          className="w-full py-3 font-mono text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg transition-all active:scale-95"
        >
          Enter a New Crucible →
        </button>
      </div>
    </div>
  );
}
