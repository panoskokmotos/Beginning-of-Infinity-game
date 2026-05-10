'use client';

import { useReducer, useCallback, useState, useEffect, useRef } from 'react';
import { gameReducer, initialState } from '@/lib/gameReducer';
import { PHENOMENA, getRandomPhenomenon, getUnlockedPhenomena } from '@/lib/phenomena';
import { THINKER_PROFILES, THINKERS_ORDER } from '@/lib/thinkers';
import { parseSSEChunk } from '@/lib/streamParser';
import { useTimer, formatTime } from '@/lib/useTimer';
import {
  getTimerDuration,
  getPassThreshold,
  averageScore,
  getDifficultyLabel,
  getDifficultyBadgeClass,
  getDifficultyDotClass,
  ADEPT_UNLOCK_THRESHOLD,
  MASTER_UNLOCK_THRESHOLD,
} from '@/lib/gameConfig';
import {
  getUnlockedDifficulties,
  addUnlockedDifficulty,
  getBestStreak,
  updateBestStreak,
  recordPersonalScore,
  getPersonalBest,
} from '@/lib/gameStorage';
import {
  ChallengeRequest,
  Difficulty,
  GameMode,
  Phenomenon,
  Thinker,
} from '@/types/game';
import PhenomenonCard from './PhenomenonCard';
import RoundIndicator from './RoundIndicator';
import ConversationThread from './ConversationThread';
import ExplanationInput from './ExplanationInput';
import ScorePanel from './ScorePanel';

// ── Filter tabs ───────────────────────────────────────────────────────────────

const THINKER_TABS: Array<{ id: Thinker | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'deutsch', label: 'Deutsch' },
  { id: 'naval', label: 'Naval' },
  { id: 'popper', label: 'Popper' },
];

const DIFFICULTY_TABS: Array<{ id: Difficulty | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'novice', label: 'Novice' },
  { id: 'adept', label: 'Adept' },
  { id: 'master', label: 'Master' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function filterPhenomena(
  thinker: Thinker | 'all',
  difficulty: Difficulty | 'all'
): Phenomenon[] {
  return PHENOMENA.filter(
    (p) =>
      (thinker === 'all' || p.thinker === thinker) &&
      (difficulty === 'all' || p.difficulty === difficulty)
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function GameShell() {
  const [state, dispatch] = useReducer(
    gameReducer,
    getRandomPhenomenon(),
    initialState
  );

  // ── Landing page filters ────────────────────────────────────────────────
  const [activeThinker, setActiveThinker] = useState<Thinker | 'all'>('all');
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | 'all'>('all');

  // ── Mode & survival state ──────────────────────────────────────────────
  const [mode, setMode] = useState<GameMode>('practice');
  const [survivalStreak, setSurvivalStreak] = useState(0);
  const survivalStreakRef = useRef(0);
  useEffect(() => { survivalStreakRef.current = survivalStreak; }, [survivalStreak]);

  // ── Unlock state (from localStorage) ──────────────────────────────────
  const [unlocked, setUnlocked] = useState<Difficulty[]>(['novice']);
  const [newUnlock, setNewUnlock] = useState<Difficulty | null>(null);
  useEffect(() => {
    setUnlocked(getUnlockedDifficulties());
  }, []);

  // ── Comparative score state ────────────────────────────────────────────
  const [percentile, setPercentile] = useState<number | null>(null);
  const [totalPlayers, setTotalPlayers] = useState<number | null>(null);

  // ── Timer ──────────────────────────────────────────────────────────────
  const currentTimerDuration = state.phenomenon
    ? getTimerDuration(state.phenomenon.difficulty)
    : 300;

  // ── fetchChallenge ──────────────────────────────────────────────────────
  const fetchChallenge = useCallback(
    async (round: number, playerExplanation: string) => {
      if (!state.phenomenon) return;

      const conversationHistory = state.messages.map((m) => ({
        role: m.role === 'player' ? ('user' as const) : ('assistant' as const),
        content: m.content,
      }));

      const body: ChallengeRequest = {
        phenomenon: state.phenomenon,
        conversationHistory,
        round,
        playerExplanation,
      };

      try {
        const res = await fetch('/api/challenge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.body) throw new Error('No response body');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = parseSSEChunk(buffer);
          buffer = '';

          for (const event of events) {
            if (event.type === 'delta' && event.content) {
              fullContent += event.content;
              dispatch({ type: 'STREAM_DELTA', content: event.content });
            } else if (event.type === 'score' && event.score) {
              dispatch({ type: 'SCORE_RECEIVED', score: event.score });
            } else if (event.type === 'done') {
              dispatch({ type: 'STREAM_COMPLETE', finalContent: fullContent });
            } else if (event.type === 'error' && event.error) {
              dispatch({ type: 'STREAM_ERROR', error: event.error });
            }
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Connection error';
        dispatch({ type: 'STREAM_ERROR', error: message });
      }
    },
    [state.phenomenon, state.messages]
  );

  // ── Timer setup ────────────────────────────────────────────────────────
  const forcedSubmitRef = useRef<{ round: number; content: string } | null>(null);

  const handleTimerExpireWithFetch = useCallback(() => {
    if (state.phase !== 'explaining' && state.phase !== 'refining') return;
    const content = state.currentInput.trim() || '[Time expired — no explanation submitted]';
    const round = state.currentRound;
    forcedSubmitRef.current = { round, content };
    dispatch({ type: 'FORCE_SUBMIT', content });
  }, [state.phase, state.currentInput, state.currentRound]);

  const { start: startTimer2, stop: stopTimer2, secondsLeft: timerSecs2 } = useTimer(handleTimerExpireWithFetch);

  // After FORCE_SUBMIT, fetch the challenge
  useEffect(() => {
    if (!forcedSubmitRef.current) return;
    if (state.phase !== 'challenging' && state.phase !== 'scoring') return;
    const { round, content } = forcedSubmitRef.current;
    forcedSubmitRef.current = null;
    fetchChallenge(round, content);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  // ── Post-scoring effects: unlock, comparative score, streak ───────────
  useEffect(() => {
    if (state.phase !== 'scored' || !state.score || !state.phenomenon) return;

    const avg = averageScore(state.score);
    const { difficulty, id } = state.phenomenon;

    // Record score locally
    recordPersonalScore(id, avg);

    // Check for new difficulty unlocks
    if (difficulty === 'novice' && avg >= ADEPT_UNLOCK_THRESHOLD) {
      const didUnlock = addUnlockedDifficulty('adept');
      if (didUnlock) {
        setUnlocked(getUnlockedDifficulties());
        setNewUnlock('adept');
        setTimeout(() => setNewUnlock(null), 4000);
      }
    }
    if (difficulty === 'adept' && avg >= MASTER_UNLOCK_THRESHOLD) {
      const didUnlock = addUnlockedDifficulty('master');
      if (didUnlock) {
        setUnlocked(getUnlockedDifficulties());
        setNewUnlock('master');
        setTimeout(() => setNewUnlock(null), 4000);
      }
    }

    // Survival streak update
    if (mode === 'survival') {
      const passed = avg >= getPassThreshold(difficulty);
      if (passed) {
        const newStreak = survivalStreakRef.current + 1;
        setSurvivalStreak(newStreak);
        updateBestStreak(newStreak);
      }
    }

    // Fetch comparative percentile
    setPercentile(null);
    setTotalPlayers(null);
    fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phenomenonId: id, score: avg, difficulty }),
    })
      .then((r) => r.json())
      .then(({ percentile: pct, totalPlayers: total }) => {
        setPercentile(pct);
        setTotalPlayers(total);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  // ── Action handlers ────────────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    if (!state.currentInput.trim()) return;
    const round = state.currentRound;
    const explanation = state.currentInput.trim();
    dispatch({ type: 'SUBMIT_EXPLANATION' });
    fetchChallenge(round, explanation);
  }, [state.currentInput, state.currentRound, fetchChallenge]);

  const handleNewGame = useCallback(() => {
    setSurvivalStreak(0);
    const next = getRandomPhenomenon(state.phenomenon?.id);
    dispatch({ type: 'RESET_GAME', phenomenon: next });
  }, [state.phenomenon]);

  const handleSurvivalContinue = useCallback(() => {
    if (!state.score || !state.phenomenon) return;
    const avg = averageScore(state.score);
    const passed = avg >= getPassThreshold(state.phenomenon.difficulty);

    if (passed) {
      // Pick next random phenomenon from unlocked pool
      const next = getRandomPhenomenon(state.phenomenon.id, getUnlockedDifficulties());
      dispatch({ type: 'RESET_GAME', phenomenon: next });
      setTimeout(() => dispatch({ type: 'START_GAME', phenomenon: next }), 0);
    } else {
      // Run failed: reset streak and go back to landing
      setSurvivalStreak(0);
      const next = getRandomPhenomenon(state.phenomenon.id, ['novice']);
      dispatch({ type: 'RESET_GAME', phenomenon: next });
    }
  }, [state.score, state.phenomenon]);

  const selectPhenomenon = useCallback(
    (p: Phenomenon) => {
      if (p.id !== state.phenomenon?.id) {
        dispatch({ type: 'RESET_GAME', phenomenon: p });
      }
    },
    [state.phenomenon?.id]
  );

  const startSurvival = useCallback(() => {
    setSurvivalStreak(0);
    setMode('survival');
    const next = getRandomPhenomenon(undefined, getUnlockedDifficulties());
    dispatch({ type: 'RESET_GAME', phenomenon: next });
    setTimeout(() => dispatch({ type: 'START_GAME', phenomenon: next }), 0);
  }, []);

  const startPractice = useCallback(() => {
    if (!state.phenomenon) return;
    setMode('practice');
    dispatch({ type: 'START_GAME', phenomenon: state.phenomenon });
  }, [state.phenomenon]);

  const isStreaming = state.phase === 'challenging' || state.phase === 'scoring';
  const inputDisabled = isStreaming || state.phase === 'idle' || state.phase === 'scored';
  const filteredPhenomena = filterPhenomena(activeThinker, activeDifficulty);

  // ── Landing screen ──────────────────────────────────────────────────────────
  if (state.phase === 'idle') {
    const bestStreak = getBestStreak();

    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col">
        {/* New unlock toast */}
        {newUnlock && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-mono text-sm px-5 py-3 rounded-xl shadow-xl animate-pulse">
            🔓 {getDifficultyLabel(newUnlock)} difficulty unlocked!
          </div>
        )}

        {/* Hero */}
        <div className="border-b border-zinc-800/60 px-6 py-8">
          <div className="max-w-5xl mx-auto flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="text-amber-400 text-3xl mb-3">◈</div>
              <h1 className="text-4xl font-serif text-zinc-100 mb-2">The Crucible</h1>
              <p className="text-zinc-500 text-sm font-mono leading-relaxed max-w-lg">
                Propose an explanation. Defend it against adversarial Socratic
                challenge. Watch it break — or become something real.
              </p>
            </div>
            {bestStreak > 0 && (
              <div className="text-right">
                <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-1">Best Streak</p>
                <p className="text-3xl font-serif text-amber-400">{bestStreak}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* ── Left: filters + list ─────────────────────────────────── */}
            <div className="lg:w-64 flex-shrink-0">
              {/* Thinker filter */}
              <p className="text-xs uppercase tracking-widest text-zinc-600 font-mono mb-2">
                Thinker
              </p>
              <div className="flex flex-wrap gap-1 mb-4">
                {THINKER_TABS.map((tab) => {
                  const active = activeThinker === tab.id;
                  const profile = tab.id !== 'all' ? THINKER_PROFILES[tab.id] : null;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveThinker(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        active
                          ? profile
                            ? profile.tabActive
                            : 'bg-zinc-800 text-zinc-100 border border-zinc-600'
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      {profile && <span className="mr-1">{profile.symbol}</span>}
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Difficulty filter */}
              <p className="text-xs uppercase tracking-widest text-zinc-600 font-mono mb-2">
                Difficulty
              </p>
              <div className="flex flex-wrap gap-1 mb-5">
                {DIFFICULTY_TABS.map((tab) => {
                  const active = activeDifficulty === tab.id;
                  const locked = tab.id !== 'all' && !unlocked.includes(tab.id as Difficulty);
                  const dotClass = tab.id !== 'all' ? getDifficultyDotClass(tab.id as Difficulty) : '';
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveDifficulty(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                        locked
                          ? 'text-zinc-700 cursor-not-allowed'
                          : active
                          ? 'bg-zinc-800 text-zinc-100 border border-zinc-600'
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      {tab.id !== 'all' && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            locked ? 'bg-zinc-700' : dotClass
                          }`}
                        />
                      )}
                      {tab.label}
                      {locked && <span className="text-zinc-700">🔒</span>}
                    </button>
                  );
                })}
              </div>

              {/* Phenomenon list */}
              <p className="text-xs uppercase tracking-widest text-zinc-600 font-mono mb-2">
                Phenomena ({filteredPhenomena.length})
              </p>
              <div className="flex flex-col gap-0.5 max-h-96 overflow-y-auto pr-1">
                {filteredPhenomena.map((p) => {
                  const isSelected = state.phenomenon?.id === p.id;
                  const isLocked = !unlocked.includes(p.difficulty);
                  const profile = THINKER_PROFILES[p.thinker];
                  const dotClass = getDifficultyDotClass(p.difficulty);
                  return (
                    <button
                      key={p.id}
                      onClick={() => !isLocked && selectPhenomenon(p)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg transition-all group ${
                        isLocked
                          ? 'text-zinc-700 cursor-not-allowed opacity-50'
                          : isSelected
                          ? `${profile.bgColor} ${profile.accentColor} border ${profile.borderColor}`
                          : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-start gap-1.5">
                        <span
                          className={`text-xs mt-0.5 flex-shrink-0 ${
                            isSelected ? profile.accentColor : 'text-zinc-700'
                          }`}
                        >
                          {isLocked ? '🔒' : profile.symbol}
                        </span>
                        <span className="text-xs font-mono leading-snug line-clamp-2">
                          {p.title}
                        </span>
                      </div>
                      {!isLocked && (
                        <div className="flex items-center gap-1 mt-1 ml-5">
                          <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                          <span className="text-[10px] font-mono text-zinc-700">
                            {getDifficultyLabel(p.difficulty)}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Right: selected phenomenon + mode + CTA ──────────────── */}
            <div className="flex-1 min-w-0">
              {state.phenomenon && (
                <>
                  <PhenomenonCard phenomenon={state.phenomenon} />

                  {/* Seed facts */}
                  <div className="mt-4 border border-zinc-800 rounded-xl px-4 py-4">
                    <p className="text-xs uppercase tracking-widest text-zinc-600 font-mono mb-3">
                      Context clues
                    </p>
                    <ul className="space-y-1.5">
                      {state.phenomenon.seedFacts.map((fact, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-zinc-700 font-mono text-xs mt-0.5">—</span>
                          <span className="text-xs text-zinc-500 font-mono leading-relaxed">
                            {fact}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Metadata row */}
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                        THINKER_PROFILES[state.phenomenon.thinker].badgeBg
                      }`}
                    >
                      {THINKER_PROFILES[state.phenomenon.thinker].symbol}{' '}
                      {THINKER_PROFILES[state.phenomenon.thinker].name}
                    </span>
                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded-full ${getDifficultyBadgeClass(
                        state.phenomenon.difficulty
                      )}`}
                    >
                      {getDifficultyLabel(state.phenomenon.difficulty)}
                    </span>
                    {(() => {
                      const pb = getPersonalBest(state.phenomenon.id);
                      return pb !== null ? (
                        <span className="text-xs font-mono text-zinc-600">
                          Your best: <span className="text-zinc-400">{pb}</span>
                        </span>
                      ) : null;
                    })()}
                  </div>

                  {/* ── Mode selector ── */}
                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-widest text-zinc-600 font-mono mb-3">
                      Choose mode
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                      {/* Practice */}
                      <button
                        onClick={() => setMode('practice')}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          mode === 'practice'
                            ? 'border-amber-500/50 bg-amber-500/10'
                            : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
                        }`}
                      >
                        <p className={`text-sm font-mono font-semibold mb-1 ${mode === 'practice' ? 'text-amber-400' : 'text-zinc-300'}`}>
                          🎯 Practice
                        </p>
                        <p className="text-xs text-zinc-600 leading-relaxed">
                          No timer. Play any phenomenon freely. Focus on the ideas.
                        </p>
                      </button>

                      {/* Survival */}
                      <button
                        onClick={() => setMode('survival')}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          mode === 'survival'
                            ? 'border-red-500/50 bg-red-500/10'
                            : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
                        }`}
                      >
                        <p className={`text-sm font-mono font-semibold mb-1 ${mode === 'survival' ? 'text-red-400' : 'text-zinc-300'}`}>
                          ⚔ Survival Run
                        </p>
                        <p className="text-xs text-zinc-600 leading-relaxed">
                          Timed rounds. Score above threshold or your run ends. Build streaks.
                        </p>
                        {mode === 'survival' && state.phenomenon && (
                          <p className="text-xs text-red-400/80 font-mono mt-1.5">
                            Round timer: {formatTime(getTimerDuration(state.phenomenon.difficulty))} · Pass threshold: {getPassThreshold(state.phenomenon.difficulty)}+ avg
                          </p>
                        )}
                      </button>
                    </div>

                    {/* CTA buttons */}
                    <div className="flex items-center gap-3 flex-wrap">
                      {mode === 'practice' ? (
                        <button
                          onClick={startPractice}
                          className="px-8 py-3 font-mono font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg transition-all active:scale-95"
                        >
                          Enter the Crucible →
                        </button>
                      ) : (
                        <button
                          onClick={startSurvival}
                          className="px-8 py-3 font-mono font-semibold text-sm bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all active:scale-95"
                        >
                          Start Survival Run ⚔
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const next = getRandomPhenomenon(
                            state.phenomenon?.id,
                            unlocked
                          );
                          selectPhenomenon(next);
                        }}
                        className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors px-2 py-3"
                      >
                        ↻ Shuffle
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Game screen ─────────────────────────────────────────────────────────────
  const timerSecondsForUI = mode === 'survival' ? timerSecs2 : null;
  const timerDurationForUI = mode === 'survival' ? currentTimerDuration : undefined;

  return (
    <div className="h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-800 px-4 py-3 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={handleNewGame}
            className="text-amber-400 font-serif text-lg hover:text-amber-300 transition-colors"
          >
            ◈ The Crucible
          </button>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Survival streak */}
            {mode === 'survival' && survivalStreak > 0 && (
              <span className="text-xs font-mono bg-red-900/50 text-red-300 border border-red-700/50 px-2 py-0.5 rounded-full">
                🔥 Streak: {survivalStreak}
              </span>
            )}
            {mode === 'survival' && (
              <span className="text-xs font-mono bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
                ⚔ Survival
              </span>
            )}
            {/* Thinker badge */}
            {state.phenomenon && (
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                  THINKER_PROFILES[state.phenomenon.thinker].badgeBg
                }`}
              >
                {THINKER_PROFILES[state.phenomenon.thinker].symbol}{' '}
                {THINKER_PROFILES[state.phenomenon.thinker].name}
              </span>
            )}
            {/* Difficulty badge */}
            {state.phenomenon && (
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded-full ${getDifficultyBadgeClass(
                  state.phenomenon.difficulty
                )}`}
              >
                {getDifficultyLabel(state.phenomenon.difficulty)}
              </span>
            )}
            <button
              onClick={handleNewGame}
              className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              ↻ Menu
            </button>
          </div>
        </div>
      </div>

      {/* Phenomenon + Round */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto space-y-4">
          {state.phenomenon && <PhenomenonCard phenomenon={state.phenomenon} compact />}
          <RoundIndicator currentRound={state.currentRound} phase={state.phase} />
        </div>
      </div>

      {/* Error banner */}
      {state.error && (
        <div className="flex-shrink-0 bg-red-950/50 border-b border-red-800/50 px-4 py-2">
          <div className="max-w-3xl mx-auto text-xs font-mono text-red-400">
            Error: {state.error}
          </div>
        </div>
      )}

      {/* Conversation */}
      <ConversationThread
        messages={state.messages}
        phase={state.phase}
        streamingContent={state.streamingContent}
        currentRound={state.currentRound}
      />

      {/* Input */}
      <div className="flex-shrink-0">
        <ExplanationInput
          phase={state.phase}
          round={state.currentRound}
          value={state.currentInput}
          onChange={(v) => dispatch({ type: 'SET_INPUT', value: v })}
          onSubmit={handleSubmit}
          disabled={inputDisabled}
          timerSecondsLeft={timerSecondsForUI}
          timerDuration={timerDurationForUI}
        />
      </div>

      {/* Score overlay */}
      {state.phase === 'scored' && state.score && state.phenomenon && (
        <ScorePanel
          score={state.score}
          phenomenon={state.phenomenon}
          mode={mode}
          survivalStreak={survivalStreak}
          onNewGame={handleNewGame}
          onSurvivalContinue={handleSurvivalContinue}
          percentile={percentile}
          totalPlayers={totalPlayers}
        />
      )}

      {/* Unlock toast (in-game) */}
      {newUnlock && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-mono text-sm px-5 py-3 rounded-xl shadow-xl">
          🔓 {getDifficultyLabel(newUnlock)} difficulty unlocked!
        </div>
      )}
    </div>
  );
}
