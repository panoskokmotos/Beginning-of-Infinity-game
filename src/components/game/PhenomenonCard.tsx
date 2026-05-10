'use client';

import { Phenomenon } from '@/types/game';

interface Props {
  phenomenon: Phenomenon;
  compact?: boolean;
}

export default function PhenomenonCard({ phenomenon, compact }: Props) {
  return (
    <div className="border border-amber-500/40 bg-zinc-900 rounded-xl p-5 shadow-lg shadow-amber-900/10">
      <div className="flex items-start gap-3">
        <span className="text-amber-400 text-xl mt-0.5">◈</span>
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-500/70 font-mono mb-2">
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
