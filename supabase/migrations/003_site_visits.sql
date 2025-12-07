-- ==========================================
-- SITE VISITS TABLE FOR VISITOR TRACKING
-- ==========================================

-- Create site_visits table
CREATE TABLE IF NOT EXISTS site_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT,
  user_agent TEXT,
  page_path TEXT NOT NULL,
  referrer TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  visit_type TEXT DEFAULT 'page_view' CHECK (visit_type IN ('page_view', 'session', 'unique_daily')),
  session_id TEXT,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view site visits
DROP POLICY IF EXISTS "Admins can view site visits" ON site_visits;
CREATE POLICY "Admins can view site visits" ON site_visits
    FOR SELECT
    TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- Policy: Anyone can insert (for tracking public visitors)
DROP POLICY IF EXISTS "Anyone can insert site visits" ON site_visits;
CREATE POLICY "Anyone can insert site visits" ON site_visits
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Policy: Admins can delete old visits for cleanup
DROP POLICY IF EXISTS "Admins can delete site visits" ON site_visits;
CREATE POLICY "Admins can delete site visits" ON site_visits
    FOR DELETE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_site_visits_visited_at ON site_visits(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_visits_page_path ON site_visits(page_path);
CREATE INDEX IF NOT EXISTS idx_site_visits_ip_address ON site_visits(ip_address);

-- Grant access
GRANT SELECT, INSERT, DELETE ON site_visits TO authenticated;
GRANT INSERT ON site_visits TO anon;
