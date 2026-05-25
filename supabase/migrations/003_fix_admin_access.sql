-- Remove test data with invalid file paths
DELETE FROM tracks WHERE audio_url LIKE '%test-audio%';

-- Fix RLS policies to allow proper admin access
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all tracks" ON tracks;
DROP POLICY IF EXISTS "Admins can view all analytics" ON analytics;
DROP POLICY IF EXISTS "Admins can manage email blasts" ON email_blasts;

-- Create better admin policies that actually work
-- Profiles - allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles admin_profiles
    WHERE admin_profiles.id = auth.uid() 
    AND admin_profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update all profiles" ON profiles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles admin_profiles
    WHERE admin_profiles.id = auth.uid() 
    AND admin_profiles.role = 'admin'
  )
);

-- Tracks - allow admins full access to all tracks
CREATE POLICY "Admins can view all tracks" ON tracks
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles admin_profiles
    WHERE admin_profiles.id = auth.uid() 
    AND admin_profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update all tracks" ON tracks
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles admin_profiles
    WHERE admin_profiles.id = auth.uid() 
    AND admin_profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can insert tracks" ON tracks
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles admin_profiles
    WHERE admin_profiles.id = auth.uid() 
    AND admin_profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete tracks" ON tracks
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles admin_profiles
    WHERE admin_profiles.id = auth.uid() 
    AND admin_profiles.role = 'admin'
  )
);

-- Analytics - allow admins to view all analytics
CREATE POLICY "Admins can view all analytics" ON analytics
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles admin_profiles
    WHERE admin_profiles.id = auth.uid() 
    AND admin_profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can manage analytics" ON analytics
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles admin_profiles
    WHERE admin_profiles.id = auth.uid() 
    AND admin_profiles.role = 'admin'
  )
);

-- Email blasts - allow admins full access
CREATE POLICY "Admins can manage email blasts" ON email_blasts
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles admin_profiles
    WHERE admin_profiles.id = auth.uid() 
    AND admin_profiles.role = 'admin'
  )
);

-- Downloads - allow admins to view all downloads
CREATE POLICY "Admins can view all downloads" ON downloads
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles admin_profiles
    WHERE admin_profiles.id = auth.uid() 
    AND admin_profiles.role = 'admin'
  )
);

-- Re-enable RLS on all tables (in case they were disabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_blasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Ensure plans table is readable by everyone
CREATE POLICY "Plans are readable by all" ON plans FOR SELECT USING (true);