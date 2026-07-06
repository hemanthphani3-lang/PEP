-- ============================================================
-- CivicPulse AI — Supabase Schema Setup
-- Run this entire script in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS submissions (
  submission_id   TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL DEFAULT 'anonymous',
  user_name       TEXT NOT NULL DEFAULT 'Citizen',
  text            TEXT NOT NULL,
  translated_text TEXT,
  summary         TEXT,
  category        TEXT NOT NULL DEFAULT 'General',
  image_url       TEXT,
  latitude        DOUBLE PRECISION NOT NULL DEFAULT 17.6868,
  longitude       DOUBLE PRECISION NOT NULL DEFAULT 83.2185,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cluster_id      TEXT,
  village_name    TEXT NOT NULL DEFAULT 'Visakhapatnam East',
  language        TEXT NOT NULL DEFAULT 'English',
  audio_url       TEXT
);

-- 2. CLUSTERS TABLE
CREATE TABLE IF NOT EXISTS clusters (
  cluster_id          TEXT PRIMARY KEY,
  title               TEXT NOT NULL,
  category            TEXT NOT NULL,
  citizen_count       INTEGER NOT NULL DEFAULT 1,
  villages_affected   TEXT[] NOT NULL DEFAULT '{}',
  priority_score      INTEGER NOT NULL DEFAULT 50,
  explanation         TEXT,
  images              TEXT[] NOT NULL DEFAULT '{}',
  location            JSONB NOT NULL DEFAULT '{"latitude": 17.6868, "longitude": 83.2185}',
  status              TEXT NOT NULL DEFAULT 'Pending'
                        CHECK (status IN ('Pending', 'Approved', 'In Progress', 'Completed')),
  public_evidence_link TEXT
);

-- 3. PUBLIC DATA TABLE
CREATE TABLE IF NOT EXISTS public_data (
  region_id                       TEXT PRIMARY KEY,
  village_name                    TEXT NOT NULL,
  population                      INTEGER NOT NULL DEFAULT 0,
  schools                         INTEGER NOT NULL DEFAULT 0,
  health_centers                  INTEGER NOT NULL DEFAULT 0,
  roads                           TEXT,
  water_facilities                TEXT,
  distance_to_nearest_hospital_km DOUBLE PRECISION NOT NULL DEFAULT 0,
  distance_to_nearest_school_km   DOUBLE PRECISION NOT NULL DEFAULT 0,
  enrollment_growth_rate          DOUBLE PRECISION NOT NULL DEFAULT 0,
  water_purity_index              DOUBLE PRECISION NOT NULL DEFAULT 0
);

-- 4. REPORTS TABLE
CREATE TABLE IF NOT EXISTS reports (
  report_id    TEXT PRIMARY KEY,
  cluster_id   TEXT NOT NULL,
  cluster_title TEXT NOT NULL,
  pdf_url      TEXT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  summary_text TEXT NOT NULL DEFAULT ''
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — Allow anonymous public access
-- ============================================================

ALTER TABLE submissions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE clusters     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_data  ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports      ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anon key) to read all tables
CREATE POLICY "Public read submissions"  ON submissions  FOR SELECT USING (true);
CREATE POLICY "Public read clusters"     ON clusters     FOR SELECT USING (true);
CREATE POLICY "Public read public_data"  ON public_data  FOR SELECT USING (true);
CREATE POLICY "Public read reports"      ON reports      FOR SELECT USING (true);

-- Allow anyone (anon key) to insert new submissions and reports
CREATE POLICY "Public insert submissions" ON submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert reports"     ON reports     FOR INSERT WITH CHECK (true);

-- Allow anyone to upsert (insert + update) clusters and public_data
CREATE POLICY "Public upsert clusters"    ON clusters    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public upsert public_data" ON public_data FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- DONE! Now go back to the app — data will save to Supabase.
-- ============================================================
