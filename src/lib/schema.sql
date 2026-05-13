-- Run once in the Vercel Postgres SQL editor
-- Dashboard → Storage → your DB → Query tab

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS game_sessions (
  id                  TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id             TEXT        REFERENCES users(id) ON DELETE CASCADE,
  phenomenon_id       TEXT        NOT NULL,
  phenomenon_title    TEXT        NOT NULL,
  difficulty          TEXT        NOT NULL,
  thinker             TEXT        NOT NULL,
  mode                TEXT        NOT NULL,
  reach               INTEGER     NOT NULL,
  falsifiability      INTEGER     NOT NULL,
  resilience          INTEGER     NOT NULL,
  avg_score           INTEGER     NOT NULL,
  verdict             TEXT,
  best_moment         TEXT,
  growth_edge         TEXT,
  initial_explanation TEXT,
  final_explanation   TEXT,
  survival_streak     INTEGER     DEFAULT 0,
  completed_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reasoning_profiles (
  user_id         TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  profile_json    TEXT NOT NULL,
  games_analyzed  INTEGER NOT NULL DEFAULT 0,
  generated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS match_actions (
  user_id         TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_user_id  TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action          TEXT        NOT NULL,  -- 'like' | 'skip'
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, target_user_id)
);

CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id  ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_completed ON game_sessions(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_match_actions_user      ON match_actions(user_id);
