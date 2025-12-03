-- =====================================================
-- MIGRATION: Performance Indexes
-- Date: 2025-12-03
-- Description: Adding missing indexes for common queries
-- =====================================================

-- 1. Cases Table Indexes
-- Critical for sorting by date (default view)
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at DESC);
-- Critical for filtering by status
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
-- Critical for filtering by type
CREATE INDEX IF NOT EXISTS idx_cases_incident_type ON cases(incident_type);
-- Text search indexes
CREATE INDEX IF NOT EXISTS idx_cases_title_search ON cases USING GIN(to_tsvector('english', coalesce(title, '')));
CREATE INDEX IF NOT EXISTS idx_cases_location_search ON cases USING GIN(to_tsvector('english', coalesce(incident_location, '')));

-- 2. Involved Parties Indexes
-- Critical for JOINs with cases
CREATE INDEX IF NOT EXISTS idx_involved_parties_case_id ON involved_parties(case_id);
-- Text search for people
CREATE INDEX IF NOT EXISTS idx_involved_parties_name_search ON involved_parties USING GIN(to_tsvector('english', coalesce(name, '')));

-- 3. Hearings Indexes
-- Critical for "Upcoming Hearings" widget
CREATE INDEX IF NOT EXISTS idx_hearings_hearing_date ON hearings(hearing_date);
CREATE INDEX IF NOT EXISTS idx_hearings_case_id ON hearings(case_id);

-- 4. Evidence Indexes
CREATE INDEX IF NOT EXISTS idx_evidence_case_id ON evidence(case_id);

-- 5. Notifications Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
