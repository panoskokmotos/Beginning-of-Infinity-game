export type GamePhase =
  | 'idle'
  | 'explaining'
  | 'challenging'
  | 'refining'
  | 'scoring'
  | 'scored';

export type MessageRole = 'player' | 'ai';

export type Thinker = 'deutsch' | 'naval' | 'popper';

export type Difficulty = 'novice' | 'adept' | 'master';

export type GameMode = 'practice' | 'survival';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  round: number;
}

export interface Score {
  reach: number;
  falsifiability: number;
  resilience: number;
  verdict: string;
  bestMoment: string;
  growthEdge: string;
}

export interface Phenomenon {
  id: string;
  title: string;
  prompt: string;
  seedFacts: string[];
  naiveTraps: string[];
  reachOpportunities: string[];
  thinker: Thinker;
  difficulty: Difficulty;
}

export interface GameState {
  phase: GamePhase;
  currentRound: number;
  phenomenon: Phenomenon | null;
  messages: Message[];
  currentInput: string;
  score: Score | null;
  streamingContent: string;
  error: string | null;
}

export interface ChallengeRequest {
  phenomenon: Phenomenon;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  round: number;
  playerExplanation: string;
}

export interface ChallengeResponse {
  type: 'delta' | 'score' | 'done' | 'error';
  content?: string;
  score?: Score;
  error?: string;
}

export type GameAction =
  | { type: 'START_GAME'; phenomenon: Phenomenon }
  | { type: 'SET_INPUT'; value: string }
  | { type: 'SUBMIT_EXPLANATION' }
  | { type: 'FORCE_SUBMIT'; content: string }
  | { type: 'STREAM_DELTA'; content: string }
  | { type: 'STREAM_COMPLETE'; finalContent: string }
  | { type: 'SCORE_RECEIVED'; score: Score }
  | { type: 'STREAM_ERROR'; error: string }
  | { type: 'RESET_GAME'; phenomenon: Phenomenon };
