'use client';

import { useEffect, useState } from 'react';
import { Score, Phenomenon, GameMode } from '@/types/game';
import { averageScore, getPassThreshold, getDifficultyLabel } from '@/lib/gameConfig';
import { getBestStreak } from '@/lib/gameStorage';

interface Props {
  score: Score;
  phenomenon: Phenomenon;
  mode: GameMode;
  survivalStreak: number;
  onNewGame: () => void;
  onSurvivalContinue: () => void;
  percentile: number | null;
  totalPlayers: number | null;
}

function ScoreBar({
  label,
  value,
  delay,
}: {
  label: string;
  value: number;
  delay: number;
}) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDisplayed(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  const color =
    value >= 71 ? 'bg-emerald-500' : value >= 41 ? 'bg-amber-500' : 'bg-red-500';
  const textColor =
    value >= 71 ? 'text-emerald-400' : value >= 41 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
          {label}
        </span>
        <span className={`text-sm font-mono font-bold ${textColor}`}>{displayed}</span>
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

export default function ScorePanel({
  score,
  phenomenon,
  mode,
  survivalStreak,
  onNewGame,
  onSurvivalContinue,
  percentile,
  totalPlayers,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const avg = averageScore(score);
  const threshold = getPassThreshold(phenomenon.difficulty);
  const passed = avg >= threshold;
  const bestStreak = getBestStreak();

  return (
    <div
      className={[
        'fixed inset-0 z-50 flex items-end justify-center transition-all duration-500',
        visible ? 'bg-black/70' : 'bg-transparent',
      ].join(' ')}
    >
      <div
        className={[
          'w-full max-w-3xl bg-zinc-900 border-t border-zinc-700 rounded-t-2xl px-6 py-6 shadow-2xl transition-transform duration-500',
          visible ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs font-mono text-amber-500/70 uppercase tracking-widest mb-1">
              Assessment Complete
            </p>
            <h3 className="text-lg font-serif text-zinc-100 leading-snug">
              {phenomenon.title}
            </h3>
          </div>
          <span className="text-amber-400 text-2xl ml-4 flex-shrink-0">◈</span>
        </div>

        {/* Survival result banner */}
        {mode === 'survival' && (
          <div
            className={[
              'rounded-lg px-4 py-3 mb-5 flex items-center justify-between',
              passed
                ? 'bg-emerald-950/60 border border-emerald-700/50'
                : 'bg-red-950/60 border border-red-700/50',
            ].join(' ')}
          >
            <div>
              <p
                className={`text-xs font-mono uppercase tracking-widest font-bold mb-0.5 ${
                  passed ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {passed ? '✓ Passed' : '✗ Run Ended'}
              </p>
              <p className="text-xs text-zinc-400 font-mono">
                {passed
                  ? `Streak: ${survivalStreak} round${survivalStreak !== 1 ? 's' : ''}`
                  : `Survived ${survivalStreak - 1} round${survivalStreak - 1 !== 1 ? 's' : ''} · Best: ${bestStreak}`}
              </p>
              <p className="text-xs text-zinc-600 font-mono mt-0.5">
                Threshold for {getDifficultyLabel(phenomenon.difficulty)}: avg ≥ {threshold}
                {' · '}Your avg: {avg}
              </p>
            </div>
            {passed && (
              <span className="text-2xl text-emerald-400 ml-4">🔥</span>
            )}
          </div>
        )}

        {/* Score bars */}
        <ScoreBar label="Explanatory Reach" value={score.reach} delay={100} />
        <ScoreBar label="Falsifiability" value={score.falsifiability} delay={300} />
        <ScoreBar label="Resilience / Hard to Vary" value={score.resilience} delay={500} />

        {/* Comparative score */}
        <div className="mt-1 mb-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-800" />
          {percentile !== null && totalPlayers !== null ? (
            <p className="text-xs font-mono text-zinc-500 whitespace-nowrap">
              Better than{' '}
              <span className="text-zinc-300 font-semibold">{percentile}%</span>
              {' '}of {totalPlayers} players
            </p>
          ) : (
            <p className="text-xs font-mono text-zinc-700">Computing percentile…</p>
          )}
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Verdict */}
        <div className="mb-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <p className="text-sm text-zinc-300 leading-relaxed">{score.verdict}</p>
        </div>

        {/* Best / Growth */}
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

        {/* Actions */}
        {mode === 'survival' ? (
          <div className="flex flex-col sm:flex-row gap-3">
            {passed ? (
              <button
                onClick={onSurvivalContinue}
                className="flex-1 py-3 font-mono text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all active:scale-95"
              >
                Continue Run → (Streak: {survivalStreak})
              </button>
            ) : (
              <button
                onClick={onSurvivalContinue}
                className="flex-1 py-3 font-mono text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg transition-all active:scale-95"
              >
                Try Again →
              </button>
            )}
            <button
              onClick={onNewGame}
              className="px-5 py-3 font-mono text-sm text-zinc-500 hover:text-zinc-300 border border-zinc-700 rounded-lg transition-all"
            >
              Back to Menu
            </button>
          </div>
        ) : (
          <button
            onClick={onNewGame}
            className="w-full py-3 font-mono text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg transition-all active:scale-95"
          >
            Enter a New Crucible →
          </button>
        )}
      </div>
    </div>
  );
}
