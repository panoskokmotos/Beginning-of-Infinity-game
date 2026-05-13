'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { ReasoningProfile } from '@/lib/profilePrompt';
import { UserStats, SessionRow } from '@/lib/db';

interface ProfileData {
  profile: { profile_json: string; games_analyzed: number; generated_at: string } | null;
  stats: UserStats | null;
  sessionCount: number;
}

const THINKER_COLORS: Record<string, string> = {
  deutsch: 'text-amber-400 border-amber-400/40 bg-amber-400/10',
  naval: 'text-sky-400 border-sky-400/40 bg-sky-400/10',
  popper: 'text-violet-400 border-violet-400/40 bg-violet-400/10',
};

const STYLE_COLORS: Record<string, string> = {
  empiricist: 'text-emerald-400',
  theorist: 'text-sky-400',
  analogist: 'text-amber-400',
  synthesist: 'text-violet-400',
};

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className={color}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: SessionRow }) {
  const thinkerColor = THINKER_COLORS[session.thinker] ?? 'text-zinc-400 border-zinc-700 bg-zinc-800';
  return (
    <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-zinc-200 font-medium leading-tight">{session.phenomenon_title}</p>
        <span className={`text-xs px-1.5 py-0.5 rounded border shrink-0 ${thinkerColor}`}>
          {session.thinker}
        </span>
      </div>
      <div className="flex gap-3 text-xs text-zinc-500">
        <span>Reach <span className="text-zinc-300">{session.reach}</span></span>
        <span>Falsi <span className="text-zinc-300">{session.falsifiability}</span></span>
        <span>Resil <span className="text-zinc-300">{session.resilience}</span></span>
        <span className="ml-auto text-zinc-400 font-medium">avg {session.avg_score}</span>
      </div>
      {session.growth_edge && (
        <p className="text-xs text-zinc-500 italic border-t border-zinc-800 pt-2">
          "{session.growth_edge}"
        </p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [data, setData] = useState<ProfileData | null>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isSignedIn) return;
    Promise.all([
      fetch('/api/user/profile').then((r) => r.json()),
      fetch('/api/user/sessions').then((r) => r.json()),
    ]).then(([profileData, sessionsData]) => {
      setData(profileData);
      setSessions(sessionsData.sessions ?? []);
      setLoading(false);
    });
  }, [isSignedIn]);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/user/profile/generate', { method: 'POST' });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Failed to generate profile');
      } else {
        const profileRes = await fetch('/api/user/profile');
        setData(await profileRes.json());
      }
    } catch {
      setError('Network error');
    } finally {
      setGenerating(false);
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 text-sm animate-pulse">Loading…</div>
      </div>
    );
  }

  const profile: ReasoningProfile | null = data?.profile
    ? JSON.parse(data.profile.profile_json)
    : null;
  const stats = data?.stats ?? null;
  const sessionCount = data?.sessionCount ?? 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors">
          ← Back to Crucible
        </Link>
        <Link href="/discover" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
          Discover →
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Reasoning Profile</h1>
          <p className="text-sm text-zinc-500 mt-1">{sessionCount} games played</p>
        </div>

        {/* Stats */}
        {stats && (
          <section className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Your Scores</h2>
            <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
              <StatBar label="Explanatory Reach" value={stats.avg_reach} color="text-amber-400" />
              <StatBar label="Falsifiability" value={stats.avg_falsifiability} color="text-sky-400" />
              <StatBar label="Resilience" value={stats.avg_resilience} color="text-violet-400" />
              <div className="pt-2 border-t border-zinc-800">
                <StatBar label="Overall Average" value={stats.avg_overall} color="text-zinc-300" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              {(['deutsch', 'naval', 'popper'] as const).map((t) => (
                <div key={t} className={`p-3 rounded-lg border ${THINKER_COLORS[t]}`}>
                  <div className="text-lg font-bold">{stats[`${t}_games`]}</div>
                  <div className="text-xs capitalize opacity-70">{t}</div>
                </div>
              ))}
            </div>
            {stats.best_streak > 0 && (
              <p className="text-sm text-zinc-400 text-center">
                Best survival streak: <span className="text-emerald-400 font-semibold">{stats.best_streak}</span>
              </p>
            )}
          </section>
        )}

        {/* Profile */}
        {profile ? (
          <>
            {/* Style */}
            <section className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Reasoning Style</h2>
              <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold capitalize ${STYLE_COLORS[profile.style.type] ?? 'text-zinc-100'}`}>
                    {profile.style.type}
                  </span>
                  <span className="text-xs text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded">
                    {profile.style.primaryMode}
                  </span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{profile.style.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Strengths</p>
                    <ul className="space-y-1">
                      {profile.style.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-zinc-300 flex gap-2">
                          <span className="text-emerald-500 shrink-0">+</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Blind Spots</p>
                    <ul className="space-y-1">
                      {profile.style.blindSpots.map((s, i) => (
                        <li key={i} className="text-xs text-zinc-300 flex gap-2">
                          <span className="text-red-500 shrink-0">−</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Thinker affinity */}
            <section className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Thinker Affinity</h2>
              <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded border text-sm font-medium capitalize ${THINKER_COLORS[profile.thinkerAffinity.primary]}`}>
                    {profile.thinkerAffinity.primary === 'deutsch' ? 'David Deutsch' : profile.thinkerAffinity.primary === 'naval' ? 'Naval Ravikant' : 'Karl Popper'}
                  </span>
                  {profile.thinkerAffinity.secondary && (
                    <span className={`px-2 py-1 rounded border text-sm font-medium capitalize opacity-60 ${THINKER_COLORS[profile.thinkerAffinity.secondary]}`}>
                      {profile.thinkerAffinity.secondary === 'deutsch' ? 'David Deutsch' : profile.thinkerAffinity.secondary === 'naval' ? 'Naval Ravikant' : 'Karl Popper'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{profile.thinkerAffinity.explanation}</p>
              </div>
            </section>

            {/* Specific knowledge */}
            <section className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Emerging Knowledge</h2>
              <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {profile.specificKnowledge.emerging.map((domain, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">
                      {domain}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{profile.specificKnowledge.description}</p>
              </div>
            </section>

            {/* Recommendations */}
            <section className="space-y-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Personalized Recommendations</h2>

              {/* Books */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-300">Books</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {profile.recommendations.books.map((b, i) => (
                    <div key={i} className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                      <p className="text-sm font-medium text-zinc-100">{b.title}</p>
                      <p className="text-xs text-zinc-500">{b.author}</p>
                      <p className="text-xs text-zinc-400 mt-1">{b.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Podcasts */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-300">Podcasts</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {profile.recommendations.podcasts.map((p, i) => (
                    <div key={i} className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                      <p className="text-sm font-medium text-zinc-100">{p.name}</p>
                      <p className="text-xs text-zinc-400">{p.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Directions */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-300">Directions to Explore</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {profile.recommendations.directions.map((d, i) => (
                    <div key={i} className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                      <p className="text-sm font-medium text-zinc-100">{d.area}</p>
                      <p className="text-xs text-zinc-400">{d.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next phenomena */}
              {profile.recommendations.phenomena.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-zinc-300">Phenomena to Challenge You Next</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {profile.recommendations.phenomena.map((ph, i) => (
                      <div key={i} className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                        <p className="text-sm font-medium text-zinc-100">{ph.title}</p>
                        <p className="text-xs text-zinc-400">{ph.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Regenerate */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleGenerate}
                disabled={generating || sessionCount < 3}
                className="text-sm px-4 py-2 rounded-lg border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {generating ? 'Regenerating…' : 'Regenerate Profile'}
              </button>
              {data?.profile?.generated_at && (
                <span className="text-xs text-zinc-600">
                  Last updated {new Date(data.profile.generated_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </>
        ) : (
          /* No profile yet */
          <section className="p-8 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-4">
            {sessionCount < 3 ? (
              <>
                <p className="text-zinc-300">Play at least <span className="text-amber-400 font-semibold">3 games</span> to unlock your reasoning profile.</p>
                <p className="text-sm text-zinc-500">{sessionCount} / 3 completed</p>
                <Link
                  href="/"
                  className="inline-block mt-2 px-5 py-2 rounded-lg bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition-colors"
                >
                  Play Now →
                </Link>
              </>
            ) : (
              <>
                <p className="text-zinc-300">
                  You've played <span className="text-amber-400 font-semibold">{sessionCount} games</span>.
                  Generate your reasoning profile to see your thinking style, thinker affinities, and personalized recommendations.
                </p>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="mt-2 px-6 py-2.5 rounded-lg bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {generating ? 'Analyzing your games…' : 'Generate My Profile'}
                </button>
              </>
            )}
          </section>
        )}

        {/* Game history */}
        {sessions.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Recent Games</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {sessions.slice(0, 10).map((s) => (
                <SessionCard key={s.id} session={s} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
