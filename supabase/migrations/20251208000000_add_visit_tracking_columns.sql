-- Migration to add user tracking columns to site_visits table

-- Add user_id column
ALTER TABLE site_visits 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add visitor_email column
ALTER TABLE site_visits 
ADD COLUMN IF NOT EXISTS visitor_email TEXT;

-- Add visitor_name column
ALTER TABLE site_visits 
ADD COLUMN IF NOT EXISTS visitor_name TEXT;

-- Add visitor_role column (e.g., 'admin', 'authenticated', 'guest', 'anonymous')
ALTER TABLE site_visits 
ADD COLUMN IF NOT EXISTS visitor_role TEXT DEFAULT 'anonymous';

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_visits_user_id ON site_visits(user_id);
