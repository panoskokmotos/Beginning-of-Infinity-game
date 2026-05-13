'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { ReasoningProfile } from '@/lib/profilePrompt';

interface DiscoverUser {
  id: string;
  name: string | null;
  image_url: string | null;
  avg_reach: number;
  avg_falsifiability: number;
  avg_resilience: number;
  avg_overall: number;
  total_games: number;
  top_thinker: string;
  profile_json: string | null;
}

interface MatchCard {
  user: DiscoverUser;
  matchType: 'complementary' | 'shared' | 'contrarian';
  matchScore: number;
  matchReason: string;
  profile: ReasoningProfile | null;
}

const MATCH_STYLES = {
  complementary: {
    label: 'Complementary',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/5',
    icon: '⇄',
    description: 'Their strength fills your gap',
  },
  shared: {
    label: 'Shared Obsession',
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    icon: '◎',
    description: 'Wrestling the same questions',
  },
  contrarian: {
    label: 'Productive Tension',
    color: 'text-violet-400',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/5',
    icon: '↯',
    description: 'Different lens, similar rigor',
  },
};

const THINKER_COLORS: Record<string, string> = {
  deutsch: 'text-amber-400 border-amber-400/40 bg-amber-400/10',
  naval: 'text-sky-400 border-sky-400/40 bg-sky-400/10',
  popper: 'text-violet-400 border-violet-400/40 bg-violet-400/10',
};

const THINKER_NAMES: Record<string, string> = {
  deutsch: 'David Deutsch',
  naval: 'Naval Ravikant',
  popper: 'Karl Popper',
};

function ScorePip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-base font-bold ${color}`}>{value}</div>
      <div className="text-[10px] text-zinc-500 mt-0.5">{label}</div>
    </div>
  );
}

function CardView({ card, onLike, onSkip, acting }: {
  card: MatchCard;
  onLike: () => void;
  onSkip: () => void;
  acting: boolean;
}) {
  const style = MATCH_STYLES[card.matchType];
  const profile = card.profile;
  const initials = card.user.name
    ? card.user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <div className={`rounded-2xl border ${style.border} ${style.bg} overflow-hidden`}>
      {/* Match type badge */}
      <div className="px-5 pt-5 pb-0 flex items-center gap-2">
        <span className={`text-xs font-semibold ${style.color}`}>{style.icon} {style.label}</span>
        <span className="text-xs text-zinc-500">· {style.description}</span>
        <span className={`ml-auto text-xs font-bold ${style.color}`}>{card.matchScore}%</span>
      </div>

      <div className="p-5 space-y-5">
        {/* User header */}
        <div className="flex items-center gap-4">
          {card.user.image_url ? (
            <img
              src={card.user.image_url}
              alt={card.user.name ?? 'Player'}
              className="w-14 h-14 rounded-full object-cover border border-zinc-700"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl font-bold text-zinc-400">
              {initials}
            </div>
          )}
          <div>
            <p className="font-semibold text-zinc-100">{card.user.name ?? 'Anonymous Thinker'}</p>
            <p className="text-xs text-zinc-500">{card.user.total_games} games played</p>
            <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded border capitalize ${THINKER_COLORS[card.user.top_thinker] ?? ''}`}>
              {THINKER_NAMES[card.user.top_thinker] ?? card.user.top_thinker}
            </span>
          </div>
        </div>

        {/* Match reason */}
        <div className="px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <p className="text-sm text-zinc-300 leading-relaxed">{card.matchReason}</p>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-4 gap-2 px-2">
          <ScorePip label="Reach" value={card.user.avg_reach} color="text-amber-400" />
          <ScorePip label="Falsi" value={card.user.avg_falsifiability} color="text-sky-400" />
          <ScorePip label="Resil" value={card.user.avg_resilience} color="text-violet-400" />
          <ScorePip label="Avg" value={card.user.avg_overall} color="text-zinc-300" />
        </div>

        {/* Profile snippet */}
        {profile && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Style:</span>
              <span className="text-xs text-zinc-300 capitalize font-medium">{profile.style.type}</span>
              <span className="text-xs text-zinc-600">· {profile.style.primaryMode}</span>
            </div>
            {profile.specificKnowledge.emerging.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {profile.specificKnowledge.emerging.slice(0, 3).map((domain, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">
                    {domain}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={onSkip}
            disabled={acting}
            className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:border-zinc-500 hover:text-zinc-200 disabled:opacity-40 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={onLike}
            disabled={acting}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 transition-colors ${
              card.matchType === 'complementary'
                ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                : card.matchType === 'shared'
                ? 'bg-amber-500 text-black hover:bg-amber-400'
                : 'bg-violet-500 text-white hover:bg-violet-400'
            }`}
          >
            Connect →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [cards, setCards] = useState<MatchCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [liked, setLiked] = useState<string[]>([]);
  const [totalCandidates, setTotalCandidates] = useState(0);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/');
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch('/api/discover')
      .then((r) => r.json())
      .then((data) => {
        setCards(data.cards ?? []);
        setTotalCandidates(data.totalCandidates ?? 0);
        setLoading(false);
      });
  }, [isSignedIn]);

  const act = useCallback(async (action: 'like' | 'skip') => {
    const card = cards[currentIndex];
    if (!card) return;
    setActing(true);
    if (action === 'like') setLiked((prev) => [...prev, card.user.id]);
    await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId: card.user.id, action }),
    });
    setCurrentIndex((i) => i + 1);
    setActing(false);
  }, [cards, currentIndex]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 text-sm animate-pulse">Finding your intellectual matches…</div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const done = currentIndex >= cards.length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors">
          ← Crucible
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/profile" className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors">
            Profile
          </Link>
          {cards.length > 0 && (
            <span className="text-xs text-zinc-600">
              {Math.min(currentIndex + 1, cards.length)} / {cards.length}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-100">Discover</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Find thinkers who sharpen you
          </p>
        </div>

        {done ? (
          <div className="text-center space-y-6 py-16">
            {liked.length > 0 ? (
              <>
                <div className="text-4xl">◎</div>
                <div>
                  <p className="text-zinc-100 font-semibold text-lg">
                    You connected with {liked.length} thinker{liked.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">
                    Come back after playing more games — new matches appear as others join.
                  </p>
                </div>
              </>
            ) : totalCandidates === 0 ? (
              <>
                <div className="text-4xl">◈</div>
                <div>
                  <p className="text-zinc-100 font-semibold text-lg">No matches yet</p>
                  <p className="text-sm text-zinc-500 mt-2 max-w-sm mx-auto">
                    The matching pool grows as more players complete games. Share The Crucible to find your intellectual peers.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: 'The Crucible', text: 'Test your explanatory reasoning.', url: window.location.origin });
                    } else {
                      navigator.clipboard.writeText(window.location.origin);
                    }
                  }}
                  className="px-5 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors"
                >
                  Share The Crucible
                </button>
              </>
            ) : (
              <>
                <div className="text-4xl">✓</div>
                <div>
                  <p className="text-zinc-100 font-semibold text-lg">All caught up</p>
                  <p className="text-sm text-zinc-500 mt-1">
                    You've seen all {totalCandidates} candidates. Play more games to refine your profile.
                  </p>
                </div>
              </>
            )}
            <div className="flex gap-3 justify-center pt-4">
              <Link
                href="/"
                className="px-5 py-2.5 rounded-lg bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition-colors"
              >
                Play More Games →
              </Link>
            </div>
          </div>
        ) : currentCard ? (
          <CardView
            card={currentCard}
            onLike={() => act('like')}
            onSkip={() => act('skip')}
            acting={acting}
          />
        ) : null}
      </main>
    </div>
  );
}
