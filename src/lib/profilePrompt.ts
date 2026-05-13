import { SessionRow } from './db';

export interface ReasoningProfile {
  style: {
    type: 'empiricist' | 'theorist' | 'analogist' | 'synthesist';
    description: string;
    primaryMode: 'bottom-up' | 'top-down' | 'lateral';
    strengths: string[];
    blindSpots: string[];
  };
  thinkerAffinity: {
    primary: 'deutsch' | 'naval' | 'popper';
    secondary: 'deutsch' | 'naval' | 'popper' | null;
    explanation: string;
  };
  specificKnowledge: {
    emerging: string[];
    description: string;
  };
  recommendations: {
    books: Array<{ title: string; author: string; reason: string }>;
    podcasts: Array<{ name: string; reason: string }>;
    phenomena: Array<{ id: string; title: string; reason: string }>;
    directions: Array<{ area: string; reason: string }>;
  };
}

export function buildProfilePrompt(sessions: SessionRow[]): string {
  const sessionSummaries = sessions
    .map((s, i) => {
      const lines = [
        `Game ${i + 1}: "${s.phenomenon_title}" (${s.difficulty}, ${s.thinker})`,
        `  Scores — Reach: ${s.reach}, Falsifiability: ${s.falsifiability}, Resilience: ${s.resilience}, Avg: ${s.avg_score}`,
      ];
      if (s.initial_explanation) {
        lines.push(`  Initial explanation: "${s.initial_explanation.slice(0, 300)}${s.initial_explanation.length > 300 ? '…' : ''}"`);
      }
      if (s.final_explanation && s.final_explanation !== s.initial_explanation) {
        lines.push(`  Final explanation: "${s.final_explanation.slice(0, 300)}${s.final_explanation.length > 300 ? '…' : ''}"`);
      }
      if (s.growth_edge) {
        lines.push(`  Growth edge identified: "${s.growth_edge}"`);
      }
      return lines.join('\n');
    })
    .join('\n\n');

  return `You are analyzing a player's complete game history from "The Crucible" — an epistemology game where players propose explanations for real-world phenomena and defend them against rigorous Socratic challenge.

The game scores explanations on three dimensions (0–100 each):
- Reach: Does the explanation generalize beyond the specific phenomenon?
- Falsifiability: Does it make specific, testable predictions?
- Resilience: Is it "hard to vary" — tightly connected, not patchable?

Here is this player's complete game history:

${sessionSummaries}

Based on these games — especially the actual explanations they wrote and how their thinking evolved — produce a deep, specific reasoning profile. Be concrete and personal, not generic.

Return ONLY valid JSON matching this exact schema (no markdown, no commentary):

{
  "style": {
    "type": "empiricist" | "theorist" | "analogist" | "synthesist",
    "description": "2-3 sentences describing their specific reasoning approach, with concrete references to what they actually wrote",
    "primaryMode": "bottom-up" | "top-down" | "lateral",
    "strengths": ["specific cognitive strength 1", "specific cognitive strength 2", "specific cognitive strength 3"],
    "blindSpots": ["specific blind spot 1", "specific blind spot 2"]
  },
  "thinkerAffinity": {
    "primary": "deutsch" | "naval" | "popper",
    "secondary": "deutsch" | "naval" | "popper" | null,
    "explanation": "1-2 sentences explaining exactly why these thinkers' frameworks match how this person already reasons"
  },
  "specificKnowledge": {
    "emerging": ["domain or intersection 1", "domain or intersection 2", "domain or intersection 3"],
    "description": "1-2 sentences about the unique knowledge constellation this player is developing"
  },
  "recommendations": {
    "books": [
      { "title": "book title", "author": "author name", "reason": "1 sentence tied specifically to their reasoning style and gaps, not generic" },
      { "title": "book title", "author": "author name", "reason": "1 sentence" },
      { "title": "book title", "author": "author name", "reason": "1 sentence" },
      { "title": "book title", "author": "author name", "reason": "1 sentence" }
    ],
    "podcasts": [
      { "name": "podcast name", "reason": "1 sentence specific to their style" },
      { "name": "podcast name", "reason": "1 sentence" }
    ],
    "phenomena": [
      { "id": "phenomenon-id-from-game", "title": "phenomenon title", "reason": "1 sentence about why this would challenge their specific blind spot" },
      { "id": "phenomenon-id-from-game", "title": "phenomenon title", "reason": "1 sentence" }
    ],
    "directions": [
      { "area": "career or project direction", "reason": "1 sentence tied specifically to their emerging specific knowledge" },
      { "area": "career or project direction", "reason": "1 sentence" },
      { "area": "career or project direction", "reason": "1 sentence" }
    ]
  }
}

Valid phenomenon IDs for the phenomena recommendations field:
stellar-scintillation, iridescent-clouds, bicycle-stability, mpemba-effect, ant-colony-intelligence, placebo-effect, jump-to-universality, delayed-choice, cambrian-explosion, fermi-paradox, static-vs-dynamic-societies, universality-of-computation, software-leverage, compound-interest-counterintuition, specific-knowledge, permissionless-leverage, black-swan-problem, evolutionary-epistemology, paradox-of-tolerance, falsificationism-vs-confirmation`;
}
