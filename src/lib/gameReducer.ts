import { GameState, GameAction, GamePhase, Message } from '@/types/game';

function makeId(): string {
  return Math.random().toString(36).slice(2);
}

function nextPhase(currentPhase: GamePhase, round: number): GamePhase {
  if (currentPhase === 'explaining') return 'challenging';
  if (currentPhase === 'refining') {
    return round === 4 ? 'scoring' : 'challenging';
  }
  if (currentPhase === 'challenging') return 'refining';
  if (currentPhase === 'scoring') return 'scored';
  return currentPhase;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        phase: 'explaining',
        currentRound: 1,
        phenomenon: action.phenomenon,
        messages: [],
        currentInput: '',
        score: null,
        streamingContent: '',
        error: null,
      };

    case 'SET_INPUT':
      return { ...state, currentInput: action.value };

    case 'SUBMIT_EXPLANATION': {
      if (!state.currentInput.trim()) return state;
      const playerMessage: Message = {
        id: makeId(),
        role: 'player',
        content: state.currentInput.trim(),
        round: state.currentRound,
      };
      const nextPh: GamePhase =
        state.phase === 'explaining'
          ? 'challenging'
          : state.currentRound === 4
          ? 'scoring'
          : 'challenging';
      return {
        ...state,
        phase: nextPh,
        messages: [...state.messages, playerMessage],
        currentInput: '',
        streamingContent: '',
      };
    }

    case 'FORCE_SUBMIT': {
      const playerMessage: Message = {
        id: makeId(),
        role: 'player',
        content: action.content,
        round: state.currentRound,
      };
      const nextPh: GamePhase =
        state.phase === 'explaining'
          ? 'challenging'
          : state.currentRound === 4
          ? 'scoring'
          : 'challenging';
      return {
        ...state,
        phase: nextPh,
        messages: [...state.messages, playerMessage],
        currentInput: '',
        streamingContent: '',
      };
    }

    case 'STREAM_DELTA':
      return {
        ...state,
        streamingContent: state.streamingContent + action.content,
      };

    case 'STREAM_COMPLETE': {
      const aiMessage: Message = {
        id: makeId(),
        role: 'ai',
        content: action.finalContent,
        round: state.currentRound,
      };
      const wasScoring = state.phase === 'scoring';
      const newRound = wasScoring ? state.currentRound : state.currentRound + 1;
      const newPhase: GamePhase = wasScoring
        ? 'scored'
        : 'refining';
      return {
        ...state,
        phase: newPhase,
        currentRound: newRound,
        messages: [...state.messages, aiMessage],
        streamingContent: '',
      };
    }

    case 'SCORE_RECEIVED':
      return { ...state, score: action.score };

    case 'STREAM_ERROR':
      return {
        ...state,
        phase: state.phase === 'scoring' ? 'scored' : 'refining',
        error: action.error,
        streamingContent: '',
      };

    case 'RESET_GAME':
      return {
        phase: 'idle',
        currentRound: 1,
        phenomenon: action.phenomenon,
        messages: [],
        currentInput: '',
        score: null,
        streamingContent: '',
        error: null,
      };

    default:
      return state;
  }
}

export function initialState(phenomenon: import('@/types/game').Phenomenon): GameState {
  return {
    phase: 'idle',
    currentRound: 1,
    phenomenon,
    messages: [],
    currentInput: '',
    score: null,
    streamingContent: '',
    error: null,
  };
}
