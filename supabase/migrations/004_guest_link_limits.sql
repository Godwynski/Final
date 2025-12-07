-- Migration: Guest Link Limits & Evidence Isolation
-- Created: 2024-12-08

-- Add recipient tracking to guest_links
ALTER TABLE guest_links ADD COLUMN IF NOT EXISTS recipient_name TEXT;
ALTER TABLE guest_links ADD COLUMN IF NOT EXISTS recipient_email TEXT;
ALTER TABLE guest_links ADD COLUMN IF NOT EXISTS recipient_phone TEXT;

-- Add link tracking and visibility to evidence
ALTER TABLE evidence ADD COLUMN IF NOT EXISTS guest_link_id UUID REFERENCES guest_links(id) ON DELETE SET NULL;
ALTER TABLE evidence ADD COLUMN IF NOT EXISTS is_visible_to_others BOOLEAN DEFAULT true;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_evidence_guest_link_id ON evidence(guest_link_id);
