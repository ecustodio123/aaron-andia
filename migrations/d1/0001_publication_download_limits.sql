-- Cloudflare D1 only. Does not alter Supabase, RLS, stores or publication-files.
CREATE TABLE IF NOT EXISTS publication_download_limits (
  key TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  requests INTEGER NOT NULL CHECK (requests > 0)
);
CREATE INDEX IF NOT EXISTS publication_download_limits_expiry ON publication_download_limits(window_start);
