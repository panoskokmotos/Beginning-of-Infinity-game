'use client';

import { useReducer, useCallback } from 'react';
import { gameReducer, initialState } from '@/lib/gameReducer';
import { getRandomPhenomenon } from '@/lib/phenomena';
import { parseSSEChunk } from '@/lib/streamParser';
import { ChallengeRequest } from '@/types/game';
import PhenomenonCard from './PhenomenonCard';
import RoundIndicator from './RoundIndicator';
import ConversationThread from './ConversationThread';
import ExplanationInput from './ExplanationInput';
import ScorePanel from './ScorePanel';

export default function GameShell() {
  const [state, dispatch] = useReducer(
    gameReducer,
    getRandomPhenomenon(),
    initialState
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

  if (state.phase === 'idle' || !state.phenomenon || state.phenomenon === null) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center mb-10">
          <div className="text-amber-400 text-4xl mb-4">◈</div>
          <h1 className="text-4xl font-serif text-zinc-100 mb-3">The Crucible</h1>
          <p className="text-zinc-500 text-sm font-mono leading-relaxed max-w-lg mx-auto">
            Propose an explanation. Defend it against rigorous challenge.
            Watch it break, or watch it become something real.
          </p>
          <p className="text-zinc-600 text-xs font-mono mt-2">
            Based on David Deutsch&apos;s epistemology in{' '}
            <em>The Beginning of Infinity</em>
          </p>
        </div>

        <div className="max-w-2xl w-full mb-8">
          <PhenomenonCard phenomenon={state.phenomenon!} />
        </div>

        <button
          onClick={() =>
            dispatch({ type: 'START_GAME', phenomenon: state.phenomenon! })
          }
          className="px-8 py-3 font-mono font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg transition-all active:scale-95"
        >
          Enter the Crucible →
        </button>

        <button
          onClick={handleNewGame}
          className="mt-3 text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          ↻ Different phenomenon
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-800 px-4 py-3 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="text-amber-400 font-serif text-lg">◈ The Crucible</span>
          <button
            onClick={handleNewGame}
            className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            ↻ New phenomenon
          </button>
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
