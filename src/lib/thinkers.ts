import { Thinker } from '@/types/game';

export interface ThinkerProfile {
  id: Thinker;
  name: string;
  subtitle: string;
  description: string;
  accentColor: string;
  borderColor: string;
  bgColor: string;
  badgeBg: string;
  tabActive: string;
  symbol: string;
}

export const THINKER_PROFILES: Record<Thinker, ThinkerProfile> = {
  deutsch: {
    id: 'deutsch',
    name: 'David Deutsch',
    subtitle: 'The Beginning of Infinity',
    description:
      'Knowledge creation, universality, the nature of good explanations, and why progress is unbounded.',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    bgColor: 'bg-amber-500/10',
    badgeBg: 'bg-amber-500/20 text-amber-400',
    tabActive: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    symbol: '◈',
  },
  naval: {
    id: 'naval',
    name: 'Naval Ravikant',
    subtitle: 'Wealth, Leverage & Clarity',
    description:
      'Specific knowledge, permissionless leverage, compound returns, and the mechanics of value creation.',
    accentColor: 'text-sky-400',
    borderColor: 'border-sky-500/40',
    bgColor: 'bg-sky-500/10',
    badgeBg: 'bg-sky-500/20 text-sky-400',
    tabActive: 'bg-sky-500/20 text-sky-300 border border-sky-500/40',
    symbol: '◆',
  },
  popper: {
    id: 'popper',
    name: 'Karl Popper',
    subtitle: 'Epistemology & Falsificationism',
    description:
      'Conjectures and refutations, the open society, and why science advances by seeking disproof.',
    accentColor: 'text-violet-400',
    borderColor: 'border-violet-500/40',
    bgColor: 'bg-violet-500/10',
    badgeBg: 'bg-violet-500/20 text-violet-400',
    tabActive: 'bg-violet-500/20 text-violet-300 border border-violet-500/40',
    symbol: '◇',
  },
};

export const THINKERS_ORDER: Thinker[] = ['deutsch', 'naval', 'popper'];
