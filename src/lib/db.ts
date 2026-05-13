import { sql } from '@vercel/postgres';

// ── User ─────────────────────────────────────────────────────────────────────

export async function upsertUser(
  id: string,
  email: string,
  name: string | null,
  imageUrl: string | null
) {
  await sql`
    INSERT INTO users (id, email, name, image_url)
    VALUES (${id}, ${email}, ${name}, ${imageUrl})
    ON CONFLICT (id) DO UPDATE SET
      email     = EXCLUDED.email,
      name      = EXCLUDED.name,
      image_url = EXCLUDED.image_url
  `;
}

export async function getUser(id: string) {
  const r = await sql<{ id: string; name: string | null; image_url: string | null }>`
    SELECT id, name, image_url FROM users WHERE id = ${id}
  `;
  return r.rows[0] ?? null;
}

// ── Game sessions ─────────────────────────────────────────────────────────────

export interface SessionRow {
  id: string;
  user_id: string;
  phenomenon_id: string;
  phenomenon_title: string;
  difficulty: string;
  thinker: string;
  mode: string;
  reach: number;
  falsifiability: number;
  resilience: number;
  avg_score: number;
  verdict: string | null;
  best_moment: string | null;
  growth_edge: string | null;
  initial_explanation: string | null;
  final_explanation: string | null;
  survival_streak: number;
  completed_at: string;
}

export async function saveSession(s: Omit<SessionRow, 'id' | 'completed_at'>) {
  await sql`
    INSERT INTO game_sessions (
      user_id, phenomenon_id, phenomenon_title, difficulty, thinker, mode,
      reach, falsifiability, resilience, avg_score,
      verdict, best_moment, growth_edge,
      initial_explanation, final_explanation, survival_streak
    ) VALUES (
      ${s.user_id}, ${s.phenomenon_id}, ${s.phenomenon_title},
      ${s.difficulty}, ${s.thinker}, ${s.mode},
      ${s.reach}, ${s.falsifiability}, ${s.resilience}, ${s.avg_score},
      ${s.verdict}, ${s.best_moment}, ${s.growth_edge},
      ${s.initial_explanation}, ${s.final_explanation}, ${s.survival_streak}
    )
  `;
}

export async function getUserSessions(userId: string): Promise<SessionRow[]> {
  const r = await sql<SessionRow>`
    SELECT * FROM game_sessions
    WHERE user_id = ${userId}
    ORDER BY completed_at DESC
    LIMIT 50
  `;
  return r.rows;
}

// ── Aggregated stats ──────────────────────────────────────────────────────────

export interface UserStats {
  total_games: number;
  avg_reach: number;
  avg_falsifiability: number;
  avg_resilience: number;
  avg_overall: number;
  best_streak: number;
  novice_games: number;
  adept_games: number;
  master_games: number;
  deutsch_games: number;
  naval_games: number;
  popper_games: number;
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  const r = await sql`
    SELECT
      COUNT(*)::int                                        AS total_games,
      COALESCE(ROUND(AVG(reach))::int, 0)                 AS avg_reach,
      COALESCE(ROUND(AVG(falsifiability))::int, 0)        AS avg_falsifiability,
      COALESCE(ROUND(AVG(resilience))::int, 0)            AS avg_resilience,
      COALESCE(ROUND(AVG(avg_score))::int, 0)             AS avg_overall,
      COALESCE(MAX(survival_streak), 0)::int              AS best_streak,
      COUNT(*) FILTER (WHERE difficulty = 'novice')::int  AS novice_games,
      COUNT(*) FILTER (WHERE difficulty = 'adept')::int   AS adept_games,
      COUNT(*) FILTER (WHERE difficulty = 'master')::int  AS master_games,
      COUNT(*) FILTER (WHERE thinker = 'deutsch')::int    AS deutsch_games,
      COUNT(*) FILTER (WHERE thinker = 'naval')::int      AS naval_games,
      COUNT(*) FILTER (WHERE thinker = 'popper')::int     AS popper_games
    FROM game_sessions
    WHERE user_id = ${userId}
  `;
  const row = r.rows[0];
  if (!row || row.total_games === 0) return null;
  return row as UserStats;
}

// ── Reasoning profiles (Layer 1 + 2) ─────────────────────────────────────────

export interface StoredProfile {
  user_id: string;
  profile_json: string;
  games_analyzed: number;
  generated_at: string;
}

export async function getProfile(userId: string): Promise<StoredProfile | null> {
  const r = await sql<StoredProfile>`
    SELECT * FROM reasoning_profiles WHERE user_id = ${userId}
  `;
  return r.rows[0] ?? null;
}

export async function upsertProfile(
  userId: string,
  profileJson: string,
  gamesAnalyzed: number
) {
  await sql`
    INSERT INTO reasoning_profiles (user_id, profile_json, games_analyzed)
    VALUES (${userId}, ${profileJson}, ${gamesAnalyzed})
    ON CONFLICT (user_id) DO UPDATE SET
      profile_json   = EXCLUDED.profile_json,
      games_analyzed = EXCLUDED.games_analyzed,
      generated_at   = NOW()
  `;
}

// ── Discovery / matching (Layer 3) ────────────────────────────────────────────

export interface DiscoverUser {
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

export async function getDiscoverCandidates(
  excludeUserId: string
): Promise<DiscoverUser[]> {
  const r = await sql<DiscoverUser>`
    SELECT
      u.id,
      u.name,
      u.image_url,
      ROUND(AVG(g.reach))::int          AS avg_reach,
      ROUND(AVG(g.falsifiability))::int AS avg_falsifiability,
      ROUND(AVG(g.resilience))::int     AS avg_resilience,
      ROUND(AVG(g.avg_score))::int      AS avg_overall,
      COUNT(g.id)::int                  AS total_games,
      (
        SELECT thinker FROM game_sessions
        WHERE user_id = u.id
        GROUP BY thinker ORDER BY COUNT(*) DESC LIMIT 1
      )                                 AS top_thinker,
      rp.profile_json
    FROM users u
    JOIN game_sessions g ON g.user_id = u.id
    LEFT JOIN reasoning_profiles rp ON rp.user_id = u.id
    WHERE u.id != ${excludeUserId}
    GROUP BY u.id, u.name, u.image_url, rp.profile_json
    HAVING COUNT(g.id) >= 3
    ORDER BY AVG(g.avg_score) DESC
    LIMIT 30
  `;
  return r.rows;
}

export async function recordMatchAction(
  userId: string,
  targetUserId: string,
  action: 'like' | 'skip'
) {
  await sql`
    INSERT INTO match_actions (user_id, target_user_id, action)
    VALUES (${userId}, ${targetUserId}, ${action})
    ON CONFLICT (user_id, target_user_id) DO UPDATE SET
      action     = EXCLUDED.action,
      created_at = NOW()
  `;
}

export async function getActedUserIds(userId: string): Promise<string[]> {
  const r = await sql<{ target_user_id: string }>`
    SELECT target_user_id FROM match_actions WHERE user_id = ${userId}
  `;
  return r.rows.map((r) => r.target_user_id);
}
