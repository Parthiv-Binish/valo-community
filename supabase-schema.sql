-- =============================================
-- Let's Build VALO Community — Supabase Schema
-- =============================================
-- Run this SQL in your Supabase SQL Editor

-- 1. STREAMERS TABLE
CREATE TABLE IF NOT EXISTS public.streamers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform    text NOT NULL CHECK (platform IN ('youtube', 'kick')),
  youtube_channel_id text,
  kick_username      text,
  enabled     boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_platform_fields CHECK (
    (platform = 'youtube' AND youtube_channel_id IS NOT NULL AND kick_username IS NULL) OR
    (platform = 'kick'    AND kick_username IS NOT NULL       AND youtube_channel_id IS NULL)
  )
);

-- 2. SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.submissions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform   text NOT NULL CHECK (platform IN ('youtube', 'kick')),
  url        text NOT NULL,
  status     text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.streamers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- STREAMERS: public read
CREATE POLICY "Public can read enabled streamers"
  ON public.streamers FOR SELECT
  USING (enabled = true);

-- STREAMERS: admin full access (authenticated users only)
CREATE POLICY "Admin full access to streamers"
  ON public.streamers FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- SUBMISSIONS: public insert
CREATE POLICY "Public can submit streamer links"
  ON public.submissions FOR INSERT
  WITH CHECK (true);

-- SUBMISSIONS: admin read/update/delete
CREATE POLICY "Admin can manage submissions"
  ON public.submissions FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_streamers_platform ON public.streamers(platform);
CREATE INDEX IF NOT EXISTS idx_streamers_enabled  ON public.streamers(enabled);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);
