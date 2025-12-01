-- Fix for "invalid input value for enum case_status" error
-- Run this in your Supabase Dashboard > SQL Editor

ALTER TYPE case_status ADD VALUE IF NOT EXISTS 'Hearing Scheduled';
ALTER TYPE case_status ADD VALUE IF NOT EXISTS 'Dismissed';
ALTER TYPE case_status ADD VALUE IF NOT EXISTS 'Referred';
