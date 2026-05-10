'use client';

import { useReducer, useCallback, useState } from 'react';
import { gameReducer, initialState } from '@/lib/gameReducer';
import { PHENOMENA, getRandomPhenomenon } from '@/lib/phenomena';
import { THINKER_PROFILES, THINKERS_ORDER } from '@/lib/thinkers';
import { parseSSEChunk } from '@/lib/streamParser';
import { ChallengeRequest, Phenomenon, Thinker } from '@/types/game';
import PhenomenonCard from './PhenomenonCard';
import RoundIndicator from './RoundIndicator';
import ConversationThread from './ConversationThread';
import ExplanationInput from './ExplanationInput';
import ScorePanel from './ScorePanel';

const THINKER_TABS: Array<{ id: Thinker | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'deutsch', label: 'David Deutsch' },
  { id: 'naval', label: 'Naval Ravikant' },
  { id: 'popper', label: 'Karl Popper' },
];

export default function GameShell() {
  const [state, dispatch] = useReducer(
    gameReducer,
    getRandomPhenomenon(),
    initialState
  );

  const [activeThinker, setActiveThinker] = useState<Thinker | 'all'>('all');

  const filteredPhenomena =
    activeThinker === 'all'
      ? PHENOMENA
      : PHENOMENA.filter((p) => p.thinker === activeThinker);

  const selectPhenomenon = useCallback(
    (p: Phenomenon) => {
      if (p.id !== state.phenomenon?.id) {
        dispatch({ type: 'RESET_GAME', phenomenon: p });
      }
    },
    [state.phenomenon?.id]
  );

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

  const handleSubmit = useCallback(() => {
    if (!state.currentInput.trim()) return;
    const round = state.currentRound;
    const explanation = state.currentInput.trim();
    dispatch({ type: 'SUBMIT_EXPLANATION' });
    fetchChallenge(round, explanation);
  }, [state.currentInput, state.currentRound, fetchChallenge]);

  const handleNewGame = useCallback(() => {
    const next = getRandomPhenomenon(state.phenomenon?.id);
    dispatch({ type: 'RESET_GAME', phenomenon: next });
  }, [state.phenomenon]);

  const isStreaming =
    state.phase === 'challenging' || state.phase === 'scoring';
  const inputDisabled =
    isStreaming ||
    state.phase === 'idle' ||
    state.phase === 'scored';

  // ── Landing screen ─────────────────────────────────────────────────────────
  if (state.phase === 'idle' || !state.phenomenon) {
    const currentProfile =
      activeThinker !== 'all' ? THINKER_PROFILES[activeThinker] : null;

    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col">
        {/* Hero */}
        <div className="border-b border-zinc-800/60 px-6 py-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-amber-400 text-3xl mb-4">◈</div>
            <h1 className="text-4xl font-serif text-zinc-100 mb-2">The Crucible</h1>
            <p className="text-zinc-500 text-sm font-mono leading-relaxed max-w-xl">
              Propose an explanation for a real-world phenomenon. Defend it
              against adversarial Socratic challenge. Watch it break — or
              watch it become something real.
            </p>
            <p className="text-zinc-700 text-xs font-mono mt-3">
              Epistemology drawn from David Deutsch, Karl Popper &amp; Naval
              Ravikant
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left column: thinker filter + phenomenon list */}
            <div className="lg:w-72 flex-shrink-0">
              {/* Thinker tabs */}
              <p className="text-xs uppercase tracking-widest text-zinc-600 font-mono mb-3">
                Filter by thinker
              </p>
              <div className="flex flex-col gap-1 mb-6">
                {THINKER_TABS.map((tab) => {
                  const isActive = activeThinker === tab.id;
                  const profile =
                    tab.id !== 'all' ? THINKER_PROFILES[tab.id] : null;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveThinker(tab.id)}
                      className={`text-left px-3 py-2 rounded-lg text-sm font-mono transition-all ${
                        isActive
                          ? profile
                            ? profile.tabActive
                            : 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      {profile && (
                        <span className="mr-1.5">{profile.symbol}</span>
                      )}
                      {tab.label}
                      <span className="ml-1.5 text-xs opacity-50">
                        ({tab.id === 'all'
                          ? PHENOMENA.length
                          : PHENOMENA.filter((p) => p.thinker === tab.id).length})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Thinker description */}
              {currentProfile && (
                <div
                  className={`rounded-lg px-3 py-3 mb-6 border ${currentProfile.borderColor} ${currentProfile.bgColor}`}
                >
                  <p className={`text-xs font-mono font-semibold mb-1 ${currentProfile.accentColor}`}>
                    {currentProfile.subtitle}
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {currentProfile.description}
                  </p>
                </div>
              )}

              {/* Phenomenon list */}
              <p className="text-xs uppercase tracking-widest text-zinc-600 font-mono mb-2">
                Phenomena
              </p>
              <div className="flex flex-col gap-0.5">
                {filteredPhenomena.map((p) => {
                  const isSelected = state.phenomenon?.id === p.id;
                  const profile = THINKER_PROFILES[p.thinker];
                  return (
                    <button
                      key={p.id}
                      onClick={() => selectPhenomenon(p)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all group ${
                        isSelected
                          ? `${profile.bgColor} ${profile.accentColor} border ${profile.borderColor}`
                          : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
                      }`}
                    >
                      <span className={`text-xs mr-1.5 ${isSelected ? profile.accentColor : 'text-zinc-700 group-hover:text-zinc-500'}`}>
                        {profile.symbol}
                      </span>
                      <span className="text-xs font-mono leading-tight">
                        {p.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right column: selected phenomenon + CTA */}
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-widest text-zinc-600 font-mono mb-3">
                Selected phenomenon
              </p>

              {state.phenomenon && (
                <PhenomenonCard phenomenon={state.phenomenon} />
              )}

              {/* Seed facts teaser */}
              {state.phenomenon && (
                <div className="mt-4 border border-zinc-800 rounded-xl px-4 py-4">
                  <p className="text-xs uppercase tracking-widest text-zinc-600 font-mono mb-3">
                    Context clues
                  </p>
                  <ul className="space-y-1.5">
                    {state.phenomenon.seedFacts.map((fact, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-zinc-700 font-mono text-xs mt-0.5">
                          —
                        </span>
                        <span className="text-xs text-zinc-500 font-mono leading-relaxed">
                          {fact}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Thinker credit */}
              {state.phenomenon && (
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded-full ${THINKER_PROFILES[state.phenomenon.thinker].badgeBg}`}
                  >
                    {THINKER_PROFILES[state.phenomenon.thinker].symbol}{' '}
                    {THINKER_PROFILES[state.phenomenon.thinker].name}
                  </span>
                </div>
              )}

              {/* CTA */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() =>
                    dispatch({
                      type: 'START_GAME',
                      phenomenon: state.phenomenon!,
                    })
                  }
                  className="px-8 py-3 font-mono font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg transition-all active:scale-95"
                >
                  Enter the Crucible →
                </button>
                <button
                  onClick={handleNewGame}
                  className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors px-2 py-3"
                >
                  ↻ Shuffle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Game screen ────────────────────────────────────────────────────────────
  return (
    <div className="h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-800 px-4 py-3 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={handleNewGame}
            className="text-amber-400 font-serif text-lg hover:text-amber-300 transition-colors"
          >
            ◈ The Crucible
          </button>
          <div className="flex items-center gap-3">
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
            <button
              onClick={handleNewGame}
              className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              ↻ New phenomenon
            </button>
          </div>
        </div>
      </div>

      {/* Phenomenon + Round */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto space-y-4">
          <PhenomenonCard phenomenon={state.phenomenon} />
          <RoundIndicator
            currentRound={state.currentRound}
            phase={state.phase}
          />
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
        />
      </div>

      {/* Score overlay */}
      {state.phase === 'scored' && state.score && (
        <ScorePanel
          score={state.score}
          phenomenon={state.phenomenon}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  );
}
