'use client';

import { Phenomenon } from '@/types/game';
import { THINKER_PROFILES } from '@/lib/thinkers';

interface Props {
  phenomenon: Phenomenon;
  compact?: boolean;
}

export default function PhenomenonCard({ phenomenon, compact }: Props) {
  const profile = THINKER_PROFILES[phenomenon.thinker];

  return (
    <div
      className={`border ${profile.borderColor} bg-zinc-900 rounded-xl p-5 shadow-lg`}
    >
      <div className="flex items-start gap-3">
        <span className={`text-xl mt-0.5 ${profile.accentColor}`}>
          {profile.symbol}
        </span>
        <div>
          <p className={`text-xs uppercase tracking-widest font-mono mb-2 ${profile.accentColor} opacity-70`}>
            Phenomenon
          </p>
          <h2 className="text-xl font-serif text-zinc-100 leading-snug mb-3">
            {phenomenon.title}
          </h2>
          {!compact && (
            <p className="text-sm text-zinc-400 leading-relaxed">
              {phenomenon.prompt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
